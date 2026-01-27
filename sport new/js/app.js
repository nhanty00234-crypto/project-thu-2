// Đợi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
    
    // --- KHAI BÁO CÁC PHẦN TỬ (SELECTORS) ---
    const luoiSanPham = document.getElementById('luoi-san-pham');
    const oTimKiem = document.getElementById('o-tim-kiem');
    const nutTimKiem = document.getElementById('nut-tim-kiem');
    const tieuDeKetQua = document.getElementById('tieu-de-ket-qua');
    const soLuongKetQua = document.getElementById('so-luong-ket-qua');
    
    // Auth Elements
    const khuVucNutXacThuc = document.getElementById('cac-nut-xac-thuc');
    const thongTinNguoiDung = document.getElementById('thong-tin-user');
    const hienThiTenNguoiDung = document.getElementById('hien-thi-ten-user');
    const nutDangXuat = document.getElementById('nut-dang-xuat');
    
    // Modal Elements
    const nutMoDangNhap = document.getElementById('nut-mo-dang-nhap');
    const nutMoDangKy = document.getElementById('nut-mo-dang-ky');
    const hopThoaiSanPham = document.getElementById('hop-thoai-san-pham');
    const anhModal = document.getElementById('anh-modal');
    const tieuDeModal = document.getElementById('tieu-de-modal');
    const danhMucModal = document.getElementById('danh-muc-modal');
    const giaModal = document.getElementById('gia-modal');
    const moTaModal = document.getElementById('mo-ta-modal');

    // Forms
    const formDangNhap = document.getElementById('form-dang-nhap');
    const formDangKy = document.getElementById('form-dang-ky');
    const loiDangNhap = document.getElementById('loi-dang-nhap');
    const loiDangKy = document.getElementById('loi-dang-ky');

    // --- 1. LOGIC BANNER TRÌNH CHIẾU ---
    function khoiTaoBanner() {
        const cacSlide = document.querySelectorAll('.tam-slide');
        const nutTruoc = document.getElementById('slide-truoc');
        const nutSau = document.getElementById('slide-sau');
        const cacCham = document.querySelectorAll('.cham');
        
        if (!cacSlide.length) return;

        let slideHienTai = 0;
        const tongSoSlide = cacSlide.length;
        let thoiGianChuyenSlide;

        function hienThiSlide(chiSo) {
            if (chiSo >= tongSoSlide) slideHienTai = 0;
            else if (chiSo < 0) slideHienTai = tongSoSlide - 1;
            else slideHienTai = chiSo;

            cacSlide.forEach(slide => slide.classList.remove('kich-hoat'));
            cacSlide[slideHienTai].classList.add('kich-hoat');

            cacCham.forEach(cham => cham.classList.remove('kich-hoat'));
            if(cacCham[slideHienTai]) cacCham[slideHienTai].classList.add('kich-hoat');
        }

        function batDauTrinhChieu() {
            thoiGianChuyenSlide = setInterval(() => { hienThiSlide(slideHienTai + 1); }, 5000);
        }

        function dungTrinhChieu() { clearInterval(thoiGianChuyenSlide); }

        if(nutSau) nutSau.addEventListener('click', () => {
            dungTrinhChieu(); hienThiSlide(slideHienTai + 1); batDauTrinhChieu();
        });

        if(nutTruoc) nutTruoc.addEventListener('click', () => {
            dungTrinhChieu(); hienThiSlide(slideHienTai - 1); batDauTrinhChieu();
        });

        cacCham.forEach((cham, chiSo) => {
            cham.addEventListener('click', () => {
                dungTrinhChieu(); hienThiSlide(chiSo); batDauTrinhChieu();
            });
        });

        batDauTrinhChieu();
    }
    if(document.querySelector('.banner-trinh-chieu')) khoiTaoBanner();

    // --- 2. LOGIC XÁC THỰC (AUTH) ---
    const KHOA_NGUOI_DUNG = 'apex_users_vn';
    const KHOA_NGUOI_DUNG_HIEN_TAI = 'apex_current_user_vn';

    function layDanhSachNguoiDung() {
        const users = localStorage.getItem(KHOA_NGUOI_DUNG);
        return users ? JSON.parse(users) : [];
    }

    function luuNguoiDung(user) {
        const users = layDanhSachNguoiDung();
        users.push(user);
        localStorage.setItem(KHOA_NGUOI_DUNG, JSON.stringify(users));
    }

    function layNguoiDungHienTai() {
        const user = localStorage.getItem(KHOA_NGUOI_DUNG_HIEN_TAI);
        return user ? JSON.parse(user) : null;
    }

    function datNguoiDungHienTai(user) {
        const sessionUser = { username: user.username, email: user.email };
        localStorage.setItem(KHOA_NGUOI_DUNG_HIEN_TAI, JSON.stringify(sessionUser));
        capNhatGiaoDienXacThuc();
    }

    function dangXuat() {
        localStorage.removeItem(KHOA_NGUOI_DUNG_HIEN_TAI);
        capNhatGiaoDienXacThuc();
        window.location.reload(); 
    }

    function capNhatGiaoDienXacThuc() {
        const user = layNguoiDungHienTai();
        if (user) {
            if(khuVucNutXacThuc) khuVucNutXacThuc.classList.add('an');
            if(thongTinNguoiDung) thongTinNguoiDung.classList.remove('an');
            if(hienThiTenNguoiDung) hienThiTenNguoiDung.textContent = user.username;
            capNhatBadgeGioHang();
        } else {
            if(khuVucNutXacThuc) khuVucNutXacThuc.classList.remove('an');
            if(thongTinNguoiDung) thongTinNguoiDung.classList.add('an');
            const badge = document.querySelector('.so-luong-gio-hang');
            if(badge) badge.textContent = '0';
        }
    }

    // --- 3. LOGIC HỘP THOẠI (MODAL) ---
    function moHopThoai(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) {
            modal.classList.add('hien');
            document.body.style.overflow = 'hidden';
            if(idModal === 'hop-thoai-dang-nhap') { if(loiDangNhap) loiDangNhap.textContent = ''; if(formDangNhap) formDangNhap.reset(); }
            if(idModal === 'hop-thoai-dang-ky') { if(loiDangKy) loiDangKy.textContent = ''; if(formDangKy) formDangKy.reset(); }
        }
    }

    function dongHopThoai(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) {
            modal.classList.remove('hien');
            document.body.style.overflow = 'auto';
        }
    }

    document.querySelectorAll('.dong-hop-thoai').forEach(nut => {
        nut.addEventListener('click', () => dongHopThoai(nut.dataset.target));
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('hop-thoai')) {
            e.target.classList.remove('hien');
            document.body.style.overflow = 'auto';
        }
    });

    // --- 4. XỬ LÝ FORM LOGIN/REGISTER ---
    if (formDangKy) {
        formDangKy.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('ten-dang-ky').value.trim();
            const email = document.getElementById('email-dang-ky').value.trim();
            const password = document.getElementById('mat-khau-dang-ky').value;
            const confirmPassword = document.getElementById('xac-nhan-mat-khau').value;

            if (password.length < 6) { loiDangKy.textContent = "Mật khẩu tối thiểu 6 ký tự."; return; }
            if (password !== confirmPassword) { loiDangKy.textContent = "Mật khẩu không khớp."; return; }

            const users = layDanhSachNguoiDung();
            if (users.find(u => u.email === email)) { loiDangKy.textContent = "Email đã tồn tại."; return; }
            if (users.find(u => u.username === username)) { loiDangKy.textContent = "Tên đăng nhập đã tồn tại."; return; }

            const newUser = { username, email, password }; 
            luuNguoiDung(newUser);
            datNguoiDungHienTai(newUser);
            dongHopThoai('hop-thoai-dang-ky');
            alert("Đăng ký thành công!");
        });
    }

    if (formDangNhap) {
        formDangNhap.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-dang-nhap').value.trim();
            const password = document.getElementById('mat-khau-dang-nhap').value;
            const users = layDanhSachNguoiDung();
            const validUser = users.find(u => (u.email === email || u.username === email) && u.password === password);

            if (validUser) {
                datNguoiDungHienTai(validUser);
                dongHopThoai('hop-thoai-dang-nhap');
            } else {
                loiDangNhap.textContent = "Sai email hoặc mật khẩu.";
            }
        });
    }

    if(nutDangXuat) nutDangXuat.addEventListener('click', dangXuat);
    if(nutMoDangNhap) nutMoDangNhap.addEventListener('click', () => moHopThoai('hop-thoai-dang-nhap'));
    if(nutMoDangKy) nutMoDangKy.addEventListener('click', () => moHopThoai('hop-thoai-dang-ky'));

    // --- 5. LOGIC HIỂN THỊ SẢN PHẨM & GIỎ HÀNG ---

    function hienThiSanPham(danhSach, tuKhoa = '') {
        if (!luoiSanPham) return;
        
        luoiSanPham.innerHTML = ''; 

        if (danhSach.length === 0) {
            luoiSanPham.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p style="color: #64748b;">Vui lòng thử danh mục hoặc từ khóa khác.</p>
                </div>
            `;
            if(soLuongKetQua) soLuongKetQua.textContent = '0 sản phẩm';
            return;
        }

        if(soLuongKetQua) soLuongKetQua.textContent = `Hiển thị ${danhSach.length} sản phẩm`;

        danhSach.forEach(sanPham => {
            const the = document.createElement('div');
            the.classList.add('the-san-pham');
            const giaVND = sanPham.price.toLocaleString('vi-VN') + ' ₫';

            let sizeHTML = '';
            if (sanPham.sizes && sanPham.sizes.length > 0) {
                sizeHTML = '<div class="lua-chon-size">';
                sanPham.sizes.forEach(size => { sizeHTML += `<span class="size-badge">${size}</span>`; });
                sizeHTML += '</div>';
            }

            the.innerHTML = `
                <div class="khung-anh-the">
                    <a href="pages/product-detail.html?id=${sanPham.id}" class="xem-chi-tiet-anh">
                        <img src="${sanPham.image}" alt="${sanPham.name}">
                    </a>
                </div>
                <div class="than-the">
                    <span class="danh-muc-the">${sanPham.category}</span>
                    <h3 class="tieu-de-the"><a href="pages/product-detail.html?id=${sanPham.id}">${sanPham.name}</a></h3>
                    ${sizeHTML}
                    <div class="chan-the">
                        <span class="gia">${giaVND}</span>
                        <div class="nhom-nut">
                            <button class="nut nut-vien-nho nut-xem-chi-tiet" data-id="${sanPham.id}">Xem</button>
                            <button class="nut nut-chinh-nho nut-them-gio" data-id="${sanPham.id}"><i class="fas fa-cart-plus"></i></button>
                        </div>
                    </div>
                </div>
            `;
            luoiSanPham.appendChild(the);
        });

        // Gán events
        document.querySelectorAll('.nut-xem-chi-tiet').forEach(nut => {
            nut.addEventListener('click', (e) => moModalSanPham(parseInt(e.target.dataset.id)));
        });
        document.querySelectorAll('.nut-them-gio').forEach(nut => {
            nut.addEventListener('click', (e) => {
                e.stopPropagation();
                xuLyThemGioHang(parseInt(nut.dataset.id));
            });
        });
    }

    function thucHienTimKiem() {
        if (!oTimKiem || typeof danhSachSanPham === 'undefined') return;
        const tuKhoa = oTimKiem.value.toLowerCase().trim();
        if (tuKhoa === '') {
            hienThiSanPham(danhSachSanPham);
            if(tieuDeKetQua) tieuDeKetQua.textContent = "Sản phẩm nổi bật";
            return;
        }
        const ketQua = danhSachSanPham.filter(sp => 
            sp.name.toLowerCase().includes(tuKhoa) || sp.category.toLowerCase().includes(tuKhoa)
        );
        if(tieuDeKetQua) tieuDeKetQua.textContent = `Kết quả cho: "${tuKhoa}"`;
        hienThiSanPham(ketQua);
    }

    if(oTimKiem) oTimKiem.addEventListener('input', thucHienTimKiem);
    if(nutTimKiem) nutTimKiem.addEventListener('click', thucHienTimKiem);

    function moModalSanPham(idSanPham) {
        if (typeof danhSachSanPham === 'undefined') return;
        const sanPham = danhSachSanPham.find(p => p.id === idSanPham);
        if (!sanPham) return;
        
        if(anhModal) anhModal.src = sanPham.image;
        if(tieuDeModal) tieuDeModal.textContent = sanPham.name;
        if(danhMucModal) danhMucModal.textContent = sanPham.category;
        if(giaModal) giaModal.textContent = sanPham.price.toLocaleString('vi-VN') + ' ₫';
        if(moTaModal) moTaModal.textContent = sanPham.description;
        moHopThoai('hop-thoai-san-pham');
    }

    function xuLyThemGioHang(idSanPham) {
        const user = layNguoiDungHienTai();
        if (!user) {
            alert("Vui lòng đăng nhập để mua hàng!");
            moHopThoai('hop-thoai-dang-nhap');
            return;
        }
        if (typeof danhSachSanPham === 'undefined') return;
        const sanPham = danhSachSanPham.find(p => p.id === idSanPham);
        if (!sanPham) return;

        const keyGioHang = 'apex_cart_' + user.username;
        let gioHang = JSON.parse(localStorage.getItem(keyGioHang)) || [];
        const itemTonTai = gioHang.find(item => item.id === idSanPham);
        if (itemTonTai) itemTonTai.soLuong += 1;
        else gioHang.push({ id: sanPham.id, ten: sanPham.name, gia: sanPham.price, hinh: sanPham.image, soLuong: 1 });

        localStorage.setItem(keyGioHang, JSON.stringify(gioHang));
        capNhatBadgeGioHang();
        alert(`Đã thêm "${sanPham.name}" vào giỏ hàng!`);
    }

    function capNhatBadgeGioHang() {
        const user = layNguoiDungHienTai();
        const badge = document.querySelector('.so-luong-gio-hang');
        if (!badge) return;
        if (!user) { badge.textContent = 0; return; }
        const keyGioHang = 'apex_cart_' + user.username;
        const gioHang = JSON.parse(localStorage.getItem(keyGioHang)) || [];
        const tongSoLuong = gioHang.reduce((tong, item) => tong + item.soLuong, 0);
        badge.textContent = tongSoLuong;
    }

    // --- 6. KHỞI TẠO BAN ĐẦU ---
    capNhatGiaoDienXacThuc();

    // --- 7. LOGIC QUÊN MẬT KHẨU ---
    const formQuenMatKhau = document.getElementById('form-quen-mat-khau');
    if (formQuenMatKhau) {
        formQuenMatKhau.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-khoi-phuc').value;
            alert(`Link khôi phục mật khẩu đã được gửi đến: ${email}`);
            window.location.href = '../index.html';
        });
    }

    // --- 8. LOGIC CHO TRANG TĨNH (STATIC PAGES) ---
    // Kiểm tra nếu đang ở trang tĩnh (có id='luoi-san-pham-static') thì KHÔNG chạy hienThiSanPham()
    // Thay vào đó, gán sự kiện trực tiếp cho các thẻ HTML tĩnh.
    const luoiStatic = document.getElementById('luoi-san-pham-static');
    
    if (luoiStatic) {
        // Đây là trang tĩnh (Category Page), gán sự kiện cho HTML có sẵn
        document.querySelectorAll('.nut-them-gio').forEach(nut => {
            nut.addEventListener('click', (e) => {
                e.stopPropagation();
                xuLyThemGioHang(parseInt(nut.dataset.id));
            });
        });
        document.querySelectorAll('.nut-xem-chi-tiet').forEach(nut => {
            nut.addEventListener('click', (e) => moModalSanPham(parseInt(e.target.dataset.id)));
        });
    } else {
        // Đây là trang chủ (Dynamic), chạy render từ JS
        if (typeof danhSachSanPham !== 'undefined') {
            hienThiSanPham(danhSachSanPham);
        }
        
        // Logic lọc (Chỉ áp dụng cho trang Dynamic)
        const cacNutLoc = document.querySelectorAll('.nut-loc');
        if (cacNutLoc.length > 0 && typeof danhSachSanPham !== 'undefined') {
            cacNutLoc.forEach(nut => {
                nut.addEventListener('click', () => {
                    cacNutLoc.forEach(n => n.classList.remove('kich-hoat'));
                    nut.classList.add('kich-hoat');
                    const danhMuc = nut.dataset.danhmuc;
                    let sanPhamLoc = (danhMuc === 'all') ? danhSachSanPham : danhSachSanPham.filter(sp => sp.category === danhMuc);
                    hienThiSanPham(sanPhamLoc);
                });
            });
        }
    }
});
// ... (Code cũ giữ nguyên)

    // --- XỬ LÝ LOGOUT MỚI TRONG DROPDOWN ---
    const nutDangXuatMoi = document.getElementById('nut-dang-xuat-moi');
    if (nutDangXuatMoi) {
        nutDangXuatMoi.addEventListener('click', (e) => {
            e.preventDefault(); // Ngăn chuyển trang nếu thẻ a có href="#"
            dangXuat();
        });
    }
    
    // Giữ lại logic cũ nếu vẫn còn nút cũ ở đâu đó (phòng hờ)
    if(nutDangXuat) nutDangXuat.addEventListener('click', dangXuat);

// ... (Code cũ giữ nguyên)
