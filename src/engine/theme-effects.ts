// src/engine/theme-effects.ts
  var THEME_OPTIONS = [
    { v: "rain", l: "Rain", colors: ["#2f6fd0", "#6aa9ff", "#b9dcff"] },
    { v: "ripples", l: "Rain Ripples", colors: ["#32b7e8", "#7ce7ff", "#d9fbff"] },
    { v: "keyboard_glow", l: "Keyboard Glow", colors: ["#52e2ff", "#8c6cff", "#ff6fc8"] },
    { v: "melody_orbit", l: "Melody Orbit", colors: ["#b48cff", "#7dd3fc", "#f9a8d4"] },
    { v: "key_nocturne", l: "Key Nocturne", colors: ["#7dd3fc", "#a78bfa", "#f9a8d4"] },
    { v: "shattered_glass", l: "Shattered Glass", colors: ["#dbe9ff", "#8fb6ff", "#e9c9ff"] },
    { v: "quantum_cloud", l: "Quantum Cloud", colors: ["#9db8ff", "#7c8cff", "#c58bff"] },
    { v: "film_reel", l: "Film Reel", colors: ["#f2e2c0", "#d9b26a", "#a87a45"] },
    { v: "waveform_ribbon", l: "Waveform Ribbon", colors: ["#8ff7ec", "#5fe0d0", "#7aa8ff"] },
    { v: "clock_rim", l: "Clock Rim", colors: ["#f5e9bd", "#e2c77e", "#a88b4f"] },
    { v: "meshing_gears", l: "Meshing Gears", colors: ["#c9d6ea", "#9fb4d8", "#e0c48a"] },
    { v: "signal_glitch", l: "Signal Glitch", colors: ["#ff7ab8", "#ff5fa2", "#5ff0ff"] },
    { v: "chat_bubbles", l: "Chat Bubbles", colors: ["#cfe9ff", "#7cc4ff", "#ffb3d9"] },
    { v: "magnetic_field", l: "Magnetic Field", colors: ["#c6d2ff", "#8fa8ff", "#b06bff"] },
    { v: "spider_web", l: "Dew Web", colors: ["#e8f4ff", "#a9c8e8", "#c9b8ff"] },
    { v: "lightning", l: "Lightning", colors: ["#e6f3ff", "#9fd2ff", "#c9a8ff"] },
    { v: "snow", l: "Snow", colors: ["#effcff", "#a9ddff", "#8495ff"] },
    { v: "sand", l: "Sandstorm", colors: ["#d9a45b", "#e8c37a", "#9b6437"] },
    { v: "stars", l: "Starry Sky", colors: ["#fff2a8", "#b6c9ff", "#7b8cff"] },
    { v: "aurora", l: "Aurora", colors: ["#8ff7d8", "#5fe0c6", "#b58bff"] },
    { v: "leaves", l: "Falling Leaves", colors: ["#a6d86f", "#e1b96a", "#7f9e4c"] },
    { v: "sakura", l: "Cherry Blossom", colors: ["#ffd6e2", "#ff91b8", "#fff1e8"] },
    { v: "fireflies", l: "Firefly Night", colors: ["#f9e784", "#b6ff8a", "#58d68d"] },
    { v: "dna", l: "DNA Particle Drift", colors: ["#5ef2ff", "#7b6cff", "#e36bff"] },
    { v: "ghost", l: "Ghost Shadows", colors: ["#d8d8ff", "#9b7cff", "#6b5d9c"] },
    { v: "water", l: "Underwater", colors: ["#3fd4e8", "#3c8dff", "#b2f5ff"] },
    { v: "fire", l: "Fire", colors: ["#ffd166", "#ff7a3d", "#ff3d5a"] },
    { v: "sunset", l: "Sunset", colors: ["#ffd27a", "#ff8a5c", "#b056a8"] },
    { v: "mc", l: "Minecraft", colors: ["#7ee787", "#5bc0eb", "#ffd166"] },
    { v: "enchanting", l: "Enchanting", colors: ["#c4a8ff", "#f9d6ff", "#75e3ff"] },
    { v: "code", l: "Code", colors: ["#69ff94", "#20d66b", "#b7ffd0"] },
    { v: "dust", l: "Dust", colors: ["#d7c7a3", "#a99472", "#f2e6c9"] },
    { v: "freeze", l: "Freeze", colors: ["#eafcff", "#b5e8ff", "#7aa8ff"] },
    { v: "sculk", l: "Sculk", colors: ["#56e0c0", "#287d91", "#5b4b8a"] },
    { v: "blank", l: "Blank", colors: ["#8e9aaf", "#5e6a7d", "#c5cedd"] }
  ];
  function getThemeOption(id) {
    return THEME_OPTIONS.find(function(option) {
      return option.v === id;
    }) || THEME_OPTIONS[0];
  }
  var THEME_GROUP_ORDER = [
    {
      labelKey: "groupNature",
      ids: ["rain", "ripples", "snow", "sand", "leaves", "sakura", "fireflies", "water", "fire", "dust", "freeze", "spider_web"]
    },
    {
      labelKey: "groupSky",
      ids: ["stars", "aurora", "sunset", "lightning", "quantum_cloud"]
    },
    {
      labelKey: "groupMusic",
      ids: ["keyboard_glow", "melody_orbit", "key_nocturne", "waveform_ribbon"]
    },
    {
      labelKey: "groupMechanical",
      ids: ["clock_rim", "meshing_gears", "film_reel", "magnetic_field"]
    },
    {
      labelKey: "groupAbstract",
      ids: ["dna", "ghost", "mc", "enchanting", "code", "sculk", "signal_glitch", "shattered_glass", "chat_bubbles"]
    },
    {
      labelKey: "groupOther",
      ids: ["blank"]
    }
  ];
  function getThemeRecent() {
    var raw = getLocal("theme_recent", []);
    if (!Array.isArray(raw)) return [];
    return raw.filter(function(id) {
      return id !== "blank" && THEME_OPTIONS.some(function(option) { return option.v === id; });
    }).slice(0, 4);
  }
  function rememberThemeUse(id) {
    if (id === "blank" || !THEME_OPTIONS.some(function(option) { return option.v === id; })) return;
    var next = [id].concat(getThemeRecent().filter(function(existing) { return existing !== id; })).slice(0, 4);
    setLocal("theme_recent", next);
  }
  function getThemeSelectorSections() {
    var recent = getThemeRecent();
    var sections = [];
    if (recent.length) {
      sections.push({ labelKey: "groupRecent", options: recent.map(getThemeOption) });
    }
    for (var g = 0; g < THEME_GROUP_ORDER.length; g++) {
      var group = THEME_GROUP_ORDER[g];
      var options = group.ids.filter(function(id) { return recent.indexOf(id) === -1; }).map(getThemeOption);
      if (options.length) sections.push({ labelKey: group.labelKey, options: options });
    }
    return sections;
  }

  var _keyboardGlowPulses = [];
  var _keyboardGlowListener = null;
  function getKeyboardGlowPosition(event, w, h) {
    if (["ShiftLeft", "ShiftRight", "ControlLeft", "ControlRight", "AltLeft", "AltRight", "MetaLeft", "MetaRight", "CapsLock", "Tab", "Escape"].includes(event.code)) {
      return null;
    }
    if (event.code === "Space") return { x: w * 0.5, y: h * 0.985, hue: 275 };
    const rows = [
      { keys: "QWERTYUIOP", y: 0.91, hue: 195 },
      { keys: "ASDFGHJKL", y: 0.93, hue: 275 },
      { keys: "ZXCVBNM", y: 0.95, hue: 330 }
    ];
    if (/^Key[A-Z]$/.test(event.code)) {
      const key = event.code.slice(3);
      for (let row = 0; row < rows.length; row++) {
        const index = rows[row].keys.indexOf(key);
        if (index >= 0) {
          const ratio = rows[row].keys.length === 1 ? 0.5 : index / (rows[row].keys.length - 1);
          return {
            x: w * (0.12 + ratio * 0.76),
            y: h * 0.985,
            hue: rows[row].hue + ratio * 35
          };
        }
      }
    }
    if (/^Digit[1-9]$/.test(event.code) || event.code === "Digit0") {
      const digit = event.code === "Digit0" ? 10 : Number(event.code.slice(5));
      return { x: w * (0.08 + (digit - 1) / 9 * 0.84), y: h * 0.985, hue: 45 + digit * 6 };
    }
    return null;
  }
  function ensureKeyboardGlowListener() {
    if (_keyboardGlowListener) return;
    _keyboardGlowListener = function(event) {
      if (!_trun || _tt !== "keyboard_glow") return;
      const position = getKeyboardGlowPosition(event, window.innerWidth, window.innerHeight);
      if (!position) return;
      _keyboardGlowPulses.push({
        x: position.x,
        y: position.y,
        hue: (position.x / Math.max(1, window.innerWidth) * 300 + performance.now() * 0.025) % 360,
        age: 0,
        life: 72,
        size: event.code === "Space" ? 1.35 : 1
      });
      if (_keyboardGlowPulses.length > 18) _keyboardGlowPulses.shift();
    };
    window.addEventListener("keydown", _keyboardGlowListener);
  }
  function removeKeyboardGlowListener() {
    if (!_keyboardGlowListener) return;
    window.removeEventListener("keydown", _keyboardGlowListener);
    _keyboardGlowListener = null;
    _keyboardGlowPulses.length = 0;
  }
  var themeEffects = {};
