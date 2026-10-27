const STRIP_CURSOR_REF_SCRIPT = `
(function () {
  var ATTR = "data-cursor-ref";
  function strip(node) {
    if (node && node.hasAttribute && node.hasAttribute(ATTR)) {
      node.removeAttribute(ATTR);
    }
  }
  function stripTree(node) {
    if (!node || node.nodeType !== 1) return;
    strip(node);
    if (!node.querySelectorAll) return;
    var found = node.querySelectorAll("[" + ATTR + "]");
    for (var i = 0; i < found.length; i++) strip(found[i]);
  }
  // React reads element.attributes while hydrating. Hide the editor ref
  // before that read, because a mutation observer runs too late.
  var proto = Element.prototype;
  var attrDesc = Object.getOwnPropertyDescriptor(proto, "attributes");
  if (attrDesc && attrDesc.get && attrDesc.configurable) {
    Object.defineProperty(proto, "attributes", {
      configurable: true,
      enumerable: attrDesc.enumerable,
      get: function () {
        strip(this);
        return attrDesc.get.call(this);
      },
    });
  }
  stripTree(document.documentElement);
  var observer = new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      strip(records[i].target);
      var added = records[i].addedNodes;
      if (!added) continue;
      for (var j = 0; j < added.length; j++) stripTree(added[j]);
    }
  });
  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: [ATTR],
  });
  window.addEventListener("load", function () {
    setTimeout(function () { observer.disconnect(); }, 0);
  });
})();
`;

/**
 * The in-editor browser writes data-cursor-ref onto the DOM before React
 * hydrates, which Next reports as a hydration mismatch. Strip it during
 * development only, including when React reads attributes. The observer
 * stops after load so later editor refs can stay.
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
