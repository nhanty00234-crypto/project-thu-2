document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Get ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    // 2. Find Product in Data
    if (typeof danhSachSanPham === 'undefined') {
        console.error("Data not loaded!");
        return;
    }

    const product = danhSachSanPham.find(p => p.id === productId);

    // 3. Render Product Data
    if (product) {
        // Basic Info
        document.title = `${product.name} | Apex Sports`;
        document.getElementById('breadcrumb-current').textContent = product.name;
        
        // --- XỬ LÝ ẢNH & GALLERY ---
        const mainImg = document.getElementById('anh-chinh');
        const thumbContainer = document.getElementById('danh-sach-thumb');
        
        // Lấy danh sách ảnh từ data.js. Nếu không có gallery thì dùng ảnh chính làm fallback
        let images = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

        // Xử lý ảnh lỗi/ảnh chưa điền link (Dùng Placeholder)
        const imagesFinal = images.map((img, index) => {
            // Nếu link là chuỗi placeholder "LINK_ANH..." hoặc bị trống -> dùng ảnh giữ chỗ
            if (!img || img.includes("LINK_ANH")) {
                return `https://via.placeholder.com/600x600?text=${product.name.substring(0, 10)}+${index + 1}`; 
            }
            return img;
        });

        // Set ảnh chính mặc định
        mainImg.src = imagesFinal[0];
        
        // Xóa nội dung cũ
        thumbContainer.innerHTML = '';

        // Render Thumbnails (Danh sách ảnh nhỏ)
        imagesFinal.forEach((imgSrc, index) => {
            const thumb = document.createElement('div');
            thumb.className = 'thumb-item';
            if (index === 0) thumb.classList.add('dang-chon');
            
            thumb.innerHTML = `<img src="${imgSrc}" alt="${product.name} ${index + 1}">`;
            
            // Click thumb -> Đổi ảnh chính
            thumb.addEventListener('click', () => {
                mainImg.src = imgSrc;
                document.querySelectorAll('.thumb-item').forEach(t => t.classList.remove('dang-chon'));
                thumb.classList.add('dang-chon');
            });

            thumbContainer.appendChild(thumb);
        });

        // --- XỬ LÝ NÚT LÊN / XUỐNG ---
        const btnUp = document.getElementById('btn-up');
        const btnDown = document.getElementById('btn-down');
        const thumbWrapper = document.querySelector('.danh-sach-thumb-wrapper');
        const scrollAmount = 90; // Chiều cao thumb (80) + gap (10)

        if(btnUp && btnDown && thumbWrapper) {
            btnUp.addEventListener('click', () => {
                thumbWrapper.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
            });

            btnDown.addEventListener('click', () => {
                thumbWrapper.scrollBy({ top: scrollAmount, behavior: 'smooth' });
            });
        }

        // --- CÁC THÔNG TIN KHÁC ---
        document.getElementById('detail-category').textContent = product.category;
        document.getElementById('detail-name').textContent = product.name;
        document.getElementById('detail-price').textContent = product.price.toLocaleString('vi-VN') + ' ₫';
        document.getElementById('detail-desc').textContent = product.description;

        // Render Sizes
        const sizeContainer = document.getElementById('size-container');
        if (product.sizes && product.sizes.length > 0) {
            product.sizes.forEach((size, index) => {
                const btn = document.createElement('div');
                btn.className = 'nut-size';
                btn.textContent = size;
                if(index === 0) btn.classList.add('chon');
                btn.addEventListener('click', () => {
                    document.querySelectorAll('.nut-size').forEach(b => b.classList.remove('chon'));
                    btn.classList.add('chon');
                });
                sizeContainer.appendChild(btn);
            });
        } else {
            sizeContainer.innerHTML = '<span style="color:#64748b">Freesize / Một kích thước</span>';
        }

        renderRelatedProducts(product.category, product.id);

    } else {
        document.querySelector('.chi-tiet-container').innerHTML = `
            <div style="text-align:center; padding:50px;">
                <h2>Không tìm thấy sản phẩm</h2>
                <a href="../index.html" class="nut nut-chinh" style="margin-top:20px">Về trang chủ</a>
            </div>
        `;
    }
});

function renderRelatedProducts(category, currentId) {
    const relatedContainer = document.getElementById('related-grid');
    const related = danhSachSanPham
        .filter(p => p.category === category && p.id !== currentId)
        .slice(0, 4);

    if(related.length === 0) {
        document.querySelector('.san-pham-lien-quan').style.display = 'none';
        return;
    }

    related.forEach(p => {
        const html = `
            <div class="the-san-pham" onclick="window.location.href='product-detail.html?id=${p.id}'" style="cursor:pointer">
                <div class="khung-anh-the" style="height:200px">
                    <img src="${p.image}" alt="${p.name}" style="width:100%; height:100%; object-fit:cover;">
                </div>
                <div class="than-the" style="padding:15px">
                    <h3 class="tieu-de-the" style="font-size:1rem">${p.name}</h3>
                    <span class="gia" style="font-size:1rem">${p.price.toLocaleString('vi-VN')} ₫</span>
                </div>
            </div>
        `;
        relatedContainer.innerHTML += html;
    });
}