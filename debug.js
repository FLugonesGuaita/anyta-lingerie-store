// Script de depuración para verificar funcionalidad de menús
console.log('=== DEBUG SCRIPT LOADED ===');

// Verificar que los elementos existen
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    
    // Verificar elementos hamburguesa
    const mobileHamburger = document.querySelector('.mobile-hamburger');
    const intermediateHamburger = document.querySelector('.intermediate-hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const intermediateNav = document.querySelector('.intermediate-nav-menu');
    
    console.log('Mobile hamburger:', mobileHamburger);
    console.log('Intermediate hamburger:', intermediateHamburger);
    console.log('Mobile nav:', mobileNav);
    console.log('Intermediate nav:', intermediateNav);
    
    // Verificar funciones globales
    console.log('toggleMobileMenu function:', typeof window.toggleMobileMenu);
    console.log('toggleIntermediateMenu function:', typeof window.toggleIntermediateMenu);
    
    // Agregar listeners de prueba
    if (mobileHamburger) {
        mobileHamburger.addEventListener('click', function() {
            console.log('Mobile hamburger clicked!');
        });
    }
    
    if (intermediateHamburger) {
        intermediateHamburger.addEventListener('click', function() {
            console.log('Intermediate hamburger clicked!');
        });
    }
    
    // Verificar estilos computados
    if (mobileHamburger) {
        const styles = window.getComputedStyle(mobileHamburger);
        console.log('Mobile hamburger display:', styles.display);
        console.log('Mobile hamburger pointer-events:', styles.pointerEvents);
        console.log('Mobile hamburger z-index:', styles.zIndex);
    }
    
    if (intermediateHamburger) {
        const styles = window.getComputedStyle(intermediateHamburger);
        console.log('Intermediate hamburger display:', styles.display);
        console.log('Intermediate hamburger pointer-events:', styles.pointerEvents);
        console.log('Intermediate hamburger z-index:', styles.zIndex);
    }
});

// Verificar funciones después de un delay
setTimeout(function() {
    console.log('=== DELAYED CHECK ===');
    console.log('toggleMobileMenu available:', typeof toggleMobileMenu);
    console.log('toggleIntermediateMenu available:', typeof toggleIntermediateMenu);
}, 1000);