document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugins
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }

    // Initialize Lucide Icons
    lucide.createIcons();

    // DOM Elements
    const nav = document.getElementById('mainNav');
    const menuBtn = document.getElementById('menuBtn');
    const searchBtn = document.getElementById('searchBtn');
    const logo = document.getElementById('logo');
    const menuView = document.getElementById('menuView');
    const searchView = document.getElementById('searchView');

    const cartBtn = document.getElementById('cartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    const heroSection = document.getElementById('hero');

    let isExpanded = false;
    let currentView = 'none'; // 'menu' or 'search'

    let currentSPAView = 'home';
    let previousSPAView = 'home';

    // --- SCROLL LOGIC ---
    window.addEventListener('scroll', () => {
        // If the nav is expanded, don't shrink it immediately on scroll
        if (isExpanded) return;

        // Keep nav large when in catalog or detail views
        if (currentSPAView === 'catalog' || currentSPAView === 'detail') {
            nav.classList.remove('scrolled');
            return;
        }

        // Shrink nav when completely passing the Hero section (or 50px on pages without a hero)
        const shrinkThreshold = heroSection ? heroSection.offsetHeight : 50;

        // Shrink nav when scrolling past the threshold
        if (window.scrollY > shrinkThreshold) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- NAV EXPAND LOGIC ---
    function openNav(viewName) {
        // If it was shrunk, temporarily un-shrink it for the expansion
        nav.classList.remove('scrolled');
        nav.classList.add('expanded');
        isExpanded = true;
        currentView = viewName;

        if (viewName === 'menu') {
            menuView.classList.add('active');
            searchView.classList.remove('active');
        } else if (viewName === 'search') {
            searchView.classList.add('active');
            menuView.classList.remove('active');
            // Auto focus search input
            setTimeout(() => {
                searchView.querySelector('input').focus();
            }, 300);
        }
    }

    function closeNav() {
        nav.classList.remove('expanded');
        isExpanded = false;
        currentView = 'none';

        // Re-apply shrunk state if user is scrolled past Hero (or 50px on pages without a hero)
        const shrinkThreshold = heroSection ? heroSection.offsetHeight : 50;
        if (window.scrollY > shrinkThreshold) {
            nav.classList.add('scrolled');
        }
    }

    // Toggle Menu
    menuBtn.addEventListener('click', () => {
        // Karena ikon menu berubah menjadi "X" saat Nav terbuka (expanded),
        // maka jika diklik saat terbuka, ia akan selalu menutup Navigasi.
        if (isExpanded) {
            closeNav();
        } else {
            openNav('menu');
        }
    });

    // Toggle Search
    searchBtn.addEventListener('click', () => {
        if (isExpanded && currentView === 'search') {
            closeNav();
        } else {
            openNav('search');
        }
    });

    // Click Logo -> Scroll to top and close nav
    logo.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeNav();
    });

    // Click outside Nav to close it
    document.addEventListener('click', (e) => {
        if (isExpanded && !nav.contains(e.target)) {
            closeNav();
        }
    });


    // --- CART DRAWER LOGIC ---
    function openCart() {
        cartDrawer.classList.add('open');
        cartOverlay.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    function closeCart() {
        cartDrawer.classList.remove('open');
        cartOverlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', () => {
        // Close nav if open
        if (isExpanded) closeNav();
        openCart();
    });

    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // --- HERO CAROUSEL LOGIC (GSAP INFINITE LOOP) ---
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    const indicators = document.querySelectorAll('.dot');

    if (track && prevBtn && nextBtn && indicators.length > 0) {
        const slides = Array.from(track.children);
        const totalOriginalSlides = slides.length;

        // Clone first and last slides dynamically
        const firstClone = slides[0].cloneNode(true);
        const lastClone = slides[slides.length - 1].cloneNode(true);

        track.appendChild(firstClone);
        track.insertBefore(lastClone, slides[0]);

        // Update slides list including clones
        const allSlides = Array.from(track.children);

        let currentIndex = 1; // Start at 1 (first original slide)
        let isAnimating = false;
        let autoPlayInterval;

        // Set initial position of track to index 1 (Slide 1)
        gsap.set(track, { xPercent: -100 });

        // Set parallax scales initial
        allSlides.forEach((slide, idx) => {
            const img = slide.querySelector('.slide-img');
            if (img) {
                gsap.set(img, { scale: idx === 1 ? 1.25 : 1.4 });
            }
        });

        function updateCarousel(instant = false) {
            if (instant) {
                gsap.set(track, { xPercent: -currentIndex * 100 });
                return;
            }

            isAnimating = true;

            // Calculate active dot index
            let activeDotIndex = currentIndex - 1;
            if (currentIndex === 0) activeDotIndex = totalOriginalSlides - 1;
            if (currentIndex === totalOriginalSlides + 1) activeDotIndex = 0;

            indicators.forEach((ind, index) => {
                if (index === activeDotIndex) {
                    ind.classList.add('active');
                } else {
                    ind.classList.remove('active');
                }
            });

            // Animate track translation using xPercent for perfect alignment
            gsap.to(track, {
                xPercent: -currentIndex * 100,
                duration: 1.2,
                ease: "power4.inOut",
                onComplete: () => {
                    // Check boundaries and instantly jump to target slide without animation
                    if (currentIndex === totalOriginalSlides + 1) {
                        currentIndex = 1;
                        gsap.set(track, { xPercent: -100 });
                    } else if (currentIndex === 0) {
                        currentIndex = totalOriginalSlides;
                        gsap.set(track, { xPercent: -totalOriginalSlides * 100 });
                    }
                    isAnimating = false;
                }
            });

            // Parallax effect on image scales
            allSlides.forEach((slide, idx) => {
                const img = slide.querySelector('.slide-img');
                if (img) {
                    if (idx === currentIndex ||
                        (currentIndex === totalOriginalSlides + 1 && idx === 1) ||
                        (currentIndex === 0 && idx === totalOriginalSlides)) {
                        gsap.to(img, { scale: 1.25, duration: 1.4, ease: "power2.out" });
                    } else {
                        gsap.to(img, { scale: 1.4, duration: 1.4, ease: "power2.out" });
                    }
                }
            });
        }

        function nextSlide() {
            if (isAnimating) return;
            currentIndex++;
            updateCarousel();
        }

        function prevSlide() {
            if (isAnimating) return;
            currentIndex--;
            updateCarousel();
        }

        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(nextSlide, 5000); // Changed to 4 seconds
        }

        function stopAutoPlay() {
            if (autoPlayInterval) clearInterval(autoPlayInterval);
        }

        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });

        indicators.forEach(indicator => {
            indicator.addEventListener('click', (e) => {
                if (isAnimating) return;
                const targetIndex = parseInt(e.target.getAttribute('data-index'));
                currentIndex = targetIndex + 1;
                updateCarousel();
                startAutoPlay();
            });
        });

        // Autoplay continues regardless of hover for a full-screen hero
        startAutoPlay();
    }

    // --- LENIS SMOOTH SCROLL ---
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            mouseMultiplier: 1,
            smoothTouch: false,
            touchMultiplier: 2,
            infinite: false,
        });
        
        window.lenis = lenis; // Expose globally for programmatic scrolling

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);
    }

    // --- POSTER STACK HORIZONTAL INTERACTION & PROGRESS BAR ---
    const posterContainer = document.getElementById('posterStack');
    const progressBar = document.getElementById('scrollProgress');

    if (posterContainer && progressBar) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Drag to scroll logic
        posterContainer.addEventListener('mousedown', (e) => {
            // Only drag if left click
            if (e.button !== 0) return;
            isDown = true;
            posterContainer.classList.add('active-drag');
            startX = e.pageX - posterContainer.offsetLeft;
            scrollLeft = posterContainer.scrollLeft;
        });

        posterContainer.addEventListener('mouseleave', () => {
            isDown = false;
            posterContainer.classList.remove('active-drag');
        });

        posterContainer.addEventListener('mouseup', () => {
            isDown = false;
            posterContainer.classList.remove('active-drag');
        });

        posterContainer.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - posterContainer.offsetLeft;
            const walk = (x - startX) * 2; // scroll speed multiplier
            posterContainer.scrollLeft = scrollLeft - walk;
        });

        // Update progress bar on scroll
        function updateScrollProgress() {
            const maxScroll = posterContainer.scrollWidth - posterContainer.clientWidth;
            if (maxScroll <= 0) {
                progressBar.style.width = '0%';
                return;
            }
            const percentage = (posterContainer.scrollLeft / maxScroll) * 100;
            progressBar.style.width = `${percentage}%`;
        }

        posterContainer.addEventListener('scroll', updateScrollProgress);
        // Initial call
        setTimeout(updateScrollProgress, 100);
        
        // Handle window resizing
        window.addEventListener('resize', updateScrollProgress);
    }

    // --- DYNAMIC CART DRAWER LOGIC ---
    let cart = JSON.parse(localStorage.getItem('sightCart')) || [];
    const cartBody = document.querySelector('.cart-body');

    function updateCartUI() {
        if (!cartBody) return;

        const cartBadge = document.getElementById('cartBadge');
        let totalQuantity = 0;
        cart.forEach(item => {
            totalQuantity += item.quantity;
        });

        if (cartBadge) {
            if (totalQuantity > 0) {
                cartBadge.style.display = 'flex';
                cartBadge.textContent = totalQuantity;
            } else {
                cartBadge.style.display = 'none';
            }
        }

        if (cart.length === 0) {
            cartBody.innerHTML = '<p class="empty-cart">Your tote bag is empty.</p>';
            return;
        }

        // Render items
        let cartHTML = '<div class="cart-items-list">';
        let total = 0;

        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            cartHTML += `
                <div class="cart-item" data-index="${index}">
                    <img src="${item.img}" alt="${item.name}" class="${item.img.endsWith('.png') ? 'cart-item-img-tshirt' : ''}">
                    <div class="cart-item-details">
                        <h4 class="cart-item-title">${item.name}</h4>
                        ${item.size ? `<span class="cart-item-size">Size: ${item.size}</span>` : ''}
                        <p class="cart-item-unit-price">$${item.price.toFixed(2)} / item</p>
                    </div>
                    <div class="cart-item-actions">
                        <span class="cart-item-price">$${itemTotal.toFixed(2)}</span>
                        <div class="cart-qty-stepper">
                            <button class="cart-qty-btn" data-action="decrease" data-index="${index}" aria-label="Decrease quantity">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                            <span class="cart-qty-value">${item.quantity}</span>
                            <button class="cart-qty-btn" data-action="increase" data-index="${index}" aria-label="Increase quantity">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                        </div>
                        <button class="remove-cart-item" data-index="${index}">Remove</button>
                    </div>
                </div>
            `;
        });

        cartHTML += '</div>';
        
        // Add Subtotal display
        cartHTML += `
            <div class="cart-subtotal">
                <span class="cart-subtotal-label">Subtotal</span>
                <span class="cart-subtotal-value">$${total.toFixed(2)}</span>
            </div>
        `;

        cartBody.innerHTML = cartHTML;

        // Re-bind remove buttons
        const removeBtns = cartBody.querySelectorAll('.remove-cart-item');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const indexToRemove = parseInt(e.currentTarget.getAttribute('data-index'));
                removeFromCart(indexToRemove);
            });
        });

        // Bind quantity stepper buttons
        const qtyBtns = cartBody.querySelectorAll('.cart-qty-btn');
        qtyBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.getAttribute('data-action');
                const idx = parseInt(e.currentTarget.getAttribute('data-index'));
                changeQuantity(idx, action);
            });
        });
    }

    function addToCart(id, name, price, img, openDrawer = true, size = null) {
        // Check if item already exists with same size (or no size for non-posters)
        const existingItem = cart.find(item => item.id === id && item.size === size);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id,
                name,
                price: parseFloat(price),
                img,
                quantity: 1,
                size: size
            });
        }
        localStorage.setItem('sightCart', JSON.stringify(cart));
        updateCartUI();
        if (openDrawer) {
            openCart();
        }
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('sightCart', JSON.stringify(cart));
        updateCartUI();
    }

    function changeQuantity(index, action) {
        if (!cart[index]) return;
        if (action === 'increase') {
            cart[index].quantity += 1;
        } else if (action === 'decrease') {
            cart[index].quantity -= 1;
            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }
        }
        localStorage.setItem('sightCart', JSON.stringify(cart));
        updateCartUI();
    }

    // Initialize cart UI on load
    updateCartUI();

    // --- POSTER & TSHIRT CARD ROUTING (FUTURE DETAILS UPGRADE) ---
    // Clicks on poster/tshirt cards are designed to navigate users to the premium product detail pages.
    const productCards = document.querySelectorAll('.poster-card, .tshirt-card');
    productCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            const id = card.getAttribute('data-id');
            const name = card.getAttribute('data-name');
            // Placeholder for detail routing: window.location.href = `product-detail.html?id=${id}`;
            console.log(`Navigating to product detail for: ${name} (ID: ${id})`);
        });
    });

    // --- MANIFESTO ANIMATION ---
    const manifestoText = document.querySelector('.manifesto-text');
    if (manifestoText && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.to(manifestoText, {
            scrollTrigger: {
                trigger: '.manifesto-section',
                start: 'top 80%', // Trigger when top of section is 80% down the viewport
                toggleActions: 'play none none reverse'
            },
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out'
        });
    }

    // --- CURTAIN FOOTER EFFECT ---
    function updateCurtainFooter() {
        const siteMain = document.querySelector('.site-main');
        const siteFooter = document.querySelector('.site-footer');
        
        if (siteMain && siteFooter) {
            // Set margin-bottom dari site-main sama dengan tinggi site-footer
            const footerHeight = siteFooter.offsetHeight;
            siteMain.style.marginBottom = `${footerHeight}px`;
        }
    }

    // Jalankan saat load dan saat window di-resize
    updateCurtainFooter();
    window.addEventListener('resize', updateCurtainFooter);

    // --- REAL-TIME SEARCH LOGIC ---
    const searchInput = document.querySelector('.search-bar input');
    const searchRecommendations = document.querySelector('.search-recommendations');

    if (searchInput && searchRecommendations && typeof sightProducts !== 'undefined') {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length === 0) {
                // Tampilkan rekomendasi default jika kosong
                searchRecommendations.innerHTML = `
                    <p class="rec-title">Best Seller</p>
                    <div class="rec-grid">
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-poster">
                                <img src="asset/POSTER/POSTER1.jpg" alt="Neymar Jr. Brazil" class="rec-img">
                            </div>
                            <p>Neymar Jr. Brazil</p>
                            <span class="rec-price">$14.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-tshirt">
                                <img src="asset/KAOS/KAOS1.png" alt="Wemby San Antonio Tee" class="rec-img">
                            </div>
                            <p>Wemby San Antonio Tee</p>
                            <span class="rec-price">$24.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-tshirt">
                                <img src="asset/KAOS/KAOS3.png" alt="LeBron King James Tee" class="rec-img">
                            </div>
                            <p>LeBron King James Tee</p>
                            <span class="rec-price">$26.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-poster">
                                <img src="asset/POSTER/POSTER3.jpg" alt="Cristiano Ronaldo Portugal" class="rec-img">
                            </div>
                            <p>Cristiano Ronaldo Portugal</p>
                            <span class="rec-price">$15.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-poster">
                                <img src="asset/POSTER/POSTER4.jpg" alt="Team USA Basketball" class="rec-img">
                            </div>
                            <p>Team USA Basketball</p>
                            <span class="rec-price">$16.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-tshirt">
                                <img src="asset/KAOS/KAOS4.png" alt="Wemby Midnight Tee" class="rec-img">
                            </div>
                            <p>Wemby Midnight Tee</p>
                            <span class="rec-price">$27.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-poster">
                                <img src="asset/POSTER/POSTER5.jpg" alt="Giannis Antetokounmpo" class="rec-img">
                            </div>
                            <p>Giannis Antetokounmpo</p>
                            <span class="rec-price">$15.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-tshirt">
                                <img src="asset/KAOS/KAOS2.png" alt="Anthony Edwards Tee" class="rec-img">
                            </div>
                            <p>Anthony Edwards Tee</p>
                            <span class="rec-price">$25.90</span>
                        </div>
                        <div class="rec-item">
                            <div class="rec-img-wrapper type-poster">
                                <img src="asset/POSTER/POSTER2.png" alt="Erling Haaland City" class="rec-img">
                            </div>
                            <p>Erling Haaland City</p>
                            <span class="rec-price">$12.90</span>
                        </div>
                    </div>
                `;
                return;
            }

            // Filter produk berdasarkan nama atau kategori
            const results = sightProducts.filter(product => 
                product.name.toLowerCase().includes(query) || 
                product.category.toLowerCase().includes(query)
            );

            // Render hasil pencarian
            if (results.length > 0) {
                let html = `<p class="rec-title">Results for "${query}"</p><div class="rec-grid">`;
                
                // Tampilkan hingga 8 hasil teratas agar muat di UI
                const topResults = results.slice(0, 8);
                topResults.forEach(product => {
                    const typeClass = product.category.toLowerCase() === 'poster' ? 'type-poster' : 'type-tshirt';
                    html += `
                        <div class="rec-item" style="cursor:pointer;" onclick="console.log('Navigate to ' + '${product.name}')">
                            <div class="rec-img-wrapper ${typeClass}">
                                <img src="${product.image}" alt="${product.name}" class="rec-img">
                            </div>
                            <p>${product.name}</p>
                            <span class="rec-price">$${product.price.toFixed(2)}</span>
                        </div>
                    `;
                });
                html += `</div>`;
                searchRecommendations.innerHTML = html;
            } else {
                // Tampilan jika tidak ditemukan
                searchRecommendations.innerHTML = `
                    <p class="rec-title">No results found for "${query}"</p>
                    <div style="font-family:var(--font-body); color:var(--color-graphite); margin-top:16px;">
                        Try searching for "poster", "t-shirt", or specific product names like "Nostalgia".
                    </div>
                `;
            }
        });
    }
    const posterGrid = document.getElementById('posterGrid');
    const catalogFilter = document.getElementById('catalogFilter');

    if (posterGrid && typeof sightProducts !== 'undefined') {
        let currentItems = [];
        const catalogTitle = document.querySelector('.catalog-title');
        const catalogSubtitle = document.querySelector('.catalog-subtitle');

        window.updateCatalogUI = function() {
            if (window.currentCatalogType === 'tshirt') {
                if (catalogTitle) catalogTitle.textContent = 'ALL T-SHIRTS';
                if (catalogSubtitle) catalogSubtitle.textContent = 'Signature wear designed for comfort and everyday expression.';
                currentItems = sightProducts.filter(p => p.category.toLowerCase() === 't-shirt');
            } else {
                if (catalogTitle) catalogTitle.textContent = 'ALL POSTERS';
                if (catalogSubtitle) catalogSubtitle.textContent = 'Transform your walls into a personal gallery.';
                currentItems = sightProducts.filter(p => p.category.toLowerCase() === 'poster');
            }
            
            // Re-apply current sort
            const activeSortBtn = catalogFilter ? catalogFilter.querySelector('.catalog-tab-btn.active') : null;
            const sortVal = activeSortBtn ? activeSortBtn.getAttribute('data-value') : 'newest';
            applySort(sortVal);
        };

        function renderPosters(items) {
            // First step of FLIP: Record current layout coordinates
            const firstRects = {};
            const oldCards = posterGrid.querySelectorAll('.catalog-item');
            const hasExistingCards = oldCards.length > 0;

            if (hasExistingCards) {
                oldCards.forEach(card => {
                    const id = card.getAttribute('data-id');
                    if (id) {
                        firstRects[id] = card.getBoundingClientRect();
                    }
                });
            }

            // Update DOM with new sorted list
            posterGrid.innerHTML = '';
            items.forEach(product => {
                const isTshirt = product.category.toLowerCase() === 't-shirt';
                const frameClass = isTshirt ? 'catalog-grid-frame tshirt-frame-mode' : 'catalog-grid-frame';
                
                const itemHTML = `
                    <div class="catalog-item" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.image}" style="cursor: pointer;">
                        <div class="catalog-grid-card">
                            <div class="${frameClass}">
                                <img src="${product.image}" alt="${product.name}" class="catalog-grid-image" loading="lazy">
                                <button class="catalog-quick-add" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-img="${product.image}" aria-label="Add to Tote">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div class="catalog-grid-details">
                            <div class="catalog-grid-title">${product.name}</div>
                            <div class="catalog-grid-price">$${product.price.toFixed(2)}</div>
                        </div>
                    </div>
                `;
                posterGrid.insertAdjacentHTML('beforeend', itemHTML);
            });

            // Re-bind clicks to open dynamic immersive product detail modal
            const catalogItems = posterGrid.querySelectorAll('.catalog-item');
            catalogItems.forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-id');
                    if (typeof openProductModalFn === 'function') {
                        openProductModalFn(id);
                    }
                });
            });

            // Bind click events for Quick Add buttons with Flying Cart Animation
            const quickAddBtns = posterGrid.querySelectorAll('.catalog-quick-add');
            quickAddBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Stop navigation click
                    
                    const id = btn.getAttribute('data-id');
                    const name = btn.getAttribute('data-name');
                    const price = btn.getAttribute('data-price');
                    const img = btn.getAttribute('data-img');
                    
                    // --- FLYING CART ANIMATION ---
                    const cardFrame = btn.closest('.catalog-grid-frame');
                    const originalImg = cardFrame.querySelector('.catalog-grid-image');
                    const cartBtn = document.getElementById('cartBtn');
                    
                    if (originalImg && cartBtn && typeof gsap !== 'undefined') {
                        const imgRect = originalImg.getBoundingClientRect();
                        const cartRect = cartBtn.getBoundingClientRect();
                        
                        // Create a floating clone image at the exact viewport position of the card image
                        const clone = originalImg.cloneNode(true);
                        clone.classList.remove('catalog-grid-image');
                        clone.style.position = 'fixed';
                        clone.style.top = `${imgRect.top}px`;
                        clone.style.left = `${imgRect.left}px`;
                        clone.style.width = `${imgRect.width}px`;
                        clone.style.height = `${imgRect.height}px`;
                        clone.style.objectFit = 'cover';
                        clone.style.borderRadius = '4px';
                        clone.style.border = '1px solid rgba(0, 0, 0, 0.08)';
                        clone.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.15)';
                        clone.style.zIndex = '99999';
                        clone.style.pointerEvents = 'none';
                        document.body.appendChild(clone);
                        
                        // Animate clone to cart button with smooth trajectory, scaling down, and vanishing (no rotation)
                        gsap.to(clone, {
                            duration: 0.8,
                            top: cartRect.top + (cartRect.height / 2) - 15,
                            left: cartRect.left + (cartRect.width / 2) - 12,
                            width: 24,
                            height: 30,
                            opacity: 0,
                            ease: 'power2.inOut',
                            onComplete: () => {
                                clone.remove();
                                
                                // Satisfying tactile punch feedback on the cart button
                                gsap.fromTo(cartBtn, 
                                    { scale: 1 }, 
                                    { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'back.out(2)' }
                                );
                            }
                        });
                    }
                    
                    // Add to cart state logic without launching slide-in drawer
                    if (typeof addToCart === 'function') {
                        addToCart(id, name, price, img, false);
                    }
                });
            });

            // Play step of FLIP: Animate cards from their inverted offsets back to the natural layout
            if (hasExistingCards && typeof gsap !== 'undefined') {
                catalogItems.forEach(card => {
                    const id = card.getAttribute('data-id');
                    const firstRect = firstRects[id];

                    if (firstRect) {
                        const lastRect = card.getBoundingClientRect();

                        // Compute layout offset differences
                        const dx = firstRect.left - lastRect.left;
                        const dy = firstRect.top - lastRect.top;

                        if (dx !== 0 || dy !== 0) {
                            // Invert: position element exactly where it was before the DOM update
                            gsap.set(card, {
                                x: dx,
                                y: dy
                            });

                            // Play: animate back smoothly to 0,0 with premium easing
                            gsap.to(card, {
                                x: 0,
                                y: 0,
                                duration: 0.8,
                                ease: "power4.out",
                                clearProps: "transform"
                            });
                        }
                    } else {
                        // Fade and slide up completely new items that were not present in previous render
                        gsap.fromTo(card, 
                            { opacity: 0, y: 30 },
                            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
                        );
                    }
                });
            }
        }

        if (catalogFilter) {
            if (catalogFilter.tagName === 'SELECT') {
                catalogFilter.addEventListener('change', (e) => {
                    applySort(e.target.value);
                });
            } else {
                const buttons = catalogFilter.querySelectorAll('.catalog-tab-btn');
                const indicator = catalogFilter.querySelector('.catalog-tab-indicator');

                function updateIndicator() {
                    const activeBtn = catalogFilter.querySelector('.catalog-tab-btn.active');
                    if (activeBtn && indicator) {
                        const parentRect = catalogFilter.getBoundingClientRect();
                        const activeRect = activeBtn.getBoundingClientRect();
                        const leftOffset = activeRect.left - parentRect.left;
                        
                        indicator.style.width = `${activeRect.width}px`;
                        indicator.style.transform = `translateX(${leftOffset}px)`;
                    }
                }

                // Initialize indicator position
                setTimeout(updateIndicator, 100);
                window.addEventListener('resize', updateIndicator);
                // Also trigger after fonts loaded completely
                window.addEventListener('load', updateIndicator);

                buttons.forEach(btn => {
                    btn.addEventListener('click', () => {
                        buttons.forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        updateIndicator();
                        applySort(btn.getAttribute('data-value'));
                    });
                });
            }

            function applySort(val) {
                let sorted = [...currentItems];
                if (val === 'az') {
                    sorted.sort((a, b) => a.name.localeCompare(b.name));
                } else if (val === 'za') {
                    sorted.sort((a, b) => b.name.localeCompare(a.name));
                } else if (val === 'newest') {
                    sorted.reverse();
                } else if (val === 'best-seller') {
                    sorted = [...currentItems];
                }
                renderPosters(sorted);
            }

            // Initial render
            window.updateCatalogUI();
        }
    }

    // --- TRUE SPA NAVIGATION LOGIC ---
    const homeView = document.getElementById('homeView');
    const catalogContainer = document.getElementById('catalogContainer');
    const catalogView = document.getElementById('catalogView');
    const productDetailView = document.getElementById('productDetailView');
    const checkoutView = document.getElementById('checkoutView');
    
    const backToCatalogBtn = document.getElementById('backToCatalogBtn');
    const detailProductImage = document.getElementById('detailProductImage');
    const detailProductTitle = document.getElementById('detailProductTitle');
    const detailProductPrice = document.getElementById('detailProductPrice');
    const detailProductDesc = document.getElementById('detailProductDesc');
    const detailAddToCartBtn = document.getElementById('detailAddToCartBtn');
    const detailSizeValueHint = document.getElementById('detailSizeValueHint');
    const sizeButtons = productDetailView ? productDetailView.querySelectorAll('.size-btn') : [];

    currentSPAView = 'home';
    previousSPAView = 'home';
    let homeScrollY = 0;
    let catalogScrollY = 0;
    let currentDetailProduct = null;
    let selectedSize = 'A3';
    let selectedSizePrice = 0;
    window.currentCatalogType = 'poster';

    window.navigateTo = function(targetView, productId = null, instant = false, pushHistory = true, catalogType = null) {
        if (!homeView || !catalogContainer || !catalogView || !productDetailView) return;
        if (targetView === currentSPAView && !productId) return; // Prevent double-clicking unless changing product

        previousSPAView = currentSPAView;
        
        // Save scroll position for returning later
        if (currentSPAView === 'home') homeScrollY = window.scrollY;
        else if (currentSPAView === 'catalog') catalogScrollY = window.scrollY;

        if (catalogType) {
            window.currentCatalogType = catalogType;
        }

        // URL handling
        const url = new URL(window.location);
        if (targetView === 'detail' && productId) {
            url.searchParams.set('id', productId);
        } else {
            url.searchParams.delete('id');
        }
        if (pushHistory) {
            window.history.pushState({ view: targetView, id: productId }, '', url);
        }

        let fadeOutTarget;
        if (currentSPAView === 'home') fadeOutTarget = homeView;
        else if (currentSPAView === 'catalog') fadeOutTarget = catalogView;
        else if (currentSPAView === 'detail') fadeOutTarget = productDetailView;
        else if (currentSPAView === 'checkout') fadeOutTarget = checkoutView;
        
        // Preparation for target Detail View
        if (targetView === 'detail' && productId && typeof sightProducts !== 'undefined') {
            const product = sightProducts.find(p => p.id === productId);
            if (product) {
                currentDetailProduct = product;
                detailProductImage.src = product.image;
                detailProductImage.alt = product.name;
                detailProductTitle.textContent = product.name;
                detailProductDesc.textContent = product.description || 'Premium museum-grade fine art product.';
                
                const sizeGrid = document.querySelector('.product-size-grid');
                let isPoster = product.category.toLowerCase() === 'poster';
                
                if (isPoster) {
                    detailProductImage.classList.remove('tshirt-detail-mode');
                } else {
                    detailProductImage.classList.add('tshirt-detail-mode');
                }
                
                if (sizeGrid) {
                    if (isPoster) {
                        selectedSize = 'A3';
                        sizeGrid.innerHTML = `
                            <button class="size-btn" data-size="A3" data-price-offset="0">
                                <span class="size-name">A3</span>
                                <span class="size-dimensions">29.7 x 42 cm</span>
                            </button>
                            <button class="size-btn" data-size="A2" data-price-offset="5">
                                <span class="size-name">A2</span>
                                <span class="size-dimensions">42 x 59.4 cm</span>
                                <span class="size-upcharge">+$5.00</span>
                            </button>
                            <button class="size-btn" data-size="A1" data-price-offset="10">
                                <span class="size-name">A1</span>
                                <span class="size-dimensions">59.4 x 84.1 cm</span>
                                <span class="size-upcharge">+$10.00</span>
                            </button>
                        `;
                    } else {
                        selectedSize = 'M';
                        sizeGrid.innerHTML = `
                            <button class="size-btn" data-size="S" data-price-offset="0">
                                <span class="size-name">S</span>
                            </button>
                            <button class="size-btn" data-size="M" data-price-offset="0">
                                <span class="size-name">M</span>
                            </button>
                            <button class="size-btn" data-size="L" data-price-offset="0">
                                <span class="size-name">L</span>
                            </button>
                            <button class="size-btn" data-size="XL" data-price-offset="0">
                                <span class="size-name">XL</span>
                            </button>
                        `;
                    }

                    const newSizeBtns = sizeGrid.querySelectorAll('.size-btn');
                    newSizeBtns.forEach(btn => {
                        // Click event
                        btn.addEventListener('click', () => {
                            newSizeBtns.forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            selectedSize = btn.getAttribute('data-size');
                            const offset = parseFloat(btn.getAttribute('data-price-offset') || 0);
                            selectedSizePrice = product.price + offset;
                            detailProductPrice.textContent = '$' + selectedSizePrice.toFixed(2);
                            
                            if(detailSizeValueHint) {
                                detailSizeValueHint.textContent = isPoster 
                                    ? (selectedSize === 'A3' ? 'A3 (29.7 x 42 cm)' : (selectedSize === 'A2' ? 'A2 (42 x 59.4 cm)' : 'A1 (59.4 x 84.1 cm)'))
                                    : 'Standard Fit';
                            }
                        });
                        
                        // Set initial active
                        if (btn.getAttribute('data-size') === selectedSize) {
                            btn.classList.add('active');
                            const offset = parseFloat(btn.getAttribute('data-price-offset') || 0);
                            selectedSizePrice = product.price + offset;
                            if(detailSizeValueHint) {
                                detailSizeValueHint.textContent = isPoster 
                                    ? (selectedSize === 'A3' ? 'A3 (29.7 x 42 cm)' : (selectedSize === 'A2' ? 'A2 (42 x 59.4 cm)' : 'A1 (59.4 x 84.1 cm)'))
                                    : 'Standard Fit';
                            }
                        }
                    });
                }
                
                detailProductPrice.textContent = `$${selectedSizePrice.toFixed(2)}`;
                
                // Also update Spec Sheet dynamically
                const specList = document.querySelector('.product-spec-list');
                if (specList) {
                    if (isPoster) {
                        specList.innerHTML = `
                            <div class="spec-row">
                                <span class="spec-label">Paper Weight</span>
                                <span class="spec-value">250 gsm (Fine Art Archival)</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label">Finish</span>
                                <span class="spec-value">Matte Premium Smooth</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label">Frame</span>
                                <span class="spec-value">Frame not included</span>
                            </div>
                        `;
                    } else {
                        specList.innerHTML = `
                            <div class="spec-row">
                                <span class="spec-label">Material</span>
                                <span class="spec-value">100% Organic Cotton</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label">Weight</span>
                                <span class="spec-value">Heavyweight 220gsm</span>
                            </div>
                            <div class="spec-row">
                                <span class="spec-label">Fit</span>
                                <span class="spec-value">Boxy oversized fit</span>
                            </div>
                        `;
                    }
                }
            }
        }

        const runTransition = () => {
            // Hide everything
            homeView.style.display = 'none';
            catalogContainer.style.display = 'none';
            catalogView.style.display = 'none';
            productDetailView.style.display = 'none';
            if (checkoutView) checkoutView.style.display = 'none';

            let fadeInTarget;
            let targetScroll = 0;

            if (targetView === 'home') {
                homeView.style.display = 'block';
                fadeInTarget = homeView;
                targetScroll = homeScrollY;
            } else if (targetView === 'catalog') {
                catalogContainer.style.display = 'block';
                catalogView.style.display = 'block';
                fadeInTarget = catalogView;
                targetScroll = catalogScrollY;
                
                if (typeof window.updateCatalogUI === 'function') {
                    window.updateCatalogUI();
                }

                // Recalculate layout-dependent elements like the tab indicator
                setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
            } else if (targetView === 'detail') {
                catalogContainer.style.display = 'block';
                productDetailView.style.display = 'block';
                fadeInTarget = productDetailView;
                targetScroll = 0; // detail view always starts from top
            } else if (targetView === 'checkout') {
                if (checkoutView) {
                    checkoutView.style.display = 'block';
                    fadeInTarget = checkoutView;
                    if (typeof window.renderCheckoutSummary === 'function') {
                        window.renderCheckoutSummary();
                    }
                }
                targetScroll = 0;
            }

            if (window.lenis) {
                window.lenis.scrollTo(targetScroll, { immediate: true });
            } else {
                window.scrollTo(0, targetScroll);
            }

            if (fadeInTarget) {
                if (!instant && typeof gsap !== 'undefined') {
                    gsap.fromTo(fadeInTarget, 
                        { opacity: 0, y: targetView === 'home' ? -20 : (targetView === 'detail' ? 30 : 20) }, 
                        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
                    );
                } else {
                    fadeInTarget.style.opacity = 1;
                    fadeInTarget.style.transform = 'translateY(0)';
                }
            }
            
            currentSPAView = targetView;
            
            // Trigger scroll to update navbar state (large/scrolled) instantly
            window.dispatchEvent(new Event('scroll'));
        };

        if (!instant && typeof gsap !== 'undefined') {
            gsap.to(fadeOutTarget, {
                opacity: 0,
                y: targetView === 'home' ? 20 : (currentSPAView === 'home' ? -20 : -20),
                duration: 0.3,
                ease: 'power2.in',
                onComplete: runTransition
            });
        } else {
            runTransition();
        }
    };

    // To ensure old calls (if any) work:
    window.openProductModalFn = function(productId, instant = false) {
        navigateTo('detail', productId, instant);
    };

    window.closeProductDetailFn = function() {
        navigateTo('catalog'); // Default back behavior is to catalog, but could be previousView
    };

    // Bind Back Button
    if (backToCatalogBtn) {
        backToCatalogBtn.addEventListener('click', () => {
            if (previousSPAView === 'home') {
                navigateTo('home');
            } else {
                navigateTo('catalog');
            }
        });
    }

    // Bind breadcrumb clicks
    const breadcrumbHome = document.getElementById('breadcrumbHome');
    const breadcrumbCatalog = document.getElementById('breadcrumbCatalog');
    if (breadcrumbHome) breadcrumbHome.addEventListener('click', () => navigateTo('home'));
    if (breadcrumbCatalog) breadcrumbCatalog.addEventListener('click', () => navigateTo('catalog'));

    // Bind Escape Key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentSPAView === 'detail') {
            if (previousSPAView === 'home') {
                navigateTo('home');
            } else {
                navigateTo('catalog');
            }
        }
    });

    // Hook size buttons clicks
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (!currentDetailProduct) return;
            sizeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            selectedSize = btn.getAttribute('data-size');
            const offset = parseFloat(btn.getAttribute('data-price-offset') || 0);
            selectedSizePrice = currentDetailProduct.price + offset;
            
            detailProductPrice.textContent = `$${selectedSizePrice.toFixed(2)}`;
            
            // Update value hint
            const dims = btn.querySelector('.size-dimensions').textContent;
            if(detailSizeValueHint) detailSizeValueHint.textContent = `${selectedSize} (${dims})`;
        });
    });

    // Hook detail page add to cart button
    if (detailAddToCartBtn) {
        detailAddToCartBtn.addEventListener('click', () => {
            if (!currentDetailProduct) return;
            
            // --- FLYING CART ANIMATION ---
            const detailImg = document.getElementById('detailProductImage');
            const cartBtn = document.getElementById('cartBtn');
            
            if (detailImg && cartBtn && typeof gsap !== 'undefined') {
                const imgRect = detailImg.getBoundingClientRect();
                const cartRect = cartBtn.getBoundingClientRect();
                
                // Create a floating clone image at the exact viewport position of the detail image
                const clone = detailImg.cloneNode(true);
                clone.classList.remove('product-detail-image');
                clone.style.position = 'fixed';
                clone.style.top = `${imgRect.top}px`;
                clone.style.left = `${imgRect.left}px`;
                clone.style.width = `${imgRect.width}px`;
                clone.style.height = `${imgRect.height}px`;
                clone.style.objectFit = 'contain';
                clone.style.borderRadius = '4px';
                clone.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                clone.style.zIndex = '100000';
                clone.style.pointerEvents = 'none';
                document.body.appendChild(clone);
                
                // Animate clone to cart button
                gsap.to(clone, {
                    duration: 0.8,
                    top: cartRect.top + (cartRect.height / 2) - 15,
                    left: cartRect.left + (cartRect.width / 2) - 12,
                    width: 24,
                    height: 30,
                    opacity: 0,
                    ease: 'power2.inOut',
                    onComplete: () => {
                        clone.remove();
                        
                        // Satisfying tactile bounce feedback on the cart button
                        gsap.fromTo(cartBtn, 
                            { scale: 1 }, 
                            { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, ease: 'back.out(2)' }
                        );
                    }
                });
            }

            // Add to cart with correct size and price offset
            if (typeof addToCart === 'function') {
                addToCart(currentDetailProduct.id, currentDetailProduct.name, selectedSizePrice, currentDetailProduct.image, false, selectedSize);
            }
        });
    }

    // --- INTERCEPT ALL NAVIGATION CLICKS ---
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href) return;
            
            // Logo goes home
            if (link.id === 'logo') {
                e.preventDefault();
                navigateTo('home');
                return;
            }

            // Other catalog links
            if (href.includes('catalog-poster.html') || link.textContent.toLowerCase().includes('poster') || link.textContent.toLowerCase().includes('t-shirt') || link.textContent.toLowerCase().includes('gallery')) {
                e.preventDefault();
                navigateTo('catalog');
                
                const navContent = document.getElementById('navContent');
                if (navContent && navContent.classList.contains('active')) {
                    document.getElementById('menuBtn').click();
                }
            }
        });
    });

    // Handle clicks on posters/tshirts from the home page or catalog
    const allCards = document.querySelectorAll('.poster-card, .tshirt-card');
    allCards.forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            if (id) {
                navigateTo('detail', id);
            }
        });
    });

    // Handle opening product directly if URL has ?id=X on load
    const urlParams = new URLSearchParams(window.location.search);
    const productIdParam = urlParams.get('id');
    if (productIdParam) {
        // Initial load should push state to set up the popstate stack properly
        window.history.replaceState({ view: 'detail', id: productIdParam }, '', window.location);
        navigateTo('detail', productIdParam, true, false);
    } else {
        window.history.replaceState({ view: 'home', id: null }, '', window.location);
    }

    // Bind Popstate for Browser Back/Forward navigation
    window.addEventListener('popstate', (e) => {
        const state = e.state;
        if (state) {
            navigateTo(state.view, state.id, true, false);
        } else {
            navigateTo('home', null, true, false);
        }
    });
});

