// 游戏入口 - 初始化所有模块
let game;
let staticNoise;

// 预加载进度跟踪
let loadedAssets = 0;
let totalAssets = 0;

/* =========================
   StaticQuasar931 Watermark
   ========================= */
(function initStaticQuasarWatermark(){
  function ensureWatermark(){
    if (document.getElementById("sq931-watermark")) return;

    const wm = document.createElement("a");
    wm.id = "sq931-watermark";
    wm.href = "https://sites.google.com/view/staticquasar931/gm3z";
    wm.target = "_blank";
    wm.rel = "noopener";
    wm.textContent = "Hosted by StaticQuasar931";
    wm.setAttribute("aria-label", "Hosted by StaticQuasar931 - More games");

    Object.assign(wm.style, {
      position: "fixed",
      left: "12px",
      bottom: "12px",
      zIndex: "99998",
      padding: "8px 10px",
      borderRadius: "10px",
      background: "rgba(0,0,0,0.55)",
      border: "1px solid rgba(94,225,255,0.30)",
      color: "#eaf4ff",
      fontFamily: "system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif",
      fontSize: "12px",
      fontWeight: "800",
      letterSpacing: "0.3px",
      textDecoration: "none",
      textShadow: "0 1px 2px rgba(0,0,0,0.9)",
      boxShadow: "0 0 10px rgba(94,225,255,0.22), 0 10px 22px rgba(0,0,0,0.35)",
      userSelect: "none",
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      msUserSelect: "none",
      cursor: "pointer",
      opacity: "0.9"
    });

    wm.addEventListener("mouseenter", () => { wm.style.opacity = "1"; });
    wm.addEventListener("mouseleave", () => { wm.style.opacity = "0.9"; });

    document.body.appendChild(wm);

    // Hidden note #1 (far away from watermark)
    if (!document.getElementById("sq931-note-1")) {
      const n1 = document.createElement("div");
      n1.id = "sq931-note-1";
      n1.textContent = "38fh3b87ejeef07t9j";
      Object.assign(n1.style, {
        position: "fixed",
        top: "6px",
        right: "6px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        opacity: "0.001",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap"
      });
      document.body.appendChild(n1);
    }

    // Hidden note #2 (different area from note #1 and watermark)
    if (!document.getElementById("sq931-note-2")) {
      const n2 = document.createElement("div");
      n2.id = "sq931-note-2";
      n2.textContent = "38dfh3hdbs8t7a4t6iecjqeusaesfa0r79t391j";
      Object.assign(n2.style, {
        position: "fixed",
        top: "50%",
        left: "6px",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        opacity: "0.001",
        pointerEvents: "none",
        userSelect: "none",
        whiteSpace: "nowrap",
        transform: "translateY(-50%)"
      });
      document.body.appendChild(n2);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureWatermark, { once: true });
  } else {
    ensureWatermark();
  }
})();

