NATALIA NEUHAUS PORTFOLIO — STATIC WEBSITE

This folder is ready for ordinary static web hosting.

HOSTGATOR
1. Open public_html in HostGator's File Manager.
2. Upload the contents of this folder, not the enclosing folder.
3. Keep the folder structure unchanged.
4. The homepage starts from index.html.

LOCAL PREVIEW
Because the site uses root-relative image paths, preview it through a local
web server rather than double-clicking index.html. From this folder, run:

  python3 -m http.server 8000

Then open http://localhost:8000 in a browser.
