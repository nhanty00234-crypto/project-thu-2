// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    
    // --- ELEMENT SELECTORS ---
    const productGrid = document.getElementById('productGrid');
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const resultsTitle = document.getElementById('results-title');
    const resultsCount = document.getElementById('results-count');
    
    const authButtons = document.getElementById('authButtons');
    const userInfo = document.getElementById('userInfo');
    const usernameDisplay = document.getElementById('usernameDisplay');
    const logoutBtn = document.getElementById('logoutBtn');
    
    const openLoginBtn = document.getElementById('openLoginBtn');
    const openRegisterBtn = document.getElementById('openRegisterBtn');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginError = document.getElementById('loginError');
    const registerError = document.getElementById('registerError');

    const productModal = document.getElementById('productModal');
    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalCategory = document.getElementById('modalCategory');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');

    // --- HERO SLIDER LOGIC (NEW) ---
    function initHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');
        const dots = document.querySelectorAll('.dot');
        
        let currentSlide = 0;
        const totalSlides = slides.length;
        let slideInterval;

        // Function to update slide classes
        function showSlide(index) {
            // Validate index bounds
            if (index >= totalSlides) currentSlide = 0;
            else if (index < 0) currentSlide = totalSlides - 1;
            else currentSlide = index;

            // Update Slides
            slides.forEach(slide => slide.classList.remove('active'));
            slides[currentSlide].classList.add('active');

            // Update Dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[currentSlide].classList.add('active');
        }

        // Auto Play
        function startSlideShow() {
            slideInterval = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 5000); // Change every 5 seconds
        }

        function stopSlideShow() {
            clearInterval(slideInterval);
        }

        // Event Listeners
        nextBtn.addEventListener('click', () => {
            stopSlideShow();
            showSlide(currentSlide + 1);
            startSlideShow();
        });

        prevBtn.addEventListener('click', () => {
            stopSlideShow();
            showSlide(currentSlide - 1);
            startSlideShow();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopSlideShow();
                showSlide(index);
                startSlideShow();
            });
        });

        // Initialize
        startSlideShow();
    }

    // Call Slider Init if slider exists
    if(document.querySelector('.hero-slider')) {
        initHeroSlider();
    }


    // --- AUTHENTICATION LOGIC ---

    const USERS_KEY = 'apex_users';
    const CURRENT_USER_KEY = 'apex_current_user';

    function getStoredUsers() {
        const users = localStorage.getItem(USERS_KEY);
        return users ? JSON.parse(users) : [];
    }

    function saveUser(user) {
        const users = getStoredUsers();
        users.push(user);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getCurrentUser() {
        const user = localStorage.getItem(CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    function setCurrentUser(user) {
        const sessionUser = { username: user.username, email: user.email };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));
        updateAuthUI();
    }

    function logout() {
        localStorage.removeItem(CURRENT_USER_KEY);
        updateAuthUI();
        window.location.reload(); 
    }

    function updateAuthUI() {
        const user = getCurrentUser();
        if (user) {
            authButtons.classList.add('hidden');
            userInfo.classList.remove('hidden');
            usernameDisplay.textContent = user.username;
        } else {
            authButtons.classList.remove('hidden');
            userInfo.classList.add('hidden');
        }
    }

    // --- MODAL LOGIC ---

    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            if(modalId === 'loginModal') { loginError.textContent = ''; loginForm.reset(); }
            if(modalId === 'registerModal') { registerError.textContent = ''; registerForm.reset(); }
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.dataset.target);
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // --- FORM HANDLERS ---

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('regUsername').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        if (password.length < 6) { registerError.textContent = "Password must be at least 6 characters."; return; }
        if (password !== confirmPassword) { registerError.textContent = "Passwords do not match."; return; }

        const users = getStoredUsers();
        if (users.find(u => u.email === email)) { registerError.textContent = "Email is already registered."; return; }
        if (users.find(u => u.username === username)) { registerError.textContent = "Username is taken."; return; }

        const newUser = { username, email, password }; 
        saveUser(newUser);
        setCurrentUser(newUser);
        closeModal('registerModal');
        alert("Registration successful! You are now logged in.");
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const users = getStoredUsers();
        const validUser = users.find(u => (u.email === email || u.username === email) && u.password === password);

        if (validUser) {
            setCurrentUser(validUser);
            closeModal('loginModal');
        } else {
            loginError.textContent = "Invalid email or password.";
        }
    });

    logoutBtn.addEventListener('click', logout);
    openLoginBtn.addEventListener('click', () => openModal('loginModal'));
    openRegisterBtn.addEventListener('click', () => openModal('registerModal'));
    
    switchToRegister.addEventListener('click', (e) => {
        e.preventDefault(); closeModal('loginModal'); openModal('registerModal');
    });

    switchToLogin.addEventListener('click', (e) => {
        e.preventDefault(); closeModal('registerModal'); openModal('loginModal');
    });

    // --- PRODUCT LOGIC ---

    function renderProducts(productsToRender, searchTerm = '') {
        productGrid.innerHTML = ''; 
        if (productsToRender.length === 0) {
            productGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                    <h3>No products found</h3>
                    <p>Try adjusting your search terms.</p>
                </div>
            `;
            resultsCount.textContent = '0 products found';
            return;
        }

        resultsCount.textContent = `Showing ${productsToRender.length} product${productsToRender.length !== 1 ? 's' : ''}`;

        productsToRender.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            const highlightedName = highlightText(product.name, searchTerm);
            card.innerHTML = `
                <div class="card-img-container">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="card-body">
                    <span class="card-category">${product.category}</span>
                    <h3 class="card-title">${highlightedName}</h3>
                    <p class="card-desc">${product.description}</p>
                    <div class="card-footer">
                        <span class="price">$${product.price.toFixed(2)}</span>
                        <div class="btn-group">
                            <button class="btn btn-outline view-details-btn" data-id="${product.id}">View</button>
                            <button class="btn btn-primary add-cart-btn" data-id="${product.id}"><i class="fas fa-cart-plus"></i></button>
                        </div>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });

        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => openProductModal(parseInt(e.target.dataset.id)));
        });

        document.querySelectorAll('.add-cart-btn').forEach(btn => {
            btn.addEventListener('click', () => handleAddToCart());
        });
    }

    function highlightText(text, term) {
        if (!term) return text;
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        if (query === '') {
            resultsTitle.textContent = "Featured Products";
            renderProducts(products); 
            return;
        }
        resultsTitle.textContent = `Search Results for "${query}"`;
        const filtered = products.filter(product => {
            return product.name.toLowerCase().includes(query) || 
                   product.description.toLowerCase().includes(query) ||
                   product.category.toLowerCase().includes(query);
        });
        renderProducts(filtered, query);
    }

    function openProductModal(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        modalImg.src = product.image;
        modalTitle.textContent = product.name;
        modalCategory.textContent = product.category;
        modalPrice.textContent = `$${product.price.toFixed(2)}`;
        modalDesc.textContent = product.description;
        openModal('productModal');
    }

    function handleAddToCart() {
        const user = getCurrentUser();
        if (!user) {
            alert("Please login to add products to cart.");
            openModal('loginModal');
        } else {
            let count = document.querySelector('.cart-count');
            let currentVal = parseInt(count.textContent);
            count.textContent = currentVal + 1;
            alert("Product added to cart!");
        }
    }

    searchInput.addEventListener('input', performSearch);
    searchBtn.addEventListener('click', performSearch);
    modalAddToCartBtn.addEventListener('click', handleAddToCart);

    updateAuthUI();
    renderProducts(products);
});