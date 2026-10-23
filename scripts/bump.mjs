import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import semver from "semver";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function readJson(file) {
  return JSON.parse(readFileSync(path.join(root, file), "utf8"));
}

function writeJson(file, value) {
  writeFileSync(path.join(root, file), JSON.stringify(value, null, 2) + "\n", "utf8");
}

function main() {
  const target = process.argv[2];
  if (!target) throw new Error("missing target version, e.g. npm run bump -- 2.2.0");

  const nextVersion = semver.valid(target);
  if (!nextVersion) throw new Error("invalid semantic version: " + target);

  const pkg = readJson("package.json");
  const manifest = readJson("sjmcl.ext.json");
  const previous = pkg.version;

  pkg.version = nextVersion;
  manifest.version = nextVersion;
  writeJson("package.json", pkg);
  writeJson("sjmcl.ext.json", manifest);

  console.log("Version bumped: " + previous + " -> " + nextVersion);
}

try {
  main();
} catch (error) {
  console.error("Bump failed: " + (error && error.message ? error.message : error));
  process.exitCode = 1;
}
