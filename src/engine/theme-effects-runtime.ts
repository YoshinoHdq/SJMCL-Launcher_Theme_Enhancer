  var _tc = null;
  var _ta = null;
  var _tp = [];
  var _tt = getLocal("th_type", "rain");
  var _ti = getLocal("th_int", 50);
  var _trun = false;
  var _tfrm = 0;
  var _tcCssW = 0;
  var _tcCssH = 0;
  var _tcDpr = 1;
  var _themeRetryTimer = null;
  function persistThemePreferences() {
    setLocal("th_type", _tt);
    setLocal("th_int", _ti);
  }
  function syncThemeGlobals() {
    window._tt = _tt;
    window._ti = _ti;
    window._trun = _trun;
  }
  function makeThemeCanvas() {
    const host = ensureBackgroundHost();
    if (!host) return null;
    if (!_tc) {
      host.querySelectorAll("#lte-th-bg").forEach(function(stale) {
        stale.remove();
      });
      _tc = document.createElement("canvas");
      _tc.id = "lte-th-bg";
      _tc.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:2;pointer-events:none;";
    }
    if (_tc.parentNode !== host) host.appendChild(_tc);
    const cssWidth = host.clientWidth || window.innerWidth;
    const cssHeight = host.clientHeight || window.innerHeight;
    _tcCssW = cssWidth;
    _tcCssH = cssHeight;
    _tcDpr = sizeCanvas(_tc, cssWidth, cssHeight).dpr;
    return _tc;
  }
  function removeThemeCanvas() {
    if (_ta) {
      cancelAnimationFrame(_ta);
      _ta = null;
    }
    if (_tc && _tc.parentNode) _tc.parentNode.removeChild(_tc);
    _tc = null;
    _tp = [];
    _trun = false;
    syncThemeGlobals();
    _tfrm = 0;
    _tcCssW = 0;
    _tcCssH = 0;
    _tcDpr = 1;
    _themeLastDraw = 0;
  }
  function themeAnimLoop() {
    const now = performance.now();
    const config = getPerfConfig();
    const interval = 1000 / config.fps;
    if (_tc && _trun && (_themeLastDraw === 0 || now - _themeLastDraw >= interval - 1)) {
      _themeLastDraw = now;
      _tfrm += Math.max(1, 60 / config.fps);
      try {
        const ctx = _tc.getContext("2d");
        if (ctx && themeEffects[_tt]) {
          ctx.setTransform(_tcDpr, 0, 0, _tcDpr, 0, 0);
          themeEffects[_tt].draw(ctx, _tcCssW, _tcCssH, _tp.filter(function(x) {
            return isFinite(x.x) && isFinite(x.y);
          }), _ti, _tfrm);
        }
      } catch (_e) {
      }
    }
    _ta = requestAnimationFrame(themeAnimLoop);
  }
  function refreshThemeCanvasResolution() {
    if (!_tc) return;
    const host = ensureBackgroundHost();
    const cssWidth = host && host.clientWidth || window.innerWidth;
    const cssHeight = host && host.clientHeight || window.innerHeight;
    _tcCssW = cssWidth;
    _tcCssH = cssHeight;
    _tcDpr = sizeCanvas(_tc, cssWidth, cssHeight).dpr;
  }
  function startThemeEffects(type, intensity) {
    if (isStandaloneWindow()) return false;
    if (_trun && _tc) return true;
    _tt = type || "rain";
    _ti = intensity || 50;
    _trun = true;
    syncThemeGlobals();
    persistThemePreferences();
    setLocal("th_enabled", true);
    _tfrm = 0;
    _themeLastDraw = 0;
    const c2 = makeThemeCanvas();
    if (!c2) {
      _trun = false;
      syncThemeGlobals();
      if (_themeRetryTimer) window.clearTimeout(_themeRetryTimer);
      _themeRetryTimer = window.setTimeout(function() {
        _themeRetryTimer = null;
        if (getLocal("th_enabled", false)) startThemeEffects(_tt, _ti);
      }, 300);
      return false;
    }
    if (themeEffects[_tt]) _tp = themeEffects[_tt].init({ width: _tcCssW, height: _tcCssH });
    themeAnimLoop();
    const rs = function() {
      if (_tc) {
        refreshThemeCanvasResolution();
        if (themeEffects[_tt]) _tp = themeEffects[_tt].init({ width: _tcCssW, height: _tcCssH });
      }
    };
    window.addEventListener("resize", rs);
    window._lteThResize = rs;
    return true;
  }
  function updateThemeEffects(type, intensity) {
    if (type !== null && type !== void 0) {
      _tt = type;
      if (_tc && themeEffects[_tt]) _tp = themeEffects[_tt].init({ width: _tcCssW, height: _tcCssH });
    }
    if (intensity !== null && intensity !== void 0) _ti = intensity;
    syncThemeGlobals();
    persistThemePreferences();
  }
  function stopThemeEffects(preserveEnabledPreference) {
    _trun = false;
    syncThemeGlobals();
    if (!preserveEnabledPreference) setLocal("th_enabled", false);
    if (_themeRetryTimer) {
      window.clearTimeout(_themeRetryTimer);
      _themeRetryTimer = null;
    }
    if (_ta) {
      cancelAnimationFrame(_ta);
      _ta = null;
    }
    if (window._lteThResize) {
      window.removeEventListener("resize", window._lteThResize);
      window._lteThResize = null;
    }
    removeThemeCanvas();
  }
  