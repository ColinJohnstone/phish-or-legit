// Applies the saved/system colour theme before first paint, so there's no
// flash of dark when a returning light-mode visitor loads the page.
// Kept as a separate same-origin file (not inline) so the Content-Security-
// Policy can use a strict `script-src 'self'` with no 'unsafe-inline'.
(function () {
  try {
    var t = localStorage.getItem("phishgame.theme");
    if (!t) t = matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    if (t === "light") document.documentElement.setAttribute("data-theme", "light");
  } catch (e) {}
})();
