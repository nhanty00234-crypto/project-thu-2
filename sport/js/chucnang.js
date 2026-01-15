const products = [
    { id: 1, name: "Áo Real Madrid 2024 - Bản Player", price: 210000, img: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&q=80&w=400", tag: "Hot" },
    { id: 2, name: "Áo Đội Tuyển Việt Nam Trắng", price: 160000, img: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=400", tag: "Mới" },
    { id: 3, name: "Giày Đá Banh Mitre Tephra", price: 550000, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400", tag: "Sale" },
    { id: 4, name: "Áo Man United 2024 Sân Nhà", price: 185000, img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&q=80&w=400", tag: "" },
    { id: 5, name: "Áo Arsenal Hồng 2024", price: 170000, img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=400", tag: "Bán chạy" },
    { id: 6, name: "Quả Bóng Động Lực FIFA Quality", price: 680000, img: "https://images.unsplash.com/photo-1614632537190-23e4141bb008?auto=format&fit=crop&q=80&w=400", tag: "" },
    { id: 7, name: "Túi Trống Thể Thao Tây Ninh", price: 120000, img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=400", tag: "" },
    { id: 8, name: "Áo Al-Nassr Ronaldo 2024", price: 195000, img: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=400", tag: "Hot" },
];

let cartCount = 0;

function renderProducts() {
    const list = document.getElementById('product-list');
    list.innerHTML = products.map(p => `
        <div class="product-card bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden group">
            <div class="h-48 md:h-72 overflow-hidden relative">
                <img src="${p.img}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="${p.name}">
                ${p.tag ? `<span class="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 uppercase">${p.tag}</span>` : ''}
                <button onclick="addToCart()" class="buy-btn absolute bottom-0 left-0 right-0 bg-red-600 text-white font-bold py-3 uppercase text-xs z-10 hover:bg-black transition-colors">
                    <i class="fa fa-cart-plus mr-2"></i> Thêm vào giỏ
                </button>
            </div>
            <div class="p-4 text-center">
                <h4 class="font-medium text-gray-800 text-sm mb-2 h-10 overflow-hidden line-clamp-2">${p.name}</h4>
                <div class="text-red-600 font-bold text-lg">${p.price.toLocaleString()}đ</div>
            </div>
        </div>
    `).join('');
}

function addToCart() {
    cartCount++;
    document.getElementById('cart-count').innerText = cartCount;
    // Hiệu ứng thông báo nhỏ
    const toast = document.createElement('div');
    toast.className = "fixed bottom-5 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl z-[100] animate-bounce";
    toast.innerText = "Đã thêm vào giỏ hàng thành công!";
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

window.onload = renderProducts;