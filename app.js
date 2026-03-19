// Active link dans le menu selon la page
(() => {
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const menuLinks = [...document.querySelectorAll(".menu a")];
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const setActive = targetHash => {
        menuLinks.forEach(a => {
            const href = (a.getAttribute("href") || "").toLowerCase();
            a.classList.toggle("active", href.endsWith(targetHash));
        });
    };

    if (current === "index.html") {
        const sections = [...document.querySelectorAll(".scroll-section[id]")];
        const initialHash = (location.hash || "#accueil").toLowerCase();
        setActive(initialHash);

        if (sections.length) {
            const observer = new IntersectionObserver(entries => {
                const visibleEntry = entries
                    .filter(entry => entry.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

                if (visibleEntry) {
                    const currentHash = `#${visibleEntry.target.id.toLowerCase()}`;
                    setActive(currentHash);
                }
            }, {
                rootMargin: "-25% 0px -55% 0px",
                threshold: [0.2, 0.4, 0.6]
            });

            sections.forEach(section => observer.observe(section));
        }
    } else {
        menuLinks.forEach(a => a.classList.remove("active"));
    }

    const addRevealGroup = (selector, className = "reveal", baseDelay = 0, step = 90) => {
        document.querySelectorAll(selector).forEach((element, index) => {
            element.classList.add("reveal", className);
            element.style.setProperty("--reveal-delay", `${baseDelay + (index * step)}ms`);
            element.classList.add("reveal-stagger");
        });
    };

    const heroMain = document.querySelector(".home-hero-main");
    const heroSide = document.querySelector(".home-side");

    if (heroMain) {
        heroMain.classList.add("reveal", "reveal-soft");
    }

    if (heroSide) {
        heroSide.classList.add("reveal", "reveal-right");
    }

    addRevealGroup(".home-card", "reveal-soft", 80, 70);
    addRevealGroup(".page-header", "reveal-soft", 0, 0);
    addRevealGroup(".content > .card.block:first-child", "reveal-left", 40, 0);
    addRevealGroup(".content > aside.card.block", "reveal-right", 80, 0);
    addRevealGroup(".project-resources", "reveal-soft", 120, 90);
    addRevealGroup(".resources-column", "reveal-soft", 140, 80);

    document.querySelectorAll(".block h2, .page-header h1").forEach((heading, index) => {
        heading.classList.add("reveal", "reveal-soft", "reveal-stagger");
        heading.style.setProperty("--reveal-delay", `${40 + (index % 3) * 50}ms`);
    });

    if (prefersReducedMotion) {
        document.querySelectorAll(".reveal").forEach(element => {
            element.classList.add("is-visible");
        });
    } else {
        if (heroMain) {
            requestAnimationFrame(() => {
                heroMain.classList.add("is-visible");
                if (heroSide) {
                    window.setTimeout(() => heroSide.classList.add("is-visible"), 120);
                }
            });
        }

        const revealTargets = [...document.querySelectorAll(".reveal")].filter(element =>
            element !== heroMain && element !== heroSide
        );

        if (revealTargets.length) {
            const revealObserver = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        revealObserver.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: "0px 0px -12% 0px",
                threshold: 0.14
            });

            revealTargets.forEach(target => revealObserver.observe(target));
        }
    }

    // Met à jour l'année automatiquement
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
})();
