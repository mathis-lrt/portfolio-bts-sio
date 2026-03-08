// Active link dans le menu selon la page
(() => {
    // Récupère le nom de la page actuelle
    const current = (location.pathname.split("/").pop() || "index.html").toLowerCase();

    // Ajoute la classe "active" au lien correspondant
    document.querySelectorAll(".menu a").forEach(a => {
        const href = (a.getAttribute("href") || "").toLowerCase();
        if (href.includes(current.replace("#", "")) || (current === "index.html" && href === "#accueil")) {
            a.classList.add("active");
        }
    });

    // Met à jour l'année automatiquement
    const yearElement = document.getElementById("year");
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
})();
