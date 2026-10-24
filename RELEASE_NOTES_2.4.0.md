# Launcher Theme Enhancer v2.4.0

> 适用 SJMCL `1.1.3` 及以上 · 建议从 2.3.x 直接覆盖安装，设置、主题偏好与已保存视频都会保留

## 简体中文

### 本次亮点

- **自动隐藏标题栏**：合并已停更的 Auto Titlebar。首页新增标题栏卡片，设置页支持触发高度（8–40px）与隐藏延迟（80–400ms）；标题栏隐藏时保留 8px 顶部拖动条，并会检测旧 Auto Titlebar 插件、提示冲突
- **视频背景控制台重做**：状态化媒体卡、动态胶片光带、播放/暂停、静音/音量、循环播放与两步移除；关闭视频只停止播放，不会删除本地文件
- **点击效果**：新增独立首页卡片与设置页分区，包含波纹、火花、符文法阵、冻结、磁场、镜面裂纹共 6 种效果
- **主题粒子扩充至 34 种**：新增旋律环流、琴键夜曲、碎镜浮光、量子纠缠、胶片流转、声波球、时之怀表、咬合齿轮、信号故障、聊天气泡、磁场、蛛网晨露、闪电；移除浮羽
- **鼠标拖尾扩充至 13 种**：新增音符、羽毛、附魔符文、末影粒子、镜面碎片、电弧、碎纸
- **主题选择器分组与最近使用**：按自然、天空、音乐、机械、数字、其他分类；最近使用过的效果自动置顶，展开时聚焦当前选项
- **手动检查更新**：设置页底部可检查 GitHub 最新 Release，查看更新说明并直接下载安装；不自动检查，也不显示小红点
- **减少动态效果**：设置页新增开关，也会遵循系统的“减少动态效果”偏好，降低标题栏过渡与闪电等效果的动画强度

### 优化与修复

- 构建前运行一致性校验：效果 ID、设置/首页映射、语言键、README 数量与版本号
- 蛛网和磁场路径缓存；状态轮询降频，窗口隐藏时自动暂停
- 更新检查增加 15 秒超时、友好错误提示、5 分钟缓存与上次检查时间
- 视频播放/暂停改用几何图标；标题栏目标检测跳过自身拖动条与 body/html
- 设置页、首页卡片与语言切换保持同步，选项容器只滚动自身、不带动整个页面

### 安装 / 升级

1. 下载下方的 `org.yoshino.launcher-theme-enhancer-2.4.0.sjmclx`
2. SJMCL → 设置 → 扩展 → 添加，选择该文件
3. 导入后**手动启用**扩展（会出现安全确认）
4. 若列表未刷新，点击扩展页顶部刷新按钮

从 2.3.x 覆盖安装即可；本地设置、主题/拖尾偏好和已保存的视频都会保留。

### 与 Auto Titlebar 的关系

Auto Titlebar 已停止维护，其自动隐藏标题栏功能已合并进本扩展。若两者同时安装，请根据设置页标题栏分区的提示停用其中一个，避免重复绑定标题栏。

### 兼容性

- 最低启动器版本：`1.1.3`
- 扩展标识符：`org.yoshino.launcher-theme-enhancer`
- 推荐启动器版本：`1.3.2`

### 文件校验

- 文件：`org.yoshino.launcher-theme-enhancer-2.4.0.sjmclx`
- 大小：111,391 字节
- SHA-256：`09fdd63750b1d3e0a99727bb7a243cc51c840086ba02699b9a08ef2c0e480cb6`

完整更新记录见 [CHANGELOG.md](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/blob/main/CHANGELOG.md)。

---

## English

### Highlights

- **Auto-hiding titlebar**: the discontinued Auto Titlebar extension is now merged in. A new titlebar home card and settings section provide a trigger zone (8–40px) and hide delay (80–400ms); an 8px top drag strip remains while hidden, and a conflict warning appears if the legacy Auto Titlebar extension is still installed
- **Redesigned video background console**: status-driven media card, animated film-strip band, play/pause, mute/volume, loop and a two-step remove; disabling video only stops playback and never deletes the local file
- **Click effects**: a dedicated home card and settings section with six effects — ripple, sparks, rune circle, frostbite, magnetic field and shatterpoint
- **Theme particles expanded to 34**: added Melody Orbit, Key Nocturne, Shattered Glass, Quantum Entanglement, Film Reel, Sound Orb, Pocket Watches, Meshing Gears, Signal Glitch, Chat Bubbles, Magnetic Field, Dew Web and Lightning; removed Drifting Feathers
- **Mouse trails expanded to 13**: added Note, Feather, Rune, Enderman, Mirror Shards, Arc and Confetti
- **Grouped theme selector with recent effects**: categories for Nature, Sky, Music, Mechanical, Digital and Other; recently used effects move to the top, and the selector scrolls to the current option when opened
- **Manual update check**: check the latest GitHub Release from the settings footer, read its notes and download/install directly; no automatic checks and no notification badge
- **Reduce Motion**: a new settings toggle that also respects the system preference, softening titlebar transitions and effects such as lightning

### Fixes & improvements

- Build-time consistency validation for effect IDs, settings/home mappings, locale keys, README counts and version numbers
- Cached spider-web and magnetic-field paths; lower polling frequency and automatic pause while the window is hidden
- Update check with a 15-second timeout, friendly errors, a 5-minute cache and last-checked time
- Geometric play/pause icons; titlebar target detection now skips its own drag strip and body/html
- Settings page, home cards and language switching stay in sync; option lists scroll only themselves, never the whole page

### Install / Upgrade

1. Download `org.yoshino.launcher-theme-enhancer-2.4.0.sjmclx` below
2. SJMCL → Settings → Extensions → Add, then select the file
3. **Enable the extension manually** after import (a security confirmation appears)
4. If it doesn't show up, click the refresh button at the top of the Extensions page

Upgrading from 2.3.x: import over the old version. Local settings, theme/trail preferences and saved videos are preserved.

### Relationship with Auto Titlebar

Auto Titlebar is discontinued, and its auto-hide titlebar feature is now part of this extension. If both are installed, disable one of them as prompted in the titlebar section of the settings page to avoid binding the titlebar twice.

### Compatibility

- Minimum launcher version: `1.1.3`
- Extension identifier: `org.yoshino.launcher-theme-enhancer`
- Recommended launcher version: `1.3.2`

### File verification

- File: `org.yoshino.launcher-theme-enhancer-2.4.0.sjmclx`
- Size: 111,391 bytes
- SHA-256: `09fdd63750b1d3e0a99727bb7a243cc51c840086ba02699b9a08ef2c0e480cb6`

See [CHANGELOG.md](https://github.com/YoshinoHdq/SJMCL-Launcher_Theme_Enhancer/blob/main/CHANGELOG.md) for the full changelog.
