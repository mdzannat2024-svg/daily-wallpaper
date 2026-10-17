(function () {
  var dw = window.__dw; if (!dw) return;
  var N = 200;
  function key(n) { var d = new Date(); d.setDate(d.getDate() - n); return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2); }
  function label(n) { if (n === 0) return "Today"; var p = key(n).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }

  var st = document.createElement("style");
  st.textContent =
    "#gbtn{position:fixed;z-index:5;top:calc(env(safe-area-inset-top,0px) + 12px);left:16px;font:600 13px system-ui,sans-serif;color:#f2f7ff;background:rgba(6,14,28,.55);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.25);border-radius:999px;padding:7px 14px}" +
    "#gal{position:fixed;inset:0;z-index:20;background:#06101f;overflow-y:auto;display:none;padding:calc(env(safe-area-inset-top,0px) + 10px) 10px 24px}" +
    "#gal.on{display:block}" +
    "#gal h2{margin:6px 6px 12px;font:600 20px Georgia,serif;color:#f2f7ff;display:flex;justify-content:space-between;align-items:center}" +
    "#gal h2 button{font:600 14px system-ui,sans-serif;color:#f2f7ff;background:transparent;border:1px solid rgba(255,255,255,.3);border-radius:10px;padding:6px 12px}" +
    "#grid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}" +
    "#grid .c{position:relative;aspect-ratio:9/16;border-radius:10px;overflow:hidden;background:#0d1a2e;border:0;padding:0}" +
    "#grid canvas{width:100%;height:100%;display:block}" +
    "#grid span{position:absolute;left:6px;bottom:4px;font:11px system-ui,sans-serif;color:#fff;text-shadow:0 1px 3px #000}" +
    "#view{position:fixed;inset:0;z-index:30;background:#000;display:none}" +
    "#view.on{display:block}" +
    "#view img{width:100%;height:100%;object-fit:cover;display:block}" +
    "#vbar{position:absolute;left:0;right:0;bottom:0;display:flex;gap:10px;padding:16px 16px calc(env(safe-area-inset-bottom,0px) + 16px);background:linear-gradient(transparent,rgba(0,0,0,.7))}" +
    "#vbar button{flex:1;font:600 16px system-ui,sans-serif;padding:13px;border-radius:14px;border:1px solid rgba(255,255,255,.3);color:#fff;background:rgba(6,14,28,.6)}" +
    "#vbar .p{background:#7df3d0;color:#04201a;border-color:transparent}" +
    "#vmsg{position:absolute;top:50%;left:0;right:0;text-align:center;color:#fff;font:15px system-ui,sans-serif}";
  document.head.appendChild(st);

  function el(tag, id, cls, txt) { var e = document.createElement(tag); if (id) e.id = id; if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }

  var btn = el("button", "gbtn", "", "Browse " + N);
  var gal = el("div", "gal"), h2 = el("h2", "", "", N + " wallpapers"), closeG = el("button", "", "", "Close");
  var grid = el("div", "grid");
  h2.appendChild(closeG); gal.appendChild(h2); gal.appendChild(grid);
  var view = el("div", "view"), img = el("img"), msg = el("div", "vmsg"), bar = el("div", "vbar");
  var back = el("button", "", "", "Back"), save = el("button", "", "p", "Save"), share = el("button", "", "", "Share");
  bar.appendChild(back); bar.appendChild(save); bar.appendChild(share);
  view.appendChild(img); view.appendChild(msg); view.appendChild(bar);
  document.body.appendChild(btn); document.body.appendChild(gal); document.body.appendChild(view);

  var queue = [], busy = false;
  function pump() {
    if (busy) return; var cv = queue.shift(); if (!cv) return; busy = true;
    setTimeout(function () {
      var out = dw.render(cv.dataset.k, 150, 267);
      cv.getContext("2d").drawImage(out.canvas, 0, 0);
      busy = false; pump();
    }, 0);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); queue.push(e.target); pump(); } });
  }, { root: gal, rootMargin: "500px" });

  var built = false, cur = null, url = null;
  function build() {
    built = true;
    for (var i = 0; i < N; i++) {
      (function (n) {
        var b = el("button", "", "c"), cv = document.createElement("canvas");
        cv.width = 150; cv.height = 267; cv.dataset.k = key(n);
        b.setAttribute("aria-label", "Wallpaper " + label(n));
        b.appendChild(cv); b.appendChild(el("span", "", "", label(n)));
        b.onclick = function () { openView(key(n)); };
        grid.appendChild(b); io.observe(cv);
      })(i);
    }
  }
  function openView(k) {
    view.className = "on"; img.removeAttribute("src"); msg.textContent = "Creating wallpaper…"; cur = null;
    setTimeout(function () {
      var wh = dw.size(), out = dw.render(k, wh[0], wh[1]);
      out.canvas.toBlob(function (b) {
        cur = { k: k, blob: b }; if (url) URL.revokeObjectURL(url);
        url = URL.createObjectURL(b); img.src = url; msg.textContent = "";
      }, "image/jpeg", 0.92);
    }, 30);
  }
  btn.onclick = function () { if (!built) build(); gal.className = "on"; };
  closeG.onclick = function () { gal.className = ""; };
  back.onclick = function () { view.className = ""; };
  save.onclick = function () {
    if (!cur) return;
    var a = document.createElement("a"); a.href = url; a.download = "wallpaper-" + cur.k + ".jpg";
    document.body.appendChild(a); a.click(); a.remove();
  };
  share.onclick = async function () {
    if (!cur) return;
    var f = new File([cur.blob], "wallpaper-" + cur.k + ".jpg", { type: "image/jpeg" });
    if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f] }); } catch (e) {} }
    else save.onclick();
  };
})();
