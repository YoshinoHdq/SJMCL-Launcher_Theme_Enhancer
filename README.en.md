<div align="center">

  <h1>Launcher Theme Enhancer</h1>

  <p>Weather, video backgrounds, 34 theme particles, 13 mouse trails, 6 click effects and an auto-hiding titlebar, all in one extension.</p>

  <p>
    <a href="https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/releases/latest">
      <img src="https://img.shields.io/github/v/release/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer?style=flat-square&label=release&color=7c6cff" alt="Latest release">
    </a>
    <img src="https://img.shields.io/badge/SJMCL-1.1.3%2B-4c9aff?style=flat-square" alt="SJMCL 1.1.3+">
    <img src="https://img.shields.io/badge/license-MIT-3fb950?style=flat-square" alt="MIT">
  </p>

  <p><b>English</b> · <a href="README.md">简体中文</a></p>

  <a href="docs/images/overview-dark.webp">
    <img src="docs/images/overview-dark.webp" alt="Launcher Theme Enhancer dark theme" width="960">
  </a>

  <p><sub>Dark theme · Theme Enhancer, Mouse Effects and Click Effects running together</sub></p>

</div>

## Quick start

| 1 | 2 | 3 |
| :---: | :---: | :---: |
| **Download** the `.sjmclx` from Releases | **Import** Settings → Extensions → Add | **Enable** the extension and refresh the list |

> Minimum launcher version: `1.1.3`. The auto-hiding titlebar requires `1.3.0+`; `1.3.2` is recommended.
>
> This extension cannot coexist with the old standalone plugins such as `sjmcl-video-background`, `sjmcl-weather-effects`, `sjmcl-city-weather` or `Auto Titlebar`. Uninstall them first.

[Download the latest release](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/releases/latest) · [View changelog](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/blob/main/CHANGELOG.md)

## Five home cards

| Card | What it does |
| --- | --- |
| **City Weather** | Real-time weather by city, with an optional animated ambience |
| **Theme Enhancer** | 34 theme particles, intensity control and a separately controlled video background |
| **Mouse Effects** | 13 cursor trails with independent toggle and intensity |
| **Click Effects** | Six click feedback effects with independent toggle and intensity |
| **Titlebar** | Auto-hide at the top edge, an 8px drag strip, trigger height and hide delay |

The settings page controls which cards appear on the launcher home page and shows the current state as `5 / 5`. Hiding a card only affects the home page; it does not stop the corresponding particles, trails or video restore logic.

## Follows the launcher light/dark theme

Cards, the settings page and the video warning modal follow the launcher's light or dark color mode. Dark mode keeps the original deep blue glass look. Light mode uses translucent white glass, dark text and a soft shadow, with accent text dimmed automatically so pale yellow and cyan palettes stay readable on white.

<p align="center">
  <a href="docs/images/overview-light.webp">
    <img src="docs/images/overview-light.webp" alt="Launcher Theme Enhancer light theme" width="960">
  </a>
</p>
<p align="center"><sub>Light theme: City Weather, Theme Enhancer and Mouse Effects · click the image for the full-size version</sub></p>

## City weather and video background

