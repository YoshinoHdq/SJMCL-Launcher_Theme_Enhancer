// src/runtime/performance.ts
  var PERF_OPTIONS = [
    { id: "auto", labelKey: "perfAuto", descriptionKey: "perfAutoDesc", dprCap: 1.5, fps: 60, colors: ["#52e2ff", "#8c6cff", "#ff6fc8"] },
    { id: "high", labelKey: "perfHigh", descriptionKey: "perfHighDesc", dprCap: 2, fps: 60, colors: ["#69e39a", "#8af0c0", "#d9fff0"] },
    { id: "saver", labelKey: "perfSaver", descriptionKey: "perfSaverDesc", dprCap: 1, fps: 30, colors: ["#ffd166", "#f6a75c", "#ff8a5c"] }
  ];
  function getPerfOption(id) {
    return PERF_OPTIONS.find(function(option) {
      return option.id === id;
    }) || PERF_OPTIONS[0];
  }
  var _perfMode = getPerfOption(getLocal("perf_mode", "auto")).id;
  var _themeLastDraw = 0;
  var _vhiddenPlaying = false;
  var _bgWatchTimer = null;
  var _visibilityHandler = null;
  function getPerfMode() {
    return _perfMode;
  }
  function getPerfConfig() {
    var option = getPerfOption(_perfMode);
    return {
      mode: option.id,
      dpr: Math.min(typeof window.devicePixelRatio === "number" ? window.devicePixelRatio : 1, option.dprCap),
      fps: option.fps
    };
  }
  function sizeCanvas(canvas, cssWidth, cssHeight) {
    var config = getPerfConfig();
    var width = Math.max(1, Math.round(cssWidth * config.dpr));
    var height = Math.max(1, Math.round(cssHeight * config.dpr));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    var ctx = canvas.getContext("2d");
    if (ctx) ctx.setTransform(config.dpr, 0, 0, config.dpr, 0, 0);
    return config;
  }
  function applyPerformanceMode(mode) {
    _perfMode = getPerfOption(mode).id;
    setLocal("perf_mode", _perfMode);
    _themeLastDraw = 0;
    if (typeof refreshThemeCanvasResolution === "function") refreshThemeCanvasResolution();
    if (_cursorCanvas) ensureCursorCanvas();
  }
  function installPerformanceRuntime() {
    if (_visibilityHandler) document.removeEventListener("visibilitychange", _visibilityHandler);
    _visibilityHandler = function() {
      if (document.hidden) {
        _vhiddenPlaying = Boolean(_vvideo && !_vvideo.paused);
        if (_vhiddenPlaying && _vvideo) {
          try {
            _vvideo.pause();
          } catch (e) {
          }
        }
      } else {
        _themeLastDraw = 0;
        if (_vhiddenPlaying && _vvideo && !_vpaused) {
          tryPlayVideo(false);
        }
        _vhiddenPlaying = false;
      }
    };
    document.addEventListener("visibilitychange", _visibilityHandler);

    if (_bgWatchTimer) window.clearInterval(_bgWatchTimer);
    _bgWatchTimer = window.setInterval(function() {
      if (!_trun && !_vactive && !_cursorEnabled) return;
      var host = ensureBackgroundHost();
      if (!host) return;
      if (_tc && _tc.parentNode !== host) {
        host.appendChild(_tc);
        refreshThemeCanvasResolution();
      }
      if (_vvideo && _vvideo.parentNode !== host) {
        host.appendChild(_vvideo);
        if (!_vpaused) tryPlayVideo(false);
      }
      if (_cursorCanvas && _cursorCanvas.parentNode !== host) {
        host.appendChild(_cursorCanvas);
        ensureCursorCanvas();
      }
    }, 5000);
  }

  
