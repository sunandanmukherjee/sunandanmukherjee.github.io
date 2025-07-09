document.addEventListener('DOMContentLoaded', () => {

    // --- Navbar Burger for Mobile ---
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
    if ($navbarBurgers.length > 0) {
        $navbarBurgers.forEach( el => {
            el.addEventListener('click', () => {
                const target = el.dataset.target;
                const $target = document.getElementById(target);
                el.classList.toggle('is-active');
                $target.classList.toggle('is-active');
            });
        });
    }

    // --- Navbar background color change on scroll ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('is-scrolled');
        } else {
            navbar.classList.remove('is-scrolled');
        }
    });

    // --- Close mobile menu when a link is clicked ---
    const navbarLinks = document.querySelectorAll('.navbar-menu .navbar-item');
    navbarLinks.forEach(link => {
        link.addEventListener('click', () => {
            const navbarMenu = document.querySelector('.navbar-menu');
            const navbarBurger = document.querySelector('.navbar-burger');
            if (navbarMenu.classList.contains('is-active')) {
                navbarMenu.classList.remove('is-active');
                navbarBurger.classList.remove('is-active');
            }
        });
    });
});