City Weather uses [Open-Meteo](https://open-meteo.com/) for real-time data, supports worldwide city lookup, and shows temperature, humidity, wind, feels-like temperature and weather conditions. The Dynamic Ambience switch only controls the gradient and icon animation; search and weather data remain available when it is off.

Video backgrounds support MP4 and WebM. Files over 100MB show a performance and storage warning first, but can still be used after confirmation. The video card handles play/pause, mute and volume, looping, replacing and a two-step remove. Disabling a video stops playback but never deletes the local file.

<p align="center">
  <a href="docs/images/feature-weather-video.webp">
    <img src="docs/images/feature-weather-video.webp" alt="City Weather, Film Reel and video background controls" width="960">
  </a>
</p>
<p align="center"><sub>City Weather, Film Reel and video background controls; video and particles are independent · click the image for the full-size version</sub></p>

- Videos are stored locally in IndexedDB and restored after a launcher restart; volume, looping and paused state are remembered
- If autoplay with sound is blocked, the video restores muted first and unlocks audio after the first click
- Save or restore failures show a notice and do not leave stale file names or size information behind
- Video and particles render in a dedicated main-window background layer without covering extension pages, modals or standalone windows; standalone windows do not load dynamic backgrounds by default

## Particle effects (34 types)

Theme particles take their palette from the active effect: accent lines, selectors, sliders and percentage labels all follow it. Effects can be selected from both the settings page and the home card, recent effects are shown first, and effects are grouped into Nature, Sky, Music, Mechanical, Digital and Other.

<details>
<summary><b>Expand all 34 theme particles</b></summary>

**Nature**

- Rain — gentle falling raindrops
- Rain Ripples — faint rain lines with expanding elliptical ripples
- Snow — slowly falling snowflakes
- Sandstorm — swirling sand and dust
- Falling Leaves — leaves drifting in the wind
- Cherry Blossom — pink petals rotating and fluttering from the upper-left
- Firefly Night — warm lights drifting and pulsing in a dark night scene
- Underwater — bubbles and light rays beneath the water
- Fire — a continuous fire band, three layers of flame tongues and cooling embers
- Dust — fine dust floating in the air
- Freeze — ice and frost covering the interface
- Dew Web — corner spider webs with dew drops, swaying and twinkling

**Sky**

- Starry Sky — a twinkling field of stars
- Aurora — three layered curtains of green-teal light with violet edges
- Sunset — warm sunset glow
- Lightning — occasional branching bolts with a brief sky flash and afterglow
- Quantum Entanglement — paired particles linked by faint lines, orbiting in opposite directions and collapsing periodically

**Music**

- Keyboard Glow — layered RGB underglow that reacts to physical key presses
- Melody Orbit — glowing notes circling along three tilted elliptical orbits
- Key Nocturne — two octaves of keys that glow with key presses and send up swaying notes
- Sound Orb — a central spectrum orb with pulsing bars and expanding sound rings

**Mechanical**

- Pocket Watches — six translucent watches drifting and turning with golden second-hand ripples
- Meshing Gears — twelve translucent gears around the screen edges, meshing slowly in opposite directions
- Film Reel — two continuously scrolling film strips with sprocket holes, abstract frames and grain
- Magnetic Field — two rotating dipoles with iron filings aligned along curved field lines

**Digital**

- DNA Particle Drift — cyan and magenta helix fragments drifting diagonally
- Ghost Shadows — translucent drifting spirits with faint glowing eyes
- Vigor — vibrant colored glowing orbs
- Enchanting — floating enchantment runes
- Code (Stealth Hacker) — matrix-style green code rain
- Sculk — warden-inspired sculk particles
- Signal Glitch — VHS tracking bands, falling pixel glyphs and RGB split
- Shattered Glass — glass shards drifting and turning with light-swept edge highlights
- Chat Bubbles — translucent speech bubbles with tails, typing dots and pop rings

</details>

There is also a **Blank** option that clears all theme particles at once.

## Mouse trails and click effects

Mouse Effects and Click Effects are separate home cards. They can be toggled independently and run alongside theme particles.

<p align="center">
  <a href="docs/images/feature-mouse-click-titlebar.webp">
    <img src="docs/images/feature-mouse-click-titlebar.webp" alt="Mouse Effects, Click Effects and Titlebar cards" width="960">
  </a>
</p>
<p align="center"><sub>Mouse trails, click effects and the auto-hiding titlebar can be controlled separately · click the image for the full-size version</sub></p>

- **Mouse trails (13)**: Stardust, Comet, Sparkle, Sakura, Snowflake, Digital Glitch, Note, Feather, Rune, Enderman, Mirror Shard, Arc, Confetti
- **Click effects (6)**: Ripple, Sparks, Rune Circle, Frostbite, Magnetic Field, Shatterpoint
- No particles are created while the pointer is stationary, and the canvas loop pauses when idle
- Clicks respond to the left button and touch only, use passive listeners and never block default page behavior

## Auto-hiding titlebar

Move the pointer to the top edge to reveal the titlebar; it hides again after the configured delay. An 8px drag strip remains at the top while hidden, so the window can still be moved.

- Trigger height is configurable from 8–40px
- Hide delay is configurable from 80–400ms
- The extension retries and watches for titlebars recreated by the launcher
- A conflict warning appears if the legacy Auto Titlebar extension is active
- Requires launcher 1.3.0+; the card disables itself with a notice when unsupported

This feature is merged from the discontinued [SJMCL-Auto_Titlebar](https://github.com/YoshinoHdq/SJMCL-Auto_Titlebar) (MIT). Uninstall the standalone version first.

## Settings and performance

The settings page uses the same icons, status badges and animated accent lines as the home cards. Toggles, particle type, intensity, language and video state stay synchronized.

- **Home card visibility**: show or hide each of the five cards, then apply the changes together with Apply & Reload
- **Language**: switch between Chinese and English, remember the last choice, follow the system language on first launch, and update home card titles immediately
- **Performance modes**: Auto / High Quality / Power Saver. Auto caps render resolution at 1.5x screen density, High Quality up to 2x, and Power Saver uses 1x with theme particles limited to 30 FPS
- **Reduce Motion**: pauses accent-line, film-strip and titlebar transitions and lowers lightning frequency and brightness; mouse trails still respond
- **Background pause**: video and animations pause while the launcher window is hidden and resume when visible
- **Resilient background layer**: falls back and re-attaches when the launcher DOM changes, and re-measures canvases on resize
- **Manual update check**: checks GitHub Releases on demand from the settings footer, with no automatic checks or notification badge; a newer version can be handed to the launcher for download and installation

<p align="center">
  <a href="docs/images/settings-cards.webp">
    <img src="docs/images/settings-cards.webp" alt="Settings: home card visibility and language" width="960">
  </a>
</p>
<p align="center"><sub>Settings: control each home card independently; current state 5 / 5 · click the image for the full-size version</sub></p>

<p align="center">
  <a href="docs/images/settings-performance.webp">
    <img src="docs/images/settings-performance.webp" alt="Settings: titlebar, Reduce Motion and performance mode" width="960">
  </a>
</p>
<p align="center"><sub>Titlebar trigger height and delay, Reduce Motion and three performance modes · click the image for the full-size version</sub></p>

## Compatibility and data

| Item | Details |
| --- | --- |
| Minimum launcher | `1.1.3` |
| Auto-hiding titlebar | Requires `1.3.0+` |
| Recommended launcher | `1.3.2` |
| Video formats | MP4 / WebM; files over 100MB show a warning first |
| Legacy plugins | Not compatible with standalone video-background, weather-effects, city-weather or Auto Titlebar |
| Local data | Settings and preferences in localStorage; videos in IndexedDB |
| Network | City names are sent to Open-Meteo for weather; update checks request GitHub Releases |
| Standalone windows | Dynamic backgrounds are disabled by default |

Video, particles and mouse effects render locally; video files and personal data are never uploaded.

## FAQ

<details>
<summary><b>Can I install it alongside the old standalone plugins?</b></summary>

No. This extension already includes weather, video and titlebar features. Keeping the old plugins installed can create duplicate background layers or titlebar bindings. Uninstall them before enabling this extension.

</details>

<details>
<summary><b>Why is the Titlebar card disabled?</b></summary>

The auto-hiding titlebar requires launcher `1.3.0+` and does not run in standalone windows. The card is also disabled when the legacy Auto Titlebar extension is detected; uninstall it and reopen the settings page.

</details>

<details>
<summary><b>Why is the video muted?</b></summary>

The system may have blocked autoplay with sound. The extension restores the video muted first and unlocks audio after the first click inside the launcher. You can also check the mute and volume controls on the video card.

</details>

<details>
<summary><b>Can I use a video larger than 100MB?</b></summary>

Yes. The warning describes performance and storage risks but does not block the file. Larger videos take longer to read and restore, so decide based on your device.

</details>

<details>
<summary><b>Does the interface follow the launcher light/dark theme?</b></summary>

Yes. The five home cards, settings page and video warning modal all follow the launcher's light or dark color mode. Dark mode keeps its original appearance.

</details>

<details>
<summary><b>Where is my data stored, and what happens on uninstall?</b></summary>

Settings and preferences live in the extension's localStorage, and videos live in local IndexedDB. Everything stays on your machine and is not uploaded. Uninstalling or deleting extension data means you will need to configure it again.

</details>

<details>
<summary><b>What if the update check fails?</b></summary>

The check needs access to GitHub Releases and can be affected by network, proxy or API rate limits. Try again later, or open the Releases page and download the latest `.sjmclx` manually.

</details>

## Development

```bash
npm install
npm run dev                  # build into the launcher extension dir and hot-reload via deeplink
npm run build                # release package: dist/<identifier>-<version>.sjmclx
npm run build -- --dev       # development package with a -dev suffix
npm run validate             # validate effects, mappings, locale keys and README counts
npm run bump -- 2.5.0        # sync versions in package.json and sjmcl.ext.json
```

The runtime source lives in `src/` and is concatenated into one scope in the order defined by `scripts/source-order.mjs`. Theme particles are split by effect under `src/effects/theme/`; add a new effect by creating a file and registering it in the order list. Cross-file `import` is not supported.

`frontend/index.js` and `dist/` are build outputs. Do not edit them directly; the build injects the version from `sjmcl.ext.json` and validates locale keys against the type definitions.

## Related projects and documentation

- [SJMCL extension documentation](https://mc.sjtu.cn/sjmcl/dev/extension/)
- [SJMCL extension API](https://mc.sjtu.cn/sjmcl/dev/extension/api.html)
- [awesome-SJMCL-extensions](https://github.com/SJMC-Dev/awesome-SJMCL-extensions)
- [Open-Meteo](https://open-meteo.com/): weather data source

## Credits and license

- Auto-hiding titlebar merged from [SJMCL-Auto_Titlebar](https://github.com/YoshinoHdq/SJMCL-Auto_Titlebar) (MIT), which is no longer maintained
- Weather data provided by [Open-Meteo](https://open-meteo.com/)
- Licensed under MIT

---

*This plugin was developed with the assistance of AI coding tools.*
