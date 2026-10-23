// src/pages/settings-page.ts
  function wmoLocaleKey2(type) {
    const m = {
      clear: "wmoClear",
      cloudy: "wmoCloudy",
      rain: "wmoRain",
      snow: "wmoSnow",
      thunder: "wmoThunder",
      fog: "wmoFog",
      windy: "wmoClear"
    };
    return m[type] || "wmoClear";
  }
  function fxLocaleKey2(v) {
    const m = {
      rain: "effectRain",
      ripples: "effectRipples",
      keyboard_glow: "effectKeyboardGlow",
      snow: "effectSnow",
      sand: "effectSandstorm",
      stars: "effectStarrySky",
      aurora: "effectAurora",
      leaves: "effectFallingLeaves",
      sakura: "effectSakura",
      fireflies: "effectFireflies",
      dna: "effectDna",
      ghost: "effectGhost",
      water: "effectUnderwater",
      fire: "effectFire",
      sunset: "effectSunset",
      mc: "effectMinecraft",
      enchanting: "effectEnchanting",
      code: "effectCode",
      blank: "effectBlank",
      dust: "effectDust",
      freeze: "effectFreeze",
      sculk: "effectSculk"
    };
    return m[v] || "effectRain";
  }
  function createSettingsPage(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const { useState, useEffect } = React;
    const el = React.createElement;
    const { Box, VStack, HStack, Text, Badge, Switch, Button } = api.ChakraUI;
    function settingsWeatherPalette(type) {
      const map = {
        clear: ["#ffb52e", "#ffd76a", "#ff8a3d"],
        cloudy: ["#65768d", "#93a5b7", "#c4cfda"],
        rain: ["#315da8", "#5d9bdf", "#b4d8ff"],
        snow: ["#9ebfe4", "#c7e2ff", "#f2fbff"],
        thunder: ["#542d7e", "#8d5ac8", "#d39cff"],
        fog: ["#69727c", "#9ba4ad", "#d1d7dc"],
        wind: ["#3d7d99", "#69bbd2", "#c0f1f7"]
      };
      return map[type] || map.clear;
    }
    function useVidState() {
      const [s, setS] = useState({
        active: window._vactive || false,
        paused: window._vpaused || false,
        vol: window._vvol == null ? 0.5 : window._vvol
      });
      useEffect(function() {
        const id = setInterval(function() {
          setS({
            active: window._vactive || false,
            paused: window._vpaused || false,
            vol: window._vvol == null ? 0.5 : window._vvol
          });
        }, 150);
        return function() {
          clearInterval(id);
        };
      }, []);
      return s;
    }
    return function SettingsPage() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const vs = useVidState();
      const [locale, setLocale] = es("locale", getSavedLocale());
      const t = useLocale(host);
      const [city, setCity] = es("cw_city", "");
      const [wInfo, setWInfo] = es("cw_wi", null);
      const [ambientEnabled, setAmbientEnabled] = es("cw_ambient_enabled", true);
      const [input, setInput] = useState(city || "");
      const [loading, setLoading] = useState(false);
      const [tType, setTType] = useState(window._tt || "rain");
      const [tInt, setTInt] = useState(window._ti || 50);
      const [tRunning, setTRunning] = useState(Boolean(window._trun));
      const [themeOpen, setThemeOpen] = useState(false);
      const [perfMode, setPerfModeState] = useState(getPerfMode());
      const [perfOpen, setPerfOpen] = useState(false);
      const [showCityWidget, setShowCityWidget] = useState(getLocal("home_show_city_weather", true));
      const [showThemeWidget, setShowThemeWidget] = useState(getLocal("home_show_theme_enhancer", true));
      const [showMouseWidget, setShowMouseWidget] = useState(getLocal("home_show_mouse_effects", true));
      const [homeWidgetsDirty, setHomeWidgetsDirty] = useState(false);
      const visibleHomeWidgetCount = Number(showCityWidget) + Number(showThemeWidget) + Number(showMouseWidget);
      const selectedTheme = getThemeOption(tType);
      const themeAccent = selectedTheme.colors[1];
      const themeGradient = "linear-gradient(90deg, " + selectedTheme.colors[0] + ", " + selectedTheme.colors[1] + ", " + selectedTheme.colors[2] + ", " + selectedTheme.colors[0] + ")";
      const perfOption = getPerfOption(perfMode);
      const previousThemeLine = useCrossfadeGradient(React, themeGradient);
      const weatherType = wInfo ? mapWMO(wInfo.code) : "clear";
      const weatherColors = settingsWeatherPalette(weatherType);
      const weatherAccent = weatherColors[1];
      const weatherGradient = "linear-gradient(90deg, " + weatherColors[0] + ", " + weatherColors[1] + ", " + weatherColors[2] + ", " + weatherColors[0] + ")";
      const previousWeatherLine = useCrossfadeGradient(React, weatherGradient);
      const videoAccent = "#69e39a";
      const videoGradient = "linear-gradient(90deg, #51c79a, #8af0c0, #d9fff0, #51c79a)";
      const homeWidgetAccent = "#8c6cff";
      const homeWidgetGradient = "linear-gradient(90deg, #52e2ff, #8c6cff, #ff6fc8, #52e2ff)";
      function renderAccentLine(gradient, previous, paused) {
        return el(
          Box,
          { className: "lte-card-accent-shell " + (paused ? "is-paused" : "") },
          previous ? el(Box, {
            key: previous,
            className: "lte-card-line-layer is-previous"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: previous }
          })) : null,
          el(Box, {
            key: gradient,
            className: "lte-card-line-layer is-current"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: gradient }
          }))
        );
      }
      function sectionHeader(accent, initials, title, status, control) {
        return el(
          HStack,
          { justify: "space-between", align: "center", spacing: 3 },
          el(
            HStack,
            { spacing: 2, align: "center" },
            el(
              Box,
              {
                w: "28px",
                h: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "md",
                bg: accent + "2b",
                color: accent,
                fontSize: "10px",
                fontWeight: "bold",
                border: "1px solid " + accent + "55"
              },
              initials
            ),
            el(Text, { fontSize: "sm", fontWeight: "bold", color: "gray.100" }, title)
          ),
          el(
            HStack,
            { spacing: 2, align: "center" },
            status ? el(Badge, { colorScheme: status.color, variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, status.text) : null,
            control || null
          )
        );
      }
      function localeButton(code, label) {
        const active = locale === code;
        const accent = code === "zh" ? "#ff9ec4" : "#6fb8ff";
        return el(
          Box,
          {
            as: "button",
            type: "button",
            className: "lte-mouse-selector lte-card-selector",
            px: 3,
            py: 1.5,
            borderRadius: "full",
            bg: active ? accent + "2b" : "rgba(255,255,255,0.035)",
            border: "1px solid " + (active ? accent + "88" : "rgba(255,255,255,0.08)"),
            color: active ? "white" : "gray.400",
            fontWeight: active ? "semibold" : "normal",
            onClick: function() {
              setLocale(code);
              setSavedLocale(code);
              syncHomeWidgetTitles(host);
            },
            style: {
              "--card-accent": accent,
              "--card-glow": accent + "2e"
            }
          },
          label
        );
      }
      function updateHomeWidgetSetting(setter, value) {
        setter(value);
        setHomeWidgetsDirty(true);
      }
      function applyHomeWidgetVisibility() {
        setLocal("home_show_city_weather", showCityWidget);
        setLocal("home_show_theme_enhancer", showThemeWidget);
        setLocal("home_show_mouse_effects", showMouseWidget);
        setHomeWidgetsDirty(false);
        if (host.actions && typeof host.actions.reloadSelf === "function") {
          host.actions.reloadSelf();
        }
      }
      function homeWidgetRow(accent, initials, title, checked, onChange) {
        return el(
          HStack,
          {
            justify: "space-between",
            align: "center",
            spacing: 3,
            p: 2,
            borderRadius: "lg",
            bg: "rgba(255,255,255,0.035)",
            border: "1px solid " + accent + (checked ? "48" : "1f")
          },
          el(
            HStack,
            { spacing: 2, align: "center" },
            el(
              Box,
              {
                w: "24px",
                h: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "md",
                bg: accent + "25",
                color: accent,
                fontSize: "9px",
                fontWeight: "bold",
                border: "1px solid " + accent + "52"
              },
              initials
            ),
            el(Text, { fontSize: "sm", color: checked ? "gray.100" : "gray.400", fontWeight: "semibold" }, title)
          ),
          el(Switch, {
            isChecked: checked,
            colorScheme: "blue",
            size: "sm",
            onChange: function() {
              onChange();
            },
            "aria-label": title
          })
        );
      }
      useEffect(function() {
        const id = setInterval(function() {
          setTRunning(Boolean(window._trun));
          const nextType = window._tt || "rain";
          const nextInt = window._ti || 50;
          setTType(function(previous) {
            return previous === nextType ? previous : nextType;
          });
          setTInt(function(previous) {
            return previous === nextInt ? previous : nextInt;
          });
        }, 250);
        return function() {
          clearInterval(id);
        };
      }, []);
      function searchCitySetting() {
        var v = input.trim();
        if (!v) return;
        setLoading(true);
        setWInfo(null);
        setCity(v);
        try {
          localStorage.setItem("lte-cw_city", JSON.stringify(v));
        } catch (e) {
        }
        getCityWeather(v, function(d) {
          setLoading(false);
          if (d) {
            setWInfo(d);
            var weaType = mapWMO(d.code), inten = mapWMOIntensity(d.code);
          }
        });
      }
      function changeThemeType(v) {
        setTType(v);
        window._tt = v;
        _tt = v;
        if (v === "blank") {
          stopThemeEffects();
          setTRunning(false);
        } else if (window._trun) {
          updateThemeEffects(v);
          setTRunning(true);
        }
        persistThemePreferences();
      }
      function changeThemeInt(v) {
        var n = parseInt(v);
        setTInt(n);
        window._ti = n;
        _ti = n;
        if (window._trun) updateThemeEffects(null, n);
        persistThemePreferences();
      }
      function changePerfMode(mode) {
        setPerfModeState(mode);
        applyPerformanceMode(mode);
        setPerfOpen(false);
      }
      function toggleTheme() {
        if (tRunning) {
          stopThemeEffects();
          setTRunning(false);
        } else {
          if (tType === "blank") return;
          startThemeEffects(tType, tInt);
          setTRunning(Boolean(window._trun));
        }
      }
      return el(
        Box,
        {
          p: { base: 4, md: 6 },
          borderRadius: "2xl",
          bg: "rgba(8,12,24,0.95)",
          backdropFilter: "blur(4px)",
          border: "1px solid rgba(255,255,255,0.08)",
          maxW: "1120px",
          w: "100%",
          mx: "auto"
        },
        el(
          VStack,
          { spacing: 4, align: "stretch" },
          el(
            HStack,
            { justify: "space-between", align: "center", spacing: 3 },
            el(
              VStack,
              { spacing: 1, align: "flex-start" },
              el(Text, { fontSize: "lg", fontWeight: "bold", color: "white" }, t("themeEnhancer")),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("themeEnhancerDesc"))
            ),
            el(Badge, { colorScheme: "purple", variant: "subtle", borderRadius: "full", fontSize: "xs", px: 3 }, "v" + __LTE_VERSION__)
          ),
          // ===== Language Selector =====
          el(
            Box,
            { p: 2.5, borderRadius: "xl", bg: "rgba(255,255,255,0.035)", border: "1px solid rgba(255,255,255,0.07)" },
            el(
              HStack,
              { spacing: 3, align: "center", justify: "space-between", flexWrap: "wrap" },
              el(Text, { fontSize: "sm", color: "gray.300", fontWeight: "600" }, "Language / 语言"),
              el(
                HStack,
                { spacing: 2, flexWrap: "wrap" },
                localeButton("en", "English"),
                localeButton("zh", "中文")
              )
            )
          ),
          // ===== Section: Home Widget Visibility =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + homeWidgetAccent + "3d",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": homeWidgetAccent }
            },
            renderAccentLine(homeWidgetGradient, null, false),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                homeWidgetAccent,
                "HW",
                t("homeWidgets"),
                { color: visibleHomeWidgetCount > 0 ? "purple" : "gray", text: visibleHomeWidgetCount + " / 3" }
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("homeWidgetsHint")),
              homeWidgetRow(
                "#69bbd2",
                "CW",
                t("cityWeather"),
                showCityWidget,
                function() {
                  updateHomeWidgetSetting(setShowCityWidget, !showCityWidget);
                }
              ),
              homeWidgetRow(
                themeAccent,
                "TE",
                t("themeEnhancer"),
                showThemeWidget,
                function() {
                  updateHomeWidgetSetting(setShowThemeWidget, !showThemeWidget);
                }
              ),
              homeWidgetRow(
                "#52e2ff",
                "ME",
                t("mouseEffects"),
                showMouseWidget,
                function() {
                  updateHomeWidgetSetting(setShowMouseWidget, !showMouseWidget);
                }
              ),
              visibleHomeWidgetCount === 0 ? el(Text, { fontSize: "xs", color: "orange.300" }, t("homeWidgetsAllHidden")) : null,
              visibleHomeWidgetCount === 1 ? el(Text, { fontSize: "xs", color: "yellow.300" }, t("homeWidgetsSingleWarning")) : null,
              el(
                HStack,
                { justify: "space-between", align: "center", spacing: 3, flexWrap: "wrap" },
                homeWidgetsDirty ? el(Text, { fontSize: "xs", color: "blue.300" }, t("homeWidgetsPending")) : null,
                el(
                  Box,
                  {
                    as: "button",
                    type: "button",
                    className: "lte-mouse-selector lte-card-selector",
                    px: 3,
                    py: 1.5,
                    borderRadius: "lg",
                    bg: homeWidgetsDirty ? homeWidgetAccent + "2b" : "rgba(255,255,255,0.035)",
                    border: "1px solid " + (homeWidgetsDirty ? homeWidgetAccent + "88" : "rgba(255,255,255,0.08)"),
                    color: homeWidgetsDirty ? "white" : "gray.500",
                    cursor: homeWidgetsDirty ? "pointer" : "default",
                    disabled: !homeWidgetsDirty,
                    fontSize: "xs",
                    fontWeight: "semibold",
                    onClick: applyHomeWidgetVisibility,
                    style: {
                      "--card-accent": homeWidgetAccent,
                      "--card-glow": homeWidgetAccent + "2e"
                    }
                  },
                  t("homeWidgetsApply")
                )
              )
            )
          ),
          // ===== Section: City Weather =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + weatherAccent + "38",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": weatherAccent }
            },
            renderAccentLine(weatherGradient, previousWeatherLine, !(wInfo && ambientEnabled)),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                weatherAccent,
                "CW",
                t("cityWeather"),
                { color: wInfo && ambientEnabled ? "green" : "gray", text: wInfo && ambientEnabled ? t("on") : t("off") },
                el(Switch, {
                  isChecked: Boolean(ambientEnabled),
                  colorScheme: "blue",
                  size: "sm",
                  isDisabled: !wInfo,
                  onChange: function() {
                    setAmbientEnabled(!ambientEnabled);
                  },
                  "aria-label": t("dynamicAmbience")
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("ambienceHint")),
              el(
                HStack,
                { spacing: 2 },
                el("input", {
                  placeholder: t("typeCityName"),
                  value: input,
                  onInput: function(e) {
                    setInput(e.target.value);
                  },
                  onKeyDown: function(e) {
                    if (e.key === "Enter") searchCitySetting();
                  },
                  style: {
                    flex: 1,
                    minWidth: 0,
                    padding: "8px 12px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.07)",
                    color: "#e2e8f0",
                    border: "1px solid " + weatherAccent + "55",
                    fontSize: "14px",
                    outline: "none"
                  }
                }),
                el(
                  Box,
                  {
                    as: "button",
                    type: "button",
                    className: "lte-mouse-selector lte-card-selector",
                    onClick: searchCitySetting,
                    disabled: !input.trim() || loading,
                    style: {
                      width: "42px",
                      height: "36px",
                      borderRadius: "10px",
                      background: weatherAccent + "22",
                      border: "1px solid " + weatherAccent + "66",
                      color: weatherAccent,
                      cursor: !input.trim() || loading ? "default" : "pointer",
                      opacity: !input.trim() || loading ? 0.55 : 1,
                      "--card-accent": weatherAccent,
                      "--card-glow": weatherAccent + "2e"
                    }
                  },
                  loading ? "..." : "🔍"
                )
              ),
              wInfo ? el(
                HStack,
                {
                  spacing: { base: 2, md: 5 },
                  align: "center",
                  p: 2.5,
                  borderRadius: "lg",
                  bg: "rgba(255,255,255,0.035)",
                  border: "1px solid " + weatherAccent + (ambientEnabled ? "42" : "22"),
                  flexWrap: "wrap"
                },
                el(
                  VStack,
                  { spacing: 0, align: "flex-start" },
                  el(Text, { fontSize: "xs", color: "gray.400", fontWeight: "600" }, city || ""),
                  el(Text, {
                    fontSize: "2xl",
                    fontWeight: "bold",
                    lineHeight: "1.15",
                    color: weatherAccent,
                    textShadow: ambientEnabled ? "0 0 10px " + weatherAccent + "55" : "none",
                    transition: "text-shadow 180ms ease"
                  }, wInfo.temp + "°C")
                ),
                el(
                  HStack,
                  { spacing: 4, flexWrap: "wrap" },
                  el(Text, { fontSize: "xs", color: "gray.400" }, "💧 " + t("humidity") + ": " + wInfo.humi + "%"),
                  el(Text, { fontSize: "xs", color: "gray.400" }, "💨 " + t("wind") + ": " + wInfo.wind + " km/h"),
                  wInfo.feels ? el(Text, { fontSize: "xs", color: "gray.400" }, "🌡 " + t("feels") + ": " + wInfo.feels + "°C") : null,
                  el(Text, { fontSize: "xs", color: weatherAccent }, "☁ " + t(wmoLocaleKey2(weatherType)) + " · Code " + wInfo.code)
                )
              ) : el(
                Text,
                { fontSize: "sm", color: "gray.500", py: 2 },
                city ? t("loading") : t("searchCity")
              )
            )
          ),
          // ===== Section: Video Background =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + videoAccent + "32",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": videoAccent }
            },
            renderAccentLine(videoGradient, null, false),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                videoAccent,
                "VB",
                t("videoBackground"),
                { color: vs.active ? "green" : "gray", text: vs.active ? t("video") : t("off") }
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("videoLayer")),
              vs.active ? el(
                VStack,
                { spacing: 2, align: "stretch" },
                el(
                  HStack,
                  { spacing: 2 },
                  el(Button, {
                    size: "xs",
                    colorScheme: "blue",
                    flex: 1,
                    borderRadius: "9px",
                    onClick: function() {
                      if (window._vpaused) videoPlay();
                      else videoPause();
                    }
                  }, vs.paused ? "▶" : "⏸"),
                  el(Button, { size: "xs", colorScheme: "green", flex: 1, borderRadius: "9px", onClick: pickVideoFile }, t("change")),
                  el(Button, { size: "xs", colorScheme: "red", flex: 1, borderRadius: "9px", onClick: videoKill }, t("remove"))
                ),
                el(
                  HStack,
                  { spacing: 2, align: "center" },
                  el(Text, { fontSize: "xs", color: "gray.400", minW: "92px" }, t("volume") + " " + Math.round(vs.vol * 100) + "%"),
                  el("input", {
                    type: "range",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    defaultValue: vs.vol,
                    onChange: function(e) {
                      videoVolume(parseFloat(e.target.value));
                    },
                    className: "lte-mouse-slider lte-card-slider",
                    style: { flex: 1, "--mouse-accent": videoAccent, "--card-accent": videoAccent }
                  })
                )
              ) : el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  px: 3,
                  py: 2,
                  borderRadius: "lg",
                  bg: "rgba(105,227,154,0.08)",
                  border: "1px solid " + videoAccent + "4d",
                  onClick: pickVideoFile,
                  style: {
                    "--card-accent": videoAccent,
                    "--card-glow": videoAccent + "26"
                  }
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center", spacing: 3 },
                  el(
                    HStack,
                    { spacing: 2, align: "center" },
                    el(Text, { fontSize: "lg" }, "📁"),
                    el(Text, { fontSize: "sm", fontWeight: "semibold", color: "gray.200" }, t("selectVideo"))
                  ),
                  el(Text, { fontSize: "xs", color: "gray.500" }, "MP4 / WebM / OGG")
                )
              )
            )
          ),
          // ===== Section: Theme Particle Effects =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + themeAccent + "42",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": themeAccent }
            },
            renderAccentLine(themeGradient, previousThemeLine, !tRunning),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                themeAccent,
                "TP",
                t("themeParticles"),
                { color: tRunning ? "green" : "gray", text: tRunning ? t("running") : t("stopped") },
                el(Switch, {
                  isChecked: tRunning,
                  colorScheme: "blue",
                  size: "sm",
                  isDisabled: tType === "blank",
                  onChange: toggleTheme,
                  "aria-label": t("themeParticles")
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("themeSwitchHint")),
              el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  p: 2.5,
                  borderRadius: "xl",
                  bg: "rgba(255,255,255,0.045)",
                  border: "1px solid " + themeAccent + "66",
                  textAlign: "left",
                  color: "white",
                  onClick: function() {
                    setThemeOpen(!themeOpen);
                  },
                  "aria-expanded": themeOpen,
                  style: {
                    "--card-accent": themeAccent,
                    "--card-glow": themeAccent + "2e"
                  }
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(fxLocaleKey2(tType))),
                  el(Text, { className: "lte-mouse-chevron lte-card-chevron " + (themeOpen ? "is-open" : ""), fontSize: "sm", color: "gray.400" }, "⌄")
                )
              ),
              themeOpen ? el(
                VStack,
                { className: "lte-mouse-options lte-card-options", spacing: 1, align: "stretch", mt: 1 },
                THEME_OPTIONS.map(function(option) {
                  const active = option.v === tType;
                  return el(
                    Box,
                    {
                      as: "button",
                      key: option.v,
                      type: "button",
                      className: "lte-mouse-option lte-card-option",
                      w: "100%",
                      p: 2,
                      borderRadius: "lg",
                      border: "1px solid " + (active ? option.colors[1] + "88" : "transparent"),
                      bg: active ? option.colors[1] + "18" : "transparent",
                      color: active ? "white" : "gray.300",
                      textAlign: "left",
                      onClick: function() {
                        changeThemeType(option.v);
                        setThemeOpen(false);
                      }
                    },
                    el(
                      HStack,
                      { justify: "space-between", align: "center" },
                      el(Text, { fontSize: "sm" }, t(fxLocaleKey2(option.v))),
                      active ? el(Text, { fontSize: "sm", color: option.colors[1] }, "✓") : null
                    )
                  );
                })
              ) : null,
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "xs", color: "gray.400", minW: "44px" }, t("intensity")),
                el("input", {
                  type: "range",
                  min: 10,
                  max: 100,
                  step: 5,
                  value: tInt,
                  onChange: function(e) {
                    changeThemeInt(e.target.value);
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { flex: 1, "--mouse-accent": themeAccent, "--card-accent": themeAccent }
                }),
                el(Text, { fontSize: "xs", color: themeAccent, minW: "34px", textAlign: "right" }, tInt + "%")
              )
            )
          ),
          // ===== Section: Performance =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "lg",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + themeAccent + "42",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": themeAccent }
            },
            renderAccentLine(themeGradient, null, false),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                themeAccent,
                "PF",
                t("performanceMode"),
                { color: "blue", text: t(perfOption.labelKey) },
                null
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("perfModeHint")),
              el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  p: 2.5,
                  borderRadius: "xl",
                  bg: "rgba(255,255,255,0.045)",
                  border: "1px solid " + themeAccent + "66",
                  textAlign: "left",
                  color: "white",
                  onClick: function() {
                    setPerfOpen(!perfOpen);
                  },
                  "aria-expanded": perfOpen,
                  style: {
                    "--card-accent": themeAccent,
                    "--card-glow": themeAccent + "2e"
                  }
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(perfOption.labelKey)),
                  el(Text, { className: "lte-mouse-chevron lte-card-chevron " + (perfOpen ? "is-open" : ""), fontSize: "sm", color: "gray.400" }, "⌄")
                )
              ),
              perfOpen ? el(
                VStack,
                { className: "lte-mouse-options lte-card-options", spacing: 1, align: "stretch", mt: 1 },
                PERF_OPTIONS.map(function(option) {
                  const active = option.id === perfMode;
                  return el(
                    Box,
                    {
                      as: "button",
                      key: option.id,
                      type: "button",
                      className: "lte-mouse-option lte-card-option",
                      w: "100%",
                      p: 2,
                      borderRadius: "lg",
                      border: "1px solid " + (active ? option.colors[1] + "88" : "transparent"),
                      bg: active ? option.colors[1] + "18" : "transparent",
                      color: active ? "white" : "gray.300",
                      textAlign: "left",
                      onClick: function() {
                        changePerfMode(option.id);
                      }
                    },
                    el(
                      HStack,
                      { justify: "space-between", align: "center", mb: 1 },
                      el(Text, { fontSize: "sm" }, t(option.labelKey)),
                      active ? el(Text, { fontSize: "sm", color: option.colors[1] }, "✓") : null
                    ),
                    el(
                      Text,
                      { fontSize: "xs", color: "gray.500", lineHeight: 1.5 },
                      t(option.descriptionKey)
                    )
                  );
                })
              ) : null
            )
          ),
          // ===== Section: Help =====
          el(
            Box,
            { p: 3, borderRadius: "lg", bg: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" },
            el(
              VStack,
              { spacing: 1, align: "stretch" },
              el(Text, { fontSize: "xs", color: "gray.500" }, t("version") + " " + __LTE_VERSION__),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("author") + ": hemekewayoshino"),
              el(Box, { h: "1px", bg: "rgba(255,255,255,0.06)", my: 1 }),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("layerOrder")),
              el(
                Text,
                {
                  fontSize: "xs",
                  color: "blue.300",
                  cursor: "pointer",
                  onClick: function() {
                    if (host.actions && typeof host.actions.openExternalLink === "function") {
                      host.actions.openExternalLink("https://open-meteo.com/");
                    }
                  }
                },
                t("weatherAttribution")
              )
            )
          )
        )
      );
    };
  }

  