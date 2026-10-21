<div align=center>

# Launcher Theme Enhancer

Integrates City Weather, Dynamic Video Background, and Particle Effects into one seamless launcher enhancement plugin 🎨

**English · [简体中文](README.md)**

<img src="docs/images/launcher-preview.webp" alt="Launcher Theme Enhancer 2.0.0 interface preview" width="960">

</div>
---

## About

Launcher Theme Enhancer is an SJMCL extension that merges three previously separate plugins into one seamless experience, resolving the conflict issues between them.

Built-in language toggle between Chinese and English in the settings panel — no need to install separate language versions.

Does not support coexistence with the old standalone plugins (sjmcl-video-background, sjmcl-weather-effects, sjmcl-city-weather). Please uninstall them before using this integrated version for the best experience.

## Features

### 🌤 City Weather
- Real-time weather data via Open-Meteo API
- 200+ cities worldwide
- Improved accuracy and smoother transitions compared to v0.1.0
- Adds a Dynamic Ambience switch that controls only the weather gradient and icon animation; search and weather data remain available

### 🎬 Dynamic Video Background
- Upload MP4/WebM video files as launcher background
- Fixed the old issue where video background overlapped other extension pages
- Volume control, play/remove

### ✨ Particle Effects (21 types)

- Cherry Blossom — pink petals drift from the upper-left toward the lower-right with rotation and fluttering
- Firefly Night — warm wandering lights that slowly drift and pulse in a dark night scene
- DNA Particle Drift — scattered cyan and magenta helix fragments drifting diagonally through the background
- Ghost Shadows — translucent drifting spirits with faint glowing eyes
- Rain Ripples — faint rainfall with expanding elliptical ripples across the lower screen
- Keyboard Glow — layered RGB underglow, subtle edge lighting, rising motes, and soft short light columns
- Enchantment — floating enchantment runes
- Sculk — warden-inspired sculk particles
- Freeze — ice and frost covering the interface
- Code — matrix-style green code rain
- Dust — fine dust floating in the air
- Vitality — vibrant colored glowing orbs
- Flame — dancing flame particles
- Snow — gently falling snowflakes
- Sunset — warm sunset glow
- Underwater — underwater bubbles and light rays
- Aurora — flowing aurora bands
- Rain — drizzling raindrops
- Sandstorm — swirling sand and dust
- Starry Sky — twinkling stars
- Falling Leaves — leaves drifting in the wind

### 🌐 Language Switch
- Toggle between Chinese and English in settings
- No need to download separate language versions

### 💾 Persistent State
- Remembers particle type, intensity, and running state
- Stores the selected video in IndexedDB and restores it after restart
- Remembers video volume and paused state
- If autoplay with sound is blocked, restores muted first and unlocks audio after the first click

### 🧱 Isolated Background Layer
- Video and particles render in a dedicated main-window background layer without covering extension pages, modals, or standalone windows
- Dynamic backgrounds are disabled by default in standalone windows

### 🖱 Mouse Effects
- Adds a dedicated Mouse Effects home card alongside City Weather and Theme Enhancer
- Uses an expandable effect selector with an animated accent line that follows the active effect
- Includes Cursor Stardust, Comet, Sparkle, Sakura, Snowflake, and Digital Glitch trails
- No particles are created while the pointer is stationary, and the canvas loop pauses when idle
- Includes an independent toggle and intensity control and runs alongside theme particles
- Disabled by default and can be enabled from the home card

### 🎛 Unified Card Interaction
- City Weather, Theme Enhancer, and Mouse Effects now share the same title icon, status badge, and toggle language
- The accent line pauses and loses brightness and saturation while its card is disabled
- The Theme Enhancer particle toggle controls particles only; the video background remains independently controlled
- Theme accent lines, selectors, sliders, and percentage labels follow the active particle palette
- The theme selector supports expansion, bounded scrolling, chevron rotation, and selected-item feedback

### ⚙️ Settings Interface
- The settings page now uses the same icons, status badges, animated accent lines, and interaction feedback as the home cards
- Theme effects use an expandable selector with a smoothly rotating chevron and a bounded, scrollable list
- When no video is selected, a compact file picker replaces the former oversized block
- Weather, theme particle, and video volume sliders share the same colored interaction style
- Settings stay synchronized with the home cards for toggles, particle type, intensity, and language
- City Weather, Theme Enhancer, and Mouse Effects home widgets can be shown or hidden independently
- Home widget visibility changes are applied together through the Apply & Reload action

## Installation

1. Download the .sjmclx file from Releases
2. Open SJMCL → Settings → Extension Management → Import. Supports file selection and drag-and-drop import
3. Enable and enjoy
## Compatibility

- Minimum launcher version: 1.1.3


## Related Projects & Documentation

- [SJMCL Extension Documentation](https://mc.sjtu.cn/sjmcl/dev/extension/)
- [awesome-SJMCL-extensions](https://github.com/SJMC-Dev/awesome-SJMCL-extensions)
## License

MIT

---

*This plugin was developed with the assistance of AI coding tools.*
