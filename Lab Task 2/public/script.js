
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');


hamburger.onclick = function() {
    // Toggle the "active" class on the menu
    navLinks.classList.toggle('active');
};


const links = document.querySelectorAll('.nav-links li a');

links.forEach(link => {
    link.onclick = function() {
        navLinks.classList.remove('active');
    };
});