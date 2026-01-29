document.addEventListener('DOMContentLoaded', () => {
    
    const gridAo = document.getElementById('luoi-san-pham-ao');
    const noResult = document.getElementById('no-result');
    const btnApply = document.getElementById('btn-apply-filter');
    const sortSelect = document.getElementById('sort-select');

    if (typeof danhSachSanPham === 'undefined') {
        console.error("Chưa load được dữ liệu sản phẩm!");
        return;
    }

    const listAo = danhSachSanPham.filter(p => 
        p.category === 'Áo' || p.name.toLowerCase().includes('áo')
    );

    function renderProducts(list) {
        gridAo.innerHTML = '';
        
        if (list.length === 0) {
            noResult.classList.remove('an');
            gridAo.style.display = 'none';
            return;
        } else {
            noResult.classList.add('an');
            gridAo.style.display = 'grid';
        }

        list.forEach(p => {
            const priceFormatted = p.price.toLocaleString('vi-VN') + ' ₫';
            
            let sizeHTML = '';
            if (p.sizes && p.sizes.length > 0) {
                sizeHTML = `<div class="lua-chon-size">` + 
                           p.sizes.map(s => `<span class="size-badge">${s}</span>`).join('') + 
                           `</div>`;
            }

            // === XỬ LÝ ĐƯỜNG DẪN ẢNH ===
            let imgSrc = p.image;
            // Tìm chữ "imgae" và cắt chuỗi từ đó để chuẩn hóa
            if (imgSrc.includes('imgae')) {
                imgSrc = imgSrc.substring(imgSrc.indexOf('imgae'));
            }
            // Thêm ../../ để quay ra thư mục gốc
            imgSrc = '/' + imgSrc; 

            // === TẠO HTML ===
            // Thay đổi quan trọng: Thẻ <a> trỏ về trang chi tiết sản phẩm
            const html = `
                <div class="the-san-pham">
                    <div class="khung-anh-the">
                        <a href="../../pages/product-detail.html?id=${p.id}" class="xem-chi-tiet-anh">
                            <img src="${imgSrc}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300?text=Lỗi+Ảnh'">
                        </a>
                    </div>
                    <div class="than-the">
                        <span class="danh-muc-the">${p.category}</span>
                        <h3 class="tieu-de-the">
                            <a href="../../pages/product-detail.html?id=${p.id}">${p.name}</a>
                        </h3>
                        ${sizeHTML}
                        <div class="chan-the">
                            <span class="gia">${priceFormatted}</span>
                            <div class="nhom-nut">
                                <button class="nut nut-vien-nho" onclick="moModalAo(${p.id})">Xem</button>
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

    function applyFilters() {
        let filtered = [...listAo];
        const priceCheckboxes = document.querySelectorAll('input[name="price"]:checked');
        if (priceCheckboxes.length > 0) {
            filtered = filtered.filter(p => {
                return Array.from(priceCheckboxes).some(cb => {
                    const val = cb.value;
                    if (val === 'duoi-500k') return p.price < 500000;
                    if (val === '500k-1tr')  return p.price >= 500000 && p.price <= 1000000;
                    if (val === 'tren-1tr')  return p.price > 1000000;
                    return false;
                });
            });
        }
        const sizeCheckboxes = document.querySelectorAll('input[name="size"]:checked');
        if (sizeCheckboxes.length > 0) {
            filtered = filtered.filter(p => {
                if (!p.sizes) return false;
                return Array.from(sizeCheckboxes).some(cb => p.sizes.includes(cb.value));
            });
        }
        const sortVal = sortSelect.value;
        if (sortVal === 'price-asc') filtered.sort((a, b) => a.price - b.price);
        if (sortVal === 'price-desc') filtered.sort((a, b) => b.price - a.price);

        renderProducts(filtered);
    }

    if(btnApply) btnApply.addEventListener('click', applyFilters);
    if(sortSelect) sortSelect.addEventListener('change', applyFilters);

    renderProducts(listAo);
});

// Hàm Modal
window.moModalAo = function(id) {
    const p = danhSachSanPham.find(x => x.id === id);
    if(!p) return;

    let imgSrc = p.image;
    if (imgSrc.includes('imgae')) {
        imgSrc = imgSrc.substring(imgSrc.indexOf('imgae'));
    }
    imgSrc = '/' + imgSrc;

    document.getElementById('anh-modal').src = imgSrc;
    document.getElementById('tieu-de-modal').textContent = p.name;
    document.getElementById('danh-muc-modal').textContent = p.category;
    document.getElementById('gia-modal').textContent = p.price.toLocaleString('vi-VN') + ' ₫';
    document.getElementById('mo-ta-modal').textContent = p.description;

    const sizeSelect = document.getElementById('kich-thuoc-modal');
    sizeSelect.innerHTML = '<option>Chọn kích thước</option>';
    if(p.sizes){
        p.sizes.forEach(s => {
            sizeSelect.innerHTML += `<option value="${s}">${s}</option>`;
        });
    }

    document.getElementById('hop-thoai-san-pham').classList.add('hien');

    const btnAddModal = document.getElementById('nut-them-gio-hang-modal');
    const newBtn = btnAddModal.cloneNode(true);
    btnAddModal.parentNode.replaceChild(newBtn, btnAddModal);
    
    newBtn.addEventListener('click', () => {
        const selectedSize = sizeSelect.value;
        if(selectedSize === 'Chọn kích thước') {
            alert("Vui lòng chọn kích thước!");
            return;
        }
        themVaoGioHangTuModal(p, selectedSize);
    });
}

function themVaoGioHangTuModal(product, size) {
    const userJson = localStorage.getItem('apex_current_user_vn');
    if (!userJson) {
        alert("Vui lòng đăng nhập!");
        document.getElementById('hop-thoai-san-pham').classList.remove('hien');
        document.getElementById('nut-mo-dang-nhap').click();
        return;
    }
    const user = JSON.parse(userJson);
    const key = 'apex_cart_' + user.username;
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    
    // Lưu ảnh gốc
    let imgSrc = product.image; 
    
    const exist = cart.find(x => x.id === product.id && x.size === size);
    if (exist) exist.soLuong++;
    else cart.push({ id: product.id, ten: product.name, gia: product.price, hinh: imgSrc, size: size, soLuong: 1 });
    
    localStorage.setItem(key, JSON.stringify(cart));
    alert(`Đã thêm "${product.name}" (Size: ${size}) vào giỏ!`);
    document.getElementById('hop-thoai-san-pham').classList.remove('hien');
    window.location.reload();
}

window.themVaoGioHangAo = function(id) {
    const userJson = localStorage.getItem('apex_current_user_vn');
    if (!userJson) {
        alert("Vui lòng đăng nhập!");
        document.getElementById('nut-mo-dang-nhap').click();
        return;
    }
    const user = JSON.parse(userJson);
    const p = danhSachSanPham.find(x => x.id === id);
    if (!p) return;

    const key = 'apex_cart_' + user.username;
    let cart = JSON.parse(localStorage.getItem(key)) || [];
    const defaultSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : 'Free';
    const exist = cart.find(x => x.id === id && x.size === defaultSize);
    
    if (exist) exist.soLuong++;
    else cart.push({ id: p.id, ten: p.name, gia: p.price, hinh: p.image, size: defaultSize, soLuong: 1 });
    
    localStorage.setItem(key, JSON.stringify(cart));
    alert(`Đã thêm "${p.name}" vào giỏ!`);
    window.location.reload();
};