// 禁用浏览器默认行为，提升游戏体验
function disableBrowserDefaults() {
  // 禁用右键菜单
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  }, {
    capture: true
  });

  // 禁用拖拽
  document.addEventListener('dragstart', (e) => {
    e.preventDefault();
    return false;
  }, {
    capture: true
  });

  // 禁用选择文本（双击、长按等）
  document.addEventListener('selectstart', (e) => {
    e.preventDefault();
    return false;
  }, {
    capture: true
  });

  // 禁用复制
  document.addEventListener('copy', (e) => {
    e.preventDefault();
    return false;
  }, {
    capture: true
  });

  // 禁用剪切
  document.addEventListener('cut', (e) => {
    e.preventDefault();
    return false;
  }, {
    capture: true
  });

  // 禁用某些快捷键
  document.addEventListener('keydown', (e) => {
    // 禁用 Ctrl+A (全选)
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      return false;
    }
    // 禁用 Ctrl+C (复制)
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault();
      return false;
    }
    // 禁用 Ctrl+X (剪切)
    if (e.ctrlKey && e.key === 'x') {
      e.preventDefault();
      return false;
    }
    // 禁用 Ctrl+S (保存)
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      return false;
    }
    // 禁用 Ctrl+P (打印)
    if (e.ctrlKey && e.key === 'p') {
      e.preventDefault();
      return false;
    }
    // 禁用 Ctrl+U (查看源代码)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault();
      return false;
    }
  }, {
    capture: true
  });

  // 禁用触摸设备的长按菜单
  document.addEventListener('touchstart', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, {
    passive: false,
    capture: true
  });

  // 禁用双指缩放
  document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }
  }, {
    passive: false,
    capture: true
  });

  // 阻止鼠标选择文本
  document.addEventListener('mousedown', (e) => {
    // 允许按钮点击
    if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
      return true;
    }
    // 阻止其他元素的鼠标按下（防止拖拽选择）
    if (e.detail > 1) { // 双击或多击
      e.preventDefault();
      return false;
    }
  }, {
    capture: true
  });

  // console.log('Browser defaults disabled for better game experience');
}

// 更新预加载进度
function updatePreloadProgress(progress) {
  const progressBar = document.getElementById('progress-bar');
  const percentage = document.getElementById('preloader-percentage');

  if (progressBar && percentage) {
    progressBar.style.width = progress + '%';
    percentage.textContent = Math.round(progress) + '%';
  }
}

