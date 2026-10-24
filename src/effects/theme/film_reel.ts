  var _filmStrips = null;
  function filmRand(seed) {
    var x = Math.sin(seed * 12.9898) * 43758.5453;
    return x - Math.floor(x);
  }
  function drawFilmFrame(ctx, y, seed, warm) {
    var h1 = filmRand(seed * 1.7 + 3.1);
    var h2 = filmRand(seed * 2.3 + 7.7);
    var h3 = filmRand(seed * 3.1 + 1.3);
    var hueA = warm ? 28 + h1 * 22 : 196 + h1 * 26;
    var hueB = hueA + 14 + h2 * 26;
    ctx.fillStyle = "rgba(18,14,10,0.72)";
    ctx.fillRect(-58, y - 42, 116, 84);
    var img = ctx.createLinearGradient(-54, y - 38, 54, y + 38);
    img.addColorStop(0, "hsla(" + hueA + ",42%,52%,0.55)");
    img.addColorStop(0.55, "hsla(" + hueB + ",46%,44%,0.45)");
    img.addColorStop(1, "hsla(" + (hueA + 40) + ",38%,30%,0.4)");
    ctx.fillStyle = img;
    ctx.fillRect(-54, y - 38, 108, 76);
    var vig = ctx.createRadialGradient(0, y, 8, 0, y, 72);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.38)");
    ctx.fillStyle = vig;
    ctx.fillRect(-54, y - 38, 108, 76);
    ctx.strokeStyle = "rgba(255,240,210,0.07)";
    ctx.lineWidth = 1;
    ctx.strokeRect(-54, y - 38, 108, 76);
    ctx.strokeStyle = "hsla(" + hueB + ",60%,80%,0.32)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-54, y + 8 + h3 * 10);
    ctx.lineTo(54, y + 6 + h3 * 10);
    ctx.stroke();
    ctx.fillStyle = "hsla(" + (hueB + 20) + ",85%,84%,0.4)";
    ctx.beginPath();
    ctx.arc(-18 + h1 * 60, y - 8 - h2 * 12, 8 + h3 * 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "hsla(" + hueA + ",55%,12%,0.85)";
    ctx.beginPath();
    ctx.moveTo(-54, y + 38);
    ctx.lineTo(-54, y + 20 + h2 * 8);
    ctx.lineTo(-20 + h1 * 30, y + 8 + h3 * 6);
    ctx.lineTo(20, y + 22 + h1 * 6);
    ctx.lineTo(54, y + 12 + h2 * 8);
    ctx.lineTo(54, y + 38);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-54, y + 38);
    ctx.lineTo(-54, y + 24 + h3 * 4);
    ctx.lineTo(-22 + h2 * 20, y + 30);
    ctx.lineTo(8 + h1 * 18, y + 20);
    ctx.lineTo(40, y + 30);
    ctx.lineTo(54, y + 26);
    ctx.lineTo(54, y + 38);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,240,220,0.05)";
    ctx.beginPath();
    var scratchX = -54 + filmRand(seed * 4.1) * 108;
    ctx.moveTo(scratchX, y - 38);
    ctx.lineTo(scratchX + (filmRand(seed * 5.9) - 0.5) * 8, y + 38);
    ctx.stroke();
    for (var g = 0; g < 4; g++) {
      var gx = -54 + filmRand(seed + g * 3.7) * 108;
      var gy = y - 38 + filmRand(seed + g * 5.3) * 76;
      ctx.fillStyle = "rgba(255,240,210," + (0.05 + 0.1 * filmRand(seed + g)) + ")";
      ctx.fillRect(gx, gy, 1, 1);
    }
  }
  themeEffects.film_reel = {
    init: function(c2) {
      var w = c2.width, h = c2.height;
      _filmStrips = [
        { x: w * 0.06, angle: -0.1, speed: 0.42, warm: true },
        { x: w * 0.94, angle: 0.09, speed: -0.34, warm: false }
      ];
      var p = [];
      for (var i = 0; i < 26; i++) {
        p.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.1,
          vy: (Math.random() - 0.5) * 0.08,
          size: 0.5 + Math.random() * 1.3,
          ph: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var strips = _filmStrips || [];
      var L = h * 0.9;
      for (var s = 0; s < strips.length; s++) {
        var strip = strips[s];
        var pitch = 96;
        ctx.save();
        ctx.globalAlpha = strength;
        ctx.translate(strip.x, h * 0.5);
        ctx.rotate(strip.angle);
        ctx.fillStyle = "rgba(8,7,6,0.4)";
        ctx.fillRect(-72, -L, 144, L * 2);
        ctx.fillStyle = "rgba(235,220,185,0.05)";
        ctx.fillRect(-72, -L, 1, L * 2);
        ctx.fillRect(71, -L, 1, L * 2);
        var scroll = frm * strip.speed;
        var first = Math.floor((-L + scroll) / pitch) - 1;
        var last = Math.ceil((L + scroll) / pitch) + 1;
        for (var idx = first; idx <= last; idx++) {
          var fy = idx * pitch - scroll;
          drawFilmFrame(ctx, fy, idx + s * 1000 + 1, strip.warm);
        }
        var holeOff = ((scroll % 16) + 16) % 16;
        for (var sy = -L - holeOff; sy < L; sy += 16) {
          ctx.fillStyle = "rgba(0,0,0,0.55)";
          ctx.fillRect(-68, sy, 6, 9);
          ctx.fillRect(62, sy, 6, 9);
          ctx.fillStyle = "rgba(255,240,210,0.05)";
          ctx.fillRect(-68, sy, 6, 1);
          ctx.fillRect(62, sy, 6, 1);
        }
        ctx.restore();
      }
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (var i = 0; i < p.length; i++) {
        var d = p[i];
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -10) d.x = w + 10;
        if (d.x > w + 10) d.x = -10;
        if (d.y < -10) d.y = h + 10;
        if (d.y > h + 10) d.y = -10;
        var tw = 0.5 + 0.5 * Math.sin(frm * 0.02 + d.ph);
        ctx.fillStyle = "rgba(255,232,190," + 0.12 * tw * strength + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
