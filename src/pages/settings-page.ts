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
      melody_orbit: "effectMelodyOrbit",
      key_nocturne: "effectKeyNocturne",
      shattered_glass: "effectShatteredGlass",
      quantum_cloud: "effectQuantumCloud",
      film_reel: "effectFilmReel",
      waveform_ribbon: "effectWaveformRibbon",
      clock_rim: "effectClockRim",
      meshing_gears: "effectMeshingGears",
      signal_glitch: "effectSignalGlitch",
      chat_bubbles: "effectChatBubbles",
      magnetic_field: "effectMagneticField",
      spider_web: "effectSpiderWeb",
      lightning: "effectLightning",
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
        vol: window._vvol == null ? 0.5 : window._vvol,
        enabled: window._venabled !== false,
        loop: window._vloop !== false,
        name: getLocal("v_name", ""),
        size: getLocal("v_size", 0),
        duration: getLocal("v_duration", 0)
      });
      useEffect(function() {
        const id = setInterval(function() {
          if (document.hidden) return;
          setS({
            active: window._vactive || false,
            paused: window._vpaused || false,
            vol: window._vvol == null ? 0.5 : window._vvol,
            enabled: window._venabled !== false,
            loop: window._vloop !== false,
            name: getLocal("v_name", ""),
            size: getLocal("v_size", 0),
            duration: getLocal("v_duration", 0)
          });
        }, 400);
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
      const [clickEnabled, setClickEnabled] = useState(Boolean(_clickEnabled));
      const [clickType, setClickType] = useState(_clickEffectType);
      const [clickInt, setClickInt] = useState(_clickIntensity);
      const [clickOpen, setClickOpen] = useState(false);
      const [confirmRemoveVideo, setConfirmRemoveVideo] = useState(false);
      const [reduceMotion, setReduceMotion] = useState(Boolean(getLocal("reduce_motion", false)));
      const [titlebarState, setTitlebarState] = useState(Object.assign({ enabled: false, supported: false, conflict: false, zone: 20, delay: 180 }, window._lteTitlebar || {}));
      useEffect(function() {
        const id = setInterval(function() {
          setTitlebarState(Object.assign({ enabled: false, supported: false, conflict: false, zone: 20, delay: 180 }, window._lteTitlebar || {}));
        }, 500);
        return function() {
          clearInterval(id);
        };
      }, []);
      const [updateStatus, setUpdateStatus] = useState("idle");
      const [latestUpdate, setLatestUpdate] = useState(null);
      const [updateError, setUpdateError] = useState("");
      const [lastUpdateCheck, setLastUpdateCheck] = useState(0);
      const [showCityWidget, setShowCityWidget] = useState(getLocal("home_show_city_weather", true));
      const [showThemeWidget, setShowThemeWidget] = useState(getLocal("home_show_theme_enhancer", true));
      const [showMouseWidget, setShowMouseWidget] = useState(getLocal("home_show_mouse_effects", true));
      const [showClickWidget, setShowClickWidget] = useState(getLocal("home_show_click_effects", true));
      const [showTitlebarWidget, setShowTitlebarWidget] = useState(getLocal("home_show_titlebar", true));
      const [homeWidgetsDirty, setHomeWidgetsDirty] = useState(false);
      const visibleHomeWidgetCount = Number(showCityWidget) + Number(showThemeWidget) + Number(showMouseWidget) + Number(showClickWidget) + Number(showTitlebarWidget);
      const selectedTheme = getThemeOption(tType);
      const themeAccent = selectedTheme.colors[1];
      const themeGradient = "linear-gradient(90deg, " + selectedTheme.colors[0] + ", " + selectedTheme.colors[1] + ", " + selectedTheme.colors[2] + ", " + selectedTheme.colors[0] + ")";
      const perfOption = getPerfOption(perfMode);
      const previousThemeLine = useCrossfadeGradient(React, themeGradient);
      const selectedClick = getClickEffectOption(clickType);
      const clickAccent = selectedClick.colors[1];
      const clickGradient = "linear-gradient(90deg, " + selectedClick.colors[0] + ", " + selectedClick.colors[1] + ", " + selectedClick.colors[2] + ", " + selectedClick.colors[0] + ")";
      const previousClickLine = useCrossfadeGradient(React, clickGradient);
      function toggleClickEffects() {
        const next = !clickEnabled;
        setClickEnabled(next);
        if (next) startClickEffects();
        else stopClickEffects(false);
      }
      function changeClickType(nextType) {
        setClickType(nextType);
        setClickEffectType(nextType);
        setClickOpen(false);
      }
      function changeClickInt(value) {
        const next = parseInt(value, 10);
        setClickInt(next);
        setClickIntensity(next);
      }
      function handleRemoveVideo() {
        if (!confirmRemoveVideo) {
          setConfirmRemoveVideo(true);
          setTimeout(function() {
            setConfirmRemoveVideo(false);
          }, 3000);
          return;
        }
        setConfirmRemoveVideo(false);
        videoKill();
      }
      function videoMetaText(duration, size) {
        var parts = [];
        if (isFinite(duration) && duration > 0) {
          var seconds = Math.floor(duration % 60);
          var minutes = Math.floor(duration / 60);
          parts.push(minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
        }
        if (size > 0) parts.push(formatVideoSize(size));
        return parts.join(" · ");
      }
      function compareLteVersions(a, b) {
        var pa = String(a).split("-")[0].split(".").map(Number);
        var pb = String(b).split("-")[0].split(".").map(Number);
        for (var i = 0; i < 3; i++) {
          var x = pa[i] || 0;
          var y = pb[i] || 0;
          if (x !== y) return x > y ? 1 : -1;
        }
        return 0;
      }
      function updateErrorMessage(error) {
        var message = String(error && error.message ? error.message : error);
        if (/timeout/i.test(message)) return t("updateErrorTimeout");
        if (/HTTP 403|rate limit|API rate/i.test(message)) return t("updateErrorRate");
        if (/HTTP 404/i.test(message)) return t("updateErrorNotFound");
        if (/fetch|network|ECONN|ENOTFOUND/i.test(message)) return t("updateErrorNetwork");
        return message;
      }
      async function checkUpdates() {
        if (updateStatus !== "error" && lastUpdateCheck > 0 && Date.now() - lastUpdateCheck < 300000) {
          return;
        }
        setUpdateStatus("checking");
        setUpdateError("");
        try {
          var host = api.getHostContext();
          var url = "https://api.github.com/repos/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/releases/latest";
          var init = { headers: { Accept: "application/vnd.github+json" } };
          var requestPromise = host.actions && typeof host.actions.request === "function"
            ? host.actions.request(url, init)
            : fetch(url, init);
          var timeoutPromise = new Promise(function(resolve, reject) {
            setTimeout(function() {
              reject(new Error("timeout"));
            }, 15000);
          });
          var response = await Promise.race([requestPromise, timeoutPromise]);
          if (!response || response.ok === false || (response.status && response.status >= 400)) {
            throw new Error("HTTP " + (response && response.status ? response.status : "error"));
          }
          var data = await response.json();
          var latestTag = String(data.tag_name || "").replace(/^v/i, "");
          if (!latestTag) throw new Error("missing version");
          var notes = String(data.body || "").split(/\r?\n/).filter(function(line) {
            return line.trim() && line.trim().indexOf("#") !== 0;
          }).slice(0, 3).join(" ").slice(0, 240);
          if (compareLteVersions(latestTag, __LTE_VERSION__) <= 0) {
            setLatestUpdate({ version: latestTag, url: "", page: data.html_url || "", notes: notes });
            setUpdateStatus("latest");
            setLastUpdateCheck(Date.now());
            return;
          }
          var assets = data.assets || [];
          var asset = assets.find(function(a) {
            return a && a.name && a.name.indexOf("org.yoshino.launcher-theme-enhancer-") === 0 && a.name.endsWith(".sjmclx") && a.name.indexOf("-dev") === -1;
          }) || assets.find(function(a) {
            return a && a.name && a.name.endsWith(".sjmclx");
          });
          if (!asset) throw new Error("no .sjmclx asset");
          setLatestUpdate({ version: latestTag, url: asset.browser_download_url, page: data.html_url || "", notes: notes });
          setUpdateStatus("available");
          setLastUpdateCheck(Date.now());
        } catch (error) {
          setUpdateError(updateErrorMessage(error));
          setUpdateStatus("error");
        }
      }
      async function installUpdate() {
        if (!latestUpdate || !latestUpdate.url) return;
        var host = api.getHostContext();
        if (!host.actions || typeof host.actions.updateSelf !== "function") {
          setUpdateError("updateSelf unavailable");
          setUpdateStatus("error");
          return;
        }
        setUpdateStatus("installing");
        try {
          await host.actions.updateSelf(latestUpdate.url, latestUpdate.version);
          setUpdateStatus("submitted");
        } catch (error) {
          setUpdateError(String(error && error.message ? error.message : error));
          setUpdateStatus("error");
        }
      }
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
        setLocal("home_show_click_effects", showClickWidget);
        setLocal("home_show_titlebar", showTitlebarWidget);
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
        rememberThemeUse(v);
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
                { color: visibleHomeWidgetCount > 0 ? "purple" : "gray", text: visibleHomeWidgetCount + " / 5" }
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
              homeWidgetRow(
                "#b45cff",
                "CE",
                t("clickEffects"),
                showClickWidget,
                function() {
                  updateHomeWidgetSetting(setShowClickWidget, !showClickWidget);
                }
              ),
              homeWidgetRow(
                "#8aa8ff",
                "TB",
                t("titlebar"),
                showTitlebarWidget,
                function() {
                  updateHomeWidgetSetting(setShowTitlebarWidget, !showTitlebarWidget);
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
                { color: !vs.name || !vs.enabled ? "gray" : vs.paused ? "yellow" : "green", text: !vs.name || !vs.enabled ? t("off") : vs.paused ? t("paused") : t("playing") },
                el(Switch, {
                  isChecked: Boolean(vs.name) && vs.enabled,
                  colorScheme: "green",
                  size: "sm",
                  isDisabled: !vs.name,
                  onChange: function() {
                    videoSetEnabled(!vs.enabled);
                  }
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("videoLayer")),
              vs.name ? el(
                VStack,
                { spacing: 2.5, align: "stretch" },
                el(
                  Box,
                  {
                    position: "relative",
                    borderRadius: "lg",
                    overflow: "hidden",
                    border: "1px solid " + videoAccent + "33",
                    style: { "--card-accent": videoAccent },
                    opacity: vs.enabled ? 1 : 0.72
                  },
                  el(Box, {
                    position: "absolute",
                    inset: 0,
                    className: "lte-video-strip " + (vs.enabled && !vs.paused ? "is-live" : "is-paused")
                  }),
                  el(
                    HStack,
                    { position: "relative", zIndex: 1, spacing: 2.5, align: "center", p: 2.5 },
                    el(Box, {
                      as: "button",
                      type: "button",
                      onClick: function() {
                        if (!vs.enabled) return;
                        if (window._vpaused) videoPlay();
                        else videoPause();
                      },
                      w: "38px",
                      h: "38px",
                      borderRadius: "full",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bg: videoAccent + "22",
                      border: "1px solid " + videoAccent + "66",
                      color: "white",
                      fontSize: "sm",
                      cursor: vs.enabled ? "pointer" : "default",
                      opacity: vs.enabled ? 1 : 0.45
                    }, el(
                      Box,
                      { display: "flex", alignItems: "center", justifyContent: "center" },
                      vs.enabled && !vs.paused ? el(
                        HStack,
                        { spacing: "3px", align: "center" },
                        el(Box, { w: "4px", h: "14px", borderRadius: "1px", bg: "white" }),
                        el(Box, { w: "4px", h: "14px", borderRadius: "1px", bg: "white" })
                      ) : el(Box, {
                        w: 0,
                        h: 0,
                        ml: "2px",
                        borderTop: "7px solid transparent",
                        borderBottom: "7px solid transparent",
                        borderLeft: "11px solid white"
                      })
                    )),
                    el(
                      VStack,
                      { spacing: 0, flex: 1, minW: 0 },
                      el(Text, { fontSize: "sm", fontWeight: "semibold", color: "gray.100", noOfLines: 1 }, vs.name),
                      el(Text, { fontSize: "xs", color: "gray.500" }, videoMetaText(vs.duration, vs.size))
                    ),
                    el(Text, { fontSize: "xs", color: videoAccent }, vs.loop ? "↻" : "1×")
                  )
                ),
                el(
                  HStack,
                  { spacing: 2, align: "center" },
                  el(Box, {
                    as: "button",
                    type: "button",
                    onClick: videoToggleMute,
                    w: "28px",
                    h: "24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "md",
                    bg: "transparent",
                    color: videoAccent,
                    cursor: "pointer",
                    fontSize: "sm",
                    "aria-label": "mute"
                  }, vs.vol > 0 ? "🔊" : "🔇"),
                  el("input", {
                    type: "range",
                    min: 0,
                    max: 1,
                    step: 0.01,
                    value: vs.vol,
                    onChange: function(e) {
                      videoVolume(parseFloat(e.target.value));
                    },
                    className: "lte-mouse-slider lte-card-slider",
                    style: { flex: 1, "--mouse-accent": videoAccent, "--card-accent": videoAccent }
                  }),
                  el(Text, { fontSize: "xs", color: videoAccent, minW: "34px", textAlign: "right" }, Math.round(vs.vol * 100) + "%")
                ),
                el(
                  HStack,
                  { justify: "space-between", align: "center", spacing: 2 },
                  el(
                    HStack,
                    { spacing: 2, align: "center" },
                    el(Text, { fontSize: "xs", color: "gray.400" }, t("loopVideo")),
                    el(Switch, { isChecked: vs.loop, colorScheme: "green", size: "sm", onChange: function() { videoSetLoop(!vs.loop); } })
                  ),
                  el(
                    HStack,
                    { spacing: 1 },
                    el(Button, { size: "xs", variant: "ghost", borderRadius: "md", onClick: pickVideoFile }, t("change")),
                    el(Button, {
                      size: "xs",
                      variant: "ghost",
                      colorScheme: "red",
                      borderRadius: "md",
                      onClick: handleRemoveVideo
                    }, confirmRemoveVideo ? t("confirmRemove") : t("remove"))
                  )
                )
              ) : el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  py: 4,
                  borderRadius: "xl",
                  border: "1px dashed " + videoAccent + "66",
                  bg: "rgba(105,227,154,0.035)",
                  textAlign: "center",
                  onClick: pickVideoFile,
                  style: {
                    "--card-accent": videoAccent,
                    "--card-glow": videoAccent + "26"
                  }
                },
                el(
                  VStack,
                  { spacing: 1, align: "center" },
                  el(Text, { fontSize: "lg" }, "🎞️"),
                  el(Text, { fontSize: "sm", fontWeight: "semibold", color: "gray.200" }, t("selectVideo")),
                  el(Text, { fontSize: "xs", color: "gray.500" }, t("videoUploadHint"))
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
                    if (!themeOpen) lteFocusSelectedOption(".lte-settings-theme-options");
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
                { className: "lte-mouse-options lte-card-options lte-settings-theme-options", spacing: 1, align: "stretch", mt: 1 },
                getThemeSelectorSections().map(function(section) {
                  return el(
                    Box,
                    { key: section.labelKey, w: "100%" },
                    el(Text, {
                      fontSize: "10px",
                      fontWeight: "semibold",
                      color: themeAccent,
                      opacity: 0.72,
                      px: 1,
                      pt: 1.5,
                      pb: 0.5
                    }, t(section.labelKey)),
                    el(
                      VStack,
                      { spacing: 1, align: "stretch" },
                      section.options.map(function(option) {
                        const active = option.v === tType;
                        return el(
                          Box,
                          {
                            as: "button",
                            key: option.v,
                            "data-lte-active": active ? "1" : "0",
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

          // ===== Section: Click Effects =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid " + clickAccent + "42",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": clickAccent }
            },
            renderAccentLine(clickGradient, previousClickLine, !clickEnabled),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                clickAccent,
                "CE",
                t("clickEffects"),
                { color: clickEnabled ? "green" : "gray", text: clickEnabled ? t("on") : t("off") },
                el(Switch, {
                  isChecked: clickEnabled,
                  colorScheme: "blue",
                  size: "sm",
                  onChange: toggleClickEffects,
                  "aria-label": t("clickEffects")
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t(selectedClick.descriptionKey)),
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
                  border: "1px solid " + clickAccent + "66",
                  textAlign: "left",
                  color: "white",
                  onClick: function() {
                    setClickOpen(!clickOpen);
                    if (!clickOpen) lteFocusSelectedOption(".lte-settings-click-options");
                  },
                  "aria-expanded": clickOpen,
                  style: {
                    "--card-accent": clickAccent,
                    "--card-glow": clickAccent + "2e"
                  }
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(
                    HStack,
                    { spacing: 2, align: "center" },
                    el(Text, { fontSize: "md", w: "24px", textAlign: "center" }, selectedClick.icon),
                    el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(selectedClick.labelKey))
                  ),
                  el(Text, { className: "lte-mouse-chevron lte-card-chevron " + (clickOpen ? "is-open" : ""), fontSize: "sm", color: "gray.400" }, "⌄")
                )
              ),
              clickOpen ? el(
                VStack,
                { className: "lte-mouse-options lte-card-options lte-settings-click-options", spacing: 1, align: "stretch", mt: 1 },
                CLICK_EFFECT_OPTIONS.map(function(option) {
                  const active = option.id === clickType;
                  return el(
                    Box,
                    {
                      as: "button",
                      key: option.id,
                      "data-lte-active": active ? "1" : "0",
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
                        changeClickType(option.id);
                      }
                    },
                    el(
                      HStack,
                      { justify: "space-between", align: "center" },
                      el(
                        HStack,
                        { spacing: 2, align: "center" },
                        el(Text, { w: "22px", textAlign: "center" }, option.icon),
                        el(Text, { fontSize: "sm" }, t(option.labelKey))
                      ),
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
                  value: clickInt,
                  onChange: function(e) {
                    changeClickInt(e.target.value);
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { flex: 1, "--mouse-accent": clickAccent, "--card-accent": clickAccent }
                }),
                el(Text, { fontSize: "xs", color: clickAccent, minW: "34px", textAlign: "right" }, clickInt + "%")
              )
            )
          ),

          // ===== Section: Titlebar =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid #8aa8ff42",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": "#8aa8ff" }
            },
            renderAccentLine("linear-gradient(90deg, #c6d4ff, #8aa8ff, #b7a8ff, #c6d4ff)", null, false),
            el(
              VStack,
              { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                "#8aa8ff",
                "TB",
                t("titlebar"),
                { color: !titlebarState.supported || titlebarState.conflict || !titlebarState.enabled ? "gray" : "green", text: !titlebarState.supported ? t("titlebarUnsupported") : titlebarState.conflict ? t("titlebarConflictShort") : titlebarState.enabled ? t("titlebarAuto") : t("off") },
                el(Switch, {
                  isChecked: Boolean(titlebarState.enabled) && Boolean(titlebarState.supported) && !titlebarState.conflict,
                  isDisabled: !titlebarState.supported || titlebarState.conflict,
                  colorScheme: "blue",
                  size: "sm",
                  onChange: function() {
                    titlebarSetEnabled(!titlebarState.enabled);
                  }
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("titlebarDesc")),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("titlebarHint")),
              !titlebarState.supported ? el(Text, { fontSize: "xs", color: "orange.300" }, t("titlebarUnsupportedHint")) : null,
              titlebarState.conflict ? el(Text, { fontSize: "xs", color: "orange.300" }, t("titlebarConflictHint")) : null,
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "xs", color: "gray.400", minW: "64px" }, t("titlebarZone")),
                el("input", {
                  type: "range",
                  min: 8,
                  max: 40,
                  step: 2,
                  value: titlebarState.zone,
                  disabled: !titlebarState.supported || titlebarState.conflict,
                  onChange: function(e) {
                    titlebarSetZone(e.target.value);
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { flex: 1, "--mouse-accent": "#8aa8ff", "--card-accent": "#8aa8ff" }
                }),
                el(Text, { fontSize: "xs", color: "#8aa8ff", minW: "42px", textAlign: "right" }, titlebarState.zone + " px")
              ),
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "xs", color: "gray.400", minW: "64px" }, t("titlebarDelay")),
                el("input", {
                  type: "range",
                  min: 80,
                  max: 400,
                  step: 20,
                  value: titlebarState.delay,
                  disabled: !titlebarState.supported || titlebarState.conflict,
                  onChange: function(e) {
                    titlebarSetDelay(e.target.value);
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { flex: 1, "--mouse-accent": "#8aa8ff", "--card-accent": "#8aa8ff" }
                }),
                el(Text, { fontSize: "xs", color: "#8aa8ff", minW: "52px", textAlign: "right" }, titlebarState.delay + " ms")
              )
            )
          ),

          // ===== Section: Accessibility =====
          el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              bg: "rgba(255,255,255,0.035)",
              border: "1px solid #8aa8ff42",
              position: "relative",
              overflow: "hidden",
              style: { "--card-accent": "#8aa8ff" }
            },
            el(
              VStack,
              { spacing: 2, align: "stretch", position: "relative", zIndex: 1 },
              sectionHeader(
                "#8aa8ff",
                "AC",
                t("reduceMotion"),
                { color: reduceMotion ? "green" : "gray", text: reduceMotion ? t("on") : t("off") },
                el(Switch, {
                  isChecked: reduceMotion,
                  colorScheme: "blue",
                  size: "sm",
                  onChange: function() {
                    const next = !reduceMotion;
                    setReduceMotion(next);
                    applyReduceMotion(next);
                  }
                })
              ),
              el(Text, { fontSize: "xs", color: "gray.500" }, t("reduceMotionDesc"))
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
              el(
                HStack,
                { spacing: 2, align: "center", flexWrap: "wrap" },
                el(Text, { fontSize: "xs", color: "gray.500" }, t("version") + " " + __LTE_VERSION__),
                el(Button, {
                  size: "xs",
                  variant: "outline",
                  borderRadius: "md",
                  isLoading: updateStatus === "checking",
                  onClick: checkUpdates
                }, t("checkUpdates"))
              ),
              updateStatus === "checking" ? el(Text, { fontSize: "xs", color: "gray.400" }, t("updateChecking")) : null,
              updateStatus === "latest" ? el(Text, { fontSize: "xs", color: "green.300" }, t("updateLatest")) : null,
              updateStatus === "available" ? el(
                VStack,
                { spacing: 1, align: "stretch" },
                el(
                  HStack,
                  { spacing: 2, align: "center", flexWrap: "wrap" },
                  el(Text, { fontSize: "xs", color: "yellow.300" }, t("updateAvailable") + " v" + (latestUpdate ? latestUpdate.version : "")),
                  el(Button, { size: "xs", colorScheme: "blue", borderRadius: "md", onClick: installUpdate }, t("updateInstall")),
                  latestUpdate && latestUpdate.page ? el(Button, {
                  size: "xs",
                  variant: "ghost",
                  borderRadius: "md",
                  onClick: function() {
                    if (host.actions && typeof host.actions.openExternalLink === "function") {
                      host.actions.openExternalLink(latestUpdate.page);
                    }
                  }
                }, t("openReleasePage")) : null
                ),
                latestUpdate && latestUpdate.notes ? el(Text, { fontSize: "xs", color: "gray.500", noOfLines: 2 }, latestUpdate.notes) : null
              ) : null,
              updateStatus === "installing" ? el(Text, { fontSize: "xs", color: "blue.300" }, t("updateInstalling")) : null,
              updateStatus === "submitted" ? el(Text, { fontSize: "xs", color: "green.300" }, t("updateSubmitted")) : null,
              updateStatus === "error" ? el(Text, { fontSize: "xs", color: "orange.300" }, t("updateFailed") + ": " + updateError) : null,
              lastUpdateCheck > 0 ? el(Text, { fontSize: "10px", color: "gray.500" }, t("lastChecked") + " " + new Date(lastUpdateCheck).toLocaleTimeString()) : null,
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

  