var BACKGROUND_HOST_ID = "lte-background-host";
  function isStandaloneWindow() {
    return window.location.pathname.indexOf("/standalone/") === 0;
  }
  function findApplicationShell() {
    const dragRegion = document.querySelector("#sjmcl-window-drag-region, #sjmcl-main-drag-region");
    let shell = dragRegion && dragRegion.parentElement && dragRegion.parentElement.parentElement;
    if (!shell) {
      const nextRoot = document.getElementById("__next");
      shell = nextRoot && (nextRoot.firstElementChild || nextRoot);
    }
    if (!shell) {
      const root = document.getElementById("root");
      shell = root && (root.firstElementChild || root);
    }
    if (!shell) {
      let best = null;
      let bestArea = 0;
      Array.from(document.body.children).forEach(function(child) {
        if (child.id === BACKGROUND_HOST_ID || /^(SCRIPT|STYLE|LINK)$/.test(child.tagName)) return;
        const rect = child.getBoundingClientRect();
        const area = rect.width * rect.height;
        if (area > bestArea) {
          best = child;
          bestArea = area;
        }
      });
      shell = best;
    }
    if (!shell) return null;
    const rect = shell.getBoundingClientRect();
    if (rect.width < 200 || rect.height < 200) return null;
    return shell;
  }
  function ensureBackgroundHost() {
    if (isStandaloneWindow()) return null;
    const shell = findApplicationShell();
    if (!shell) return null;
    const existing = document.getElementById(BACKGROUND_HOST_ID);
    if (existing && existing.isConnected && existing.parentNode === shell) return existing;
    if (existing) removeBackgroundHost();
    ["lte-th-bg", "lte-video-bg"].forEach(function(id) {
      const legacy = document.getElementById(id);
      if (legacy && legacy.parentNode === document.body) legacy.parentNode.removeChild(legacy);
    });
    const host = document.createElement("div");
    host.id = BACKGROUND_HOST_ID;
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;inset:0;width:100%;height:100%;overflow:hidden;pointer-events:none;z-index:0;border-radius:inherit;";
    host.__lteShell = shell;
    host.__ltePreviousPosition = shell.style.position;
    host.__ltePreviousIsolation = shell.style.isolation;
    if (getComputedStyle(shell).position === "static") shell.style.position = "relative";
    shell.style.isolation = "isolate";
    shell.insertBefore(host, shell.firstChild);
    if (typeof ResizeObserver === "function" && !host.__lteResizeObserver) {
      host.__lteResizeObserver = new ResizeObserver(function() {
        if (_tc) refreshThemeCanvasResolution();
        if (_cursorCanvas) ensureCursorCanvas();
      });
      host.__lteResizeObserver.observe(host);
    }
    return host;
  }
  function removeBackgroundHost() {
    const host = document.getElementById(BACKGROUND_HOST_ID);
    if (!host) return;
    if (host.__lteResizeObserver) {
      host.__lteResizeObserver.disconnect();
      host.__lteResizeObserver = null;
    }
    const shell = host.__lteShell;
    if (shell) {
      shell.style.position = host.__ltePreviousPosition || "";
      shell.style.isolation = host.__ltePreviousIsolation || "";
    }
    if (host.parentNode) host.parentNode.removeChild(host);
  }
  