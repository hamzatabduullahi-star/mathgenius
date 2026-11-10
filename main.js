/* =========================================
   MATHGENIUS — MAIN JAVASCRIPT
   Futuristic 3D Homepage Interactions
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        // Close menu after clicking a navigation link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });

        // Close menu when clicking outside
        document.addEventListener("click", event => {
            if (
                !menuToggle.contains(event.target) &&
                !navLinks.contains(event.target)
            ) {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            }
        });
    }


    // =====================================
    // CURRENT YEAR
    // =====================================

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // =====================================
    // HEADER SCROLL EFFECT
    // =====================================

    const header = document.querySelector(".header");

    function updateHeader() {
        if (!header) return;

        if (window.scrollY > 40) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    // =====================================
    // SMOOTH SCROLLING
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener("click", event => {

            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

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


    // =====================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealElements = document.querySelectorAll(
        ".tool-card, .audience-card, .stat-item, .about-content"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("revealed");

                        observer.unobserve(entry.target);
                    }
                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("revealed");
        });
    }


    // =====================================
    // 3D HERO CARD MOVEMENT
    // =====================================

    const heroVisual = document.querySelector(".hero-visual");
    const mathCard = document.querySelector(".math-card");

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (
        heroVisual &&
        mathCard &&
        !prefersReducedMotion &&
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {

        heroVisual.addEventListener("mousemove", event => {

            const rect = heroVisual.getBoundingClientRect();

            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateY = ((x - centerX) / centerX) * 7;
            const rotateX = ((centerY - y) / centerY) * 7;

            mathCard.style.transform = `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateZ(20px)
            `;
        });

        heroVisual.addEventListener("mouseleave", () => {

            mathCard.style.transform = `
                perspective(1000px)
                rotateX(0deg)
                rotateY(0deg)
                translateZ(0px)
            `;
        });
    }


    // =====================================
    // 3D CARD HOVER EFFECT
    // =====================================

    const interactiveCards = document.querySelectorAll(
        ".tool-card, .audience-card"
    );

    if (!prefersReducedMotion) {

        interactiveCards.forEach(card => {

            card.addEventListener("mouseenter", () => {
                card.classList.add("card-hovered");
            });

            card.addEventListener("mouseleave", () => {
                card.classList.remove("card-hovered");
            });

        });
    }


    // =====================================
    // FLOATING MATHEMATICAL SYMBOLS
    // =====================================

    const floatingSymbols = document.querySelectorAll(
        ".floating-symbol"
    );

    floatingSymbols.forEach((symbol, index) => {

        symbol.style.animationDelay = `${index * 0.7}s`;

    });


    // =====================================
    // BUTTON CLICK FEEDBACK
    // =====================================

    document.querySelectorAll(".btn").forEach(button => {

        button.addEventListener("pointerdown", () => {
            button.classList.add("button-pressed");
        });

        button.addEventListener("pointerup", () => {
            button.classList.remove("button-pressed");
        });

        button.addEventListener("pointerleave", () => {
            button.classList.remove("button-pressed");
        });

    });


    // =====================================
    // PAGE LOADED
    // =====================================

    document.body.classList.add("page-loaded");

});
