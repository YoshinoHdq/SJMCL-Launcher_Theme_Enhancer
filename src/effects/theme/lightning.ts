  var _boltNext = -1;
  var _bolts = [];
  function strokeThemeBolt(ctx, pts, width, core, hue, alpha) {
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (var k = 1; k < pts.length; k++) ctx.lineTo(pts[k].x, pts[k].y);
    ctx.strokeStyle = "hsla(" + hue + ",100%,72%," + alpha * 0.25 + ")";
    ctx.lineWidth = width * 4;
    ctx.stroke();
    ctx.strokeStyle = "hsla(" + (hue + 12) + ",100%,90%," + alpha * (core ? 0.9 : 0.55) + ")";
    ctx.lineWidth = width;
    ctx.stroke();
  }
  function spawnThemeBolt(w, h) {
    var x = w * (0.15 + Math.random() * 0.7);
    var y = -12;
    var pts = [];
    var segs = 8 + Math.floor(Math.random() * 4);
    var cy = y;
    var dir = Math.random() < 0.5 ? -1 : 1;
    for (var i = 0; i <= segs; i++) {
      if (i > 0) {
        cy += h * (0.035 + Math.random() * 0.03);
        dir *= -1;
        x += dir * w * (0.012 + Math.random() * 0.035);
      }
      pts.push({ x: x, y: cy });
    }
    var branches = [];
    var branchCount = 3 + Math.floor(Math.random() * 2);
    for (var b = 0; b < branchCount; b++) {
      var start = pts[2 + Math.floor(Math.random() * Math.max(1, pts.length - 3))];
      var bpts = [{ x: start.x, y: start.y }];
      var bx = start.x;
      var by = start.y;
      for (var s = 0; s < 4; s++) {
        bx += (s % 2 === 0 ? 1 : -1) * w * (0.01 + Math.random() * 0.025);
        by += h * (0.02 + Math.random() * 0.025);
        bpts.push({ x: bx, y: by });
      }
      branches.push(bpts);
    }
    _bolts.push({
      pts: pts,
      branches: branches,
      age: 0,
      life: 28 + Math.random() * 12,
      phase: Math.random() * Math.PI * 2,
      hue: 198 + Math.random() * 30
    });
    if (_bolts.length > 3) _bolts.shift();
  }
  themeEffects.lightning = {
    init: function() {
      _bolts.length = 0;
      _boltNext = -1;
      return [{ x: 0, y: 0 }];
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var cloud = ctx.createLinearGradient(0, 0, 0, h * 0.32);
      cloud.addColorStop(0, "hsla(220,45%,62%," + 0.035 * strength + ")");
      cloud.addColorStop(1, "hsla(225,40%,55%,0)");
      ctx.fillStyle = cloud;
      ctx.fillRect(0, 0, w, h * 0.32);
      if (_boltNext < 0) _boltNext = frm + (30 + (1 - strength) * 60) + Math.random() * 40;
      if (frm >= _boltNext) {
        spawnThemeBolt(w, h);
        var interval = (520 - 360 * strength) + Math.random() * (320 - 200 * strength);
        if (typeof getReduceMotion === "function" && getReduceMotion()) interval *= 2.2;
        _boltNext = frm + Math.max(180, interval);
      }
      for (var i = _bolts.length - 1; i >= 0; i--) {
        var bolt = _bolts[i];
        bolt.age += 1;
        if (bolt.age >= bolt.life) {
          _bolts.splice(i, 1);
          continue;
        }
        var fade = Math.pow(1 - bolt.age / bolt.life, 1.5);
        var flicker = 0.75 + 0.25 * Math.sin(bolt.age * 2.2 + bolt.phase);
        var reduce = typeof getReduceMotion === "function" && getReduceMotion();
        var alpha = fade * flicker * strength * (reduce ? 0.72 : 1);
        if (bolt.age < 10) {
          var flash = (1 - bolt.age / 10) * 0.1 * strength * (reduce ? 0.7 : 1);
          var fg = ctx.createLinearGradient(0, 0, 0, h * 0.62);
          fg.addColorStop(0, "hsla(" + bolt.hue + ",100%,88%," + flash + ")");
          fg.addColorStop(0.45, "hsla(" + bolt.hue + ",100%,78%," + flash * 0.35 + ")");
          fg.addColorStop(1, "hsla(" + bolt.hue + ",100%,70%,0)");
          ctx.fillStyle = fg;
          ctx.fillRect(0, 0, w, h * 0.62);
        }
        strokeThemeBolt(ctx, bolt.pts, 1.8, true, bolt.hue, alpha);
        for (var b = 0; b < bolt.branches.length; b++) {
          strokeThemeBolt(ctx, bolt.branches[b], 1, false, bolt.hue, alpha);
        }
      }
      ctx.restore();
    }
  };
