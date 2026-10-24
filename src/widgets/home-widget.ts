// src/widgets/home-widget.ts
  function wmoLocaleKey(type) {
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
  function fxLocaleKey(v) {
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
  function useCrossfadeGradient(React, gradient) {
    const [previous, setPrevious] = React.useState(null);
    const current = React.useRef(gradient);
    const timer = React.useRef(null);
    React.useEffect(function() {
      if (gradient === current.current) return;
      setPrevious(current.current);
      current.current = gradient;
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(function() {
        setPrevious(null);
        timer.current = null;
      }, 260);
      return function() {
        if (timer.current) {
          window.clearTimeout(timer.current);
          timer.current = null;
        }
      };
    }, [gradient]);
    return previous;
  }
  function createCityWeatherWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const ChakraUI = api.ChakraUI;
    const { useState, useEffect, useCallback } = React;
    const el = React.createElement;
    const { Badge, Box, VStack, HStack, Switch, Text } = ChakraUI;
    function weaGradient(type) {
      var m = { clear: "linear-gradient(135deg,rgba(255,200,80,0.35),rgba(255,120,30,0.08))", cloudy: "linear-gradient(135deg,rgba(100,130,160,0.35),rgba(60,70,90,0.08))", rain: "linear-gradient(135deg,rgba(40,80,160,0.4),rgba(15,40,80,0.08))", snow: "linear-gradient(135deg,rgba(180,210,240,0.3),rgba(200,220,250,0.08))", thunder: "linear-gradient(135deg,rgba(50,25,80,0.45),rgba(15,8,30,0.1))", fog: "linear-gradient(135deg,rgba(120,130,140,0.3),rgba(80,85,90,0.08))", wind: "linear-gradient(135deg,rgba(70,140,170,0.3),rgba(40,80,100,0.08))" };
      return m[type] || m.clear;
    }
    function weaPalette(type) {
      var m = {
        clear: ["#ffb52e", "#ffd76a", "#ff8a3d"],
        cloudy: ["#65768d", "#93a5b7", "#c4cfda"],
        rain: ["#315da8", "#5d9bdf", "#b4d8ff"],
        snow: ["#9ebfe4", "#c7e2ff", "#f2fbff"],
        thunder: ["#542d7e", "#8d5ac8", "#d39cff"],
        fog: ["#69727c", "#9ba4ad", "#d1d7dc"],
        wind: ["#3d7d99", "#69bbd2", "#c0f1f7"]
      };
      return m[type] || m.clear;
    }
    function tempColor(t) {
      if (t < 0) return "#66b3ff";
      if (t < 10) return "#88ccff";
      if (t < 20) return "#ffcc44";
      if (t < 30) return "#ff8833";
      return "#ff4444";
    }
    function weaAnim(type) {
      var m = { clear: "pulse 3s ease-in-out infinite", cloudy: "drift 4s ease-in-out infinite", rain: "none", snow: "snowfall 5s ease-in-out infinite", thunder: "flicker 0.5s ease-in-out infinite", fog: "drift 6s ease-in-out infinite", wind: "drift 2s ease-in-out infinite" };
      return m[type] || "none";
    }
    return function CityWeatherWidget() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const [city, setCity] = es("cw_city", "");
      const [wInfo, setWInfo] = es("cw_wi", null);
      const [ambientEnabled, setAmbientEnabled] = es("cw_ambient_enabled", true);
      const [input, setInput] = useState("");
      const [loading, setLoading] = useState(false);
      const t = useLocale(host);
      const theme = lteUseTheme(api);
      const tone = theme.tone;
      useEffect(function() {
        if (!document.getElementById("lte-wx-keys")) {
          var s = document.createElement("style");
          s.id = "lte-wx-keys";
          s.textContent = "@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.08)}}@keyframes drift{0%,100%{transform:translateX(0)}50%{transform:translateX(6px)}}@keyframes snowfall{0%,100%{transform:translateY(0)rotate(0deg)}50%{transform:translateY(8px)rotate(10deg)}}@keyframes flicker{0%,100%{opacity:1}50%{opacity:0.3}}@keyframes shine{0%{background-position:-200% 0}100%{background-position:200% 0}}";
          document.head.appendChild(s);
        }
      }, []);
      const searchCity = useCallback(function() {
        const v = input.trim();
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
          if (d) setWInfo(d);
        });
      }, [input]);
      const weaType = wInfo ? mapWMO(wInfo.code) : "clear";
      const weatherIcon = wInfo ? WN_ICON[weaType] || "" : "";
      const grad = weaGradient(weaType);
      const palette = weaPalette(weaType);
      const accent = palette[1];
      const lineGradient = "linear-gradient(90deg, " + palette[0] + ", " + palette[1] + ", " + palette[2] + ", " + palette[0] + ")";
      const previousLine = useCrossfadeGradient(React, lineGradient);
      const tColor = wInfo ? tone(tempColor(wInfo.temp)) : "var(--lte-text)";
      const anim = wInfo ? weaAnim(weaType) : "none";
      const active = Boolean(wInfo && ambientEnabled);
      return el(
        Box,
        {
          p: 3,
          borderRadius: "xl",
          bg: "var(--lte-surface)",
          backdropFilter: "blur(4px)",
          border: "1px solid var(--lte-border)",
          style: theme.style,
          boxShadow: "var(--lte-shadow)",
          position: "relative",
          overflow: "hidden"
        },
        el(
          Box,
          { className: "lte-card-accent-shell " + (active ? "" : "is-paused") },
          previousLine ? el(Box, {
            key: previousLine,
            className: "lte-card-line-layer is-previous",
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: previousLine }
          })) : null,
          el(Box, {
            key: lineGradient,
            className: "lte-card-line-layer is-current"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: lineGradient }
          }))
        ),
        // Animated weather gradient overlay
        wInfo ? el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          style: {
            background: grad,
            opacity: ambientEnabled ? (theme.isDark ? 0.8 : 0.22) : (theme.isDark ? 0.16 : 0.08),
            filter: ambientEnabled ? "saturate(1)" : "saturate(0.35)",
            transition: "opacity 220ms ease, filter 220ms ease"
          }
        }) : null,
        el(
          VStack,
          { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(
                Box,
                {
                  w: "26px",
                  h: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "md",
                  bg: accent + "33",
                  color: tone(accent),
                  fontSize: "xs",
                  fontWeight: "bold",
                  border: "1px solid " + accent + "66",
                  transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease"
                },
                "CW"
              ),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "var(--lte-text-strong)" }, t("cityWeather"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: active ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, active ? t("on") : t("off")),
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
            )
          ),
          el(Text, { fontSize: "xs", color: "var(--lte-text-faint)" }, t("ambienceHint")),
          el(
            HStack,
            { spacing: 2 },
            el("input", {
              placeholder: t("searchPlaceholder"),
              value: input,
              onInput: function(e) {
                setInput(e.target.value);
              },
              onKeyDown: function(e) {
                if (e.key === "Enter") searchCity();
              },
              style: {
                flex: 1,
                padding: "6px 10px",
                borderRadius: "10px",
                background: "var(--lte-input-bg)",
                color: "var(--lte-input-text)",
                border: "1px solid " + accent + "55",
                fontSize: "13px",
                outline: "none",
                transition: "border-color 180ms ease, box-shadow 180ms ease"
              }
            }),
            el(
              Box,
              {
                as: "button",
                type: "button",
                className: "lte-mouse-selector lte-card-selector",
                onClick: searchCity,
                disabled: !input.trim() || loading,
                "aria-label": t("searchCity"),
                style: {
                  width: "38px",
                  height: "34px",
                  borderRadius: "10px",
                  background: accent + "22",
                  border: "1px solid " + accent + "66",
                  color: tone(accent),
                  cursor: !input.trim() || loading ? "default" : "pointer",
                  opacity: !input.trim() || loading ? 0.55 : 1,
                  "--card-accent": accent,
                  "--card-glow": accent + "2e"
                }
              },
              loading ? "..." : "🔍"
            )
          ),
          wInfo ? el(
            Box,
            {
              p: 3,
              borderRadius: "xl",
              style: {
                border: "1px solid " + accent + (ambientEnabled ? "48" : "24"),
                transition: "border-color 220ms ease, background-color 220ms ease"
              },
              bg: "var(--lte-inner)"
            },
            el(
              VStack,
              { spacing: 2, align: "center" },
              el(Text, { fontSize: "11px", color: "var(--lte-text-soft)", textTransform: "uppercase", letterSpacing: "1px", fontWeight: "medium" }, city || ""),
              el(
                HStack,
                { spacing: 1, align: "center" },
                el("span", { style: { fontSize: "40px", fontWeight: "300", color: tColor, lineHeight: "1", transition: "color 220ms ease, textShadow 220ms ease", textShadow: ambientEnabled ? "0 0 8px " + accent + "60, 0 0 16px " + accent + "30" : "none" } }, wInfo.temp + "°"),
                el(Text, { fontSize: "14px", color: "var(--lte-text-soft)", mt: "6px" }, "C")
              ),
              el(
                HStack,
                { spacing: 1, align: "center" },
                el(Text, { fontSize: "24px", style: { animation: ambientEnabled ? anim : "none", display: "inline-block", opacity: ambientEnabled ? 1 : 0.7, transition: "opacity 220ms ease" } }, weatherIcon),
                el(Text, { fontSize: "13px", color: "var(--lte-text-medium)", fontWeight: "500" }, t(wmoLocaleKey(weaType)))
              ),
              el(Box, { h: "1px", bg: "var(--lte-divider)", w: "100%" }),
              el(
                HStack,
                { spacing: 4, justify: "center" },
                el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "var(--lte-text-faint)", textTransform: "uppercase" }, t("humidity")),
                  el(Text, { fontSize: "14px", color: "var(--lte-text)", fontWeight: "600" }, wInfo.humi + "%")
                ),
                el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "var(--lte-text-faint)", textTransform: "uppercase" }, t("wind")),
                  el(Text, { fontSize: "14px", color: "var(--lte-text)", fontWeight: "600" }, wInfo.wind + " km/h")
                ),
                wInfo.feels ? el(
                  VStack,
                  { spacing: 0, align: "center" },
                  el(Text, { fontSize: "10px", color: "var(--lte-text-faint)", textTransform: "uppercase" }, t("feels")),
                  el(Text, { fontSize: "14px", color: "var(--lte-text)", fontWeight: "600" }, wInfo.feels + "°")
                ) : null
              )
            )
          ) : el(
            Box,
            { p: 3, borderRadius: "xl", bg: "var(--lte-inner)", textAlign: "center" },
            el(
              Text,
              { fontSize: "sm", color: "var(--lte-text-faint)" },
              city ? el("span", null, t("loading")) : el("span", null, t("searchCity"))
            )
          )
        )
      );
    };
  }
  function createThemeEnhancerWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const ChakraUI = api.ChakraUI;
    const { useState, useEffect } = React;
    const el = React.createElement;
    const { Badge, Box, VStack, HStack, Switch, Text, Button } = ChakraUI;
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
    return function ThemeEnhancerWidget() {
      const host = api.getHostContext();
      const es = host.state.useExtensionState;
      const vs = useVidState();
      const t = useLocale(host);
      const theme = lteUseTheme(api);
      const tone = theme.tone;
      var _tt2 = window._tt || "rain";
      var _ti2 = window._ti || 50;
      const [selType, setSelType] = useState(_tt2);
      const [selInt, setSelInt] = useState(_ti2);
      const [running, setRunning] = useState(Boolean(window._trun));
      const [isOpen, setIsOpen] = useState(false);
      const [confirmRemoveVideo, setConfirmRemoveVideo] = useState(false);
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
      const selected = getThemeOption(selType);
      const accent = selected.colors[1];
      const lineGradient = "linear-gradient(90deg, " + selected.colors[0] + ", " + selected.colors[1] + ", " + selected.colors[2] + ", " + selected.colors[0] + ")";
      const previousLine = useCrossfadeGradient(React, lineGradient);
      useEffect(function() {
        const id = setInterval(function() {
          setRunning(Boolean(window._trun));
          const nextType = window._tt || "rain";
          const nextInt = window._ti || 50;
          setSelType(function(previous) {
            return previous === nextType ? previous : nextType;
          });
          setSelInt(function(previous) {
            return previous === nextInt ? previous : nextInt;
          });
        }, 250);
        return function() {
          clearInterval(id);
        };
      }, []);
      function toggleTheme() {
        if (running) {
          stopThemeEffects();
          setRunning(false);
        } else {
          if (selType === "blank") return;
          startThemeEffects(selType, selInt);
          setRunning(Boolean(window._trun));
        }
      }
      function changeType(v) {
        rememberThemeUse(v);
        setSelType(v);
        window._tt = v;
        _tt = v;
        if (v === "blank") {
          stopThemeEffects();
          setRunning(false);
        } else if (window._trun) {
          updateThemeEffects(v);
          setRunning(true);
        }
        persistThemePreferences();
      }
      function changeInt(v) {
        var n = parseInt(v);
        setSelInt(n);
        window._ti = n;
        _ti = n;
        if (window._trun) updateThemeEffects(null, n);
        persistThemePreferences();
      }
      function chooseEffect(nextEffect) {
        changeType(nextEffect);
        setIsOpen(false);
      }
      return el(
        Box,
        {
          p: 3,
          borderRadius: "xl",
          bg: "var(--lte-surface)",
          backdropFilter: "blur(4px)",
          border: "1px solid var(--lte-border)",
          style: theme.style,
          boxShadow: "var(--lte-shadow)",
          position: "relative",
          overflow: "hidden"
        },
        el(
          Box,
          { className: "lte-card-accent-shell " + (running ? "" : "is-paused") },
          previousLine ? el(Box, {
            key: previousLine,
            className: "lte-card-line-layer is-previous",
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: previousLine }
          })) : null,
          el(Box, {
            key: lineGradient,
            className: "lte-card-line-layer is-current"
          }, el(Box, {
            className: "lte-mouse-accent-line lte-card-line-fill",
            style: { backgroundImage: lineGradient }
          }))
        ),
        el(
          VStack,
          { spacing: 3, align: "stretch", position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(
                Box,
                {
                  w: "26px",
                  h: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "md",
                  bg: accent + "33",
                  color: tone(accent),
                  fontSize: "xs",
                  fontWeight: "bold",
                  border: "1px solid " + accent + "66",
                  transition: "background-color 180ms ease, color 180ms ease, border-color 180ms ease"
                },
                "TE"
              ),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "var(--lte-text-strong)" }, t("themeEnhancer"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: running ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, running ? t("on") : t("off")),
              el(Switch, {
                isChecked: running,
                colorScheme: "blue",
                size: "sm",
                isDisabled: selType === "blank",
                onChange: toggleTheme,
                "aria-label": t("themeParticles")
              })
            )
          ),
          el(
            Box,
            {
              p: 2,
              borderRadius: "xl",
              bg: "var(--lte-inner-strong)",
              border: "1px solid " + accent + "52",
              style: { "--card-accent": accent, "--card-glow": accent + "2e" }
            },
            el(
              VStack,
              { spacing: 2, align: "stretch" },
              el(
                HStack,
                { justify: "space-between", align: "center" },
                el(Text, { fontSize: "xs", color: "var(--lte-text-secondary)", fontWeight: "600" }, t("themeParticles")),
                el(Badge, { colorScheme: running ? "green" : "gray", variant: "subtle", fontSize: "xs", borderRadius: "full", px: 2 }, running ? t("running") : t("stopped"))
              ),
              el(
                Box,
                {
                  as: "button",
                  type: "button",
                  className: "lte-mouse-selector lte-card-selector",
                  w: "100%",
                  p: 2,
                  borderRadius: "xl",
                  bg: "var(--lte-inner-strong)",
                  border: "1px solid " + accent + "66",
                  textAlign: "left",
                  color: "var(--lte-text)",
                  onClick: function() {
                    setIsOpen(!isOpen);
                    if (!isOpen) lteFocusSelectedOption(".lte-home-theme-options");
                  },
                  "aria-expanded": isOpen
                },
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(fxLocaleKey(selType))),
                  el(Text, { className: "lte-mouse-chevron lte-card-chevron " + (isOpen ? "is-open" : ""), fontSize: "sm", color: "var(--lte-text-muted)" }, "⌄")
                )
              ),
              isOpen ? el(
                VStack,
                { className: "lte-mouse-options lte-card-options lte-home-theme-options", spacing: 1, align: "stretch", style: { "--card-accent": accent } },
                getThemeSelectorSections().map(function(section) {
                  return el(
                    Box,
                    { key: section.labelKey, w: "100%" },
                    el(Text, {
                      fontSize: "10px",
                      fontWeight: "semibold",
                      color: tone(accent),
                      opacity: 0.72,
                      px: 1,
                      pt: 1.5,
                      pb: 0.5
                    }, t(section.labelKey)),
                    el(
                      VStack,
                      { spacing: 1, align: "stretch" },
                      section.options.map(function(option) {
                        const optionActive = option.v === selType;
                        return el(
                          Box,
                          {
                            as: "button",
                            key: option.v,
                            "data-lte-active": optionActive ? "1" : "0",
                            type: "button",
                            className: "lte-mouse-option lte-card-option",
                            w: "100%",
                            p: 2,
                            borderRadius: "lg",
                            border: "1px solid " + (optionActive ? option.colors[1] + "88" : "transparent"),
                            bg: optionActive ? option.colors[1] + "18" : "transparent",
                            color: optionActive ? "var(--lte-text)" : "var(--lte-text-secondary)",
                            textAlign: "left",
                            onClick: function() {
                              chooseEffect(option.v);
                            }
                          },
                          el(
                            HStack,
                            { justify: "space-between", align: "center" },
                            el(Text, { fontSize: "sm" }, t(fxLocaleKey(option.v))),
                            optionActive ? el(Text, { fontSize: "sm", color: tone(option.colors[1]) }, "✓") : null
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
                el(Text, { fontSize: "xs", color: "var(--lte-text-muted)", minW: "44px" }, t("intensity")),
                el("input", {
                  type: "range",
                  min: 10,
                  max: 100,
                  step: 5,
                  value: selInt,
                  onChange: function(e) {
                    changeInt(e.target.value);
                  },
                  className: "lte-mouse-slider lte-card-slider",
                  style: { flex: 1, "--mouse-accent": accent, "--card-accent": accent }
                }),
                el(Text, { fontSize: "xs", color: tone(accent), minW: "34px", textAlign: "right" }, selInt + "%")
              )
            )
          ),
          el(Text, { fontSize: "xs", color: "var(--lte-text-faint)" }, t("themeSwitchHint")),
          el(
            Box,
            { p: 2.5, borderRadius: "lg", bg: "var(--lte-inner)", border: "1px solid " + accent + "2e", style: { "--card-accent": accent } },
            el(
              VStack,
              { spacing: 2, align: "stretch" },
              el(
                HStack,
                { justify: "space-between", align: "center" },
                el(Text, { fontSize: "xs", color: "var(--lte-text-secondary)", fontWeight: "600" }, t("videoBackground")),
                el(
                  HStack,
                  { spacing: 1.5, align: "center" },
                  el(Badge, {
                    colorScheme: !vs.name || !vs.enabled ? "gray" : vs.paused ? "yellow" : "green",
                    variant: "subtle",
                    fontSize: "xs",
                    borderRadius: "full",
                    px: 2
                  }, !vs.name || !vs.enabled ? t("off") : vs.paused ? t("paused") : t("playing")),
                  el(Switch, {
                    isChecked: Boolean(vs.name) && vs.enabled,
                    isDisabled: !vs.name,
                    size: "sm",
                    colorScheme: "green",
                    onChange: function() {
                      videoSetEnabled(!vs.enabled);
                    }
                  })
                )
              ),
              !vs.name ? el(
                Box,
                {
                  as: "button",
                  type: "button",
                  w: "100%",
                  py: 3,
                  borderRadius: "md",
                  border: "1px dashed " + accent + "66",
                  bg: "var(--lte-inner-faint)",
                  textAlign: "center",
                  onClick: pickVideoFile,
                  className: "lte-mouse-selector"
                },
                el(Text, { fontSize: "sm", color: "var(--lte-text-strong)" }, "🎞️ " + t("selectVideo")),
                el(Text, { fontSize: "10px", color: "var(--lte-text-faint)" }, "MP4 / WebM")
              ) : el(
                VStack,
                { spacing: 2, align: "stretch" },
                el(
                  Box,
                  {
                    position: "relative",
                    borderRadius: "md",
                    overflow: "hidden",
                    border: "1px solid " + accent + "33",
                    style: { "--card-accent": accent },
                    opacity: vs.enabled ? 1 : 0.72
                  },
                  el(Box, {
                    position: "absolute",
                    inset: 0,
                    className: "lte-video-strip " + (vs.enabled && !vs.paused ? "is-live" : "is-paused")
                  }),
                  el(
                    HStack,
                    { position: "relative", zIndex: 1, spacing: 2, align: "center", p: 2 },
                    el(Box, {
                      as: "button",
                      type: "button",
                      onClick: function() {
                        if (!vs.enabled) return;
                        if (window._vpaused) videoPlay();
                        else videoPause();
                      },
                      w: "32px",
                      h: "32px",
                      borderRadius: "full",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bg: accent + "22",
                      border: "1px solid " + accent + "66",
                      color: "var(--lte-text)",
                      fontSize: "xs",
                      cursor: vs.enabled ? "pointer" : "default",
                      opacity: vs.enabled ? 1 : 0.45
                    }, el(
                      Box,
                      { display: "flex", alignItems: "center", justifyContent: "center" },
                      vs.enabled && !vs.paused ? el(
                        HStack,
                        { spacing: "3px", align: "center" },
                        el(Box, { w: "3px", h: "11px", borderRadius: "1px", bg: "var(--lte-text)" }),
                        el(Box, { w: "3px", h: "11px", borderRadius: "1px", bg: "var(--lte-text)" })
                      ) : el(Box, {
                        w: 0,
                        h: 0,
                        ml: "1.5px",
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderLeft: "9px solid var(--lte-text)"
                      })
                    )),
                    el(
                      VStack,
                      { spacing: 0, flex: 1, minW: 0 },
                      el(Text, { fontSize: "xs", fontWeight: "semibold", color: "var(--lte-text-strong)", noOfLines: 1 }, vs.name),
                      el(Text, { fontSize: "10px", color: "var(--lte-text-faint)" }, videoMetaText(vs.duration, vs.size))
                    ),
                    el(Text, { fontSize: "xs", color: tone(accent) }, vs.loop ? "↻" : "1×")
                  )
                ),
                el(
                  HStack,
                  { spacing: 1, align: "center" },
                  el(Box, {
                    as: "button",
                    type: "button",
                    onClick: videoToggleMute,
                    w: "24px",
                    h: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "md",
                    bg: "transparent",
                    color: tone(accent),
                    cursor: "pointer",
                    fontSize: "xs"
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
                    style: { flex: 1, "--mouse-accent": accent, "--card-accent": accent }
                  }),
                  el(Text, { fontSize: "10px", color: tone(accent), minW: "28px", textAlign: "right" }, Math.round(vs.vol * 100) + "%")
                ),
                el(
                  HStack,
                  { justify: "space-between", align: "center" },
                  el(
                    HStack,
                    { spacing: 1.5, align: "center" },
                    el(Text, { fontSize: "10px", color: "var(--lte-text-muted)" }, t("loopVideo")),
                    el(Switch, { isChecked: vs.loop, colorScheme: "green", size: "sm", onChange: function() { videoSetLoop(!vs.loop); } })
                  ),
                  el(
                    HStack,
                    { spacing: 1 },
                    el(Button, { size: "xs", variant: "ghost", px: 1, fontSize: "10px", onClick: pickVideoFile }, t("change")),
                    el(Button, {
                      size: "xs",
                      variant: "ghost",
                      px: 1,
                      fontSize: "10px",
                      colorScheme: "red",
                      onClick: handleRemoveVideo
                    }, confirmRemoveVideo ? t("confirmRemove") : t("remove"))
                  )
                )
              )
            )
          )
        )
      );
    };
  }
  function createMouseEffectsWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const el = React.createElement;
    const { Badge, Box, HStack, Switch, Text, VStack } = api.ChakraUI;
    return function MouseEffectsWidget() {
      const host = api.getHostContext();
      const t = useLocale(host);
      const theme = lteUseTheme(api);
      const tone = theme.tone;
      const [enabled, setEnabled] = React.useState(_cursorEnabled);
      const [intensity, setIntensity] = React.useState(_cursorIntensity);
      const [isOpen, setIsOpen] = React.useState(false);
      const [effectType, setEffectType] = React.useState(_cursorEffectType);
      const selected = getMouseEffectOption(effectType);
      const accent = selected.colors[1];
      const lineGradient = "linear-gradient(90deg, " + selected.colors[0] + ", " + selected.colors[1] + ", " + selected.colors[2] + ", " + selected.colors[0] + ")";
      function toggleEnabled() {
        const next = !enabled;
        setEnabled(next);
        if (next) startCursorEffects();
        else stopCursorEffects(false);
      }
      function changeIntensity(event) {
        const next = parseInt(event.target.value, 10);
        setIntensity(next);
        setCursorIntensity(next);
      }
      function chooseEffect(nextEffect) {
        setEffectType(nextEffect);
        setCursorEffectType(nextEffect);
        setIsOpen(false);
      }
      return el(
        Box,
        {
          position: "relative",
          p: 3,
          borderRadius: "xl",
          bg: "var(--lte-surface)",
          border: "1px solid var(--lte-border)",
          style: theme.style,
          boxShadow: "var(--lte-shadow)",
          overflow: "hidden"
        },
        el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          className: "lte-mouse-accent-line " + (enabled ? "" : "lte-mouse-paused"),
          style: { backgroundImage: lineGradient }
        }),
        el(
          VStack,
          { align: "stretch", spacing: 3, position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(
                Box,
                {
                  w: "26px",
                  h: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "md",
                  bg: accent + "33",
                  color: tone(accent),
                  fontSize: "xs",
                  fontWeight: "bold",
                  border: "1px solid " + accent + "66"
                },
                "ME"
              ),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "var(--lte-text-strong)" }, t("mouseEffects"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: enabled ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, enabled ? t("on") : t("off")),
              el(Switch, { isChecked: enabled, colorScheme: "blue", size: "sm", onChange: toggleEnabled })
            )
          ),
          el(
            Box,
            {
              as: "button",
              type: "button",
              className: "lte-mouse-selector",
              w: "100%",
              p: 2,
              borderRadius: "xl",
              bg: "var(--lte-inner-strong)",
              border: "1px solid " + accent + "66",
              textAlign: "left",
              color: "var(--lte-text)",
              onClick: function() {
                setIsOpen(!isOpen);
                if (!isOpen) lteFocusSelectedOption(".lte-home-mouse-options");
              },
              "aria-expanded": isOpen
            },
            el(
              HStack,
              { justify: "space-between", align: "center" },
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "md", w: "24px", textAlign: "center" }, selected.icon),
                el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(selected.labelKey))
              ),
              el(Text, { className: "lte-mouse-chevron " + (isOpen ? "is-open" : ""), fontSize: "sm", color: "var(--lte-text-muted)" }, "⌄")
            )
          ),
          isOpen ? el(
            VStack,
            { className: "lte-mouse-options lte-card-options lte-home-mouse-options", spacing: 1, align: "stretch", style: { "--card-accent": accent } },
            MOUSE_EFFECT_OPTIONS.map(function(option) {
              const active = option.id === effectType;
              return el(
                Box,
                {
                  as: "button",
                  key: option.id,
                  "data-lte-active": active ? "1" : "0",
                  type: "button",
                  className: "lte-mouse-option",
                  w: "100%",
                  p: 2,
                  borderRadius: "lg",
                  border: "1px solid " + (active ? option.colors[1] + "88" : "transparent"),
                  bg: active ? option.colors[1] + "18" : "transparent",
                  color: active ? "var(--lte-text)" : "var(--lte-text-secondary)",
                  textAlign: "left",
                  onClick: function() {
                    chooseEffect(option.id);
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
                  active ? el(Text, { fontSize: "sm", color: tone(option.colors[1]) }, "✓") : null
                )
              );
            })
          ) : null,
          el(Text, { fontSize: "xs", color: "var(--lte-text-faint)" }, t(selected.descriptionKey)),
          el(
            HStack,
            { spacing: 2, align: "center" },
            el(Text, { fontSize: "xs", color: "var(--lte-text-muted)", minW: "44px" }, t("intensity")),
            el("input", {
              type: "range",
              min: 10,
              max: 100,
              step: 5,
              value: intensity,
              onChange: changeIntensity,
              className: "lte-mouse-slider",
              style: { flex: 1, "--mouse-accent": accent }
            }),
            el(Text, { fontSize: "xs", color: tone(accent), minW: "34px", textAlign: "right" }, intensity + "%")
          )
        )
      );
    };
  }

  

  function createClickEffectsWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const el = React.createElement;
    const { Badge, Box, HStack, Switch, Text, VStack } = api.ChakraUI;
    return function ClickEffectsWidget() {
      const host = api.getHostContext();
      const t = useLocale(host);
      const theme = lteUseTheme(api);
      const tone = theme.tone;
      const [enabled, setEnabled] = React.useState(_clickEnabled);
      const [intensity, setIntensity] = React.useState(_clickIntensity);
      const [isOpen, setIsOpen] = React.useState(false);
      const [effectType, setEffectType] = React.useState(_clickEffectType);
      const selected = getClickEffectOption(effectType);
      const accent = selected.colors[1];
      const lineGradient = "linear-gradient(90deg, " + selected.colors[0] + ", " + selected.colors[1] + ", " + selected.colors[2] + ", " + selected.colors[0] + ")";
      function toggleEnabled() {
        const next = !enabled;
        setEnabled(next);
        if (next) startClickEffects();
        else stopClickEffects(false);
      }
      function changeIntensity(event) {
        const next = parseInt(event.target.value, 10);
        setIntensity(next);
        setClickIntensity(next);
      }
      function chooseEffect(nextEffect) {
        setEffectType(nextEffect);
        setClickEffectType(nextEffect);
        setIsOpen(false);
      }
      return el(
        Box,
        {
          position: "relative",
          p: 3,
          borderRadius: "xl",
          bg: "var(--lte-surface)",
          border: "1px solid var(--lte-border)",
          style: theme.style,
          boxShadow: "var(--lte-shadow)",
          overflow: "hidden"
        },
        el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          className: "lte-mouse-accent-line " + (enabled ? "" : "lte-mouse-paused"),
          style: { backgroundImage: lineGradient }
        }),
        el(
          VStack,
          { align: "stretch", spacing: 3, position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(
                Box,
                {
                  w: "26px",
                  h: "26px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "md",
                  bg: accent + "33",
                  color: tone(accent),
                  fontSize: "xs",
                  fontWeight: "bold",
                  border: "1px solid " + accent + "66"
                },
                "CE"
              ),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "var(--lte-text-strong)" }, t("clickEffects"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: enabled ? "green" : "gray", variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, enabled ? t("on") : t("off")),
              el(Switch, { isChecked: enabled, colorScheme: "blue", size: "sm", onChange: toggleEnabled })
            )
          ),
          el(
            Box,
            {
              as: "button",
              type: "button",
              className: "lte-mouse-selector",
              w: "100%",
              p: 2,
              borderRadius: "xl",
              bg: "var(--lte-inner-strong)",
              border: "1px solid " + accent + "66",
              textAlign: "left",
              color: "var(--lte-text)",
              onClick: function() {
                setIsOpen(!isOpen);
                if (!isOpen) lteFocusSelectedOption(".lte-home-click-options");
              },
              "aria-expanded": isOpen
            },
            el(
              HStack,
              { justify: "space-between", align: "center" },
              el(
                HStack,
                { spacing: 2, align: "center" },
                el(Text, { fontSize: "md", w: "24px", textAlign: "center" }, selected.icon),
                el(Text, { fontSize: "sm", fontWeight: "semibold" }, t(selected.labelKey))
              ),
              el(Text, { className: "lte-mouse-chevron " + (isOpen ? "is-open" : ""), fontSize: "sm", color: "var(--lte-text-muted)" }, "⌄")
            )
          ),
          isOpen ? el(
            VStack,
            { className: "lte-mouse-options lte-card-options lte-home-click-options", spacing: 1, align: "stretch", style: { "--card-accent": accent } },
            CLICK_EFFECT_OPTIONS.map(function(option) {
              const active = option.id === effectType;
              return el(
                Box,
                {
                  as: "button",
                  key: option.id,
                  "data-lte-active": active ? "1" : "0",
                  type: "button",
                  className: "lte-mouse-option",
                  w: "100%",
                  p: 2,
                  borderRadius: "lg",
                  border: "1px solid " + (active ? option.colors[1] + "88" : "transparent"),
                  bg: active ? option.colors[1] + "18" : "transparent",
                  color: active ? "var(--lte-text)" : "var(--lte-text-secondary)",
                  textAlign: "left",
                  onClick: function() {
                    chooseEffect(option.id);
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
                  active ? el(Text, { fontSize: "sm", color: tone(option.colors[1]) }, "✓") : null
                )
              );
            })
          ) : null,
          el(Text, { fontSize: "xs", color: "var(--lte-text-faint)" }, t(selected.descriptionKey)),
          el(
            HStack,
            { spacing: 2, align: "center" },
            el(Text, { fontSize: "xs", color: "var(--lte-text-muted)", minW: "44px" }, t("intensity")),
            el("input", {
              type: "range",
              min: 10,
              max: 100,
              step: 5,
              value: intensity,
              onChange: changeIntensity,
              className: "lte-mouse-slider",
              style: { flex: 1, "--mouse-accent": accent }
            }),
            el(Text, { fontSize: "xs", color: tone(accent), minW: "34px", textAlign: "right" }, intensity + "%")
          )
        )
      );
    };
  }


  function createTitlebarWidget(api) {
    ensureMouseUiStyles();
    const React = api.React;
    const el = React.createElement;
    const { Badge, Box, HStack, Switch, Text, VStack } = api.ChakraUI;
    const ACCENT = "#8aa8ff";
    const GRADIENT = "linear-gradient(90deg, #c6d4ff, #8aa8ff, #b7a8ff, #c6d4ff)";
    return function TitlebarWidget() {
      const host = api.getHostContext();
      const t = useLocale(host);
      const theme = lteUseTheme(api);
      const tone = theme.tone;
      const [state, setState] = React.useState(window._lteTitlebar || { enabled: false, supported: false, conflict: false, zone: 20, delay: 180 });
      React.useEffect(function() {
        const id = setInterval(function() {
          setState(Object.assign({ enabled: false, supported: false, conflict: false, zone: 20, delay: 180 }, window._lteTitlebar || {}));
        }, 500);
        return function() {
          clearInterval(id);
        };
      }, []);
      const supported = Boolean(state.supported);
      const conflict = Boolean(state.conflict);
      const canToggle = supported && !conflict;
      const enabled = Boolean(state.enabled) && canToggle;
      const statusText = !supported ? t("titlebarUnsupported") : conflict ? t("titlebarConflictShort") : enabled ? t("titlebarAuto") : t("off");
      const statusColor = !supported || conflict || !enabled ? "gray" : "green";
      return el(
        Box,
        {
          position: "relative",
          p: 3,
          borderRadius: "xl",
          bg: "var(--lte-surface)",
          border: "1px solid var(--lte-border)",
          style: theme.style,
          boxShadow: "var(--lte-shadow)",
          overflow: "hidden"
        },
        el(Box, {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          className: "lte-mouse-accent-line " + (enabled ? "" : "lte-mouse-paused"),
          style: { backgroundImage: GRADIENT }
        }),
        el(
          VStack,
          { align: "stretch", spacing: 2.5, position: "relative", zIndex: 1 },
          el(
            HStack,
            { justify: "space-between", align: "center" },
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Box, {
                w: "26px",
                h: "26px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "md",
                bg: ACCENT + "33",
                color: tone(ACCENT),
                fontSize: "xs",
                fontWeight: "bold",
                border: "1px solid " + ACCENT + "66"
              }, "TB"),
              el(Text, { fontSize: "sm", fontWeight: "bold", color: "var(--lte-text-strong)" }, t("titlebar"))
            ),
            el(
              HStack,
              { spacing: 2, align: "center" },
              el(Badge, { colorScheme: statusColor, variant: "solid", fontSize: "xs", borderRadius: "full", px: 2 }, statusText),
              el(Switch, {
                isChecked: enabled,
                isDisabled: !canToggle,
                colorScheme: "blue",
                size: "sm",
                onChange: function() {
                  titlebarSetEnabled(!enabled);
                }
              })
            )
          ),
          el(Text, { fontSize: "xs", color: "var(--lte-text-faint)" }, t("titlebarDesc")),
          !supported ? el(Text, { fontSize: "xs", color: "var(--lte-warning)" }, t("titlebarUnsupportedHint")) : null,
          conflict ? el(Text, { fontSize: "xs", color: "var(--lte-warning)" }, t("titlebarConflictHint")) : null,
          el(Text, { fontSize: "xs", color: "var(--lte-text-faint)" }, t("titlebarHint"))
        )
      );
    };
  }