// 预加载所有游戏资源
async function preloadGameAssets() {
  const basePath = window.location.pathname.includes('/Five-Night-s-at-Epstein-s-FNAE-/') ?
    '/Five-Night-s-at-Epstein-s-FNAE-/' :
    './';

  // 定义所有需要预加载的资源
  const imagePaths = [
    'assets/images/original.png',
    'assets/images/Cam1.png',
    'assets/images/Cam2.png',
    'assets/images/Cam3.png',
    'assets/images/Cam4.png',
    'assets/images/Cam5.png',
    'assets/images/Cam6.png',
    'assets/images/Cam7.png',
    'assets/images/Cam8.png',
    'assets/images/Cam9.png',
    'assets/images/Cam10.png',
    'assets/images/Cam11.png',
    'assets/images/jump.png',
    'assets/images/menubackground.png',
    'assets/images/cutscene.png',
    'assets/images/fa3.png',
    'assets/images/FNAE-Map-layout.png',
    'assets/images/enemyep1.png',
    'assets/images/ep1.png',
    'assets/images/ep4.png',
    'assets/images/enemyep4.png',
    'assets/images/scaryhawk.png',
    'assets/images/scaryep.png',
    'assets/images/scarytrump.png',
    'assets/images/winscreen.png', // Night 5 胜利画面
    'assets/images/goldenstephen.png' // Golden 霍金
  ];

  const soundPaths = [
    'assets/sounds/music.ogg',
    'assets/sounds/music3.ogg',
    'assets/sounds/Static_sound.ogg',
    'assets/sounds/vents.ogg',
    'assets/sounds/jumpcare.ogg',
    'assets/sounds/Blip.ogg',
    'assets/sounds/winmusic.ogg',
    'assets/sounds/chimes.ogg',
    'assets/sounds/Crank1.ogg',
    'assets/sounds/Crank2.ogg',
    'assets/sounds/goldenstephenscare.ogg' // Golden 霍金音效
  ];

  totalAssets = imagePaths.length + soundPaths.length;
  loadedAssets = 0;

  // 预加载图片
  const imagePromises = imagePaths.map(path => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        loadedAssets++;
        updatePreloadProgress((loadedAssets / totalAssets) * 100);
        resolve();
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${path}`);
        loadedAssets++;
        updatePreloadProgress((loadedAssets / totalAssets) * 100);
        resolve();
      };
      img.src = basePath + path;
    });
  });

  // 预加载音频（不阻塞，快速加载）
  const audioPromises = soundPaths.map(path => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => {
        loadedAssets++;
        updatePreloadProgress((loadedAssets / totalAssets) * 100);
        resolve();
      }, {
        once: true
      });
      audio.addEventListener('error', () => {
        console.warn(`Failed to load audio: ${path}`);
        loadedAssets++;
        updatePreloadProgress((loadedAssets / totalAssets) * 100);
        resolve();
      }, {
        once: true
      });
      audio.src = basePath + path;
      audio.load();
    });
  });

  // 等待所有资源加载完成
  await Promise.all([...imagePromises, ...audioPromises]);

  // 确保进度条显示100%
  updatePreloadProgress(100);

  // 等待一小段时间让玩家看到100%
  await new Promise(resolve => setTimeout(resolve, 500));
}

// 隐藏预加载动画
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 500);
  }
}

// 页面加载完成后启动
window.addEventListener('DOMContentLoaded', async () => {
  // 禁用浏览器默认行为
  disableBrowserDefaults();

  // 先预加载所有资源
  await preloadGameAssets();

  // 预加载背景图片（用于恐怖脸效果）
  preloadBackgrounds();

  // 隐藏预加载动画
  hidePreloader();

  // 初始化游戏
  game = new Game();
  staticNoise = new StaticNoise();

  // 更新Continue按钮显示
  game.updateContinueButton();

  const mainMenu = document.getElementById('main-menu');

  // 检查是否从外部页面启动（带autostart参数）
  const urlParams = new URLSearchParams(window.location.search);
  const autostart = urlParams.get('autostart');

  // 启动菜单音乐
  const menuMusic = document.getElementById('menu-music');
  if (menuMusic) {
    menuMusic.volume = 0.5;

    // 如果是autostart，立即尝试播放
    if (autostart === '1') {
      // console.log('检测到autostart参数，尝试自动播放音乐...');
      menuMusic.play().then(() => {
        // console.log('✅ 音乐自动播放成功！');
      }).catch(e => {
        // console.log('❌ 自动播放失败，等待用户交互:', e);
        // 失败则等待用户点击
        setupManualPlayback();
      });
    } else {
      // 正常流程：等待用户点击
      setupManualPlayback();
    }

    function setupManualPlayback() {
      const playMusic = () => {
        if (mainMenu && !mainMenu.classList.contains('hidden')) {
          menuMusic.play().catch(e => {
            /* console.log('音乐播放需要用户交互') */ });
        }
        document.removeEventListener('click', playMusic);
        document.removeEventListener('keydown', playMusic);
      };

      document.addEventListener('click', playMusic);
      document.addEventListener('keydown', playMusic);
    }
  }

  // 监听主菜单显示/隐藏，控制雪花和鬼脸效果
  const observer = new MutationObserver(() => {
    if (mainMenu && !mainMenu.classList.contains('hidden')) {
      startScaryFaceFlicker();
      staticNoise.start();
    } else {
      stopScaryFaceFlicker();
      staticNoise.stop();
    }
  });

  if (mainMenu) {
    observer.observe(mainMenu, {
      attributes: true,
      attributeFilter: ['class']
    });

    if (!mainMenu.classList.contains('hidden')) {
      startScaryFaceFlicker();
      staticNoise.start();
    }
  }
});

// 监听来自父页面的消息（iframe 通信）
window.addEventListener('message', (event) => {
  if (event.data.type === 'USER_CLICKED_PLAY') {
    // console.log('收到父页面的用户点击事件');
    const menuMusic = document.getElementById('menu-music');
    if (menuMusic) {
      // 立即尝试播放音乐
      menuMusic.volume = 0.5;
      menuMusic.play().then(() => {
        // console.log('✅ 音乐自动播放成功！');
      }).catch(e => {
        // console.log('❌ 音乐播放失败:', e);
        // 如果失败，等待用户在游戏内点击
      });
    }
  }

});
