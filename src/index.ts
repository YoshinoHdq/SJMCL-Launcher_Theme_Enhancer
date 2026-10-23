// src/index.ts
  function getToken() {
    var _a, _b, _c;
    let t = ((_b = (_a = document.currentScript) == null ? void 0 : _a.dataset) == null ? void 0 : _b.extensionToken) || "";
    if (t) return t;
    const scripts = document.querySelectorAll("script");
    for (let i = 0; i < scripts.length; i++) {
      const tok = (_c = scripts[i].dataset) == null ? void 0 : _c.extensionToken;
      if (tok) return tok;
    }
    return "";
  }
  var TOKEN = getToken();
  if (typeof window.registerExtension !== "function") {
    throw new Error("SJMCL host is unavailable");
  }
  window.registerExtension(function(api) {
    _lteHostApi = api.getHostContext();
    setSavedLocale(getSavedLocale());
    installPerformanceRuntime();
    try {
      const u = api.resolveAssetUrl("assets/galactic.ttf");
      const f = new FontFace("GalacticSGA", "url(" + u + ")");
      f.load().then(function() {
        document.fonts.add(f);
      }).catch(function() {
      });
    } catch (e) {
    }
    try {
      const u = api.resolveAssetUrl("assets/Minecraft.ttf");
      const f = new FontFace("MinecraftPixel", "url(" + u + ")");
      f.load().then(function() {
        document.fonts.add(f);
      }).catch(function() {
      });
    } catch (e) {
    }
    window._ltePI = {};
    function lp(key, path) {
      var i2 = new Image();
      i2.src = api.resolveAssetUrl(path);
      window._ltePI[key] = i2;
    }
    lp("snow", "assets/particles/snow.png");
    lp("flame", "assets/particles/flame.png");
    for (var i = 0; i < 11; i++) lp("sculk_soul_" + i, "assets/particles/sculk/sculk_soul_" + i + ".png");
    for (var i = 0; i < 7; i++) lp("sculk_charge_" + i, "assets/particles/sculk/sculk_charge_" + i + ".png");
    for (var i = 0; i < 4; i++) lp("sculk_charge_pop_" + i, "assets/particles/sculk/sculk_charge_pop_" + i + ".png");
    syncThemeGlobals();
    restoreCursorEffects();
    if (!isStandaloneWindow()) {
      window.setTimeout(function() {
        syncThemeGlobals();
        if (getLocal("th_enabled", false)) startThemeEffects(_tt, _ti);
        restoreVideoBackground();
      }, 0);
    }
    const homeWidgets = [];
    if (getLocal("home_show_city_weather", true)) {
      homeWidgets.push({
        key: "city-weather",
        title: lteT("homeCityTitle"),
        description: lteT("homeCityDesc"),
        icon: "cloud-sun",
        Component: createCityWeatherWidget(api)
      });
    }
    if (getLocal("home_show_theme_enhancer", true)) {
      homeWidgets.push({
        key: "theme-enhancer",
        title: lteT("homeThemeTitle"),
        description: lteT("homeThemeDesc"),
        icon: "palette",
        Component: createThemeEnhancerWidget(api)
      });
    }
    if (getLocal("home_show_mouse_effects", true)) {
      homeWidgets.push({
        key: "mouse-effects",
        title: lteT("homeMouseTitle"),
        description: lteT("homeMouseDesc"),
        icon: "mouse-pointer",
        defaultWidth: 320,
        minWidth: 260,
        Component: createMouseEffectsWidget(api)
      });
    }
    const videoWarningComponent = createVideoSizeWarningModal(api);
    return {
      homeWidgets,
      settingsPage: {
        Component: createSettingsPage(api)
      },
      customModals: [
        {
          key: "video-size-warning-zh",
          title: zh_default.videoLargeTitle,
          size: "md",
          isCentered: true,
          onClose: cancelPendingVideo,
          Component: videoWarningComponent
        },
        {
          key: "video-size-warning-en",
          title: en_default.videoLargeTitle,
          size: "md",
          isCentered: true,
          onClose: cancelPendingVideo,
          Component: videoWarningComponent
        }
      ],
      dispose: function() {
        stopThemeEffects(true);
        stopCursorEffects(true);
        removeKeyboardGlowListener();
        clearVideoElement();
        _vactive = false;
        if (_videoRestoreTimer) {
          window.clearTimeout(_videoRestoreTimer);
          _videoRestoreTimer = null;
        }
        if (_bgWatchTimer) {
          window.clearInterval(_bgWatchTimer);
          _bgWatchTimer = null;
        }
        if (_visibilityHandler) {
          document.removeEventListener("visibilitychange", _visibilityHandler);
          _visibilityHandler = null;
        }
        removeBackgroundHost();
      }
    };
  }, TOKEN);