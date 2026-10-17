cd /home/claude/daily-wallpaper && cat > world.js <<'EOF'
(function () {
  "use strict";
  var TAU = Math.PI * 2, BASE = 200, PER = 50, LAUNCH = [2026, 10, 17];
  var NAMES = ["Antarctica", "Swimming pool", "Sky", "Playground", "Earth", "Moon night", "Jungle", "Desert", "Underwater", "City night", "Beach sunset", "Flower meadow", "Deep space"];

  function hash(s) { var h = 1779033703 ^ s.length; for (var i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
  function rng(seed) { var a = seed; return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; var t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function pick(R, a) { return a[Math.floor(R() * a.length)]; }
  function rgba(h, a) { var n = parseInt(h.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; }
  function lin(c, x0, y0, x1, y1, st) { var g = c.createLinearGradient(x0, y0, x1, y1); for (var i = 0; i < st.length; i++) g.addColorStop(st[i][0], st[i][1]); return g; }
  function rad(c, x, y, r0, r1, st, x2, y2) { var g = c.createRadialGradient(x, y, r0, x2 == null ? x : x2, y2 == null ? y : y2, r1); for (var i = 0; i < st.length; i++) g.addColorStop(st[i][0], st[i][1]); return g; }
  function circ(c, x, y, r, f) { c.beginPath(); c.arc(x, y, r, 0, TAU); if (f) c.fillStyle = f; c.fill(); }
  function ell(c, x, y, rx, ry, rot, f) { c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, TAU); if (f) c.fillStyle = f; c.fill(); }
  function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function stars(c, R, W, maxY, n, sz) { for (var i = 0; i < n; i++) { c.fillStyle = "rgba(255,255,255," + (0.25 + R() * 0.7) + ")"; circ(c, R() * W, R() * maxY, (0.5 + R() * 1.5) * sz); } }
  function cloud(c, x, y, s, top, bot) {
    c.fillStyle = lin(c, 0, y - s * .5, 0, y + s * .4, [[0, top], [1, bot]]);
    for (var k = 0; k < 7; k++) { var t = k / 6, b = Math.sin(t * Math.PI); ell(c, x + (t - .5) * s * 1.8, y - b * s * .35 + ((k * 37) % 5 - 2) * s * .03, s * (.3 + .25 * b), s * (.22 + .2 * b)); }
    ell(c, x, y + s * .12, s * 1.05, s * .2);
  }
  function blob(c, R, x, y, r, col) { c.beginPath(); for (var i = 0; i <= 10; i++) { var a = i / 10 * TAU, q = r * (.6 + R() * .6), px = x + Math.cos(a) * q, py = y + Math.sin(a) * q * .8; if (i) c.lineTo(px, py); else c.moveTo(px, py); } c.closePath(); c.fillStyle = col; c.fill(); }
  function ridge(c, R, W, base, amp, bottom, top, bot) {
    var p = [R() * 6, R() * 6, R() * 6]; c.beginPath(); c.moveTo(0, bottom);
    for (var x = 0; x <= W + 1; x += W / 50) { var t = x / W; c.lineTo(x, base - amp * (.5 + .28 * Math.sin(t * 5 + p[0]) + .17 * Math.sin(t * 11 + p[1]) + .08 * Math.sin(t * 27 + p[2]))); }
    c.lineTo(W, bottom); c.closePath(); c.fillStyle = lin(c, 0, base - amp, 0, bottom, [[0, top], [1, bot]]); c.fill();
  }
  function frond(c, x, y, len, ang, col, droop) {
    c.strokeStyle = col; c.lineCap = "round"; c.lineWidth = Math.max(1, len * .018); var pts = [], i;
    c.beginPath(); c.moveTo(x, y);
    for (i = 0; i <= 24; i++) { var t = i / 24, qx = x + Math.cos(ang) * len * t, qy = y + Math.sin(ang) * len * t + droop * len * t * t; pts.push([qx, qy, t]); c.lineTo(qx, qy); }
    c.stroke(); c.lineWidth = Math.max(1, len * .012);
    for (i = 2; i < 24; i++) { var p = pts[i], l = len * .2 * Math.sin(Math.PI * Math.min(1, p[2] * 1.1)) + len * .02;
      for (var s = -1; s <= 1; s += 2) { c.beginPath(); c.moveTo(p[0], p[1]); c.lineTo(p[0] + Math.cos(ang + s * 1.1 + droop * p[2]) * l, p[1] + Math.sin(ang + s * 1.1 + droop * p[2] * .6) * l + l * .25); c.stroke(); } }
  }
  function pine(c, x, y, s, col) { c.fillStyle = col; for (var i = 0; i < 4; i++) { var w = s * (.5 - i * .09), yy = y - s * (.35 * i); c.beginPath(); c.moveTo(x - w, yy); c.lineTo(x, yy - s * .55); c.lineTo(x + w, yy); c.closePath(); c.fill(); } c.fillRect(x - s * .05, y, s * .1, s * .18); }
  function butterfly(c, x, y, s, col) { c.save(); c.translate(x, y); c.fillStyle = col; ell(c, -s * .5, -s * .25, s * .55, s * .35, -.5); ell(c, s * .5, -s * .25, s * .55, s * .35, .5); ell(c, -s * .35, s * .3, s * .35, s * .25, .5); ell(c, s * .35, s * .3, s * .35, s * .25, -.5); c.fillStyle = "#1a1020"; ell(c, 0, 0, s * .08, s * .45); c.restore(); }
  function fishS(c, x, y, s, col, dir) { c.save(); c.translate(x, y); c.scale(dir * s, s); c.fillStyle = col; ell(c, 0, 0, 20, 9); c.beginPath(); c.moveTo(-16, 0); c.lineTo(-30, -10); c.lineTo(-30, 10); c.closePath(); c.fill(); c.beginPath(); c.moveTo(-2, -8); c.lineTo(6, -17); c.lineTo(10, -7); c.closePath(); c.fill(); circ(c, 10, -2, 2.4, "#fff"); circ(c, 10.6, -2, 1.2, "#001"); c.restore(); }

  /* ---- 0 Antarctica ---- */
  var AT = [
    { sky: ["#0b1030", "#3b2a7a", "#e58fb0"], aur: ["#3dffb0", "#9b6bff"], water: ["#2a6f9e", "#06203f"], mount: "#1b2a55", ice: "#cfeaff", glow: "#ffd6a8", st: 1 },
    { sky: ["#17224d", "#c0527a", "#ffcf8a"], aur: ["#7dffd6", "#ff8fd0"], water: ["#4a8fb8", "#0b2a4a"], mount: "#2b3566", ice: "#e8f6ff", glow: "#fff0c0", st: .4 },
    { sky: ["#030814", "#0a2a4a", "#1d6b86"], aur: ["#42ff9a", "#35c9ff"], water: ["#0f4f75", "#02101f"], mount: "#0a1f3a", ice: "#bfe6ff", glow: "#9be8ff", st: 1 },
    { sky: ["#0a3a5a", "#3aa0c8", "#d8f4ff"], aur: ["#ffffff", "#bfefff"], water: ["#2e9cc4", "#0a3a66"], mount: "#3d6f96", ice: "#ffffff", glow: "#fff8d8", st: 0 }];
  function swan(c, tint) {
    c.fillStyle = c.strokeStyle = lin(c, 0, -40, 0, 22, [[0, "#ffffff"], [1, tint]]);
    c.beginPath(); c.moveTo(-78, -26); c.bezierCurveTo(-60, -6, -52, 14, -10, 18); c.bezierCurveTo(30, 22, 60, 10, 66, -10); c.bezierCurveTo(58, -30, 10, -34, -30, -28); c.bezierCurveTo(-52, -30, -66, -36, -78, -26); c.closePath(); c.fill();
    c.lineWidth = 11; c.lineCap = "round"; c.beginPath(); c.moveTo(52, -14); c.bezierCurveTo(88, -30, 82, -84, 56, -92); c.bezierCurveTo(46, -96, 50, -108, 62, -106); c.stroke();
    ell(c, 64, -106, 9, 7, -.2); c.fillStyle = "#ff9a3c"; c.beginPath(); c.moveTo(70, -108); c.lineTo(91, -102); c.lineTo(71, -100); c.closePath(); c.fill(); circ(c, 65, -108, 1.8, "#10161f");
  }
  function seal(c, baby) { c.fillStyle = "#6a7d96"; ell(c, 0, 0, 60, 22); ell(c, -4, -8, 46, 10, 0, "#8a9db6"); ell(c, 62, -8, 19, 14, -.2, "#6a7d96"); ell(c, -62, 6, 14, 8, .3); ell(c, 10, 18, 14, 6, baby ? -.9 : .3); circ(c, 70, -12, 2.4, "#0b1220"); circ(c, 80, -6, 3); }
  function antarctic(c, R, W, H, u) {
    var T = pick(R, AT), hz = H * .6, i;
    c.fillStyle = lin(c, 0, 0, 0, hz, [[0, T.sky[0]], [.55, T.sky[1]], [1, T.sky[2]]]); c.fillRect(0, 0, W, hz + 2);
    stars(c, R, W, hz * .6, Math.floor(160 * T.st), W / 1000);
    var gx = W * (.25 + R() * .5); c.fillStyle = rad(c, gx, hz, 0, H * .45, [[0, rgba(T.glow, .65)], [1, rgba(T.glow, 0)]]); c.fillRect(0, 0, W, hz);
    c.save(); c.globalCompositeOperation = "lighter"; if ("filter" in c) c.filter = "blur(" + Math.round(W / 140) + "px)";
    var nr = 3 + Math.floor(R() * 2);
    for (var k = 0; k < nr; k++) { var f = 1.5 + R() * 2.5, ph = R() * 6.3, f2 = 2 + R() * 3, ph2 = R() * 6.3, by = H * (.16 + k * .06 + R() * .04), col = T.aur[k % 2], step = Math.max(3, W / 220);
      for (var x = 0; x <= W; x += step) { var y = by + Math.sin(x / W * f * 6.28 + ph) * H * .05, len = H * (.10 + .09 * (.5 + .5 * Math.sin(x / W * f2 * 6.28 + ph2)));
        c.fillStyle = lin(c, 0, y - len, 0, y + len * .2, [[0, rgba(col, 0)], [.75, rgba(col, .33)], [1, rgba(col, 0)]]); c.fillRect(x, y - len, step + 1, len * 1.2); } }
    c.restore();
    ridge(c, R, W, hz - H * .01, H * .16, hz + 2, rgba(T.ice, .8), T.mount); ridge(c, R, W, hz + 1, H * .09, hz + 2, T.mount, T.mount);
    for (i = 0; i < 3; i++) { var bx = R() * W, bw = W * (.1 + R() * .14), bh = H * (.03 + R() * .06);
      c.globalAlpha = .9; c.fillStyle = T.ice; c.beginPath(); c.moveTo(bx - bw / 2, hz + 3); c.lineTo(bx - bw * .28, hz - bh * .6); c.lineTo(bx - bw * .08, hz - bh); c.lineTo(bx + bw * .15, hz - bh * .55); c.lineTo(bx + bw * .5, hz + 3); c.closePath(); c.fill();
      c.fillStyle = "rgba(30,70,120,.35)"; c.beginPath(); c.moveTo(bx - bw * .08, hz - bh); c.lineTo(bx + bw * .15, hz - bh * .55); c.lineTo(bx + bw * .5, hz + 3); c.lineTo(bx, hz + 3); c.closePath(); c.fill(); c.globalAlpha = 1; }
    c.fillStyle = lin(c, 0, hz, 0, H, [[0, T.water[0]], [1, T.water[1]]]); c.fillRect(0, hz, W, H - hz);
    c.fillStyle = lin(c, 0, hz, 0, hz + H * .35, [[0, rgba(T.sky[2], .55)], [1, rgba(T.sky[2], 0)]]); c.fillRect(0, hz, W, H * .35);
    c.lineCap = "round";
    for (i = 0; i < 120; i++) { var t2 = R(), yy = hz + 4 + t2 * t2 * (H - hz - 8), ww = (.02 + R() * .12) * W * (.4 + t2); c.strokeStyle = "rgba(255,255,255," + (.04 + R() * .1) + ")"; c.lineWidth = 1 + t2 * 3; var xx = R() * W; c.beginPath(); c.moveTo(xx, yy); c.lineTo(xx + ww, yy); c.stroke(); }
    var fx = W * (R() < .5 ? .27 : .73), fy = hz + H * .065, fw = W * .34, ss = u / 760;
    ell(c, fx, fy + H * .012, fw * .52, H * .014, 0, "rgba(0,20,40,.25)"); ell(c, fx, fy, fw * .5, H * .016, 0, T.ice); ell(c, fx, fy - H * .004, fw * .44, H * .011, 0, "#fff");
    c.save(); c.translate(fx - fw * .12, fy - H * .006 - 18 * ss); c.scale(ss, ss); seal(c, false); c.restore();
    c.save(); c.translate(fx + fw * .2, fy - H * .006 - 11 * ss); c.rotate(-.25); c.scale(ss * .55, ss * .55); seal(c, true); c.restore();
    var cnt = 2 + Math.floor(R() * 2);
    for (var q = 0; q < cnt; q++) { var lead = q === 0, dp = lead ? 1 : .62 + R() * .25, sx = lead ? W * (.45 + R() * .1) : W * (q % 2 ? .2 : .8) + (R() - .5) * W * .1, sy = lead ? H * .8 : H * .8 - H * (.07 + R() * .05) * q, sc = (u / 360) * dp * (lead ? 1.25 : 1), fl = q % 2 === 0 ? 1 : -1;
      c.save(); c.globalAlpha = .22; c.translate(sx, sy + 8 * sc); c.scale(sc * fl, -sc * .6); swan(c, T.sky[2]); c.restore();
      c.strokeStyle = "rgba(255,255,255,.35)"; c.lineWidth = Math.max(1, sc * 1.6);
      for (var r2 = 1; r2 <= 3; r2++) { c.globalAlpha = .5 / r2; c.beginPath(); c.ellipse(sx, sy + 14 * sc, 80 * sc * (1 + r2 * .35), 11 * sc * (1 + r2 * .35), 0, 0, TAU); c.stroke(); }
      c.globalAlpha = 1; c.save(); c.translate(sx, sy); c.scale(sc * fl, sc); c.shadowColor = "rgba(255,255,255,.35)"; c.shadowBlur = 18; swan(c, "#c9dcf2"); c.shadowBlur = 0;
      if (lead) { c.translate(98, -86); c.rotate(1.25); ell(c, 0, 0, 15, 5, 0, "#cfe0f0"); c.beginPath(); c.moveTo(-13, 0); c.lineTo(-24, -6); c.lineTo(-24, 6); c.closePath(); c.fill(); }
      c.restore(); }
  }

  /* ---- 1 Swimming pool ---- */
  function pool(c, R, W, H, u) {
    c.fillStyle = pick(R, ["#eadfce", "#dfe8ee", "#f1e6d2", "#d6dccd"]); c.fillRect(0, 0, W, H);
    c.strokeStyle = "rgba(0,0,0,.07)"; c.lineWidth = Math.max(1, W / 400); var x, y, i;
    for (x = 0; x < W; x += W / 5) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
    for (y = 0; y < H; y += W / 5) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
    var pal = pick(R, [["#6fe7f0", "#12b5d8", "#0a7fb8"], ["#7ff0d4", "#1fc3c0", "#0c8aa8"], ["#8fd8ff", "#2a9be8", "#1555b8"]]);
    var m = W * .08, px = m, py = H * .09, pw = W - 2 * m, ph = H * .82, r0 = W * .07;
    rr(c, px - W * .025, py - W * .025, pw + W * .05, ph + W * .05, r0 + W * .02); c.fillStyle = "#fbfaf5"; c.fill();
    rr(c, px, py, pw, ph, r0); c.fillStyle = lin(c, 0, py, 0, py + ph, [[0, pal[0]], [.5, pal[1]], [1, pal[2]]]); c.fill();
    c.save(); rr(c, px, py, pw, ph, r0); c.clip();
    c.strokeStyle = "rgba(255,255,255,.18)"; c.lineWidth = Math.max(1, W / 500); var tg = W / 9;
    for (x = px; x < px + pw; x += tg) { c.beginPath(); c.moveTo(x, py); c.lineTo(x, py + ph); c.stroke(); }
    for (y = py; y < py + ph; y += tg) { c.beginPath(); c.moveTo(px, y); c.lineTo(px + pw, y); c.stroke(); }
    c.globalCompositeOperation = "lighter"; c.lineWidth = Math.max(2, W / 170); c.lineCap = "round";
    for (i = 0; i < 70; i++) { var cx = px + R() * pw, cy = py + R() * ph, r = W * (.04 + R() * .09); c.strokeStyle = "rgba(210,255,255," + (.05 + R() * .1) + ")"; c.beginPath();
      for (var a = 0; a <= TAU + .1; a += .4) { var rx = cx + Math.cos(a) * r * (1 + .35 * Math.sin(a * 3 + i)), ry = cy + Math.sin(a) * r * (1 + .35 * Math.cos(a * 2 + i)); if (a) c.lineTo(rx, ry); else c.moveTo(rx, ry); } c.stroke(); }
    c.globalCompositeOperation = "source-over";
    if (R() < .6) for (i = 1; i < 3; i++) { c.strokeStyle = "rgba(255,255,255,.6)"; c.lineWidth = W * .012; c.setLineDash([W * .025, W * .02]); c.beginPath(); c.moveTo(px + pw * i / 3, py); c.lineTo(px + pw * i / 3, py + ph); c.stroke(); c.setLineDash([]); }
    var cols = ["#ff5d7a", "#ffd23f", "#ffffff", "#7dff9a", "#ff9a3c"], nf = 2 + Math.floor(R() * 3);
    for (i = 0; i < nf; i++) { var fx = px + pw * (.2 + R() * .6), fy = py + ph * (.12 + R() * .76), fr = u * (.09 + R() * .08);
      ell(c, fx + fr * .3, fy + fr * .4, fr * 1.15, fr * 1.05, 0, "rgba(0,50,90,.28)");
      c.lineWidth = fr * .5; c.strokeStyle = pick(R, cols); c.beginPath(); c.arc(fx, fy, fr * .75, 0, TAU); c.stroke();
      c.strokeStyle = "rgba(255,255,255,.6)"; c.setLineDash([fr * .5, fr * .7]); c.beginPath(); c.arc(fx, fy, fr * .75, 0, TAU); c.stroke(); c.setLineDash([]); }
    var bx = px + pw * (.25 + R() * .5), by = py + ph * (.2 + R() * .6), br = u * .07, bc = ["#ff4d6d", "#ffffff", "#3a8dff", "#ffd23f", "#ffffff", "#3acf6a"];
    ell(c, bx + br * .3, by + br * .4, br * 1.1, br, 0, "rgba(0,50,90,.28)");
    for (i = 0; i < 6; i++) { c.beginPath(); c.moveTo(bx, by); c.arc(bx, by, br, i * TAU / 6, (i + 1) * TAU / 6); c.closePath(); c.fillStyle = bc[i]; c.fill(); }
    c.restore();
    c.strokeStyle = "#cfd6dc"; c.lineWidth = W * .012; c.lineCap = "round";
    for (i = 0; i < 2; i++) { var lx = px + pw * (.14 + i * .07); c.beginPath(); c.moveTo(lx, py - W * .035); c.lineTo(lx, py + H * .08); c.stroke(); }
    for (i = 0; i < 3; i++) { c.beginPath(); c.moveTo(px + pw * .14, py + H * (.01 + i * .025)); c.lineTo(px + pw * .21, py + H * (.01 + i * .025)); c.stroke(); }
  }

  /* ---- 2 Sky ---- */
  function sky(c, R, W, H, u) {
    var P = pick(R, [["#2f7fe0", "#7fc4ff", "#e8f6ff"], ["#2a2f7a", "#e0627a", "#ffc27a"], ["#3a5fa8", "#f2a6b8", "#fff1d6"], ["#0f2f66", "#4a8be0", "#bfe3ff"]]), i;
    c.fillStyle = lin(c, 0, 0, 0, H, [[0, P[0]], [.55, P[1]], [1, P[2]]]); c.fillRect(0, 0, W, H);
    var sx = W * (.2 + R() * .6), sy = H * (.12 + R() * .25);
    c.fillStyle = rad(c, sx, sy, 0, u * 1.2, [[0, "rgba(255,250,220,.9)"], [.2, "rgba(255,240,200,.35)"], [1, "rgba(255,240,200,0)"]]); c.fillRect(0, 0, W, H);
    if (R() < .35) { var rc = ["#ff6b6b", "#ffb86b", "#fff06b", "#7bff8a", "#6bc4ff", "#a98bff"]; for (i = 0; i < 6; i++) { c.strokeStyle = rgba(rc[i], .28); c.lineWidth = u * .03; c.beginPath(); c.arc(W * .5, H * 1.05, u * (1.05 - i * .03), Math.PI * 1.08, Math.PI * 1.92); c.stroke(); } }
    for (i = 0; i < 16; i++) { var s = u * (.18 + R() * .35), y = H * (.08 + i / 16 * .9); cloud(c, R() * W, y, s, "rgba(255,255,255," + (.55 + R() * .4) + ")", rgba(P[2], .55)); }
    if (R() < .55) { var bx = W * (.25 + R() * .5), by = H * (.4 + R() * .2), bs = u * .2, bc = pick(R, [["#ff5d7a", "#ffd23f"], ["#3a8dff", "#ffffff"], ["#ffb347", "#ff4d6d"]]);
      c.strokeStyle = "rgba(80,60,40,.8)"; c.lineWidth = Math.max(1, bs * .02); c.beginPath(); c.moveTo(bx - bs * .4, by + bs * .9); c.lineTo(bx - bs * .2, by + bs * 1.3); c.moveTo(bx + bs * .4, by + bs * .9); c.lineTo(bx + bs * .2, by + bs * 1.3); c.stroke();
      c.fillStyle = "#8a5a32"; c.fillRect(bx - bs * .2, by + bs * 1.3, bs * .4, bs * .25);
      ell(c, bx, by, bs * .6, bs * .75, 0, bc[0]); c.save(); c.beginPath(); c.ellipse(bx, by, bs * .6, bs * .75, 0, 0, TAU); c.clip(); c.fillStyle = bc[1]; c.fillRect(bx - bs * .2, by - bs, bs * .4, bs * 2); c.restore(); }
    c.strokeStyle = "rgba(20,30,60,.55)"; c.lineWidth = Math.max(1.5, u * .006); c.lineCap = "round";
    for (i = 0; i < 6; i++) { var bx2 = W * R(), by2 = H * (.1 + R() * .5), bw = u * (.03 + R() * .03); c.beginPath(); c.moveTo(bx2 - bw, by2); c.quadraticCurveTo(bx2 - bw * .4, by2 - bw * .7, bx2, by2); c.quadraticCurveTo(bx2 + bw * .4, by2 - bw * .7, bx2 + bw, by2); c.stroke(); }
  }

  /* ---- 3 Playground ---- */
  function tree(c, x, y, s) { c.fillStyle = "#7a4a2a"; c.fillRect(x - s * .06, y - s * .5, s * .12, s * .5); for (var i = 0; i < 5; i++) circ(c, x + (i - 2) * s * .14, y - s * (.65 + (i % 2) * .12), s * .26, i % 2 ? "#3f9a3a" : "#56b84a"); }
  function playground(c, R, W, H, u) {
    var hz = H * .6, i, s = u / 300;
    c.fillStyle = lin(c, 0, 0, 0, hz, [[0, "#4aa8f0"], [1, "#d4f0ff"]]); c.fillRect(0, 0, W, hz + 2);
    c.fillStyle = rad(c, W * .8, H * .1, 0, u * .7, [[0, "rgba(255,245,190,1)"], [.15, "rgba(255,240,180,.6)"], [1, "rgba(255,240,180,0)"]]); c.fillRect(0, 0, W, hz);
    for (i = 0; i < 4; i++) cloud(c, R() * W, H * (.08 + R() * .3), u * (.2 + R() * .2), "rgba(255,255,255,.95)", "rgba(200,225,250,.8)");
    ridge(c, R, W, hz - H * .02, H * .09, hz + 4, "#8fd45a", "#5fae3a");
    c.fillStyle = lin(c, 0, hz, 0, H, [[0, "#66bb44"], [1, "#2f7a2a"]]); c.fillRect(0, hz, W, H - hz);
    c.fillStyle = "rgba(235,215,160,.85)"; c.beginPath(); c.moveTo(W * .35, hz); c.lineTo(W * .55, hz); c.quadraticCurveTo(W * .7, H * .78, W * 1.1, H); c.lineTo(W * .1, H); c.quadraticCurveTo(W * .35, H * .78, W * .35, hz); c.fill();
    tree(c, W * .12, hz + H * .05, u * .7); tree(c, W * .9, hz + H * .04, u * .6);
    c.save(); c.translate(W * .3, hz + H * .2); c.scale(s * 1.3, s * 1.3);
    c.strokeStyle = "#e84a5f"; c.lineWidth = 7; c.lineCap = "round"; c.beginPath(); c.moveTo(-80, -140); c.lineTo(80, -140); c.moveTo(-80, -140); c.lineTo(-110, 0); c.moveTo(-80, -140); c.lineTo(-50, 0); c.moveTo(80, -140); c.lineTo(110, 0); c.moveTo(80, -140); c.lineTo(50, 0); c.stroke();
    var sw = R() * .4 - .2; c.strokeStyle = "#555"; c.lineWidth = 2;
    for (i = -1; i <= 1; i += 2) { var tx = i * 32 + Math.sin(sw * i) * 40; c.beginPath(); c.moveTo(i * 32, -140); c.lineTo(tx, -45); c.stroke(); c.fillStyle = i < 0 ? "#ffd23f" : "#3a8dff"; c.fillRect(tx - 20, -45, 40, 8); }
    c.restore();
    c.save(); c.translate(W * .72, hz + H * .17); c.scale(s * 1.3, s * 1.3);
    c.fillStyle = "#3a8dff"; c.fillRect(-10, -120, 70, 8); c.strokeStyle = "#3a8dff"; c.lineWidth = 6; c.beginPath(); c.moveTo(-5, -120); c.lineTo(-5, 0); c.moveTo(55, -120); c.lineTo(55, 0); c.stroke();
    c.strokeStyle = "#cfe3ff"; c.lineWidth = 3; for (i = 0; i < 6; i++) { c.beginPath(); c.moveTo(-5, -20 * i - 15); c.lineTo(55, -20 * i - 15); c.stroke(); }
    c.strokeStyle = "#ffcc33"; c.lineWidth = 26; c.beginPath(); c.moveTo(60, -118); c.quadraticCurveTo(130, -100, 190, -8); c.stroke(); c.strokeStyle = "#ff9a1f"; c.lineWidth = 6; c.beginPath(); c.moveTo(60, -134); c.quadraticCurveTo(135, -116, 198, -22); c.stroke();
    c.restore();
    var kx = W * (.25 + R() * .3), ky = H * (.2 + R() * .12), ks = u * .12;
    c.strokeStyle = "rgba(255,255,255,.8)"; c.lineWidth = 1.5; c.beginPath(); c.moveTo(kx, ky + ks); c.quadraticCurveTo(kx + ks, ky + ks * 4, W * .5, hz + H * .1); c.stroke();
    c.fillStyle = "#ff4d6d"; c.beginPath(); c.moveTo(kx, ky - ks); c.lineTo(kx + ks * .7, ky); c.lineTo(kx, ky + ks * 1.2); c.lineTo(kx - ks * .7, ky); c.closePath(); c.fill(); c.fillStyle = "#ffd23f"; c.beginPath(); c.moveTo(kx, ky - ks); c.lineTo(kx + ks * .7, ky); c.lineTo(kx, ky); c.closePath(); c.fill();
    for (i = 0; i < 3; i++) { var bx = W * (.6 + R() * .3), by = H * (.2 + R() * .2), bc = pick(R, ["#ff4d6d", "#ffd23f", "#3a8dff", "#7dff9a"]); c.strokeStyle = "rgba(255,255,255,.7)"; c.beginPath(); c.moveTo(bx, by + u * .07); c.lineTo(bx + 4, by + u * .22); c.stroke(); ell(c, bx, by, u * .05, u * .065, 0, bc); }
    for (i = 0; i < 90; i++) circ(c, R() * W, hz + R() * (H - hz), 1 + R() * 3.5 * W 
