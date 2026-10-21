# Launcher Theme Enhancer 2.1.0

![Launcher Theme Enhancer 2.1.0](https://raw.githubusercontent.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/main/docs/images/launcher-preview.webp)

## 中文

### 版本概述

Launcher Theme Enhancer 已更新至 `2.1.0`。本次更新加入主页卡片显示管理，用户可以按需隐藏城市天气、主题增强或鼠标效果卡片，减少主页占用空间。

### 主页卡片显示管理

- 设置页新增“主页卡片”区域。
- 可分别控制城市天气、主题增强和鼠标效果卡片的显示状态。
- 支持隐藏全部主页卡片。
- 修改多个开关后，通过“应用并刷新”统一保存并重载扩展。
- 设置页始终保留，因此即使隐藏全部卡片，也可以随时重新开启。
- 隐藏卡片不会关闭对应的主题粒子、鼠标效果或视频恢复逻辑。
- 未启用的卡片不会注册到启动器，而不是只返回空内容，因此可以真正释放主页空间。

如果只保留一张主页卡片，SJMCL 可能重置该卡片已保存的宽度或折叠状态。设置页会显示对应提示。

### 已有功能

- 21 种主题粒子效果，包括樱花、萤火虫、DNA 粒子流、鬼影、雨滴涟漪和键盘光效。
- 6 种鼠标效果：光标星尘、彗尾轨迹、星芒轨迹、樱叶轨迹、雪花拖尾和数据残影。
- 城市天气、动态视频背景、主题粒子和鼠标效果均支持状态记忆。
- 主题粒子与视频背景独立控制。
- 城市天气“动态氛围”开关只控制视觉动画，不影响天气查询。
- 三张首页卡片和设置页使用统一的动态彩色光带、状态徽章和开关交互。
- 视频与粒子使用隔离背景层，不会覆盖其他扩展页面、弹窗或独立窗口。
- 支持中文与英文界面实时切换。

### 兼容性

- 最低 SJMCL 版本：`1.1.3`
- 扩展标识符：`org.yoshino.launcher-theme-enhancer`
- 安装包：`org.yoshino.launcher-theme-enhancer-2.1.0.sjmclx`

不建议与 `sjmcl-video-background`、`sjmcl-weather-effects`、`sjmcl-city-weather` 等旧版独立插件同时启用。

### 校验信息

`SHA-256: 2BCD0DEAFEB9099B9C4F0B3A6ADA442A710F49F27D2B69E4265687CDD4319002`

完整更新记录请查看 [CHANGELOG.md](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/blob/main/CHANGELOG.md)。

---

## English

### Overview

Launcher Theme Enhancer has been updated to `2.1.0`. This release introduces home widget visibility management, allowing users to hide City Weather, Theme Enhancer, or Mouse Effects cards when they need more home page space.

### Home Widget Visibility

- Adds a Home Widgets section to the settings page.
- City Weather, Theme Enhancer, and Mouse Effects can be shown or hidden independently.
- All home widgets can be hidden.
- Multiple changes are saved together and applied through Apply & Reload.
- The settings page remains available, so hidden widgets can be restored at any time.
- Hiding a widget does not stop its theme particles, mouse effects, or video restoration logic.
- Disabled widgets are no longer registered with the launcher instead of returning empty content, so they truly release home page space.

If only one home widget remains visible, SJMCL may reset its saved width or collapsed state. The settings page displays a warning for this case.

### Existing Features

- 21 theme particle effects, including Cherry Blossom, Firefly Night, DNA Particle Drift, Ghost Shadows, Rain Ripples, and Keyboard Glow.
- 6 mouse effects: Cursor Stardust, Comet Trail, Sparkle Trail, Sakura Trail, Snowflake Trail, and Digital Glitch Trail.
- Persistent settings for City Weather, dynamic video backgrounds, theme particles, and mouse effects.
- Independent controls for theme particles and the video background.
- The City Weather Dynamic Ambience toggle affects visual animation only and does not disable weather search or data.
- The three home widgets and settings page share animated color accent lines, status badges, and toggle interactions.
- Video and particles use an isolated background layer without covering extension pages, modals, or standalone windows.
- Live switching between Chinese and English.

### Compatibility

- Minimum SJMCL version: `1.1.3`
- Extension identifier: `org.yoshino.launcher-theme-enhancer`
- Package: `org.yoshino.launcher-theme-enhancer-2.1.0.sjmclx`

Do not enable this extension together with legacy standalone plugins such as `sjmcl-video-background`, `sjmcl-weather-effects`, or `sjmcl-city-weather`.

### Verification

`SHA-256: 2BCD0DEAFEB9099B9C4F0B3A6ADA442A710F49F27D2B69E4265687CDD4319002`

See [CHANGELOG.md](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/blob/main/CHANGELOG.md) for the complete change history.
