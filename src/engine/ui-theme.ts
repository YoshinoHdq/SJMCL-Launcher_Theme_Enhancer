// src/engine/ui-theme.ts
  var LTE_THEME_DARK = {
    "--lte-surface": "rgba(8,12,24,0.92)",
    "--lte-surface-strong": "rgba(8,12,24,0.95)",
    "--lte-border": "rgba(255,255,255,0.08)",
    "--lte-border-soft": "rgba(255,255,255,0.07)",
    "--lte-border-faint": "rgba(255,255,255,0.06)",
    "--lte-inner": "rgba(255,255,255,0.035)",
    "--lte-inner-strong": "rgba(255,255,255,0.045)",
    "--lte-inner-faint": "rgba(255,255,255,0.025)",
    "--lte-input-bg": "rgba(255,255,255,0.08)",
    "--lte-input-text": "#e2e8f0",
    "--lte-text": "#ffffff",
    "--lte-text-strong": "#edf2f7",
    "--lte-text-secondary": "#cbd5e0",
    "--lte-text-muted": "#a0aec0",
    "--lte-text-faint": "#718096",
    "--lte-text-soft": "rgba(255,255,255,0.5)",
    "--lte-text-medium": "rgba(255,255,255,0.7)",
    "--lte-divider": "rgba(255,255,255,0.06)",
    "--lte-hover": "rgba(255,255,255,0.075)",
    "--lte-hover-soft": "rgba(255,255,255,0.065)",
    "--lte-track": "rgba(255,255,255,0.16)",
    "--lte-stripe": "rgba(255,255,255,0.05)",
    "--lte-scroll-track": "rgba(255,255,255,0.035)",
    "--lte-scroll-track-soft": "rgba(255,255,255,0.06)",
    "--lte-thumb": "#ffffff",
    "--lte-success-surface": "rgba(105,227,154,0.035)",
    "--lte-warning": "#fbd38d",
    "--lte-caution": "#faf089",
    "--lte-info": "#90cdf4",
    "--lte-success": "#9ae6b4",
    "--lte-shadow": "none"
  };

  var LTE_THEME_LIGHT = {
    "--lte-surface": "rgba(255,255,255,0.88)",
    "--lte-surface-strong": "rgba(255,255,255,0.94)",
    "--lte-border": "rgba(15,23,42,0.10)",
    "--lte-border-soft": "rgba(15,23,42,0.09)",
    "--lte-border-faint": "rgba(15,23,42,0.08)",
    "--lte-inner": "rgba(15,23,42,0.035)",
    "--lte-inner-strong": "rgba(15,23,42,0.05)",
    "--lte-inner-faint": "rgba(15,23,42,0.025)",
    "--lte-input-bg": "rgba(15,23,42,0.05)",
    "--lte-input-text": "#1a202c",
    "--lte-text": "#1a202c",
    "--lte-text-strong": "#1a202c",
    "--lte-text-secondary": "#2d3748",
    "--lte-text-muted": "#4a5568",
    "--lte-text-faint": "#64748b",
    "--lte-text-soft": "rgba(15,23,42,0.55)",
    "--lte-text-medium": "rgba(15,23,42,0.72)",
    "--lte-divider": "rgba(15,23,42,0.08)",
    "--lte-hover": "rgba(15,23,42,0.06)",
    "--lte-hover-soft": "rgba(15,23,42,0.05)",
    "--lte-track": "rgba(15,23,42,0.16)",
    "--lte-stripe": "rgba(15,23,42,0.08)",
    "--lte-scroll-track": "rgba(15,23,42,0.04)",
    "--lte-scroll-track-soft": "rgba(15,23,42,0.06)",
    "--lte-thumb": "#ffffff",
    "--lte-success-surface": "rgba(22,163,74,0.06)",
    "--lte-warning": "#c05621",
    "--lte-caution": "#b7791f",
    "--lte-info": "#2b6cb0",
    "--lte-success": "#2f855a",
    "--lte-shadow": "0 10px 30px rgba(15,23,42,0.07)"
  };

  function lteTone(color, isDark) {
    if (isDark || typeof color !== "string") return color;
    var match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
    if (!match) return color;
    var hex = match[1];
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var red = parseInt(hex.slice(0, 2), 16);
    var green = parseInt(hex.slice(2, 4), 16);
    var blue = parseInt(hex.slice(4, 6), 16);
    var luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
    var factor = luminance > 0.55 ? 0.5 : 0.75;
    var r = Math.round(red * factor);
    var g = Math.round(green * factor);
    var b = Math.round(blue * factor);
    return "#" + [r, g, b].map(function(value) {
      return value.toString(16).padStart(2, "0");
    }).join("");
  }

  function lteUseTheme(api) {
    var mode = "dark";
    try {
      var useColorMode = api.ChakraUI && api.ChakraUI.useColorMode;
      if (typeof useColorMode === "function") {
        mode = useColorMode().colorMode || "dark";
      }
    } catch (error) {
      mode = "dark";
    }
    var isDark = mode !== "light";
    return {
      isDark: isDark,
      style: isDark ? LTE_THEME_DARK : LTE_THEME_LIGHT,
      tone: function(color) {
        return lteTone(color, isDark);
      }
    };
  }
