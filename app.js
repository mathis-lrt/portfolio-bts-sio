// Active link dans le menu selon la page
(() => {
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const menuLinks = [...document.querySelectorAll(".menu a")];
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

    // Met à jour l'année automatiquement
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
})();
