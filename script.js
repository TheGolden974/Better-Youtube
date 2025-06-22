// Better YouTube - Liquid Glass Enhancement Script
(function() {
    'use strict';
    
    let currentFilter = 'tout';
    let searchOverlay = null;
    let isSearchExpanded = false;
    
    // Fonction pour créer les boutons personnalisés avec liquid glass
    function createCustomButtons() {
        // Vérifier si les boutons existent déjà
        if (document.querySelector('.custom-filter-buttons')) {
            return;
        }
        
        // Trouver le conteneur des filtres existants
        const filterContainer = document.querySelector('#chips-wrapper, ytd-feed-filter-chip-bar-renderer, #chips');
        if (!filterContainer) {
            return;
        }
        
        // Masquer les filtres existants
        filterContainer.style.display = 'none';
        
        // Créer le conteneur pour nos boutons liquid glass
        const customContainer = document.createElement('div');
        customContainer.className = 'custom-filter-buttons';
        
        // Créer les boutons avec effet liquid glass
        const buttons = [
            { text: 'Tout', filter: 'tout', icon: '∞' },
            { text: 'Vidéo', filter: 'video', icon: '▶' },
            { text: 'Short', filter: 'short', icon: '⚡' }
        ];
        
        buttons.forEach(buttonData => {
            const button = document.createElement('button');
            button.innerHTML = `
                <span class="btn-icon">${buttonData.icon}</span>
                <span class="btn-text">${buttonData.text}</span>
            `;
            button.className = 'custom-filter-btn';
            button.dataset.filter = buttonData.filter;
            
            // Marquer le bouton actif
            if (buttonData.filter === currentFilter) {
                button.classList.add('active');
                button.dataset.active = 'true';
            }
            
            // Événement de clic avec animation
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Animation de clic
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
                
                currentFilter = buttonData.filter;
                updateButtonStyles();
                applyFilterWithAnimation(buttonData.filter);
            });
            
            // Effet de hover amélioré
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = 'translateY(-2px) scale(1.02)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.transform = '';
                }
            });
            
            customContainer.appendChild(button);
        });
        
        // Ajouter CSS pour les icônes dans les boutons
        const buttonStyles = document.createElement('style');
        buttonStyles.textContent = `
            .custom-filter-btn {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
            }
            .btn-icon {
                font-size: 16px !important;
                opacity: 0.8 !important;
            }
            .btn-text {
                font-weight: 600 !important;
            }
            .custom-filter-btn.active .btn-icon {
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(buttonStyles);
        
        // Insérer les boutons avec animation
        filterContainer.parentNode.insertBefore(customContainer, filterContainer.nextSibling);
        
        // Animation d'entrée
        customContainer.style.opacity = '0';
        customContainer.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            customContainer.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            customContainer.style.opacity = '1';
            customContainer.style.transform = 'translateY(0)';
        }, 100);
    }
    
    // Fonction pour mettre à jour les styles des boutons avec animations
    function updateButtonStyles() {
        const buttons = document.querySelectorAll('.custom-filter-btn');
        buttons.forEach(btn => {
            const isActive = btn.dataset.filter === currentFilter;
            
            // Animation de transition
            btn.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            
            if (isActive) {
                btn.classList.add('active');
                btn.dataset.active = 'true';
            } else {
                btn.classList.remove('active');
                btn.dataset.active = 'false';
            }
        });
    }
    
    // Fonction pour appliquer le filtre avec animations fluides
    function applyFilterWithAnimation(filter) {
        const allContent = document.querySelectorAll(`
            ytd-video-renderer,
            ytd-grid-video-renderer,
            ytd-compact-video-renderer,
            ytd-rich-grid-slim-media-renderer,
            ytd-reel-item-renderer,
            [is-shorts]
        `);
        
        // Animation de sortie pour les éléments qui vont être cachés
        allContent.forEach(element => {
            const isShort = element.querySelector('[href*="/shorts/"]') ||
                           element.querySelector('[aria-label*="Shorts"]') ||
                           element.hasAttribute('is-shorts') ||
                           element.closest('[is-shorts]') ||
                           element.tagName === 'YTD-RICH-GRID-SLIM-MEDIA-RENDERER' ||
                           element.tagName === 'YTD-REEL-ITEM-RENDERER';
            
            let shouldShow = false;
            
            if (filter === 'tout') {
                shouldShow = true;
            } else if (filter === 'video') {
                shouldShow = !isShort;
            } else if (filter === 'short') {
                shouldShow = isShort;
            }
            
            if (!shouldShow && element.style.display !== 'none') {
                // Animation de disparition
                element.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                element.style.opacity = '0';
                element.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    element.style.display = 'none';
                }, 300);
            } else if (shouldShow && element.style.display === 'none') {
                // Animation d'apparition
                element.style.display = '';
                element.style.opacity = '0';
                element.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1) translateY(0)';
                }, 50);
            } else if (shouldShow) {
                // Assurer que l'élément est visible
                element.style.display = '';
                element.style.opacity = '1';
                element.style.transform = 'scale(1) translateY(0)';
            }
        });
    }
    
    // Fonction pour créer la barre de recherche dynamique (style Finder macOS 26)
    function enhanceSearchBar() {
        const searchContainer = document.querySelector('#search-form, #masthead-search');
        if (!searchContainer) return;
        
        const searchInput = searchContainer.querySelector('#search-input, input[name="search_query"]');
        if (!searchInput) return;
        
        // Ajouter des événements pour l'animation de la barre de recherche
        searchInput.addEventListener('focus', expandSearchOverlay);
        searchInput.addEventListener('blur', collapseSearchOverlay);
        
        // Ajouter l'effet de typing
        let typingTimer;
        searchInput.addEventListener('input', () => {
            clearTimeout(typingTimer);
            searchInput.style.transform = 'scale(1.01)';
            searchInput.style.borderColor = 'var(--liquid-primary)';
            
            typingTimer = setTimeout(() => {
                if (!searchInput.matches(':focus')) {
                    searchInput.style.transform = '';
                    searchInput.style.borderColor = '';
                }
            }, 500);
        });
    }
    
    // Fonction pour créer l'overlay de recherche (style macOS 26)
    function expandSearchOverlay() {
        if (isSearchExpanded) return;
        isSearchExpanded = true;
        
        // Créer l'overlay
        searchOverlay = document.createElement('div');
        searchOverlay.className = 'search-overlay';
        searchOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(40px);
            -webkit-backdrop-filter: blur(40px);
            z-index: 9999;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        // Créer le conteneur de recherche amélioré
        const enhancedSearchContainer = document.createElement('div');
        enhancedSearchContainer.className = 'enhanced-search-container';
        enhancedSearchContainer.style.cssText = `
            position: absolute;
            top: 20%;
            left: 50%;
            transform: translateX(-50%) translateY(-50%) scale(0.8);
            width: 90%;
            max-width: 600px;
            background: var(--liquid-surface);
            backdrop-filter: blur(60px);
            -webkit-backdrop-filter: blur(60px);
            border: 1px solid var(--liquid-border);
            border-radius: 20px;
            padding: 24px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        `;
        
        // Ajouter du contenu à la recherche étendue
        enhancedSearchContainer.innerHTML = `
            <div class="search-header" style="
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 20px;
                color: var(--liquid-text);
            ">
                <span style="font-size: 20px;">🔍</span>
                <h3 style="margin: 0; font-weight: 600; font-size: 18px;">Recherche Avancée</h3>
            </div>
            <div class="search-suggestions" style="
                display: grid;
                gap: 8px;
                margin-top: 16px;
            ">
                <div class="suggestion-category" style="color: var(--liquid-text-secondary); font-size: 14px; font-weight: 600; margin-bottom: 8px;">Suggestions populaires</div>
                <div class="suggestion-item" data-query="tutorials" style="
                    padding: 12px 16px;
                    background: var(--liquid-secondary);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--liquid-text);
                ">📚 Tutoriels</div>
                <div class="suggestion-item" data-query="music" style="
                    padding: 12px 16px;
                    background: var(--liquid-secondary);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--liquid-text);
                ">🎵 Musique</div>
                <div class="suggestion-item" data-query="gaming" style="
                    padding: 12px 16px;
                    background: var(--liquid-secondary);
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    color: var(--liquid-text);
                ">🎮 Gaming</div>
            </div>
        `;
        
        searchOverlay.appendChild(enhancedSearchContainer);
        document.body.appendChild(searchOverlay);
        
        // Ajouter les événements pour les suggestions
        const suggestionItems = enhancedSearchContainer.querySelectorAll('.suggestion-item');
        suggestionItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.background = 'var(--liquid-primary)';
                item.style.transform = 'scale(1.02)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.background = 'var(--liquid-secondary)';
                item.style.transform = 'scale(1)';
            });
            
            item.addEventListener('click', () => {
                const query = item.dataset.query;
                const searchInput = document.querySelector('#search-input, input[name="search_query"]');
                if (searchInput) {
                    searchInput.value = query;
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                }
                collapseSearchOverlay();
            });
        });
        
        // Fermer l'overlay en cliquant à l'extérieur
        searchOverlay.addEventListener('click', (e) => {
            if (e.target === searchOverlay) {
                collapseSearchOverlay();
            }
        });
        
        // Animation d'entrée
        setTimeout(() => {
            searchOverlay.style.opacity = '1';
            enhancedSearchContainer.style.transform = 'translateX(-50%) translateY(-50%) scale(1)';
        }, 50);
    }
    
    // Fonction pour fermer l'overlay de recherche
    function collapseSearchOverlay() {
        if (!isSearchExpanded || !searchOverlay) return;
        
        isSearchExpanded = false;
        
        const enhancedSearchContainer = searchOverlay.querySelector('.enhanced-search-container');
        
        // Animation de sortie
        searchOverlay.style.opacity = '0';
        if (enhancedSearchContainer) {
            enhancedSearchContainer.style.transform = 'translateX(-50%) translateY(-50%) scale(0.8)';
        }
        
        setTimeout(() => {
            if (searchOverlay && searchOverlay.parentNode) {
                searchOverlay.parentNode.removeChild(searchOverlay);
            }
            searchOverlay = null;
        }, 400);
    }
    
    // Fonction pour ajouter des effets de parallaxe subtils
    function addParallaxEffects() {
        let ticking = false;
        
        function updateParallax() {
            const scrollY = window.pageYOffset;
            const filterButtons = document.querySelector('.custom-filter-buttons');
            
            if (filterButtons) {
                // Effet de parallaxe léger sur les boutons
                const parallaxValue = scrollY * 0.02;
                filterButtons.style.transform = `translateY(${parallaxValue}px)`;
            }
            
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
    
    // Fonction pour ajouter des micro-interactions
    function addMicroInteractions() {
        // Effet de ripple sur les boutons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('custom-filter-btn')) {
                createRippleEffect(e.target, e);
            }
        });
    }
    
    // Fonction pour créer l'effet ripple
    function createRippleEffect(button, event) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Observer pour détecter les changements de contenu
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length > 0) {
                    shouldUpdate = true;
                }
            });
            
            if (shouldUpdate) {
                setTimeout(() => {
                    createCustomButtons();
                    enhanceSearchBar();
                    if (currentFilter !== 'tout') {
                        applyFilterWithAnimation(currentFilter);
                    }
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Fonction pour masquer les boutons indésirables avec animation
    function hideUnwantedButtons() {
        const unwantedButtons = document.querySelectorAll(`
            button[aria-label*="Télécharger"],
            button[aria-label*="Download"],
            .download-button,
            ytd-download-button-renderer,
            #download-button,
            button[aria-label*="Créer"],
            button[aria-label*="Create"],
            ytd-topbar-menu-button-renderer[data-button-renderer="create"],
            #create-button,
            [aria-label="Créer"],
            [aria-label="Create"]
        `);
        
        unwantedButtons.forEach(btn => {
            if (btn && btn.style.display !== 'none') {
                btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                btn.style.opacity = '0';
                btn.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    btn.style.display = 'none';
                }, 300);
            }
        });
    }
    
    // Observer pour masquer les boutons indésirables
    function setupButtonHideObserver() {
        const observer = new MutationObserver(() => {
            hideUnwantedButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        hideUnwantedButtons();
    }
    
    // Fonction d'initialisation principale
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        setTimeout(() => {
            createCustomButtons();
            enhanceSearchBar();
            addParallaxEffects();
            addMicroInteractions();
            setupObserver();
            setupButtonHideObserver();
        }, 1000);
    }
    
    // Gestion des changements de page YouTube SPA
    let lastUrl = location.href;
    const urlObserver = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('youtube.com') && !url.includes('/watch') && !url.includes('/shorts/')) {
                setTimeout(() => {
                    currentFilter = 'tout';
                    createCustomButtons();
                    enhanceSearchBar();
                }, 1000);
            }
            setTimeout(hideUnwantedButtons, 500);
        }
    });
    
    urlObserver.observe(document, { subtree: true, childList: true });
    
    // Gestion des raccourcis clavier
    document.addEventListener('keydown', (e) => {
        // Raccourcis pour les filtres (Alt + 1, 2, 3)
        if (e.altKey && !e.ctrlKey && !e.shiftKey) {
            switch (e.key) {
                case '1':
                    e.preventDefault();
                    currentFilter = 'tout';
                    updateButtonStyles();
                    applyFilterWithAnimation('tout');
                    break;
                case '2':
                    e.preventDefault();
                    currentFilter = 'video';
                    updateButtonStyles();
                    applyFilterWithAnimation('video');
                    break;
                case '3':
                    e.preventDefault();
                    currentFilter = 'short';
                    updateButtonStyles();
                    applyFilterWithAnimation('short');
                    break;
            }
        }
        
        // Échapper pour fermer l'overlay de recherche
        if (e.key === 'Escape' && isSearchExpanded) {
            collapseSearchOverlay();
        }
    });
    
    // Démarrer le script
    init();
    
})();
