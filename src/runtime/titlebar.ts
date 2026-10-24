  var LTE_TB_STYLE_ID = "lte-titlebar-style";
  var LTE_TB_STRIP_ID = "lte-titlebar-drag-strip";
  var LTE_TB_HIDDEN = "data-lte-titlebar-hidden";
  var LTE_TB_VISIBLE = "data-lte-titlebar-visible";
  var LTE_TB_SELECTORS = ["#sjmcl-window-drag-region", "#sjmcl-main-drag-region", "[data-tauri-drag-region]"];
  var _titlebarEnabled = getLocal("titlebar_enabled", false);
  var _titlebarZone = Math.max(8, Math.min(40, Number(getLocal("titlebar_zone", 20)) || 20));
  var _titlebarDelay = Math.max(80, Math.min(400, Number(getLocal("titlebar_delay", 180)) || 180));
  var _titlebarSupported = false;
  var _titlebarConflict = false;
  var _titlebarController = null;
  var _titlebarWatch = null;

  function titlebarFindTarget() {
    for (var i = 0; i < LTE_TB_SELECTORS.length; i++) {
      var nodes = document.querySelectorAll(LTE_TB_SELECTORS[i]);
      for (var n = 0; n < nodes.length; n++) {
        var drag = nodes[n];
        if (drag.id === LTE_TB_STRIP_ID || (drag.closest && drag.closest("#" + LTE_TB_STRIP_ID))) continue;
        var parent = drag.parentElement;
        if (!parent || parent === document.body || parent === document.documentElement) continue;
        return parent;
      }
    }
    return null;
  }
  function titlebarOldPluginActive() {
    return Boolean(document.getElementById("sjmcl-auto-titlebar-style") || document.getElementById("sjmcl-auto-titlebar-drag-strip"));
  }
  function syncTitlebarState() {
    window._lteTitlebar = {
      enabled: Boolean(_titlebarEnabled),
      zone: _titlebarZone,
      delay: _titlebarDelay,
      supported: Boolean(_titlebarSupported),
      conflict: Boolean(_titlebarConflict)
    };
  }
  function createTitlebarController() {
    var enabled = false;
    var disposed = false;
    var titlebar = null;
    var hideTimer = null;
    var retryTimer = null;
    var watchTimer = null;
    var styleEl = null;
    var stripEl = null;
    var zone = _titlebarZone;
    var delay = _titlebarDelay;
    function clearTimers() {
      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      if (retryTimer !== null) {
        window.clearTimeout(retryTimer);
        retryTimer = null;
      }
      if (watchTimer !== null) {
        window.clearInterval(watchTimer);
        watchTimer = null;
      }
    }
    function showTitlebar() {
      if (!enabled || !titlebar) return;
      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      titlebar.setAttribute(LTE_TB_VISIBLE, "");
    }
    function hideTitlebar() {
      if (hideTimer !== null) {
        window.clearTimeout(hideTimer);
        hideTimer = null;
      }
      if (titlebar) titlebar.removeAttribute(LTE_TB_VISIBLE);
    }
    function scheduleHide() {
      if (!enabled || !titlebar) return;
      if (hideTimer !== null) window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(function() {
        hideTimer = null;
        if (enabled && titlebar) titlebar.removeAttribute(LTE_TB_VISIBLE);
      }, delay);
    }
    function handleMove(event) {
      if (!enabled) return;
      if (!titlebar || !titlebar.isConnected) bindTitlebar(titlebarFindTarget());
      if (!titlebar) return;
      if (event.clientY <= zone) {
        showTitlebar();
        return;
      }
      if (!titlebar.hasAttribute(LTE_TB_VISIBLE)) return;
      var h = Math.max(titlebar.getBoundingClientRect().height, 24);
      if (event.clientY > h + 8) scheduleHide();
    }
    function handleBlur() {
      hideTitlebar();
    }
    function ensureStyle() {
      if (styleEl && styleEl.isConnected) return;
      styleEl = document.getElementById(LTE_TB_STYLE_ID);
      if (styleEl) return;
      styleEl = document.createElement("style");
      styleEl.id = LTE_TB_STYLE_ID;
      styleEl.textContent =
        "[" + LTE_TB_HIDDEN + "] { opacity: 0 !important; pointer-events: none !important; transform: translateY(-100%) !important; transition: opacity 120ms ease, transform 120ms ease !important; }\n" +
        "[" + LTE_TB_HIDDEN + "][" + LTE_TB_VISIBLE + "] { opacity: 1 !important; pointer-events: auto !important; transform: translateY(0) !important; }\n" +
        "#" + LTE_TB_STRIP_ID + " { position: fixed; top: 0; right: 0; left: 0; height: 8px; z-index: 2147482999; -webkit-app-region: drag; }";
      document.head.appendChild(styleEl);
    }
    function ensureStrip() {
      if (stripEl && stripEl.isConnected) return;
      stripEl = document.getElementById(LTE_TB_STRIP_ID);
      if (stripEl) return;
      stripEl = document.createElement("div");
      stripEl.id = LTE_TB_STRIP_ID;
      stripEl.setAttribute("data-tauri-drag-region", "");
      stripEl.setAttribute("aria-hidden", "true");
      stripEl.addEventListener("pointerenter", showTitlebar);
      document.body.appendChild(stripEl);
    }
    function bindTitlebar(next) {
      if (titlebar === next && titlebar && titlebar.isConnected) return;
      if (titlebar) {
        titlebar.removeAttribute(LTE_TB_HIDDEN);
        titlebar.removeAttribute(LTE_TB_VISIBLE);
      }
      titlebar = next;
      if (!titlebar) return;
      titlebar.setAttribute(LTE_TB_HIDDEN, "");
      titlebar.removeAttribute(LTE_TB_VISIBLE);
    }
    function scheduleRetry() {
      if (!enabled || disposed || retryTimer !== null) return;
      retryTimer = window.setTimeout(function() {
        retryTimer = null;
        if (!enabled || disposed) return;
        bindTitlebar(titlebarFindTarget());
        if (!titlebar) scheduleRetry();
      }, 300);
    }
    function setEnabled(next) {
      if (disposed || enabled === next) return;
      enabled = next;
      clearTimers();
      if (!enabled) {
        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseleave", handleBlur);
        window.removeEventListener("blur", handleBlur);
        if (titlebar) {
          titlebar.removeAttribute(LTE_TB_HIDDEN);
          titlebar.removeAttribute(LTE_TB_VISIBLE);
        }
        titlebar = null;
        if (stripEl && stripEl.parentNode) stripEl.parentNode.removeChild(stripEl);
        if (styleEl && styleEl.parentNode) styleEl.parentNode.removeChild(styleEl);
        stripEl = null;
        styleEl = null;
        return;
      }
      ensureStyle();
      ensureStrip();
      bindTitlebar(titlebarFindTarget());
      scheduleRetry();
      document.addEventListener("mousemove", handleMove, { passive: true });
      document.addEventListener("mouseleave", handleBlur);
      window.addEventListener("blur", handleBlur);
      watchTimer = window.setInterval(function() {
        if (!enabled) return;
        var next = titlebarFindTarget();
        if (!titlebar || !titlebar.isConnected || next !== titlebar) bindTitlebar(next);
      }, 1000);
    }
    return {
      setEnabled: setEnabled,
      setZone: function(px) { zone = px; },
      setDelay: function(ms) { delay = ms; },
      dispose: function() {
        setEnabled(false);
        disposed = true;
      }
    };
  }
  function refreshTitlebarState() {
    _titlebarSupported = Boolean(titlebarFindTarget());
    _titlebarConflict = titlebarOldPluginActive();
    if (_titlebarController) {
      _titlebarController.setEnabled(Boolean(_titlebarEnabled && _titlebarSupported && !_titlebarConflict));
    }
    syncTitlebarState();
  }
  function installTitlebarRuntime() {
    if (isStandaloneWindow()) return;
    _titlebarController = createTitlebarController();
    _titlebarController.setZone(_titlebarZone);
    _titlebarController.setDelay(_titlebarDelay);
    refreshTitlebarState();
    if (_titlebarWatch === null) _titlebarWatch = window.setInterval(refreshTitlebarState, 1000);
  }
  function disposeTitlebarRuntime() {
    if (_titlebarWatch !== null) {
      window.clearInterval(_titlebarWatch);
      _titlebarWatch = null;
    }
    if (_titlebarController) {
      _titlebarController.dispose();
      _titlebarController = null;
    }
    _titlebarSupported = false;
    _titlebarConflict = false;
    syncTitlebarState();
  }
  function titlebarSetEnabled(on) {
    if (on && (!_titlebarSupported || _titlebarConflict)) return;
    _titlebarEnabled = Boolean(on);
    setLocal("titlebar_enabled", _titlebarEnabled);
    if (_titlebarController) {
      _titlebarController.setEnabled(Boolean(_titlebarEnabled && _titlebarSupported && !_titlebarConflict));
    }
    syncTitlebarState();
  }
  function titlebarSetZone(px) {
    _titlebarZone = Math.max(8, Math.min(40, Number(px) || 20));
    setLocal("titlebar_zone", _titlebarZone);
    if (_titlebarController) _titlebarController.setZone(_titlebarZone);
    syncTitlebarState();
  }
  function titlebarSetDelay(ms) {
    _titlebarDelay = Math.max(80, Math.min(400, Number(ms) || 180));
    setLocal("titlebar_delay", _titlebarDelay);
    if (_titlebarController) _titlebarController.setDelay(_titlebarDelay);
    syncTitlebarState();
  }
