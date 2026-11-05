/* =========================================
   MATHGENIUS — MAIN JAVASCRIPT
========================================= */


/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        navLinks.classList.toggle("active");

        if (navLinks.classList.contains("active")) {
            menuToggle.innerHTML = "&times;";
            menuToggle.setAttribute("aria-expanded", "true");
        } else {
            menuToggle.innerHTML = "☰";
            menuToggle.setAttribute("aria-expanded", "false");
        }

    });

}


/* CLOSE MENU AFTER CLICKING A LINK */

if (navLinks) {

    const navigationItems = navLinks.querySelectorAll("a");

    navigationItems.forEach(function (item) {

        item.addEventListener("click", function () {

            navLinks.classList.remove("active");

            if (menuToggle) {
                menuToggle.innerHTML = "☰";
                menuToggle.setAttribute("aria-expanded", "false");
            }

        });

    });

}


/* AUTOMATIC COPYRIGHT YEAR */

const currentYear = document.getElementById("currentYear");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}


/* SMOOTH SCROLLING */

document.querySelectorAll('a[href^="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (targetId === "#") return;

        const target = document.querySelector(targetId);

        if (target) {

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});


/* HEADER SCROLL EFFECT */

const header = document.querySelector(".header");

window.addEventListener("scroll", function () {

    if (!header) return;

    if (window.scrollY > 30) {

        header.style.background = "rgba(8, 13, 28, 0.97)";
        header.style.boxShadow = "0 5px 25px rgba(0,0,0,0.15)";

    } else {

        header.style.background = "rgba(8, 13, 28, 0.88)";
        header.style.boxShadow = "none";

    }

});


/* REVEAL ANIMATIONS */

const revealElements = document.querySelectorAll(
    ".tool-card, .audience-card, .stat-item, .about-content"
);

if ("IntersectionObserver" in window) {

    const revealObserver = new IntersectionObserver(

        function (entries, observer) {

            entries.forEach(function (entry) {

                if (entry.isIntersecting) {

                    entry.target.classList.add("revealed");

                    observer.unobserve(entry.target);

                }

            });

        },

        {
            threshold: 0.12
        }

    );

    revealElements.forEach(function (element) {

        element.classList.add("reveal");

        revealObserver.observe(element);

    });

}


/* PREVENT EMPTY LINK JUMPS */

document.querySelectorAll('a[href="#"]').forEach(function (link) {

    link.addEventListener("click", function (event) {
        event.preventDefault();
    });

});


/* CONSOLE MESSAGE */

console.log(
    "%cMathGenius",
    "font-size: 25px; font-weight: bold; color: #6d91ff;"
);

console.log(
    "Solve Smarter. Learn Better."
);
