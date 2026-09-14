"""Génère le PDF depuis le tableau de l'accueil avec Chrome/Chromium.

À relancer après modification du tableau : python3 scripts/generate-synthese-pdf.py
"""

from pathlib import Path
import re
import shutil
import subprocess
import tempfile


ROOT = Path(__file__).resolve().parents[1]
browser = next((shutil.which(name) for name in
                ("google-chrome", "chromium", "chromium-browser")
                if shutil.which(name)), None)
if not browser:
    raise SystemExit("Installez Chrome ou Chromium pour générer le PDF.")

source = (ROOT / "index.html").read_text()
table = re.search(r'<table class="e5-table".*?</table>', source, re.S)
if not table:
    raise SystemExit("Tableau de synthèse introuvable dans index.html.")

styles = (ROOT / "styles.css").read_text()
print_styles = """
@page { size: A3 landscape; margin: 10mm; }
html, body { background: white; color: #0f172a; }
body { zoom: .65; width: max-content; padding: 0; min-height: 0; }
* { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.e5-table { min-width: 0; break-inside: avoid; }
"""
output = ROOT / "assets" / "tableau_synthese_e5.pdf"
with tempfile.TemporaryDirectory(prefix="portfolio-pdf-") as temp:
    document = Path(temp) / "synthese.html"
    document.write_text(
        '<!doctype html><html lang="fr"><meta charset="utf-8">'
        '<title>Tableau de synthèse E5 — Mathis Lauret Pouvreau</title>'
        f'<style>{styles}\n{print_styles}</style><body>{table.group()}</body></html>'
    )
    subprocess.run([
        browser, "--headless", "--disable-gpu", "--no-pdf-header-footer",
        f"--user-data-dir={temp}/chrome", f"--print-to-pdf={output}",
        document.as_uri(),
    ], check=True)
print(f"PDF généré : {output}")
