// src/locales/index.ts
  var locales = { en: en_default, zh: zh_default };
  var LOCALE_KEY = "locale";
  function getSavedLocale() {
    var saved = getLocal(LOCALE_KEY, "");
    if (saved === "zh" || saved === "en") return saved;
    try {
      if (typeof navigator !== "undefined" && /^zh/i.test(navigator.language || "")) return "zh";
    } catch (e) {
    }
    return "en";
  }
  function setSavedLocale(locale) {
    if (locale === "zh" || locale === "en") setLocal(LOCALE_KEY, locale);
  }
  function lteT(key) {
    var locale = getSavedLocale();
    var strings = locales[locale] || en_default;
    var text = strings[key];
    if (text == null) text = en_default[key];
    return text == null ? key : text;
  }
  function notifyUser(key, status) {
    var message = lteT(key);
    try {
      if (_lteHostApi && _lteHostApi.actions && typeof _lteHostApi.actions.toast === "function") {
        _lteHostApi.actions.toast({ title: message, status: status || "warning", duration: 3500, isClosable: true });
        return;
      }
    } catch (e) {
    }
    try {
      var el = document.createElement("div");
      el.textContent = message;
      el.style.cssText = "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:2147483647;max-width:70vw;padding:10px 16px;border-radius:8px;background:rgba(20,24,34,0.95);color:#fff;font-size:13px;border:1px solid rgba(255,255,255,0.15);box-shadow:0 8px 24px rgba(0,0,0,0.35);pointer-events:none;";
      document.body.appendChild(el);
      setTimeout(function() {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 4000);
      return;
    } catch (e) {
    }
    try {
      console.warn("[LTE] " + message);
    } catch (e) {
    }
  }
  function syncHomeWidgetTitles(host) {
    if (!host || !host.actions || typeof host.actions.setHomeWidgetTitle !== "function") return;
    if (getLocal("home_show_city_weather", true)) host.actions.setHomeWidgetTitle(lteT("homeCityTitle"), "city-weather");
    if (getLocal("home_show_theme_enhancer", true)) host.actions.setHomeWidgetTitle(lteT("homeThemeTitle"), "theme-enhancer");
    if (getLocal("home_show_mouse_effects", true)) host.actions.setHomeWidgetTitle(lteT("homeMouseTitle"), "mouse-effects");
    if (getLocal("home_show_click_effects", true)) host.actions.setHomeWidgetTitle(lteT("homeClickTitle"), "click-effects");
    if (getLocal("home_show_titlebar", true)) host.actions.setHomeWidgetTitle(lteT("homeTitlebarTitle"), "titlebar");
  }
  function useLocale(host) {
    const [locale] = host.state.useExtensionState("locale", getSavedLocale());
    const strings = locales[locale] || en_default;
    return function(key) {
      var _a, _b;
      return (_b = (_a = strings[key]) != null ? _a : en_default[key]) != null ? _b : key;
    };
  }

  
