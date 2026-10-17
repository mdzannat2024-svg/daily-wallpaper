(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var KEEP_DAYS = 30;

  function hash(s) { var h = 1779033703 ^ s.length; for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
  function rng(seed) { var a = seed; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  var THEMES = [
    { name: "Aurora Twilight", sky: ["#0b1030", "#3b2a7a", "#e58fb0"], aur: ["#3dffb0", "#9b6bff"], water: ["#2a6f9e", "#06203f"], mount: "#1b2a55", ice: "#cfeaff", glow: "#ffd6a8", stars: 1 },
    { name: "Pink Dawn", sky: ["#17224d", "#c0527a", "#ffcf8a"], aur: ["#7dffd6", "#ff8fd0"], water: ["#4a8fb8", "#0b2a4a"], mount: "#2b3566", ice: "#e8f6ff", glow: "#fff0c0", stars: .4 },
    { name: "Polar Night", sky: ["#030814", "#0a2a4a", "#1d6b86"], aur: ["#42ff9a", "#35c9ff"], water: ["#0f4f75", "#02101f"], mount: "#0a1f3a", ice: "#bfe6ff", glow: "#9be8ff", stars: 1 },
    { name: "Violet Dusk", sky: ["#120a2e", "#5a2a8c", "#ff9a8a"], aur: ["#a2ff7a", "#6be0ff"], water: ["#3a5fa0", "#0a1030"], mount: "#2a1f5a", ice: "#e6dcff", glow: "#ffc0b0", stars: .8 },
    { name: "Clear Blue Day", sky: ["#0a3a5a", "#3aa0c8", "#d8f4ff"], aur: ["#ffffff", "#bfefff"], water: ["#2e9cc4", "#0a3a66"], mount: "#3d6f96", ice: "#ffffff", glow: "#fff8d8", stars: 0 },
    { name: "Rose Horizon", sky: ["#2a0f33", "#b84a7a", "#ffc2a0"], aur: ["#8affc8", "#ffa0e0"], water: ["#5a78b0", "#150f33"], mount: "#3a2a5f", ice: "#ffeef4", glow: "#ffe0c0", stars: .5 },
    { name: "Emerald Night", sky: ["#02120f", "#0b4a45", "#3fb6a0"], aur: ["#6bffb0", "#3ad0ff"], water: ["#127a78", "#021a1a"], mount: "#073530", ice: "#c8fff0", glow: "#a0ffe0", stars: 1 },
    { name: "Golden Hour", sky: ["#1a1030", "#6a3b7a", "#ffb870"], aur: ["#ffe08a", "#ff9ac0"], water: ["#5a7ab0", "#1a1535"], mount: "#3a2a58", ice: "#fff2e0", glow: "#ffd890", stars: .3 }
  ];

  function swan(c, tint) {
    var g = c.createLinearGradient(0, -40, 0, 22);
    g.addColorStop(0, "#ffffff"); g.addColorStop(1, tint);
    c.fillStyle = g; c.strokeStyle = g;
    c.beginPath();
    c.moveTo(-78, -26);
    c.bezierCurveTo(-60, -6, -52, 14, -10, 18);
    c.bezierCurveTo(30, 22, 60, 10, 66, -10);
    c.bezierCurveTo(58, -30, 10, -34, -30, -28);
    c.bezierCurveTo(-52, -30, -66, -36, -78, -26);
    c.closePath(); c.fill();
    c.save(); c.strokeStyle = "rgba(110,140,185,.35)"; c.lineWidth = 2; c.lineCap = "round";
    for (var i = 0; i < 3; i++) { c.beginPath(); c.moveTo(-50 + i * 10, -18 + i * 3); c.quadraticCurveTo(-5 + i * 8, -26 + i * 5, 30 - i * 4, -8 + i * 4); c.stroke(); }
    c.restore();
    c.lineWidth = 11; c.lineCap = "round";
    c.beginPath(); c.moveTo(52, -14);
    c.bezierCurveTo(88, -30, 82, -84, 56, -92);
    c.bezierCurveTo(46, -96, 50, -108, 62, -106); c.stroke();
    c.beginPath(); c.ellipse(64, -106, 9, 7, -0.2, 0, 7); c.fill();
    c.fillStyle = "#ff9a3c"; c.beginPath(); c.moveTo(70, -108); c.lineTo(91, -102); c.lineTo(71, -100); c.closePath(); c.fill();
    c.fillStyle = "#10161f"; c.beginPath(); c.arc(65, -108, 1.8, 0, 7); c.fill();
  }
  function fish(c) {
    c.save(); c.translate(98, -86); c.rotate(1.25);
    var g = c.createLinearGradient(-14, 0, 14, 0); g.addColorStop(0, "#9fb4c8"); g.addColorStop(1, "#eaf3ff");
    c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 15, 5, 0, 0, 7); c.fill();
    c.beginPath(); c.moveTo(-13, 0); c.lineTo(-24, -6); c.lineTo(-24, 6); c.closePath(); c.fill();
    c.restore();
  }
  function seal(c, baby) {
    c.fillStyle = "#6a7d96";
    c.beginPath(); c.ellipse(0, 0, 60, 22, 0, 0, 7); c.fill();
    c.fillStyle = "#8a9db6"; c.beginPath(); c.ellipse(-4, -8, 46, 10, 0, 0, 7); c.fill();
    c.fillStyle = "#6a7d96"; c.beginPath(); c.ellipse(62, -8, 19, 14, -0.2, 0, 7); c.fill();
    c.beginPath(); c.ellipse(-62, 6, 14, 8, 0.3, 0, 7); c.fill();
    c.beginPath(); c.ellipse(10, 18, 14, 6, baby ? -0.9 : 0.3, 0, 7); c.fill();
    c.fillStyle = "#0b1220"; c.beginPath(); c.arc(70, -12, 2.4, 0, 7); c.fill(); c.beginPath(); c.arc(80, -6, 3, 0, 7); c.fill();
  }

  function render(dateKey, W, H) {
    var R = rng(hash(dateKey)), T = THEMES[Math.floor(R() * THEMES.length)];
    var cv = document.createElement("canvas"); cv.width = W; cv.height = H;
    var c = cv.getContext("2d"), hz = H * 0.6, u = Math.min(W, H * 0.56);

    var g = c.createLinearGradient(0, 0, 0, hz);
    g.addColorStop(0, T.sky[0]); g.addColorStop(.55, T.sky[1]); g.addColorStop(1, T.sky[2]);
    c.fillStyle = g; c.fillRect(0, 0, W, hz + 2);

    var n = Math.floor(160 * T.stars);
    for (var i = 0; i < n; i++) { c.fillStyle = "rgba(255,255,255," + (0.2 + R() * 0.7) + ")"; c.beginPath(); c.arc(R() * W, R() * hz * 0.6, (0.5 + R() * 1.4) * W / 1000, 0, 7); c.fill(); }

    var gx = W * (0.25 + R() * 0.5);
    var rg = c.createRadialGradient(gx, hz, 0, gx, hz, H * 0.45);
    rg.addColorStop(0, T.glow + "aa"); rg.addColorStop(1, T.glow + "00");
    c.fillStyle = rg; c.fillRect(0, 0, W, hz);

    c.save(); c.globalCompositeOperation = "lighter"; if ("filter" in c) c.filter = "blur(" + Math.round(W / 140) + "px)";
    var ribbons = 3 + Math.floor(R() * 2);
    for (var k = 0; k < ribbons; k++) {
      var f = 1.5 + R() * 2.5, ph = R() * 6.3, f2 = 2 + R() * 3, ph2 = R() * 6.3, by = H * (0.16 + k * 0.06 + R() * 0.04), col = T.aur[k % 2], step = Math.max(3, W / 220);
      for (var x = 0; x <= W; x += step) {
        var y = by + Math.sin(x / W * f * 6.28 + ph) * H * 0.05, len = H * (0.10 + 0.09 * (0.5 + 0.5 * Math.sin(x / W * f2 * 6.28 + ph2)));
        var lg = c.createLinearGradient(0, y - len, 0, y + len * 0.2);
        lg.addColorStop(0, col + "00"); lg.addColorStop(.75, col + "55"); lg.addColorStop(1, col + "00");
        c.fillStyle = lg; c.fillRect(x, y - len, step + 1, len * 1.2);
      }
    }
    c.restore();

    function ridge(base, amp, color, light) {
      var ph = [R() * 6, R() * 6, R() * 6];
      c.beginPath(); c.moveTo(0, hz + 2);
      for (var x = 0; x <= W + 1; x += W / 48) {
        var t = x / W, y = base - amp * (0.5 + 0.28 * Math.sin(t * 5 + ph[0]) + 0.17 * Math.sin(t * 11 + ph[1]) + 0.08 * Math.sin(t * 27 + ph[2])) - R() * amp * 0.06;
        c.lineTo(x, y);
      }
      c.lineTo(W, hz + 2); c.closePath();
      var mg = c.createLinearGradient(0, base - amp, 0, hz); mg.addColorStop(0, light); mg.addColorStop(1, color);
      c.fillStyle = mg; c.fill();
    }
    ridge(hz - H * 0.01, H * 0.16, T.mount, T.ice + "cc");
    ridge(hz + 1, H * 0.09, T.mount, T.mount);

    for (var b = 0; b < 3; b++) {
      var bx = R() * W, bw = W * (0.1 + R() * 0.14), bh = H * (0.03 + R() * 0.06);
      c.fillStyle = T.ice; c.globalAlpha = .9; c.beginPath(); c.moveTo(bx - bw / 2, hz + 3);
      c.lineTo(bx - bw * .28, hz - bh * .6); c.lineTo(bx - bw * .08, hz - bh); c.lineTo(bx + bw * .15, hz - bh * .55); c.lineTo(bx + bw * .5, hz + 3); c.closePath(); c.fill();
      c.fillStyle = "rgba(30,70,120,.35)"; c.beginPath(); c.moveTo(bx - bw * .08, hz - bh); c.lineTo(bx + bw * .15, hz - bh * .55); c.lineTo(bx + bw * .5, hz + 3); c.lineTo(bx, hz + 3); c.closePath(); c.fill(); c.globalAlpha = 1;
    }

    var wg = c.createLinearGradient(0, hz, 0, H); wg.addColorStop(0, T.water[0]); wg.addColorStop(1, T.water[1]);
    c.fillStyle = wg; c.fillRect(0, hz, W, H - hz);
    var sg = c.createLinearGradient(0, hz, 0, hz + H * 0.35); sg.addColorStop(0, T.sky[2] + "88"); sg.addColorStop(1, T.sky[2] + "00");
    c.fillStyle = sg; c.fillRect(0, hz, W, H * 0.35);
    var sh = c.createLinearGradient(gx - W * .08, 0, gx + W * .08, 0); sh.addColorStop(0, T.glow + "00"); sh.addColorStop(.5, T.glow + "55"); sh.addColorStop(1, T.glow + "00");
    c.fillStyle = sh; c.fillRect(gx - W * .08, hz, W * .16, H * 0.4);
    c.lineCap = "round";
    for (var s = 0; s < 120; s++) {
      var t2 = R(), yy = hz + 4 + t2 * t2 * (H - hz - 8), ww = (0.02 + R() * 0.12) * W * (0.4 + t2);
      c.strokeStyle = "rgba(255,255,255," + (0.04 + R() * 0.1) + ")"; c.lineWidth = 1 + t2 * 3; c.beginPath(); var xx = R() * W; c.moveTo(xx, yy); c.lineTo(xx + ww, yy); c.stroke();
    }

    var side = R() < .5 ? 0.27 : 0.73, fx = W * side, fy = hz + H * 0.065, fw = W * 0.34;
    c.fillStyle = "rgba(0,20,40,.25)"; c.beginPath(); c.ellipse(fx, fy + H * .012, fw * .52, H * .014, 0, 0, 7); c.fill();
    c.fillStyle = T.ice; c.beginPath(); c.ellipse(fx, fy, fw * .5, H * .016, 0, 0, 7); c.fill();
    c.fillStyle = "#ffffff"; c.beginPath(); c.ellipse(fx, fy - H * .004, fw * .44, H * .011, 0, 0, 7); c.fill();
    var ss = u / 760;
    c.save(); c.translate(fx - fw * .12, fy - H * .006 - 18 * ss); c.scale(ss, ss); seal(c, false); c.restore();
    c.save(); c.translate(fx + fw * .2, fy - H * .006 - 11 * ss); c.rotate(-0.25); c.scale(ss * .55, ss * .55); seal(c, true); c.restore();

    var count = 2 + Math.floor(R() * 2), baseY = H * 0.8, tint = "#c9dcf2";
    for (var q = 0; q < count; q++) {
      var lead = q === 0, depth = lead ? 1 : 0.62 + R() * 0.25;
      var sx = lead ? W * (0.45 + R() * 0.1) : W * (lead ? .5 : (q % 2 ? 0.2 : 0.8)) + (R() - .5) * W * .1;
      var sy = lead ? baseY : baseY - H * (0.07 + R() * 0.05) * q, sc = (u / 360) * depth * (lead ? 1.25 : 1), flip = (q % 2 === 0) ? 1 : -1;
      c.save(); c.globalAlpha = .22; c.translate(sx, sy + 8 * sc); c.scale(sc * flip, -sc * .6); swan(c, T.sky[2]); c.restore();
      c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = Math.max(1, sc * 1.6);
      for (var r2 = 1; r2 <= 3; r2++) { c.globalAlpha = .5 / r2; c.beginPath(); c.ellipse(sx, sy + 14 * sc, 80 * sc * (1 + r2 * .35), 11 * sc * (1 + r2 * .35), 0, 0, 7); c.stroke(); }
      c.globalAlpha = 1;
      c.save(); c.translate(sx, sy); c.scale(sc * flip, sc); c.shadowColor = "rgba(255,255,255,.35)"; c.shadowBlur = 18; swan(c, tint); c.shadowBlur = 0; if (lead) fish(c); c.restore();
      if (lead) { c.fillStyle = "rgba(255,255,255,.8)"; for (var d = 0; d < 9; d++) { c.beginPath(); c.arc(sx + flip * (98 + (R() - .5) * 60) * sc, sy - (60 + R() * 50) * sc, (1 + R() * 2.5) * sc, 0, 7); c.fill(); } }
    }

    var mg2 = c.createLinearGradient(0, hz - H * .04, 0, hz + H * .05); mg2.addColorStop(0, "rgba(255,255,255,0)"); mg2.addColorStop(.5, "rgba(255,255,255,.14)"); mg2.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = mg2; c.fillRect(0, hz - H * .04, W, H * .09);
    var vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * .35, W / 2, H / 2, Math.max(W, H) * .75);
    vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, "rgba(0,0,0,.4)"); c.fillStyle = vg; c.fillRect(0, 0, W, H);
    return { canvas: cv, title: T.name };
  }

  var dbp = new Promise(function (res, rej) {
    var q = indexedDB.open("daily-wallpaper", 1);
    q.onupgradeneeded = function () { q.result.createObjectStore("w", { keyPath: "date" }); };
    q.onsuccess = function () { res(q.result); }; q.onerror = function () { rej(q.error); };
  });
  function tx(mode, fn) { return dbp.then(function (db) { return new Promise(function (res, rej) { var t = db.transaction("w", mode), s = t.objectStore("w"), r = fn(s); t.oncomplete = function () { res(r && r.result); }; t.onerror = function () { rej(t.error); }; }); }); }
  var getAll = function () { return tx("readonly", function (s) { return s.getAll(); }); };
  var put = function (v) { return tx("readwrite", function (s) { return s.put(v); }); };
  var del = function (k) { return tx("readwrite", function (s) { return s.delete(k); }); };

  function todayKey() { var d = new Date(); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function size() { var dpr = Math.min(window.devicePixelRatio || 1, 3), W = Math.round(screen.width * dpr), H = Math.round(screen.height * dpr), m = Math.max(W, H); if (m > 2600) { W = Math.round(W * 2600 / m); H = Math.round(H * 2600 / m); } return [Math.max(W, 600), Math.max(H, 600)]; }
  function pretty(k) { var p = k.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" }); }
  function toBlob(cv) { return new Promise(function (r) { cv.toBlob(r, "image/jpeg", 0.92); }); }

  var current = null, urls = {};
  function show(item) {
    current = item;
    if (!urls[item.date]) urls[item.date] = URL.createObjectURL(item.blob);
    $("wall").src = urls[item.date];
    $("date").textContent = pretty(item.date) + (item.date === todayKey() ? " · Today" : "");
    $("title").textContent = item.title;
    var bs = document.querySelectorAll("#strip button");
    bs.forEach(function (b) { b.setAttribute("aria-current", b.dataset.date === item.date ? "true" : "false"); });
  }
  function drawStrip(items) {
    var st = $("strip"); st.innerHTML = "";
    items.sort(function (a, b) { return a.date < b.date ? 1 : -1; }).forEach(function (it) {
      if (!urls[it.date]) urls[it.date] = URL.createObjectURL(it.blob);
      var b = document.createElement("button"); b.dataset.date = it.date; b.setAttribute("aria-label", pretty(it.date));
      var im = document.createElement("img"); im.src = urls[it.date]; im.alt = ""; b.appendChild(im);
      b.onclick = function () { show(it); }; st.appendChild(b);
    });
  }
  async function ensureToday() {
    var key = todayKey(), items = await getAll(), have = items.find(function (i) { return i.date === key; });
    if (!have) {
      var wh = size(), out = render(key, wh[0], wh[1]), blob = await toBlob(out.canvas);
      have = { date: key, title: out.title, blob: blob }; await put(have); items.push(have);
      items.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      for (var i = KEEP_DAYS; i < items.length; i++) { await del(items[i].date); }
      items = items.slice(0, KEEP_DAYS);
    }
    drawStrip(items); show(have);
  }

  $("save").onclick = function () {
    if (!current) return;
    var a = document.createElement("a"); a.href = urls[current.date]; a.download = "wallpaper-" + current.date + ".jpg";
    document.body.appendChild(a); a.click(); a.remove();
  };
  $("share").onclick = async function () {
    if (!current) return;
    var f = new File([current.blob], "wallpaper-" + current.date + ".jpg", { type: "image/jpeg" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: current.title }); } catch (e) {} }
    else $("save").click();
  };

  function net() { var on = navigator.onLine; $("net").textContent = on ? "Online" : "Offline · showing saved wallpapers"; $("net").className = "pill" + (on ? "" : " off"); }
  window.addEventListener("online", net); window.addEventListener("offline", net); net();
  var lastKey = todayKey();
  document.addEventListener("visibilitychange", function () { if (!document.hidden && todayKey() !== lastKey) { lastKey = todayKey(); ensureToday(); } });
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js");
  ensureToday();window.__dw = { render: render, size: size };
})();
