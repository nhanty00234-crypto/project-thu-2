document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. KHAI BÁO BIẾN ---
    const cartContent = document.getElementById('cart-content');
    const cartEmpty = document.getElementById('cart-empty');
    const cartList = document.getElementById('danh-sach-cart-items');
    const elTamTinh = document.getElementById('tam-tinh');
    const elTongTien = document.getElementById('tong-tien');
    const btnThanhToan = document.getElementById('nut-thanh-toan');

    // Key lưu trữ (phải giống app.js)
    const KHOA_USER = 'apex_current_user_vn';
    
    // --- 2. LẤY DỮ LIỆU USER & CART ---
    const userJson = localStorage.getItem(KHOA_USER);
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
        // Nếu chưa đăng nhập -> Hiện giỏ hàng trống hoặc yêu cầu đăng nhập
        hienThiGioHangTrong();
        // Tùy chọn: Tự động mở modal đăng nhập
        // document.getElementById('nut-mo-dang-nhap').click();
        return;
    }

    const KEY_CART = 'apex_cart_' + user.username;
    let gioHang = JSON.parse(localStorage.getItem(KEY_CART)) || [];

    // --- 3. HÀM HIỂN THỊ GIỎ HÀNG ---
    function renderCart() {
        if (gioHang.length === 0) {
            hienThiGioHangTrong();
            return;
        }

        // Hiện nội dung, ẩn thông báo trống
        cartContent.classList.remove('an');
        cartEmpty.classList.add('an');
        cartList.innerHTML = '';

        let tongTien = 0;

        gioHang.forEach((item, index) => {
            const thanhTien = item.gia * item.soLuong;
            tongTien += thanhTien;

            const itemHTML = document.createElement('div');
            itemHTML.className = 'cart-item';
            itemHTML.innerHTML = `
                <div class="col-sp">
                    <div class="item-info">
                        <img src="${item.hinh}" alt="${item.ten}" onerror="this.src='https://via.placeholder.com/80'">
                        <div class="item-details">
                            <h4><a href="product-detail.html?id=${item.id}">${item.ten}</a></h4>
                            <span class="item-size">Size: ${item.size}</span>
                        </div>
                    </div>
                </div>
                <div class="col-gia">${item.gia.toLocaleString()} ₫</div>
                <div class="col-sl">
                    <div class="quantity-control">
                        <button onclick="updateCartItem(${index}, -1)">-</button>
                        <input type="text" value="${item.soLuong}" readonly>
                        <button onclick="updateCartItem(${index}, 1)">+</button>
                    </div>
                </div>
                <div class="col-tong">${thanhTien.toLocaleString()} ₫</div>
                <div class="col-xoa">
                    <button class="btn-remove" onclick="removeCartItem(${index})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartList.appendChild(itemHTML);
        });

        // Cập nhật tổng tiền
        elTamTinh.textContent = tongTien.toLocaleString() + ' ₫';
        elTongTien.textContent = tongTien.toLocaleString() + ' ₫';
    }

    function hienThiGioHangTrong() {
        cartContent.classList.add('an');
        cartEmpty.classList.remove('an');
    }

    // --- 4. CÁC HÀM XỬ LÝ (GLOBAL SCOPE) ---
    
    // Cập nhật số lượng
    window.updateCartItem = function(index, change) {
        if (gioHang[index]) {
            let newQty = gioHang[index].soLuong + change;
            if (newQty < 1) return; // Không cho giảm dưới 1
            
            gioHang[index].soLuong = newQty;
            luuVaRender();
        }
    };

    // Xóa sản phẩm
    window.removeCartItem = function(index) {
        if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            gioHang.splice(index, 1);
            luuVaRender();
        }
    };

    // Lưu vào LocalStorage và Render lại
    function luuVaRender() {
        localStorage.setItem(KEY_CART, JSON.stringify(gioHang));
        renderCart();
        // Cập nhật badge trên header (nếu có hàm trong app.js, hoặc reload nhẹ)
        // Cách đơn giản nhất để badge header cập nhật theo là reload hoặc cập nhật DOM thủ công
        const badge = document.querySelector('.so-luong-gio-hang');
        if(badge) {
            const totalQty = gioHang.reduce((sum, item) => sum + item.soLuong, 0);
            badge.textContent = totalQty;
        }
    }

    // --- 5. SỰ KIỆN THANH TOÁN ---
    if(btnThanhToan) {
        btnThanhToan.addEventListener('click', () => {
            alert("Chức năng thanh toán đang được phát triển!\nTổng tiền: " + elTongTien.textContent);
            // Ở đây bạn có thể xóa giỏ hàng hoặc chuyển sang trang Success
            // localStorage.removeItem(KEY_CART);
            // window.location.reload();
        });
    }

    // Khởi chạy render
    renderCart();
});