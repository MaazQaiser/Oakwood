const STRIP_CURSOR_REF_SCRIPT = `
(function () {
  function strip(node) {
    if (node && node.removeAttribute) node.removeAttribute("data-cursor-ref");
  }
  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      if (records[i].type === "attributes") strip(records[i].target);
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    attributeFilter: ["data-cursor-ref"],
  });
  window.addEventListener("load", function () {
    setTimeout(function () { observer.disconnect(); }, 0);
  });
})();
`;

/**
 * The in-editor browser writes data-cursor-ref onto the DOM before React
 * hydrates, which Next reports as a hydration mismatch. Strip it during
 * development only, and stop once the page has loaded.
 */
export function CursorHydrationGuard() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <script
      id="strip-cursor-ref"
      dangerouslySetInnerHTML={{ __html: STRIP_CURSOR_REF_SCRIPT }}
    />
  );
}
