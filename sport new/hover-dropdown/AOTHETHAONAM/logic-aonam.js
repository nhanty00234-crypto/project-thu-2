// File: hover-dropdown/logic-ao-nam.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Lấy khung lưới nơi sẽ hiển thị sản phẩm
    const gridAo = document.getElementById('luoi-san-pham-ao');
    const noResult = document.getElementById('no-result');
    const btnApply = document.getElementById('btn-apply-filter');
    const sortSelect = document.getElementById('sort-select');

    // 2. Kiểm tra xem dữ liệu (data.js) đã tải được chưa
    if (typeof danhSachSanPham === 'undefined') {
        console.error("Chưa load được dữ liệu sản phẩm từ data.js!");
        return;
    }

    // 3. Lọc lấy các sản phẩm là "Áo"
    // (Lọc theo danh mục hoặc tên có chứa chữ "Áo")
    const listAo = danhSachSanPham.filter(p => 
        p.category === 'Áo' || p.name.toLowerCase().includes('áo')
    );

    // 4. Hàm hiển thị sản phẩm ra màn hình
    function renderProducts(list) {
        gridAo.innerHTML = ''; // Xóa nội dung cũ (nếu có)
        
        // Nếu không tìm thấy sản phẩm nào
        if (list.length === 0) {
            noResult.classList.remove('an'); // Hiện thông báo trống
            gridAo.style.display = 'none';
            return;
        } else {
            noResult.classList.add('an'); // Ẩn thông báo trống
            gridAo.style.display = 'grid';
        }

        // Tạo thẻ HTML cho từng sản phẩm
        list.forEach(p => {
            // Định dạng giá tiền (VD: 1.000.000 ₫)
            const priceFormatted = p.price.toLocaleString('vi-VN') + ' ₫';
            
            // Xử lý hiển thị Size (nếu có)
            let sizeHTML = '';
            if (p.sizes && p.sizes.length > 0) {
                // Hiển thị các size dưới dạng nhãn nhỏ
                sizeHTML = `<div class="lua-chon-size">` + 
                           p.sizes.map(s => `<span class="size-badge">${s}</span>`).join('') + 
                           `</div>`;
            }

            // Tạo khung thẻ sản phẩm (Copy cấu trúc từ index.html)
            const html = `
                <div class="the-san-pham">
                    <div class="khung-anh-the">
                        <a href="../pages/product-detail.html?id=${p.id}" class="xem-chi-tiet-anh">
                            <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
                        </a>
                    </div>
                    <div class="than-the">
                        <span class="danh-muc-the">${p.category}</span>
                        <h3 class="tieu-de-the">
                            <a href="../pages/product-detail.html?id=${p.id}">${p.name}</a>
                        </h3>
                        ${sizeHTML}
                        <div class="chan-the">
                            <span class="gia">${priceFormatted}</span>
                            <div class="nhom-nut">
                                <button class="nut nut-vien-nho" onclick="window.location.href='../pages/product-detail.html?id=${p.id}'">Xem</button>
                                <button class="nut nut-chinh-nho nut-them-gio" onclick="themVaoGioHangAo(${p.id})">
                                    <i class="fas fa-cart-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            gridAo.innerHTML += html;
        });
    }

    // 5. Chức năng Lọc (Filter)
    function applyFilters() {
        let filtered = [...listAo]; // Bắt đầu với danh sách Áo đầy đủ

        // A. Lọc theo Giá
        const priceCheckboxes = document.querySelectorAll('input[name="price"]:checked');
        if (priceCheckboxes.length > 0) {
            filtered = filtered.filter(p => {
                return Array.from(priceCheckboxes).some(cb => {
                    const val = cb.value;
                    if (val === 'duoi-200k') return p.price < 200000;
                    if (val === '200k-500k') return p.price >= 200000 && p.price <= 500000;
                    if (val === '500k-1tr')  return p.price > 500000 && p.price <= 1000000;
                    if (val === 'tren-1tr')  return p.price > 1000000;
                    return false;
                });
            });
        }

        // B. Lọc theo Size
        const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
        if (sizeCheckboxes.length > 0) {
            filtered = filtered.filter(p => {
                if (!p.sizes) return false;
                // Kiểm tra xem sản phẩm có chứa size được chọn không
                return Array.from(sizeCheckboxes).some(cb => p.sizes.includes(cb.value));
            });
        }

        // C. Sắp xếp (Giá tăng/giảm)
        const sortVal = sortSelect.value;
        if (sortVal === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortVal === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        }

        renderProducts(filtered); // Vẽ lại màn hình với danh sách đã lọc
    }

    // Gán sự kiện click cho nút "Áp Dụng" và ô chọn Sắp xếp
    if(btnApply) btnApply.addEventListener('click', applyFilters);
    if(sortSelect) sortSelect.addEventListener('change', applyFilters);

    // CHẠY LẦN ĐẦU TIÊN (Hiển thị toàn bộ áo)
    renderProducts(listAo);
});

// 6. Hàm Thêm vào giỏ hàng (Dành riêng cho trang này)
window.themVaoGioHangAo = function(id) {
    // Kiểm tra đăng nhập (Lấy thông tin từ bộ nhớ trình duyệt)
    const userJson = localStorage.getItem('apex_current_user_vn');
    
    if (!userJson) {
        alert("Vui lòng đăng nhập để mua hàng!");
        // Tìm và click nút đăng nhập trên header
        const btnLogin = document.getElementById('nut-mo-dang-nhap');
        if(btnLogin) btnLogin.click();
        return;
    }

    const user = JSON.parse(userJson);
    const p = danhSachSanPham.find(x => x.id === id);
    if (!p) return;

    // Lấy giỏ hàng cũ hoặc tạo mới
    const key = 'apex_cart_' + user.username;
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    
    // Kiểm tra sản phẩm đã có chưa để tăng số lượng
    const exist = cart.find(x => x.id === id);
    if (exist) {
        exist.soLuong++;
    } else {
        cart.push({ 
            id: p.id, 
            ten: p.name, 
            gia: p.price, 
            hinh: p.image, 
            size: p.sizes ? p.sizes[0] : 'Free', // Mặc định size đầu tiên
            soLuong: 1 
        });
    }
    
    // Lưu lại và thông báo
    localStorage.setItem(key, JSON.stringify(cart));
    alert(`Đã thêm "${p.name}" vào giỏ!`);
    
    // Tải lại trang để số lượng trên icon giỏ hàng nhảy số
    window.location.reload();
};