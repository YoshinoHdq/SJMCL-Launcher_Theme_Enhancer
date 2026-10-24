import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];

function read(rel) {
  return readFileSync(path.join(root, rel), "utf8");
}

function fail(message) {
  errors.push(message);
}

const effectFiles = readdirSync(path.join(root, "src/effects/theme")).filter((f) => f.endsWith(".ts"));
const effectSource = effectFiles
  .map((f) => read(path.join("src/effects/theme", f)))
  .join("\n");
const optionSource = read("src/engine/theme-effects.ts");
const optionIds = [...optionSource.matchAll(/\{ v: "([a-z0-9_]+)"/g)].map((m) => m[1]);
const definedIds = [...effectSource.matchAll(/themeEffects\.([a-z0-9_]+) =/g)].map((m) => m[1]);

for (const id of optionIds) {
  if (!definedIds.includes(id)) fail("missing theme effect implementation: " + id);
}
for (const id of definedIds) {
  if (!optionIds.includes(id)) fail("theme effect has no option entry: " + id);
}
for (const id of optionIds) {
  const line = optionSource.split("\n").find((l) => l.includes('{ v: "' + id + '"'));
  if (!line || !/colors: \[[^\]]+\]/.test(line)) fail("theme option missing colors: " + id);
}
for (const file of effectFiles) {
  const id = file.replace(/\.ts$/, "");
  if (!definedIds.includes(id)) fail("effect file does not register an effect: " + file);
}

const groupIds = [...optionSource.matchAll(/ids: \[([^\]]+)\]/g)]
  .flatMap((m) => [...m[1].matchAll(/"([a-z0-9_]+)"/g)].map((x) => x[1]));
for (const id of optionIds) {
  if (!groupIds.includes(id)) fail("theme option missing from selector groups: " + id);
}

const sourceOrder = read("scripts/source-order.mjs");
for (const file of effectFiles) {
  if (!sourceOrder.includes('"src/effects/theme/' + file + '"')) fail("effect file missing from source-order: " + file);
}

const mouseSource = read("src/engine/mouse-effects.ts");
const mouseIds = [...mouseSource.matchAll(/\{ id: "([a-z0-9_]+)", icon:/g)]
  .map((m) => m[1])
  .filter((id) => !id.startsWith("click_"));
const clickIds = [...mouseSource.matchAll(/\{ id: "(click_[a-z0-9_]+)"/g)].map((m) => m[1]);
for (const id of mouseIds) {
  if (id === "cursor_stardust") continue;
  if (!mouseSource.includes('_cursorEffectType === "' + id + '"')) fail("mouse effect missing handler: " + id);
}
for (const id of clickIds) {
  if (!mouseSource.includes('_clickEffectType === "' + id + '"')) fail("click effect missing handler: " + id);
}

const settings = read("src/pages/settings-page.ts");
const home = read("src/widgets/home-widget.ts");
for (const id of optionIds) {
  if (!settings.includes(id + ': "effect')) fail("settings page missing effect label mapping: " + id);
  if (!home.includes(id + ': "effect')) fail("home widget missing effect label mapping: " + id);
}

if (!sourceOrder.includes('"src/runtime/titlebar.ts"')) fail("titlebar runtime missing from source-order");
if (!read("src/index.ts").includes("installTitlebarRuntime")) fail("titlebar runtime is not started");
if (!read("src/index.ts").includes("disposeTitlebarRuntime")) fail("titlebar runtime is not disposed");

const readme = read("README.md");
if (!readme.includes("粒子特效（" + (optionIds.length - 1) + " 种）")) {
  fail("README particle count does not match " + (optionIds.length - 1));
}
const readmeBullets = (readme.match(/^- .+—/gm) || []).length;
if (readmeBullets !== optionIds.length - 1) {
  fail("README effect bullets (" + readmeBullets + ") do not match " + (optionIds.length - 1));
}
if (!readme.includes("标题栏自动隐藏")) fail("README is missing the titlebar section");

if (mouseSource.includes("onClick: videoKill") || settings.includes("onClick: videoKill")) {
  fail("legacy video UI marker is still present");
}

const manifest = JSON.parse(read("sjmcl.ext.json"));
const pkg = JSON.parse(read("package.json"));
if (manifest.version !== pkg.version) fail("manifest/package version mismatch");

if (!existsSync(path.join(root, "frontend"))) fail("frontend directory is missing");

if (errors.length) {
  console.error("Validation failed:");
  for (const error of errors) console.error(" - " + error);
  process.exit(1);
}
console.log("Validation passed: " + (optionIds.length - 1) + " theme effects, " + mouseIds.length + " mouse trails, " + clickIds.length + " click effects.");