/* =========================================
   CHECKOUT LOGIC
   ========================================= */
(function() {
    const checkoutBtn   = document.getElementById('checkoutBtn');
    const checkoutView  = document.getElementById('checkoutView');
    const homeView      = document.getElementById('homeView');
    const catalogCont   = document.getElementById('catalogContainer');
    const step1         = document.getElementById('checkoutStep1');
    const step2         = document.getElementById('checkoutStep2');
    const step3         = document.getElementById('checkoutStep3');
    const shippingForm  = document.getElementById('shippingForm');
    const backToStep1Btn = document.getElementById('backToStep1Btn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    const successContinueBtn = document.getElementById('successContinueBtn');

    const SHIPPING_COSTS = { standard: 4.90, express: 12.90 };

    function getCart() {
        try { return JSON.parse(localStorage.getItem('sightCart')) || []; }
        catch { return []; }
    }

    function getShippingCost() {
        const selected = document.querySelector('input[name="shipping"]:checked');
        return selected ? SHIPPING_COSTS[selected.value] : 4.90;
    }

    function getShippingLabel() {
        const selected = document.querySelector('input[name="shipping"]:checked');
        return selected ? (selected.value === 'express' ? 'Express ($12.90)' : 'Standard ($4.90)') : 'Standard ($4.90)';
    }

    function renderSummary(itemsContainerId, totalsContainerId) {
        const cart = getCart();
        const itemsEl = document.getElementById(itemsContainerId);
        const totalsEl = document.getElementById(totalsContainerId);
        if (!itemsEl || !totalsEl) return;

        let subtotal = 0;
        let itemsHTML = '';
        cart.forEach(item => {
            const lineTotal = item.price * item.quantity;
            subtotal += lineTotal;
            const isTshirt = item.img && item.img.endsWith('.png');
            itemsHTML += `
                <div class="summary-item">
                    <img src="${item.img}" alt="${item.name}" class="summary-item-img ${isTshirt ? 'tshirt-img' : ''}">
                    <div class="summary-item-info">
                        <p class="summary-item-name">${item.name}</p>
                        <p class="summary-item-meta">Qty: ${item.quantity}${item.size ? ' · Size: ' + item.size : ''}</p>
                    </div>
                    <span class="summary-item-price">$${lineTotal.toFixed(2)}</span>
                </div>`;
        });

        const shipping = getShippingCost();
        const total = subtotal + shipping;

        itemsEl.innerHTML = itemsHTML || '<p style="font-family:var(--font-mono);font-size:0.8rem;color:rgba(34,34,34,0.4)">Cart is empty</p>';
        totalsEl.innerHTML = `
            <div class="summary-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="summary-row"><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
            <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>`;
    }

    window.renderCheckoutSummary = function() {
        renderSummary('checkoutSummaryItems1', 'checkoutTotals1');
    };

    // Wire cancel button
    const cancelCheckoutBtn = document.getElementById('cancelCheckoutBtn');
    if (cancelCheckoutBtn) {
        cancelCheckoutBtn.addEventListener('click', () => {
            if (typeof navigateTo === 'function') {
                navigateTo('home');
            }
        });
    }

    // Wire checkout button
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const cart = getCart();
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            // Close cart drawer first
            const cartDrawer = document.getElementById('cartDrawer');
            const cartOverlay = document.getElementById('cartOverlay');
            if (cartDrawer) cartDrawer.classList.remove('open');
            if (cartOverlay) cartOverlay.classList.remove('open');

            // Reset to step 1
            step1.style.display = '';
            step2.style.display = 'none';
            step3.style.display = 'none';

            // Render summaries
            window.renderCheckoutSummary();

            if (typeof navigateTo === 'function') {
                navigateTo('checkout');
            }
        });
    }

    // Step 1 → Step 2: validate and proceed
    if (shippingForm) {
        shippingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const required = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode', 'country'];
            let valid = true;
            required.forEach(id => {
                const el = document.getElementById(id);
                if (el) {
                    el.classList.remove('error');
                    if (!el.value.trim()) {
                        el.classList.add('error');
                        valid = false;
                    }
                }
            });
            if (!valid) return;

            // Build review card
            const reviewCard = document.getElementById('reviewShippingCard');
            const firstName = document.getElementById('firstName').value;
            const lastName  = document.getElementById('lastName').value;
            const email     = document.getElementById('email').value;
            const address   = document.getElementById('address').value;
            const city      = document.getElementById('city').value;
            const postal    = document.getElementById('postalCode').value;
            const countryEl = document.getElementById('country');
            const country   = countryEl.options[countryEl.selectedIndex].text;

            reviewCard.innerHTML = `
                <h4>Ship To</h4>
                <p><strong>${firstName} ${lastName}</strong></p>
                <p>${address}, ${city} ${postal}</p>
                <p>${country}</p>
                <p style="margin-top:8px;color:rgba(34,34,34,0.5);font-size:0.85rem;">${email} · ${getShippingLabel()}</p>`;

            // Build review items
            const cart = getCart();
            const reviewList = document.getElementById('reviewItemsList');
            let html = '';
            cart.forEach(item => {
                const isTshirt = item.img && item.img.endsWith('.png');
                html += `
                    <div class="review-item">
                        <img src="${item.img}" alt="${item.name}" class="${isTshirt ? 'tshirt-img' : ''}">
                        <div class="review-item-info">
                            <p class="review-item-name">${item.name}</p>
                            <p class="review-item-meta">Qty: ${item.quantity}${item.size ? ' · ' + item.size : ''}</p>
                        </div>
                        <span class="review-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>`;
            });
            reviewList.innerHTML = html;

            // Render summary sidebar for step 2
            renderSummary('checkoutSummaryItems2', 'checkoutTotals2');

            // Transition step 1 → step 2
            if (typeof gsap !== 'undefined') {
                gsap.to(step1, { opacity: 0, x: -30, duration: 0.3, ease: 'power2.in', onComplete: () => {
                    step1.style.display = 'none';
                    step2.style.display = '';
                    step2.style.opacity = '0';
                    gsap.to(step2, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', clearProps: 'x' });
                    setTimeout(() => window.scrollTo(0, 0), 10);
                }});
                gsap.set(step2, { x: 30 });
            } else {
                step1.style.display = 'none';
                step2.style.display = '';
                setTimeout(() => window.scrollTo(0, 0), 10);
            }
        });
    }

    // Step 2 → Step 1 (back)
    if (backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            if (typeof gsap !== 'undefined') {
                gsap.to(step2, { opacity: 0, x: 30, duration: 0.3, ease: 'power2.in', onComplete: () => {
                    step2.style.display = 'none';
                    step1.style.display = '';
                    gsap.fromTo(step1, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out', clearProps: 'x' });
                    setTimeout(() => window.scrollTo(0, 0), 10);
                }});
            } else {
                step2.style.display = 'none';
                step1.style.display = '';
                setTimeout(() => window.scrollTo(0, 0), 10);
            }
        });
    }

    // Step 2 → Step 3 (place order)
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', () => {
            // Generate random order ID
            const orderId = 'SGT-' + Math.random().toString(36).toUpperCase().slice(2, 8);
            document.getElementById('successOrderId').textContent = orderId;

            // Transition step 2 → step 3
            if (typeof gsap !== 'undefined') {
                gsap.to(step2, { opacity: 0, scale: 0.97, duration: 0.3, ease: 'power2.in', onComplete: () => {
                    step2.style.display = 'none';
                    step3.style.display = '';
                    gsap.fromTo(step3, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
                    setTimeout(() => window.scrollTo(0, 0), 10);
                }});
            } else {
                step2.style.display = 'none';
                step3.style.display = '';
                setTimeout(() => window.scrollTo(0, 0), 10);
            }

            // Clear cart
            localStorage.removeItem('sightCart');
            cart.length = 0;
            if (typeof updateCartUI === 'function') updateCartUI();
        });
    }

    // Success → back to home
    if (successContinueBtn) {
        successContinueBtn.addEventListener('click', () => {
            if (typeof navigateTo === 'function') {
                navigateTo('home');
            }
        });
    }

    // Shipping option change → update totals live
    document.addEventListener('change', (e) => {
        if (e.target && e.target.name === 'shipping') {
            renderSummary('checkoutSummaryItems1', 'checkoutTotals1');
        }
    });
})();
