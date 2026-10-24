  var _gearGears = null;
  function makeGearPath(r, teeth, toothH) {
    var step = Math.PI * 2 / teeth;
    var path = new Path2D();
    for (var i = 0; i < teeth; i++) {
      var a0 = i * step;
      var a1 = a0 + step * 0.22;
      var a2 = a0 + step * 0.5;
      var a3 = a0 + step * 0.72;
      if (i === 0) path.moveTo(Math.cos(a0) * r, Math.sin(a0) * r);
      else path.lineTo(Math.cos(a0) * r, Math.sin(a0) * r);
      path.lineTo(Math.cos(a1) * (r + toothH), Math.sin(a1) * (r + toothH));
      path.lineTo(Math.cos(a2) * (r + toothH), Math.sin(a2) * (r + toothH));
      path.lineTo(Math.cos(a3) * r, Math.sin(a3) * r);
    }
    path.closePath();
    return path;
  }
  themeEffects.meshing_gears = {
    init: function(c2) {
      var w = c2.width, h = c2.height;
      var specs = [
        { x: 0.03 * w, y: 0.04 * h, r: 80, teeth: 22, hue: 212, dir: 1 },
        { x: 0.12 * w, y: 0.125 * h, r: 44, teeth: 12, hue: 42, dir: -1 },
        { x: 0.97 * w, y: 0.035 * h, r: 66, teeth: 18, hue: 212, dir: -1 },
        { x: 0.9 * w, y: 0.1 * h, r: 38, teeth: 10, hue: 42, dir: 1 },
        { x: 0.035 * w, y: 0.95 * h, r: 72, teeth: 20, hue: 212, dir: -1 },
        { x: 0.115 * w, y: 0.865 * h, r: 40, teeth: 11, hue: 42, dir: 1 },
        { x: 0.97 * w, y: 0.96 * h, r: 84, teeth: 22, hue: 212, dir: 1 },
        { x: 0.89 * w, y: 0.875 * h, r: 46, teeth: 12, hue: 42, dir: -1 },
        { x: 0.5 * w, y: 0.012 * h, r: 48, teeth: 13, hue: 190, dir: 1 },
        { x: 0.44 * w, y: 0.99 * h, r: 42, teeth: 11, hue: 190, dir: -1 },
        { x: 0.012 * w, y: 0.5 * h, r: 52, teeth: 14, hue: 190, dir: -1 },
        { x: 0.988 * w, y: 0.56 * h, r: 56, teeth: 15, hue: 190, dir: 1 }
      ];
      var gears = [];
      for (var i = 0; i < specs.length; i++) {
        var spec = specs[i];
        gears.push({
          x: spec.x,
          y: spec.y,
          r: spec.r,
          inner: spec.r * 0.74,
          hue: spec.hue,
          angle: Math.random() * Math.PI * 2,
          speed: 0.0009 * (60 / spec.r) * spec.dir,
          path: makeGearPath(spec.r, spec.teeth, spec.r * 0.16)
        });
      }
      _gearGears = gears;
      var p = [];
      for (var d = 0; d < 24; d++) {
        p.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.06,
          vy: (Math.random() - 0.5) * 0.05,
          size: 0.5 + Math.random() * 1.2,
          ph: Math.random() * Math.PI * 2
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var gears = _gearGears || [];
      ctx.save();
      for (var i = 0; i < gears.length; i++) {
        var gear = gears[i];
        gear.angle += gear.speed;
        var hue = gear.hue;
        var fillOpacity = (hue > 100 && hue < 200 ? 0.09 : 0.065) * strength;
        var strokeOpacity = (hue > 100 && hue < 200 ? 0.46 : 0.38) * strength;
        ctx.save();
        ctx.translate(gear.x, gear.y);
        ctx.rotate(gear.angle);
        ctx.fillStyle = "hsla(" + hue + ",45%,62%," + fillOpacity + ")";
        ctx.fill(gear.path);
        ctx.strokeStyle = "hsla(" + hue + ",55%,80%," + strokeOpacity + ")";
        ctx.lineWidth = 1.1;
        ctx.stroke(gear.path);
        ctx.strokeStyle = "hsla(" + hue + ",45%,72%," + strokeOpacity * 0.7 + ")";
        ctx.beginPath();
        ctx.arc(0, 0, gear.inner, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = "hsla(" + hue + ",40%,70%," + fillOpacity * 1.4 + ")";
        ctx.beginPath();
        ctx.arc(0, 0, gear.r * 0.18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "hsla(" + hue + ",40%,78%," + strokeOpacity + ")";
        ctx.beginPath();
        ctx.arc(0, 0, gear.r * 0.18, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "hsla(" + hue + ",35%,72%," + strokeOpacity * 0.65 + ")";
        ctx.lineWidth = Math.max(2, gear.r * 0.07);
        for (var s = 0; s < 4; s++) {
          var sa = s * Math.PI * 0.5;
          ctx.beginPath();
          ctx.moveTo(Math.cos(sa) * gear.r * 0.22, Math.sin(sa) * gear.r * 0.22);
          ctx.lineTo(Math.cos(sa) * gear.inner * 0.92, Math.sin(sa) * gear.inner * 0.92);
          ctx.stroke();
        }
        ctx.strokeStyle = "hsla(" + hue + ",60%,90%," + strokeOpacity * 1.1 + ")";
        ctx.lineWidth = 1.3;
        ctx.beginPath();
        ctx.arc(0, 0, gear.r * 0.87, -2.45, -1.55);
        ctx.stroke();
        ctx.restore();
      }
      ctx.globalCompositeOperation = "lighter";
      for (var d = 0; d < p.length; d++) {
        var mote = p[d];
        mote.x += mote.vx;
        mote.y += mote.vy;
        if (mote.x < 0) mote.x = w;
        if (mote.x > w) mote.x = 0;
        if (mote.y < 0) mote.y = h;
        if (mote.y > h) mote.y = 0;
        var tw = 0.5 + 0.5 * Math.sin(frm * 0.02 + mote.ph);
        ctx.fillStyle = "hsla(45,50%,86%," + 0.2 * tw * strength + ")";
        ctx.beginPath();
        ctx.arc(mote.x, mote.y, mote.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  };
