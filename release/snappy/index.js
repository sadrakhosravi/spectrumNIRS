const { existsSync, readFileSync } = require("fs"),
    { join } = require("path"),
    { platform, arch } = process;
let nativeBinding = null,
    localFileExisted = !1,
    isMusl = !1,
    loadError = null;
switch (platform) {
    case "android":
        if (arch !== "arm64") throw new Error(`Unsupported architecture on Android ${arch}`);
        localFileExisted = existsSync(join(__dirname, "snappy.android-arm64.node"));
        try {
            localFileExisted ? (nativeBinding = require("./snappy.android-arm64.node")) : (nativeBinding = require("@napi-rs/snappy-android-arm64"));
        } catch (e) {
            loadError = e;
        }
        break;
    case "win32":
        switch (arch) {
            case "x64":
                localFileExisted = existsSync(join(__dirname, "snappy.win32-x64-msvc.node"));
                try {
                    localFileExisted ? (nativeBinding = require("./snappy.win32-x64-msvc.node")) : (nativeBinding = require("@napi-rs/snappy-win32-x64-msvc"));
                } catch (e) {
                    loadError = e;
                }
                break;
            case "ia32":
                localFileExisted = existsSync(join(__dirname, "snappy.win32-ia32-msvc.node"));
                try {
                    localFileExisted ? (nativeBinding = require("./snappy.win32-ia32-msvc.node")) : (nativeBinding = require("@napi-rs/snappy-win32-ia32-msvc"));
                } catch (e) {
                    loadError = e;
                }
                break;
            case "arm64":
                localFileExisted = existsSync(join(__dirname, "snappy.win32-arm64-msvc.node"));
                try {
                    localFileExisted ? (nativeBinding = require("./snappy.win32-arm64-msvc.node")) : (nativeBinding = require("@napi-rs/snappy-win32-arm64-msvc"));
                } catch (e) {
                    loadError = e;
                }
                break;
            default:
                throw new Error(`Unsupported architecture on Windows: ${arch}`);
        }
        break;
    case "darwin":
        switch (arch) {
            case "x64":
                localFileExisted = existsSync(join(__dirname, "snappy.darwin-x64.node"));
                try {
                    localFileExisted ? (nativeBinding = require("./snappy.darwin-x64.node")) : (nativeBinding = require("@napi-rs/snappy-darwin-x64"));
                } catch (e) {
                    loadError = e;
                }
                break;
            case "arm64":
                localFileExisted = existsSync(join(__dirname, "snappy.darwin-arm64.node"));
                try {
                    localFileExisted ? (nativeBinding = require("./snappy.darwin-arm64.node")) : (nativeBinding = require("@napi-rs/snappy-darwin-arm64"));
                } catch (e) {
                    loadError = e;
                }
                break;
            default:
                throw new Error(`Unsupported architecture on macOS: ${arch}`);
        }
        break;
    case "freebsd":
        if (arch !== "x64") throw new Error(`Unsupported architecture on FreeBSD: ${arch}`);
        localFileExisted = existsSync(join(__dirname, "snappy.freebsd-x64.node"));
        try {
            localFileExisted ? (nativeBinding = require("./snappy.freebsd-x64.node")) : (nativeBinding = require("@napi-rs/snappy-freebsd-x64"));
        } catch (e) {
            loadError = e;
        }
        break;
    case "linux":
        switch (arch) {
            case "x64":
                if (((isMusl = readFileSync("/usr/bin/ldd", "utf8").includes("musl")), isMusl)) {
                    localFileExisted = existsSync(join(__dirname, "snappy.linux-x64-musl.node"));
                    try {
                        localFileExisted ? (nativeBinding = require("./snappy.linux-x64-musl.node")) : (nativeBinding = require("@napi-rs/snappy-linux-x64-musl"));
                    } catch (e) {
                        loadError = e;
                    }
                } else {
                    localFileExisted = existsSync(join(__dirname, "snappy.linux-x64-gnu.node"));
                    try {
                        localFileExisted ? (nativeBinding = require("./snappy.linux-x64-gnu.node")) : (nativeBinding = require("@napi-rs/snappy-linux-x64-gnu"));
                    } catch (e) {
                        loadError = e;
                    }
                }
                break;
            case "arm64":
                if (((isMusl = readFileSync("/usr/bin/ldd", "utf8").includes("musl")), isMusl)) {
                    localFileExisted = existsSync(join(__dirname, "snappy.linux-arm64-musl.node"));
                    try {
                        localFileExisted ? (nativeBinding = require("./snappy.linux-arm64-musl.node")) : (nativeBinding = require("@napi-rs/snappy-linux-arm64-musl"));
                    } catch (e) {
                        loadError = e;
                    }
                } else {
                    localFileExisted = existsSync(join(__dirname, "snappy.linux-arm64-gnu.node"));
                    try {
                        localFileExisted ? (nativeBinding = require("./snappy.linux-arm64-gnu.node")) : (nativeBinding = require("@napi-rs/snappy-linux-arm64-gnu"));
                    } catch (e) {
                        loadError = e;
                    }
                }
                break;
            case "arm":
                localFileExisted = existsSync(join(__dirname, "snappy.linux-arm-gnueabihf.node"));
                try {
                    localFileExisted ? (nativeBinding = require("./snappy.linux-arm-gnueabihf.node")) : (nativeBinding = require("@napi-rs/snappy-linux-arm-gnueabihf"));
                } catch (e) {
                    loadError = e;
                }
                break;
            default:
                throw new Error(`Unsupported architecture on Linux: ${arch}`);
        }
        break;
    default:
        throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`);
}
if (!nativeBinding) throw loadError || new Error("Failed to load native binding");
const { compressSync, compress, uncompressSync, uncompress } = nativeBinding;
(module.exports.compressSync = compressSync), (module.exports.compress = compress), (module.exports.uncompressSync = uncompressSync), (module.exports.uncompress = uncompress);
