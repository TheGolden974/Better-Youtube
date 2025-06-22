// Script pour remplacer les filtres YouTube par des boutons personnalisés
(function() {
    'use strict';
    
    let currentFilter = 'tout';
    
    // Fonction pour créer les boutons personnalisés
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
        
        // Créer le conteneur pour nos boutons
        const customContainer = document.createElement('div');
        customContainer.className = 'custom-filter-buttons';
        customContainer.style.cssText = `
            display: flex;
            gap: 8px;
            padding: 12px 24px;
            background: var(--yt-spec-base-background);
            border-bottom: 1px solid var(--yt-spec-10-percent-layer);
        `;
        
        // Créer les boutons
        const buttons = [
            { text: 'Tout', filter: 'tout' },
            { text: 'Vidéo', filter: 'video' },
            { text: 'Short', filter: 'short' }
        ];
        
        buttons.forEach(buttonData => {
            const button = document.createElement('button');
            button.textContent = buttonData.text;
            button.className = 'custom-filter-btn';
            button.dataset.filter = buttonData.filter;
            
            // Style des boutons
            button.style.cssText = `
                padding: 8px 16px;
                border: 1px solid var(--yt-spec-10-percent-layer);
                border-radius: 18px;
                background: ${buttonData.filter === currentFilter ? 'var(--yt-spec-text-primary)' : 'transparent'};
                color: ${buttonData.filter === currentFilter ? 'var(--yt-spec-base-background)' : 'var(--yt-spec-text-primary)'};
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s ease;
            `;
            
            // Événement de clic
            button.addEventListener('click', () => {
                currentFilter = buttonData.filter;
                updateButtonStyles();
                applyFilter(buttonData.filter);
            });
            
            customContainer.appendChild(button);
        });
        
        // Insérer les boutons après le conteneur des filtres
        filterContainer.parentNode.insertBefore(customContainer, filterContainer.nextSibling);
    }
    
    // Fonction pour mettre à jour les styles des boutons
    function updateButtonStyles() {
        const buttons = document.querySelectorAll('.custom-filter-btn');
        buttons.forEach(btn => {
            const isActive = btn.dataset.filter === currentFilter;
            btn.style.background = isActive ? 'var(--yt-spec-text-primary)' : 'transparent';
            btn.style.color = isActive ? 'var(--yt-spec-base-background)' : 'var(--yt-spec-text-primary)';
        });
    }
    
    // Fonction pour appliquer le filtre
    function applyFilter(filter) {
        // Tous les contenus possibles
        const allContent = document.querySelectorAll(`
            ytd-video-renderer,
            ytd-grid-video-renderer,
            ytd-compact-video-renderer,
            ytd-rich-grid-slim-media-renderer,
            ytd-reel-item-renderer,
            [is-shorts]
        `);
        
        allContent.forEach(element => {
            // Détecter si c'est un Short
            const isShort = element.querySelector('[href*="/shorts/"]') ||
                           element.querySelector('[aria-label*="Shorts"]') ||
                           element.hasAttribute('is-shorts') ||
                           element.closest('[is-shorts]') ||
                           element.tagName === 'YTD-RICH-GRID-SLIM-MEDIA-RENDERER' ||
                           element.tagName === 'YTD-REEL-ITEM-RENDERER';
            
            if (filter === 'tout') {
                element.style.display = '';
            } else if (filter === 'video') {
                element.style.display = isShort ? 'none' : '';
            } else if (filter === 'short') {
                element.style.display = isShort ? '' : 'none';
            }
        });
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
                    if (currentFilter !== 'tout') {
                        applyFilter(currentFilter);
                    }
                }, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Initialiser le script
    function init() {
        // Attendre que la page soit chargée
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Démarrer avec un délai pour laisser YouTube se charger
        setTimeout(() => {
            createCustomButtons();
            setupObserver();
        }, 1000);
    }
    
    // Fonction pour cacher les boutons indésirables
    function hideUnwantedButtons() {
        // Cacher le bouton téléchargement sous les vidéos
        const downloadButtons = document.querySelectorAll(`
            button[aria-label*="Télécharger"],
            button[aria-label*="Download"],
            .download-button,
            ytd-download-button-renderer,
            #download-button
        `);
        downloadButtons.forEach(btn => {
            if (btn) btn.style.display = 'none';
        });
        
        // Cacher le bouton "Créer" en haut à gauche
        const createButtons = document.querySelectorAll(`
            button[aria-label*="Créer"],
            button[aria-label*="Create"],
            ytd-topbar-menu-button-renderer[data-button-renderer="create"],
            #create-button,
            [aria-label="Créer"],
            [aria-label="Create"]
        `);
        createButtons.forEach(btn => {
            if (btn) btn.style.display = 'none';
        });
    }
    
    // Observer pour cacher les boutons indésirables
    function setupButtonHideObserver() {
        const observer = new MutationObserver(() => {
            hideUnwantedButtons();
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Exécuter immédiatement
        hideUnwantedButtons();
    }
    
    // Démarrer le script
    init();
    setupButtonHideObserver();
    
    // Réinitialiser lors des changements de page YouTube
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('youtube.com') && !url.includes('/watch') && !url.includes('/shorts/')) {
                setTimeout(() => {
                    currentFilter = 'tout';
                    createCustomButtons();
                }, 1000);
            }
            // Cacher les boutons indésirables à chaque changement de page
            setTimeout(hideUnwantedButtons, 500);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();
