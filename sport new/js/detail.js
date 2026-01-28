// js/detail.js

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. LẤY ID TỪ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // 2. KIỂM TRA DỮ LIỆU
    if (typeof danhSachSanPham === 'undefined') {
        console.error("Dữ liệu sản phẩm chưa được tải!");
        return;
    }

    const product = danhSachSanPham.find(p => p.id === productId);

    // 3. HIỂN THỊ DỮ LIỆU SẢN PHẨM
    if (product) {
        // Thông tin cơ bản
        document.title = `${product.name} | Apex Sports`;
        const breadcrumb = document.getElementById('breadcrumb-current');
        if(breadcrumb) breadcrumb.textContent = product.name;
        
        const elCategory = document.getElementById('detail-category');
        const elName = document.getElementById('detail-name');
        const elPrice = document.getElementById('detail-price');
        const elDesc = document.getElementById('detail-desc');

        if(elCategory) elCategory.textContent = product.category;
        if(elName) elName.textContent = product.name;
        if(elPrice) elPrice.textContent = product.price.toLocaleString('vi-VN') + ' ₫';
        if(elDesc) elDesc.textContent = product.description;

        // --- XỬ LÝ ẢNH (GALLERY) ---
        const mainImg = document.getElementById('anh-chinh');
        const thumbContainer = document.getElementById('danh-sach-thumb');
        
        let images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

        // Fallback ảnh lỗi
        const imagesFinal = images.map((img, index) => {
            if (!img || img.includes("LINK_ANH")) {
                return `https://via.placeholder.com/600x600?text=${product.name.substring(0, 10)}+${index + 1}`; 
            }
            return img;
        });

        if(mainImg) mainImg.src = imagesFinal[0];
        
        if(thumbContainer) {
            thumbContainer.innerHTML = '';
            imagesFinal.forEach((imgSrc, index) => {
                const thumb = document.createElement('div');
                thumb.className = 'thumb-item';
                if (index === 0) thumb.classList.add('dang-chon');
                
                thumb.innerHTML = `<img src="${imgSrc}" alt="Thumbnail ${index + 1}">`;
                
                thumb.addEventListener('click', () => {
                    if(mainImg) mainImg.src = imgSrc;
                    document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('dang-chon'));
                    thumb.classList.add('dang-chon');
                });

                thumbContainer.appendChild(thumb);
            });
        }

        // Xử lý nút cuộn ảnh nhỏ
        const btnUp = document.getElementById('btn-up');
        const btnDown = document.getElementById('btn-down');
        const thumbWrapper = document.querySelector('.danh-sach-thumb-wrapper');
        
        if(btnUp && thumbWrapper) {
            btnUp.addEventListener('click', () => thumbWrapper.scrollBy({ top: -90, behavior: 'smooth' }));
        }
        if(btnDown && thumbWrapper) {
            btnDown.addEventListener('click', () => thumbWrapper.scrollBy({ top: 90, behavior: 'smooth' }));
        }

        // --- RENDER SIZES ---
        const sizeContainer = document.getElementById('size-container');
        if (sizeContainer) {
            sizeContainer.innerHTML = '';
            if (product.sizes && product.sizes.length > 0) {
                product.sizes.forEach((size, index) => {
                    const btn = document.createElement('div');
                    btn.className = 'nut-size';
                    btn.textContent = size;
                    if(index === 0) btn.classList.add('chon'); // Chọn mặc định size đầu
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.nut-size').forEach(b => b.classList.remove('chon'));
                        btn.classList.add('chon');
                    });
                    sizeContainer.appendChild(btn);
                });
            } else {
                sizeContainer.innerHTML = '<span style="color:#64748b">Freesize</span>';
            }
        }

        // Render sản phẩm liên quan
        renderRelatedProducts(product.category, product.id);

    } else {
        const container = document.querySelector('.chi-tiet-container');
        if(container) {
            container.innerHTML = `
                <div style="text-align:center; padding:50px;">
                    <h2>Không tìm thấy sản phẩm</h2>
                    <a href="../index.html" class="nut nut-chinh" style="margin-top:20px">Về trang chủ</a>
                </div>
            `;
        }
    }
});

