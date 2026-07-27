// ================================
// Portfolio v1.0
// Fiyinfoluwa
// ================================

// Fade-in animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {

        if (entry.isIntersecting) {
            entry.target.classList.add("show");
        }

    });
}, {
    threshold: 0.15
});

document.querySelectorAll("section").forEach((section) => {
    section.classList.add("hidden");
    observer.observe(section);
});

// Navbar background on scroll
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 60) {
        navbar.style.background = "rgba(8,17,31,0.85)";
        navbar.style.backdropFilter = "blur(20px)";
    } else {
        navbar.style.background = "rgba(255,255,255,.07)";
        navbar.style.backdropFilter = "blur(18px)";
    }

});

// Hero typing effect
const intro = document.querySelector(".intro");

const words = [
    "BUILDING THE FUTURE",
    "ARTIFICIAL INTELLIGENCE",
    "CYBERSECURITY",
    "SOFTWARE ENGINEERING",
    "OPEN SOURCE"
];

let index = 0;

setInterval(() => {

    index++;

    if (index >= words.length) {
        index = 0;
    }

    intro.textContent = words[index];

}, 2500);
