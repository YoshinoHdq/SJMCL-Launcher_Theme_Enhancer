# Launcher Theme Enhancer v2.2.0

> 适用 SJMCL `1.1.3` 及以上 · 从 2.1.0 直接导入覆盖即可，设置与已保存视频都会保留

## 简体中文

### 本次亮点

- **语言记忆**：切换中英文后重启启动器仍会保持；首次启动跟随系统语言，首页卡片标题会随语言即时同步
- **性能模式**：设置页新增自动 / 高质量 / 省电三档，使用与主题粒子一致的选择器样式
- **高分屏优化**：自动模式最高 1.5x、高质量最高 2x、省电 1x 渲染分辨率；省电模式将主题粒子限制为 30 FPS
- **大视频不再硬限制**：超过 100MB 会先提示性能与存储风险，确认后仍可使用；保存失败会明确提示
- **背景层更稳**：启动器 DOM 结构变化时支持 fallback 与自动重挂载，窗口隐藏时自动暂停视频和动画
- **开关与状态**：设置页和首页卡片继续共享同一套视觉体系、状态徽章与彩色强调线

### 修复与改进

- 语言选择持久化到本地，重启后保持
- 首页卡片标题/描述按当前语言注册
- 视频超过 100MB 时弹出本地化确认框，取消不会改动当前背景
- 设置页与 README 补充 Open-Meteo 天气数据署名，修正“200+ 城市”的表述
- 源码按效果拆分为独立文件，版本号改由构建注入，构建期校验中英文语言键

### 安装 / 升级

1. 下载下方的 `org.yoshino.launcher-theme-enhancer-2.2.0.sjmclx`
2. SJMCL → 设置 → 扩展 → 添加，选择该文件
3. 导入后**手动启用**扩展（会显示安全确认）
4. 若列表未刷新，点击扩展页顶部刷新按钮

从 2.1.0 升级时直接导入覆盖即可；本地设置、粒子偏好和已保存的视频都会保留。

### 兼容性

- 最低启动器版本：`1.1.3`
- 扩展标识符：`org.yoshino.launcher-theme-enhancer`

### 文件校验

- 文件：`org.yoshino.launcher-theme-enhancer-2.2.0.sjmclx`
- 大小：71,075 字节
- SHA-256：`5cd30b552937b4d9502028900a291ed902bf7adeff4bc5a4ebf3cfb5b7aac5b2`

完整更新记录见 [CHANGELOG.md](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/blob/main/CHANGELOG.md)。

---

## English

### Highlights

- **Language memory**: Chinese/English choice now survives a launcher restart; first launch follows the system language, and home widget titles sync immediately
- **Performance modes**: Auto / High Quality / Power Saver in settings, using the same selector style as theme particles
- **HiDPI rendering**: Auto caps at 1.5x, High Quality at 2x, Power Saver at 1x; Power Saver limits theme particles to 30 FPS
- **No more hard video limit**: videos over 100MB show a performance/storage warning but can still be used after confirmation; save failures are reported clearly
- **More resilient background layer**: falls back and re-attaches when the launcher DOM changes, and pauses video/animations while the window is hidden
- **Consistent UI**: settings and home cards continue to share the same visual system, status badges and animated accent lines

### Fixes & improvements

- Language choice is persisted across restarts
- Home widget titles/descriptions are registered in the current language
- Videos over 100MB open a localized confirmation dialog; cancel leaves the current background untouched
- Added Open-Meteo attribution in settings and README; corrected the "200+ cities" wording
- Source is split by effect, the version is injected at build time, and locale key consistency is validated during builds

### Install / Upgrade

1. Download `org.yoshino.launcher-theme-enhancer-2.2.0.sjmclx` below
2. SJMCL → Settings → Extensions → Add, then select the file
3. **Enable the extension manually** after import (a security confirmation appears)
4. If it doesn't show up, click the refresh button at the top of the Extensions page

Upgrading from 2.1.0: import over the old version. Local settings, particle preferences and saved videos are preserved.

### Compatibility

- Minimum launcher version: `1.1.3`
- Extension identifier: `org.yoshino.launcher-theme-enhancer`

### File checksum

- File: `org.yoshino.launcher-theme-enhancer-2.2.0.sjmclx`
- Size: 71,075 bytes
- SHA-256: `5cd30b552937b4d9502028900a291ed902bf7adeff4bc5a4ebf3cfb5b7aac5b2`

See [CHANGELOG.md](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/blob/main/CHANGELOG.md) for the full history.