// --- HÀM HỖ TRỢ (RENDER LIÊN QUAN) ---
function renderRelatedProducts(category, currentId) {
    const relatedContainer = document.getElementById('related-grid');
    if(!relatedContainer) return;

    const related = danhSachSanPham
        .filter(p => p.category === category && p.id !== currentId)
        .slice(0, 4);

    if(related.length === 0) {
        const section = document.querySelector('.san-pham-lien-quan');
        if(section) section.style.display = 'none';
        return;
    }

    relatedContainer.innerHTML = '';
    related.forEach(p => {
        const html = `
            <div class="the-san-pham" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                <div class="khung-anh-the" style="height:200px">
                    <img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="than-the" style="padding:15px">
                    <h3 class="tieu-de-the" style="font-size:1rem">${p.name}</h3>
                    <span class="gia" style="font-size:1rem; color:#2563eb; font-weight:bold;">${p.price.toLocaleString('vi-VN')} ₫</span>
                </div>
            </div>
        `;
        relatedContainer.innerHTML += html;
    });
}

// =========================================================
// CÁC HÀM TOÀN CỤC (GLOBAL) ĐỂ GỌI TỪ HTML (onclick="")
// =========================================================

// 1. Hàm Tăng/Giảm số lượng
window.doiSoLuong = function(amount) {
    const input = document.getElementById('input-so-luong');
    if (input) {
        let currentValue = parseInt(input.value);
        let newValue = currentValue + amount;
        if (newValue >= 1) {
            input.value = newValue;
        }
    }
};

// 2. Hàm THÊM VÀO GIỎ HÀNG (Đã cập nhật để đồng bộ Auth với trang chủ)
window.themVaoGioHang = function() {
    // A. Kiểm tra đăng nhập (Sử dụng cùng key với app.js)
    const KHOA_NGUOI_DUNG_HIEN_TAI = 'apex_current_user_vn';
    const userJson = localStorage.getItem(KHOA_NGUOI_DUNG_HIEN_TAI);
    const user = userJson ? JSON.parse(userJson) : null;

    if (!user) {
        alert("Vui lòng đăng nhập để mua hàng!");
        // Mở modal đăng nhập (Kích hoạt nút ẩn trên header do app.js quản lý)
        const btnLoginHeader = document.getElementById('nut-mo-dang-nhap');
        if(btnLoginHeader) btnLoginHeader.click(); 
        return;
    }

    // B. Lấy thông tin sản phẩm
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = danhSachSanPham.find(p => p.id === productId);

    if (!product) return;

    // C. Lấy số lượng và size
    const inputSoLuong = document.getElementById('input-so-luong');
    const soLuong = inputSoLuong ? parseInt(inputSoLuong.value) : 1;
    
    const sizeEl = document.querySelector('.nut-size.chon');
    const size = sizeEl ? sizeEl.textContent : (product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'Freesize');

    // D. Lưu vào LocalStorage (Cùng cấu trúc với app.js)
    const keyGioHang = 'apex_cart_' + user.username;
    let gioHang = JSON.parse(localStorage.getItem(keyGioHang)) || [];
    
    // Kiểm tra trùng sản phẩm (cùng ID và Size)
    const itemTonTai = gioHang.find(item => item.id === productId && item.size === size);
    
    if (itemTonTai) {
        itemTonTai.soLuong += soLuong;
    } else {
        gioHang.push({
            id: product.id,
            ten: product.name,
            gia: product.price,
            hinh: product.image,
            size: size,
            soLuong: soLuong
        });
    }

    localStorage.setItem(keyGioHang, JSON.stringify(gioHang));

    // E. Cập nhật Badge trên Header ngay lập tức
    const badge = document.querySelector('.so-luong-gio-hang');
    if(badge) {
        const tongSoLuong = gioHang.reduce((tong, item) => tong + item.soLuong, 0);
        badge.textContent = tongSoLuong;
    }

    alert(`Đã thêm ${soLuong} sản phẩm "${product.name}" (Size: ${size}) vào giỏ hàng!`);
};