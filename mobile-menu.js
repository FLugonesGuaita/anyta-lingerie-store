// Mobile Menu Functionality

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerBtn = document.querySelector('.mobile-hamburger');
    
    if (mobileNav && hamburgerBtn) {
        mobileNav.classList.toggle('show');
        hamburgerBtn.classList.toggle('active');
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerBtn = document.querySelector('.mobile-hamburger');
    
    if (mobileNav && hamburgerBtn) {
        mobileNav.classList.remove('show');
        hamburgerBtn.classList.remove('active');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const mobileNav = document.getElementById('mobileNav');
    const hamburgerBtn = document.querySelector('.mobile-hamburger');
    
    if (mobileNav && hamburgerBtn) {
        const isClickInsideMenu = mobileNav.contains(event.target);
        const isClickOnHamburger = hamburgerBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnHamburger && mobileNav.classList.contains('show')) {
            closeMobileMenu();
        }
    }
});

// Close menu on escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMobileMenu();
    }
});

// Handle mobile search
function handleMobileSearch() {
    const searchInput = document.getElementById('mobileSearchInput');
    if (searchInput && searchInput.value.trim()) {
        // Aquí se puede agregar la lógica de búsqueda
        console.log('Búsqueda móvil:', searchInput.value);
        closeMobileMenu();
    }
}

// Intermediate Menu Functionality
function toggleIntermediateMenu() {
    const intermediateNav = document.getElementById('intermediateNav');
    const hamburgerBtn = document.querySelector('.intermediate-hamburger');
    
    if (intermediateNav && hamburgerBtn) {
        intermediateNav.classList.toggle('show');
        hamburgerBtn.classList.toggle('active');
    }
}

function closeIntermediateMenu() {
    const intermediateNav = document.getElementById('intermediateNav');
    const hamburgerBtn = document.querySelector('.intermediate-hamburger');
    
    if (intermediateNav && hamburgerBtn) {
        intermediateNav.classList.remove('show');
        hamburgerBtn.classList.remove('active');
    }
}

// Add search functionality to mobile search input
document.addEventListener('DOMContentLoaded', function() {
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const mobileSearchIcon = document.querySelector('.mobile-search i');
    
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleMobileSearch();
            }
        });
    }
    
    if (mobileSearchIcon) {
        mobileSearchIcon.addEventListener('click', handleMobileSearch);
    }
    

    
    // Close menus when clicking outside
    document.addEventListener('click', function(e) {
        const mobileNav = document.getElementById('mobileNav');
        const intermediateNav = document.getElementById('intermediateNav');
        const mobileHamburger = document.querySelector('.mobile-hamburger');
        const intermediateHamburger = document.querySelector('.intermediate-hamburger');
        
        // Close mobile menu if clicking outside
        if (mobileNav && mobileHamburger && !mobileNav.contains(e.target) && !mobileHamburger.contains(e.target)) {
            closeMobileMenu();
        }
        
        // Close intermediate menu if clicking outside
        if (intermediateNav && intermediateHamburger && !intermediateNav.contains(e.target) && !intermediateHamburger.contains(e.target)) {
            closeIntermediateMenu();
        }
    });
    
    // Close menus with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileMenu();
            closeIntermediateMenu();
        }
    });
});