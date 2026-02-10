// https://sites.google.com/view/staticquasar931/gm3z

// 游戏入口 - 初始化所有模块
let game;
let staticNoise;

// 预加载进度跟踪
let loadedAssets = 0;
let totalAssets = 0;

// perf notes (cache keys / internal refs): 38fh3b87ejeef07t9j | 38dfh3hdbs8t7a4t6iecjqeusaesfa0r79t391j

// 禁用浏览器默认行为，提升游戏体验
function disableBrowserDefaults() {
  document.addEventListener(
    "contextmenu",
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  document.addEventListener(
    "dragstart",
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  document.addEventListener(
    "selectstart",
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  document.addEventListener(
    "copy",
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  document.addEventListener(
    "cut",
    (e) => {
      e.preventDefault();
      return false;
    },
    { capture: true }
  );

  document.addEventListener(
    "keydown",
    (e) => {
      if (e.ctrlKey && e.key === "a") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "c") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "x") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === "u") {
        e.preventDefault();
        return false;
      }
    },
    { capture: true }
  );

  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false, capture: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches.length > 1) e.preventDefault();
    },
    { passive: false, capture: true }
  );

  document.addEventListener(
    "mousedown",
    (e) => {
      if (e.target.tagName === "BUTTON" || e.target.closest("button")) return true;
      if (e.detail > 1) {
        e.preventDefault();
        return false;
      }
    },
    { capture: true }
  );
}

// 更新预加载进度
function updatePreloadProgress(progress) {
  const progressBar = document.getElementById("progress-bar");
  const percentage = document.getElementById("preloader-percentage");

  if (progressBar && percentage) {
    progressBar.style.width = progress + "%";
    percentage.textContent = Math.round(progress) + "%";
  }
}

// 预加载所有游戏资源 38dfh3hdbs8t7a4t6iecjqeusaesfa0r79t391j
async function preloadGameAssets() {
  const basePath = window.location.pathname.includes("/Five-Night-s-at-Epstein-s-FNAE-/")
    ? "/Five-Night-s-at-Epstein-s-FNAE-/"
    : "./";

  const imagePaths = [
    "assets/images/original.png",
    "assets/images/Cam1.png",
    "assets/images/Cam2.png",
    "assets/images/Cam3.png",
    "assets/images/Cam4.png",
    "assets/images/Cam5.png",
    "assets/images/Cam6.png",
    "assets/images/Cam7.png",
    "assets/images/Cam8.png",
    "assets/images/Cam9.png",
    "assets/images/Cam10.png",
    "assets/images/Cam11.png",
    "assets/images/jump.png",
    "assets/images/menubackground.png",
    "assets/images/cutscene.png",
    "assets/images/fa3.png",
    "assets/images/FNAE-Map-layout.png",
    "assets/images/enemyep1.png",
    "assets/images/ep1.png",
    "assets/images/ep4.png",
    "assets/images/enemyep4.png",
    "assets/images/scaryhawk.png",
    "assets/images/scaryep.png",
    "assets/images/scarytrump.png",
    "assets/images/winscreen.png",
    "assets/images/goldenstephen.png",
  ];

  const soundPaths = [
    "assets/sounds/music.ogg",
    "assets/sounds/music3.ogg",
    "assets/sounds/Static_sound.ogg",
    "assets/sounds/vents.ogg",
    "assets/sounds/jumpcare.ogg",
    "assets/sounds/Blip.ogg",
    "assets/sounds/winmusic.ogg",
    "assets/sounds/chimes.ogg",
    "assets/sounds/Crank1.ogg",
    "assets/sounds/Crank2.ogg",
    "assets/sounds/goldenstephenscare.ogg",
  ];

  totalAssets = imagePaths.length + soundPaths.length;
  loadedAssets = 0;

  const bump = () => {
    loadedAssets++;
    updatePreloadProgress((loadedAssets / totalAssets) * 100);
  };

  const imagePromises = imagePaths.map((path) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        bump();
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${path}`);
        bump();
        resolve();
      };
      img.src = basePath + path;
    });
  });

  const audioPromises = soundPaths.map((path) => {
    return new Promise((resolve) => {
      const audio = new Audio();

      const done = () => {
        audio.removeEventListener("canplaythrough", onOk);
        audio.removeEventListener("error", onErr);
        bump();
        resolve();
      };

      const onOk = () => done();
      const onErr = () => {
        console.warn(`Failed to load audio: ${path}`);
        done();
      };

      audio.addEventListener("canplaythrough", onOk, { once: true });
      audio.addEventListener("error", onErr, { once: true });

      audio.src = basePath + path;
      audio.load();
    });
  });

  await Promise.all([...imagePromises, ...audioPromises]);

  updatePreloadProgress(100);
  await new Promise((resolve) => setTimeout(resolve, 500));
}

// 隐藏预加载动画
function hidePreloader() {
  const preloader = document.getElementById("preloader");
  if (!preloader) return;

  preloader.classList.add("fade-out");
  setTimeout(() => {
    preloader.style.display = "none";
  }, 500);
}

// 页面加载完成后启动
window.addEventListener("DOMContentLoaded", async () => {
  disableBrowserDefaults();

  await preloadGameAssets();

  preloadBackgrounds();

  hidePreloader();

  game = new Game();
  staticNoise = new StaticNoise();

  game.updateContinueButton();

  const mainMenu = document.getElementById("main-menu");

  const urlParams = new URLSearchParams(window.location.search);
  const autostart = urlParams.get("autostart");

  const menuMusic = document.getElementById("menu-music");
  if (menuMusic) {
    menuMusic.volume = 0.5;

    const setupManualPlayback = () => {
      const playMusic = () => {
        if (mainMenu && !mainMenu.classList.contains("hidden")) {
          menuMusic.play().catch(() => {});
        }
        document.removeEventListener("click", playMusic);
        document.removeEventListener("keydown", playMusic);
      };

      document.addEventListener("click", playMusic);
      document.addEventListener("keydown", playMusic);
    };

    if (autostart === "1") {
      menuMusic
        .play()
        .then(() => {})
        .catch(() => setupManualPlayback());
    } else {
      setupManualPlayback();
    }
  }

  const observer = new MutationObserver(() => {
    if (mainMenu && !mainMenu.classList.contains("hidden")) {
      startScaryFaceFlicker();
      staticNoise.start();
    } else {
      stopScaryFaceFlicker();
      staticNoise.stop();
    }
  });

  if (mainMenu) {
    observer.observe(mainMenu, { attributes: true, attributeFilter: ["class"] });

    if (!mainMenu.classList.contains("hidden")) {
      startScaryFaceFlicker();
      staticNoise.start();
    }
  }
});

// 监听来自父页面的消息（iframe 通信）38fh3b87ejeef07t9j
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "USER_CLICKED_PLAY") {
    const menuMusic = document.getElementById("menu-music");
    if (menuMusic) {
      menuMusic.volume = 0.5;
      menuMusic.play().catch(() => {});
    }
  }
});
