var VIDEO_DB_NAME = "LTEVidDB";
  var VIDEO_STORE_NAME = "d";
  var VIDEO_KEY = "v";
  var LARGE_VIDEO_BYTES = 100 * 1024 * 1024;
  var _pendingVideo = null;
  function openVideoDatabase() {
    return new Promise(function(resolve, reject) {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB is unavailable"));
        return;
      }
      const request = indexedDB.open(VIDEO_DB_NAME, 1);
      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) db.createObjectStore(VIDEO_STORE_NAME);
      };
      request.onsuccess = function() {
        resolve(request.result);
      };
      request.onerror = function() {
        reject(request.error || new Error("Failed to open video database"));
      };
    });
  }
  function saveVideoBlob(blob) {
    return openVideoDatabase().then(function(db) {
      return new Promise(function(resolve, reject) {
        const tx = db.transaction([VIDEO_STORE_NAME], "readwrite");
        tx.objectStore(VIDEO_STORE_NAME).put(blob, VIDEO_KEY);
        tx.oncomplete = function() {
          db.close();
          resolve();
        };
        tx.onerror = tx.onabort = function() {
          db.close();
          reject(tx.error || new Error("Failed to save video"));
        };
      });
    });
  }
  function loadStoredVideoBlob() {
    return openVideoDatabase().then(function(db) {
      return new Promise(function(resolve, reject) {
        const tx = db.transaction([VIDEO_STORE_NAME], "readonly");
        const request = tx.objectStore(VIDEO_STORE_NAME).get(VIDEO_KEY);
        request.onsuccess = function() {
          db.close();
          resolve(request.result || null);
        };
        request.onerror = function() {
          db.close();
          reject(request.error || new Error("Failed to load video"));
        };
      });
    });
  }
  function deleteStoredVideoBlob() {
    return openVideoDatabase().then(function(db) {
      return new Promise(function(resolve, reject) {
        const tx = db.transaction([VIDEO_STORE_NAME], "readwrite");
        tx.objectStore(VIDEO_STORE_NAME).delete(VIDEO_KEY);
        tx.oncomplete = function() {
          db.close();
          resolve();
        };
        tx.onerror = tx.onabort = function() {
          db.close();
          reject(tx.error || new Error("Failed to delete video"));
        };
      });
    }).catch(function() {
    });
  }
  var _vvideo = null;
  var _vurl = null;
  var _vactive = false;
  var _vpaused = false;
  var _vvol = 0.5;
  var _videoAudioUnlock = null;
  var _videoRestoreTimer = null;
  var _videoPersistenceChain = Promise.resolve();
  try {
    const sv = localStorage.getItem("lte-vvol");
    if (sv) {
      const parsed = parseFloat(sv);
      if (isFinite(parsed)) _vvol = Math.max(0, Math.min(1, parsed));
    }
  } catch (e) {
  }
  function releaseVideoAudioUnlock() {
    if (_videoAudioUnlock) {
      document.removeEventListener("pointerdown", _videoAudioUnlock, true);
      _videoAudioUnlock = null;
    }
  }
  function attachVideoAudioUnlock() {
    if (_videoAudioUnlock) return;
    _videoAudioUnlock = function() {
      if (_vvideo) {
        _vvideo.muted = false;
        _vvideo.volume = _vvol;
        const played = _vvideo.play();
        if (played && played.catch) played.catch(function() {
        });
      }
      releaseVideoAudioUnlock();
    };
    document.addEventListener("pointerdown", _videoAudioUnlock, { capture: true, once: true });
  }
  function clearVideoElement() {
    releaseVideoAudioUnlock();
    if (_vvideo) {
      try {
        _vvideo.pause();
      } catch (e) {
      }
      if (_vvideo.parentNode) _vvideo.parentNode.removeChild(_vvideo);
    }
    _vvideo = null;
    if (_vurl) {
      URL.revokeObjectURL(_vurl);
      _vurl = null;
    }
  }
  function mountVideoElement() {
    const host = ensureBackgroundHost();
    if (!host || !_vurl) return null;
    if (!_vvideo) {
      host.querySelectorAll("#lte-video-bg").forEach(function(stale) {
        stale.remove();
      });
      _vvideo = document.createElement("video");
      _vvideo.id = "lte-video-bg";
      _vvideo.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;z-index:1;object-fit:cover;pointer-events:none;";
      _vvideo.loop = true;
      _vvideo.playsInline = true;
      _vvideo.src = _vurl;
    }
    if (_vvideo.parentNode !== host) host.appendChild(_vvideo);
    return _vvideo;
  }
  function tryPlayVideo(restoreAutoplay) {
    if (!_vvideo) return;
    _vvideo.muted = Boolean(restoreAutoplay);
    _vvideo.volume = _vvol;
    const played = _vvideo.play();
    if (played && played.catch) {
      played.catch(function() {
        if (!_vvideo) return;
        _vvideo.muted = true;
        const retried = _vvideo.play();
        if (retried && retried.catch) retried.catch(function() {
        });
        attachVideoAudioUnlock();
      });
    }
    if (restoreAutoplay) attachVideoAudioUnlock();
  }
  function videoStart(blob, restoreMode) {
    if (isStandaloneWindow()) return false;
    clearVideoElement();
    _vurl = URL.createObjectURL(blob);
    if (!mountVideoElement()) {
      clearVideoElement();
      if (restoreMode) {
        if (_videoRestoreTimer) window.clearTimeout(_videoRestoreTimer);
        _videoRestoreTimer = window.setTimeout(function() {
          _videoRestoreTimer = null;
          videoStart(blob, true);
        }, 300);
      }
      return false;
    }
    _vactive = true;
    _vpaused = restoreMode ? Boolean(getLocal("v_paused", false)) : false;
    if (_vpaused) {
      _vvideo.pause();
    } else {
      tryPlayVideo(Boolean(restoreMode));
    }
    if (!restoreMode) setLocal("v_paused", false);
    return true;
  }
  function formatVideoSize(bytes) {
    if (!isFinite(bytes) || bytes <= 0) return "0 MB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
  }
  function requestVideoUse(file) {
    var fileName = file.name;
    setLocal("v_name", fileName);
    _videoPersistenceChain = _videoPersistenceChain.catch(function() {
    }).then(function() {
      return saveVideoBlob(file);
    }).catch(function() {
      if (getLocal("v_name", "") === fileName) {
        try {
          localStorage.removeItem(PREFIX + "v_name");
        } catch (e) {
        }
        notifyUser("videoSaveFailed", "error");
      }
    });
    videoStart(file, false);
  }
  function acceptPendingVideo() {
    var file = _pendingVideo;
    _pendingVideo = null;
    if (file) requestVideoUse(file);
  }
  function cancelPendingVideo() {
    _pendingVideo = null;
  }
  function pickVideoFile() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4,video/webm,video/ogg,video/*";
    input.onchange = function(e) {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      if (file.type && !/^video\//i.test(file.type)) {
        notifyUser("videoUnsupported", "error");
        return;
      }
      if (file.size > LARGE_VIDEO_BYTES) {
        _pendingVideo = file;
        var actions = _lteHostApi && _lteHostApi.actions;
        if (actions && typeof actions.openCustomModal === "function") {
          try {
            var modalKey = getSavedLocale() === "zh" ? "video-size-warning-zh" : "video-size-warning-en";
            actions.openCustomModal(modalKey);
            return;
          } catch (e) {
          }
        }
        notifyUser("videoLargeWarning", "warning");
        acceptPendingVideo();
        return;
      }
      requestVideoUse(file);
    };
    input.click();
  }
  function videoPlay() {
    if (!_vurl) return;
    if (!mountVideoElement()) return;
    _vpaused = false;
    setLocal("v_paused", false);
    tryPlayVideo(false);
  }
  function videoPause() {
    if (_vvideo) {
      _vvideo.pause();
      _vpaused = true;
      setLocal("v_paused", true);
    }
  }
  function videoKill() {
    clearVideoElement();
    _vactive = false;
    _vpaused = false;
    if (_videoRestoreTimer) {
      window.clearTimeout(_videoRestoreTimer);
      _videoRestoreTimer = null;
    }
    setLocal("v_paused", false);
    try {
      localStorage.removeItem(PREFIX + "v_name");
    } catch (e) {
    }
    _videoPersistenceChain = _videoPersistenceChain.catch(function() {
    }).then(function() {
      return deleteStoredVideoBlob();
    });
  }
  function videoVolume(v) {
    _vvol = Math.max(0, Math.min(1, Number(v) || 0));
    if (_vvideo) {
      _vvideo.volume = _vvol;
      _vvideo.muted = false;
      if (!_vpaused) {
        const played = _vvideo.play();
        if (played && played.catch) played.catch(function() {
        });
      }
    }
    try {
      localStorage.setItem("lte-vvol", String(_vvol));
    } catch (e) {
    }
  }
  function restoreVideoBackground() {
    if (isStandaloneWindow()) return;
    loadStoredVideoBlob().then(function(blob) {
      if (blob) videoStart(blob, true);
    }).catch(function() {
      if (getLocal("v_name", "")) notifyUser("videoRestoreFailed", "warning");
    });
  }

  