// Đợi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
    
    // --- KHAI BÁO CÁC PHẦN TỬ (SELECTORS) ---
    
    // Lưới sản phẩm & Tìm kiếm
    const luoiSanPham = document.getElementById('luoi-san-pham');
    const oTimKiem = document.getElementById('o-tim-kiem');
    const nutTimKiem = document.getElementById('nut-tim-kiem');
    const tieuDeKetQua = document.getElementById('tieu-de-ket-qua');
    const soLuongKetQua = document.getElementById('so-luong-ket-qua');
    
    // Phần xác thực (Auth)
    const khuVucNutXacThuc = document.getElementById('cac-nut-xac-thuc');
    const thongTinNguoiDung = document.getElementById('thong-tin-user');
    const hienThiTenNguoiDung = document.getElementById('hien-thi-ten-user');
    const nutDangXuat = document.getElementById('nut-dang-xuat');
    
    // Nút mở hộp thoại (Modal)
    const nutMoDangNhap = document.getElementById('nut-mo-dang-nhap');
    const nutMoDangKy = document.getElementById('nut-mo-dang-ky');
    const chuyenSangDangKy = document.getElementById('chuyen-sang-dang-ky');
    const chuyenSangDangNhap = document.getElementById('chuyen-sang-dang-nhap');
    
    // Biểu mẫu (Forms)
    const formDangNhap = document.getElementById('form-dang-nhap');
    const formDangKy = document.getElementById('form-dang-ky');
    const loiDangNhap = document.getElementById('loi-dang-nhap');
    const loiDangKy = document.getElementById('loi-dang-ky');

    // Hộp thoại sản phẩm (Product Modal)
    const hopThoaiSanPham = document.getElementById('hop-thoai-san-pham');
    const anhModal = document.getElementById('anh-modal');
    const tieuDeModal = document.getElementById('tieu-de-modal');
    const danhMucModal = document.getElementById('danh-muc-modal');
    const giaModal = document.getElementById('gia-modal');
    const moTaModal = document.getElementById('mo-ta-modal');
    const nutThemGioHangModal = document.getElementById('nut-them-gio-hang-modal');

    // --- LOGIC BANNER TRÌNH CHIẾU (SLIDER) ---
    function khoiTaoBanner() {
        const cacSlide = document.querySelectorAll('.tam-slide');
        const nutTruoc = document.getElementById('slide-truoc');
        const nutSau = document.getElementById('slide-sau');
        const cacCham = document.querySelectorAll('.cham');
        
        let slideHienTai = 0;
        const tongSoSlide = cacSlide.length;
        let thoiGianChuyenSlide;

        // Hàm hiển thị slide
        function hienThiSlide(chiSo) {
            if (chiSo >= tongSoSlide) slideHienTai = 0;
            else if (chiSo < 0) slideHienTai = tongSoSlide - 1;
            else slideHienTai = chiSo;

            // Cập nhật Slide
            cacSlide.forEach(slide => slide.classList.remove('kich-hoat'));
            cacSlide[slideHienTai].classList.add('kich-hoat');

            // Cập nhật Chấm
            cacCham.forEach(cham => cham.classList.remove('kich-hoat'));
            cacCham[slideHienTai].classList.add('kich-hoat');
        }

        // Tự động chạy
        function batDauTrinhChieu() {
            thoiGianChuyenSlide = setInterval(() => {
                hienThiSlide(slideHienTai + 1);
            }, 5000); // Chuyển mỗi 5 giây
        }

        function dungTrinhChieu() {
            clearInterval(thoiGianChuyenSlide);
        }

        // Sự kiện nút bấm
        nutSau.addEventListener('click', () => {
            dungTrinhChieu();
            hienThiSlide(slideHienTai + 1);
            batDauTrinhChieu();
        });

        nutTruoc.addEventListener('click', () => {
            dungTrinhChieu();
            hienThiSlide(slideHienTai - 1);
            batDauTrinhChieu();
        });

        cacCham.forEach((cham, chiSo) => {
            cham.addEventListener('click', () => {
                dungTrinhChieu();
                hienThiSlide(chiSo);
                batDauTrinhChieu();
            });
        });

        // Khởi chạy
        batDauTrinhChieu();
    }

    // Chỉ khởi tạo nếu slider tồn tại
    if(document.querySelector('.banner-trinh-chieu')) {
        khoiTaoBanner();
    }

    // --- LOGIC XÁC THỰC (AUTH) ---

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
            khuVucNutXacThuc.classList.add('an');
            thongTinNguoiDung.classList.remove('an');
            hienThiTenNguoiDung.textContent = user.username;
        } else {
            khuVucNutXacThuc.classList.remove('an');
            thongTinNguoiDung.classList.add('an');
        }
    }

    // --- LOGIC HỘP THOẠI (MODAL) ---

    function moHopThoai(idModal) {
        const modal = document.getElementById(idModal);
        if (modal) {
            modal.classList.add('hien');
            document.body.style.overflow = 'hidden';
            if(idModal === 'hop-thoai-dang-nhap') { loiDangNhap.textContent = ''; formDangNhap.reset(); }
            if(idModal === 'hop-thoai-dang-ky') { loiDangKy.textContent = ''; formDangKy.reset(); }
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
        nut.addEventListener('click', () => {
            dongHopThoai(nut.dataset.target);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('hop-thoai')) {
            e.target.classList.remove('hien');
            document.body.style.overflow = 'auto';
        }
    });

    // --- XỬ LÝ BIỂU MẪU (FORMS) ---

    formDangKy.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('ten-dang-ky').value.trim();
        const email = document.getElementById('email-dang-ky').value.trim();
        const password = document.getElementById('mat-khau-dang-ky').value;
        const confirmPassword = document.getElementById('xac-nhan-mat-khau').value;

        if (password.length < 6) { loiDangKy.textContent = "Mật khẩu phải có ít nhất 6 ký tự."; return; }
        if (password !== confirmPassword) { loiDangKy.textContent = "Mật khẩu không khớp."; return; }

        const users = layDanhSachNguoiDung();
        if (users.find(u => u.email === email)) { loiDangKy.textContent = "Email đã được đăng ký."; return; }
        if (users.find(u => u.username === username)) { loiDangKy.textContent = "Tên đăng nhập đã tồn tại."; return; }

        const newUser = { username, email, password }; 
        luuNguoiDung(newUser);
        datNguoiDungHienTai(newUser);
        dongHopThoai('hop-thoai-dang-ky');
        alert("Đăng ký thành công! Bạn đã được đăng nhập.");
    });

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
            loiDangNhap.textContent = "Email hoặc mật khẩu không đúng.";
        }
    });

    nutDangXuat.addEventListener('click', dangXuat);
    nutMoDangNhap.addEventListener('click', () => moHopThoai('hop-thoai-dang-nhap'));
    nutMoDangKy.addEventListener('click', () => moHopThoai('hop-thoai-dang-ky'));
    
    chuyenSangDangKy.addEventListener('click', (e) => {
        e.preventDefault(); dongHopThoai('hop-thoai-dang-nhap'); moHopThoai('hop-thoai-dang-ky');
    });

    chuyenSangDangNhap.addEventListener('click', (e) => {
        e.preventDefault(); dongHopThoai('hop-thoai-dang-ky'); moHopThoai('hop-thoai-dang-nhap');
    });

    // --- LOGIC SẢN PHẨM ---

    function hienThiSanPham(danhSach, tuKhoa = '') {
        luoiSanPham.innerHTML = ''; 
        if (danhSach.length === 0) {
            luoiSanPham.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <h3>Không tìm thấy sản phẩm</h3>
                    <p>Hãy thử từ khóa khác.</p>
                </div>
            `;
            soLuongKetQua.textContent = '0 sản phẩm được tìm thấy';
            return;
        }

        soLuongKetQua.textContent = `Hiển thị ${danhSach.length} sản phẩm`;

        danhSach.forEach(sanPham => {
            const the = document.createElement('div');
            the.classList.add('the-san-pham');
            const tenNoibat = toDamTuKhoa(sanPham.name, tuKhoa);
            the.innerHTML = `
                <div class="khung-anh-the">
                    <img src="${sanPham.image}" alt="${sanPham.name}">
                </div>
                <div class="than-the">
                    <span class="danh-muc-the">${sanPham.category}</span>
                    <h3 class="tieu-de-the">${tenNoibat}</h3>
                    <p class="mo-ta-the">${sanPham.description}</p>
                    <div class="chan-the">
                        <span class="gia">$${sanPham.price.toFixed(2)}</span>
                        <div class="nhom-nut">
                            <button class="nut nut-vien-nho nut-xem-chi-tiet" data-id="${sanPham.id}">Xem</button>
                            <button class="nut nut-chinh-nho nut-them-gio" data-id="${sanPham.id}"><i class="fas fa-cart-plus"></i></button>
                        </div>
                    </div>
                </div>
            `;
            luoiSanPham.appendChild(the);
        });

        document.querySelectorAll('.nut-xem-chi-tiet').forEach(nut => {
            nut.addEventListener('click', (e) => moModalSanPham(parseInt(e.target.dataset.id)));
        });

        document.querySelectorAll('.nut-them-gio').forEach(nut => {
            nut.addEventListener('click', () => xuLyThemGioHang());
        });
    }

    function toDamTuKhoa(vanBan, tuKhoa) {
        if (!tuKhoa) return vanBan;
        const regex = new RegExp(`(${tuKhoa})`, 'gi');
        return vanBan.replace(regex, '<span class="noi-bat">$1</span>');
    }

    function thucHienTimKiem() {
        const tuKhoa = oTimKiem.value.toLowerCase().trim();
        if (tuKhoa === '') {
            tieuDeKetQua.textContent = "Sản phẩm nổi bật";
            hienThiSanPham(danhSachSanPham); 
            return;
        }
        tieuDeKetQua.textContent = `Kết quả tìm kiếm cho "${tuKhoa}"`;
        const ketQuaLoc = danhSachSanPham.filter(sp => {
            return sp.name.toLowerCase().includes(tuKhoa) || 
                   sp.description.toLowerCase().includes(tuKhoa) ||
                   sp.category.toLowerCase().includes(tuKhoa);
        });
        hienThiSanPham(ketQuaLoc, tuKhoa);
    }

    function moModalSanPham(idSanPham) {
        const sanPham = danhSachSanPham.find(p => p.id === idSanPham);
        if (!sanPham) return;
        anhModal.src = sanPham.image;
        tieuDeModal.textContent = sanPham.name;
        danhMucModal.textContent = sanPham.category;
        giaModal.textContent = `$${sanPham.price.toFixed(2)}`;
        moTaModal.textContent = sanPham.description;
        moHopThoai('hop-thoai-san-pham');
    }

    function xuLyThemGioHang() {
        const user = layNguoiDungHienTai();
        if (!user) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            moHopThoai('hop-thoai-dang-nhap');
        } else {
            let dem = document.querySelector('.so-luong-gio-hang');
            let giaTriHienTai = parseInt(dem.textContent);
            dem.textContent = giaTriHienTai + 1;
            alert("Đã thêm sản phẩm vào giỏ hàng!");
        }
    }

    oTimKiem.addEventListener('input', thucHienTimKiem);
    nutTimKiem.addEventListener('click', thucHienTimKiem);
    nutThemGioHangModal.addEventListener('click', xuLyThemGioHang);

    capNhatGiaoDienXacThuc();
    hienThiSanPham(danhSachSanPham);
});