(() => {
  "use strict";

  // ====== DOM ======
  const canvas = document.getElementById('etchCanvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  const announce = document.getElementById('announce');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // ====== State ======
  let tipColor = '#e2e8f0';
  let bgColor = '#0a0a0a';
  let frameColor = '#3a3f4b';
  let arrowColor = '#ff0000'; // stroke default bright red
  let arrowFill = '#f5f5f5';  // fill default whitesmoke
  let currentTipColor = tipColor;
  let tipWidth = 3;
  let drawing = true;
  let step = 5;
  let pos = { x: 20, y: 20 };
  let history = [];

  // Preview system
  let previewImage = null;
  let isPreviewing = false;

  // Throttling & cooldown
  let lastDraw = 0;
  const DRAW_THROTTLE_MS = 30;

  // ====== Utils (Security & Resilience) ======
  function say(msg) {
    // Small live-region debouncer to avoid SR spam
    if (!announce) return;
    window.requestAnimationFrame(() => { announce.textContent = String(msg || ''); });
  }

  function safeColor(value, fallback) {
    // Accepts #RRGGBB only
    return /^#[0-9A-Fa-f]{6}$/.test(value) ? value : fallback;
  }

  function safeWidth(value, fallback = 3) {
    const n = Number(value);
    return (Number.isFinite(n) && n >= 1 && n <= 20) ? n : fallback;
  }

  function withCooldown(fn, delay = 600) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last > delay) {
        last = now;
        try { fn(...args); } catch (e) { console.error(e); say('Action failed.'); }
      } else {
        // Optional UX toast could go here
      }
    };
  }

  function safeOpen(url) {
    try {
      const w = window.open(url, '_blank', 'noopener,noreferrer');
      if (w) return w;
    } catch {}
    say('Pop-up blocked. Please allow pop-ups for Sketchy.');
    return null;
  }

  // ====== Canvas Setup ======
  function setCanvasSize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 3)); // clamp DPR for memory safety
    canvas.width  = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);
  }

  // History (Undo) with cap
  function saveState() {
    try {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      history.push(data);
      if (history.length > 50) history.shift(); // cap
    } catch (err) {
      console.error('Error saving state:', err);
      // If getImageData fails (in memory), clear history to recover
      history = [];
    }
  }

  function undo() {
    if (history.length > 1) {
      history.pop();
      const prev = history[history.length - 1];
      try {
        ctx.putImageData(prev, 0, 0);
        say('Undo last action.');
      } catch (e) {
        console.error(e);
        say('Undo failed.');
      }
    } else {
      say('Nothing to undo.');
    }
  }

  // ====== Drawing ======
  function drawDot(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, tipWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = currentTipColor;
    ctx.fill();
  }

  function move(dx, dy) {
    const prev = { ...pos };
    pos.x = Math.max(0, Math.min(canvas.width - 1, pos.x + dx));
    pos.y = Math.max(0, Math.min(canvas.height - 1, pos.y + dy));

    if (drawing) {
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = currentTipColor;
      ctx.lineWidth = tipWidth;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
      drawDot(pos.x, pos.y);
      saveState();
    }
  }

  function throttledMove(dx, dy) {
    const now = Date.now();
    if (now - lastDraw > DRAW_THROTTLE_MS) {
      move(dx, dy);
      lastDraw = now;
    }
  }

  function invertHex(hex) {
    try {
      const c = hex.startsWith('#') ? hex.substring(1) : hex;
      if (c.length !== 6) return hex;
      const r = (255 - parseInt(c.substring(0,2), 16)).toString(16).padStart(2, '0');
      const g = (255 - parseInt(c.substring(2,4), 16)).toString(16).padStart(2, '0');
      const b = (255 - parseInt(c.substring(4,6), 16)).toString(16).padStart(2, '0');
      return `#${r}${g}${b}`;
    } catch {
      return hex;
    }
  }

  // ====== File actions ======
  function newPage() {
    try {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pos = { x: Math.round(canvas.width * 0.1), y: Math.round(canvas.height * 0.1) };
      drawDot(pos.x, pos.y);
      saveState();
      say('New page created.');
    } catch (e) {
      console.error(e);
      say('Failed to create a new page.');
    }
  }

  function printImage() {
  try {
    const url = canvas.toDataURL('image/png');
    const w = safeOpen('');
    if (!w) return;
    const img = w.document.createElement('img');
    img.src = url;
    img.alt = "Etch drawing";
    img.style.maxWidth = "100%";
    w.document.body.appendChild(img);
    w.print();
  } catch (e) {
    console.error(e);
    say('Print failed.');
  }
}


  function saveAsPng() {
  try {
    // Create an offscreen canvas slightly bigger to include frame
    const exportCanvas = document.createElement('canvas');
    const padding = 20; // size of frame border in pixels
    exportCanvas.width = canvas.width + padding * 2;
    exportCanvas.height = canvas.height + padding * 2;
    const exportCtx = exportCanvas.getContext('2d');

    // Fill frame (wrap color)
    exportCtx.fillStyle = frameColor;
    exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Fill background inside the frame
    exportCtx.fillStyle = bgColor;
    exportCtx.fillRect(padding, padding, canvas.width, canvas.height);

    // Copy user drawing into the background
    exportCtx.drawImage(canvas, padding, padding);

    // Save flattened image
    const url = exportCanvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `etch-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    say('Image downloaded with styles included.');
  } catch (e) {
    console.error(e);
    say('Save failed.');
  }
}

  // Exit (close tab)
  function exitApp() {
    try {
      if (confirm('Exit Etch? Unsaved work will be lost.')) {
        window.close();
        if (!window.closed) say('Please close tab manually.');
      }
    } catch (e) {
      console.error(e);
      say('Exit failed.');
    }
  }

  // ====== Wiring File menu with cooldowns ======
  document.getElementById('action-new')?.addEventListener('click', withCooldown(newPage));
  document.getElementById('action-save')?.addEventListener('click', withCooldown(saveAsPng));
  document.getElementById('action-print')?.addEventListener('click', withCooldown(printImage));
  document.getElementById('action-exit')?.addEventListener('click', withCooldown(exitApp));
  document.getElementById('action-undo')?.addEventListener('click', withCooldown(undo, 300));

  // ====== Settings ======
  const bgPicker = document.getElementById('bg-color');
  const tipPicker = document.getElementById('tip-color');
  const framePicker = document.getElementById('frame-color');
  const arrowPicker = document.getElementById('arrow-color');     // stroke
  const arrowFillPicker = document.getElementById('arrow-fill');  // fill (may be in DOM or added later)
  const tipWidthRange = document.getElementById('tip-width');

  // Initialize UI from state
  canvas.style.backgroundColor = bgColor;
  const wrap = document.querySelector('.canvas-wrap');
  if (wrap) wrap.style.borderColor = frameColor;

  // Initialize CSS variables for arrows (used by styles.css)
  document.documentElement.style.setProperty('--arrows', arrowColor);
  document.documentElement.style.setProperty('--arrow-fill', arrowFill);

  bgPicker?.addEventListener('input', () => {
    const next = safeColor(bgPicker.value, bgColor);
    if (next !== bgColor) {
      bgColor = next;
      canvas.style.backgroundColor = bgColor;
      say('Background updated.');
    }
  });

  tipPicker?.addEventListener('input', () => {
    const next = safeColor(tipPicker.value, tipColor);
    if (next !== tipColor) {
      tipColor = next;
      say('Tip color updated.');
    }
  });

  framePicker?.addEventListener('input', () => {
    const next = safeColor(framePicker.value, frameColor);
    if (next !== frameColor) {
      frameColor = next;
      if (wrap) wrap.style.borderColor = frameColor;
      say('Frame color updated.');
    }
  });

  arrowPicker?.addEventListener('input', () => {
    const next = safeColor(arrowPicker.value, arrowColor);
    if (next !== arrowColor) {
      arrowColor = next;
      document.documentElement.style.setProperty('--arrows', arrowColor);
      say('Arrow stroke color updated.');
    }
  });

  arrowFillPicker?.addEventListener('input', () => {
    const next = safeColor(arrowFillPicker.value, arrowFill);
    if (next !== arrowFill) {
      arrowFill = next;
      document.documentElement.style.setProperty('--arrow-fill', arrowFill);
      say('Arrow fill color updated.');
    }
  });

  tipWidthRange?.addEventListener('input', () => {
    const next = safeWidth(tipWidthRange.value, tipWidth);
    if (next !== tipWidth) {
      tipWidth = next;
      say('Tip width updated.');
    }
  });

  // ====== Keyboard handling (throttled) ======
  function handleKey(e) {
    const tag = e.target?.tagName;
    if (tag && (tag === 'INPUT' || tag === 'TEXTAREA') || e.target?.isContentEditable) return;

    // Undo
    if ((e.ctrlKey || e.metaKey) && String(e.key || '').toLowerCase() === 'z') {
      e.preventDefault();
      undo();
      return;
    }

    const key = e.key;
    let dx = 0, dy = 0;

    if (key === 'ArrowUp'    || key.toLowerCase() === 'w') dy = -step;
    else if (key === 'ArrowDown'  || key.toLowerCase() === 's') dy = step;
    else if (key === 'ArrowLeft'  || key.toLowerCase() === 'a') dx = -step;
    else if (key === 'ArrowRight' || key.toLowerCase() === 'd') dx = step;
    else if (key.toLowerCase() === 'n') { e.preventDefault(); newPage(); return; }
    else return;

    e.preventDefault();

    if (e.shiftKey) {
      // Preview path: invert color, draw, then immediately restore snapshot
      try {
        if (!isPreviewing) {
          previewImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
          isPreviewing = true;
        }
        currentTipColor = invertHex(tipColor);
        throttledMove(dx, dy);
        if (previewImage) ctx.putImageData(previewImage, 0, 0);
      } catch (err) {
        console.error(err);
      }
    } else {
      if (isPreviewing) {
        previewImage = null;
        isPreviewing = false;
      }
      currentTipColor = tipColor;
      throttledMove(dx, dy);
    }
  }

  document.addEventListener('keydown', handleKey, { passive: false });

  // ====== Menu toggling (with outside-click close) ======
  function setupMenu(triggerId, menuId) {
    const trigger = document.getElementById(triggerId);
    const menu = document.getElementById(menuId);
    if (!trigger || !menu) return;

    const toggle = () => {
      const expanded = trigger.getAttribute('aria-expanded') === 'true';
      trigger.setAttribute('aria-expanded', String(!expanded));
      menu.setAttribute('aria-hidden', String(expanded));
    };

    trigger.addEventListener('click', withCooldown(toggle, 150));

    document.addEventListener('click', (e) => {
      const t = e.target;
      if (!menu.contains(t) && t !== trigger) {
        trigger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
      }
    });
  }

  setupMenu('menu-file', 'menu-file-list');
  setupMenu('menu-settings', 'menu-settings-list');

  // ====== Init ======
  window.addEventListener('resize', setCanvasSize);
  setCanvasSize();
  // Draw initial dot + save
  newPage();

})();
