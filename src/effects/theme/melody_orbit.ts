  var _melodyGlyphCache = null;
  var _melodyRings = null;
  function melodyGlyphs() {
    if (_melodyGlyphCache) return _melodyGlyphCache;
    var single = new Path2D();
    single.ellipse(-0.2, 0.56, 0.32, 0.22, -0.38, 0, Math.PI * 2);
    single.rect(0.02, -0.62, 0.11, 1.2);
    single.moveTo(0.13, -0.62);
    single.bezierCurveTo(0.58, -0.5, 0.53, -0.14, 0.41, 0.04);
    single.bezierCurveTo(0.47, -0.3, 0.32, -0.38, 0.13, -0.34);
    single.closePath();
    var pair = new Path2D();
    pair.ellipse(-0.52, 0.56, 0.29, 0.2, -0.38, 0, Math.PI * 2);
    pair.ellipse(0.42, 0.64, 0.29, 0.2, -0.38, 0, Math.PI * 2);
    pair.rect(-0.31, -0.58, 0.1, 1.16);
    pair.rect(0.63, -0.5, 0.1, 1.16);
    pair.moveTo(-0.31, -0.6);
    pair.lineTo(0.73, -0.52);
    pair.lineTo(0.73, -0.3);
    pair.lineTo(-0.31, -0.38);
    pair.closePath();
    _melodyGlyphCache = [single, pair];
    return _melodyGlyphCache;
  }
  themeEffects.melody_orbit = {
    init: function(c2) {
      var p = [];
      var w = c2.width, h = c2.height;
      var rings = [
        { rx: 0.36, ry: 0.2, tilt: -0.13, hue: 262, scale: 1, speed: 95e-5, notes: 18, dots: 18 },
        { rx: 0.54, ry: 0.31, tilt: 0.09, hue: 202, scale: 0.82, speed: 68e-5, notes: 17, dots: 18 },
        { rx: 0.7, ry: 0.43, tilt: -0.06, hue: 326, scale: 0.64, speed: 48e-5, notes: 15, dots: 18 }
      ];
      for (var r = 0; r < rings.length; r++) {
        var ring = rings[r];
        ring.rx *= w;
        ring.ry *= h;
        ring.cosTilt = Math.cos(ring.tilt);
        ring.sinTilt = Math.sin(ring.tilt);
        for (var i = 0; i < ring.notes; i++) {
          p.push({
            kind: 0,
            ring: ring,
            x: 0,
            y: 0,
            a: (i / ring.notes) * Math.PI * 2 + (Math.random() - 0.5) * 0.42,
            rj: 0.93 + Math.random() * 0.14,
            ph: Math.random() * Math.PI * 2,
            rate: 0.72 + Math.random() * 0.6,
            size: 19 + Math.random() * 9,
            hueShift: (Math.random() - 0.5) * 26,
            glyph: Math.random() < 0.58 ? 0 : 1
          });
        }
        for (var j = 0; j < ring.dots; j++) {
          p.push({
            kind: 1,
            ring: ring,
            x: 0,
            y: 0,
            a: Math.random() * Math.PI * 2,
            rj: 0.96 + Math.random() * 0.08,
            ph: Math.random() * Math.PI * 2,
            rate: 0.6 + Math.random() * 0.9,
            size: 1 + Math.random() * 1.3,
            hueShift: (Math.random() - 0.5) * 20,
            glyph: 0
          });
        }
      }
      _melodyRings = rings;
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      var strength = int / 100;
      var cx = w * 0.5;
      var cy = h * 0.52;
      var glyphs = melodyGlyphs();
      var rings = _melodyRings || [];
      var i, d, ring, da, cs, sn, cosT, sinT, x, y, dx, dy, tangent, breath, alpha, hue, size;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      var washPhase = frm * 6e-3;
      var washAlpha = (0.045 + 0.028 * Math.sin(washPhase)) * strength;
      if (washAlpha > 0) {
        var wash = ctx.createRadialGradient(
          cx + Math.sin(frm * 3e-3) * w * 0.06,
          cy + Math.cos(frm * 2.2e-3) * h * 0.04,
          0,
          cx,
          cy,
          Math.max(w, h) * 0.74
        );
        wash.addColorStop(0, "hsla(258,92%,72%," + washAlpha + ")");
        wash.addColorStop(0.52, "hsla(205,92%,66%," + washAlpha * 0.58 + ")");
        wash.addColorStop(1, "hsla(326,92%,70%,0)");
        ctx.fillStyle = wash;
        ctx.fillRect(0, 0, w, h);
      }
      for (i = 0; i < p.length; i++) {
        d = p[i];
        if (d.kind !== 1) continue;
        ring = d.ring;
        da = d.a + ring.speed * frm;
        cs = Math.cos(da) * ring.rx * d.rj;
        sn = Math.sin(da) * ring.ry * d.rj;
        x = cx + cs * ring.cosTilt - sn * ring.sinTilt;
        y = cy + cs * ring.sinTilt + sn * ring.cosTilt;
        breath = 0.5 + 0.5 * Math.sin(frm * 0.011 * d.rate + d.ph);
        alpha = (0.16 + 0.2 * breath) * strength * (y > cy ? 1 : 0.72);
        hue = (ring.hue + d.hueShift + frm * 0.02) % 360;
        ctx.fillStyle = "hsla(" + hue + ",100%,84%," + alpha + ")";
        ctx.beginPath();
        ctx.arc(x, y, d.size * (0.8 + 0.4 * breath), 0, Math.PI * 2);
        ctx.fill();
      }
      for (var r = rings.length - 1; r >= 0; r--) {
        for (i = 0; i < p.length; i++) {
          d = p[i];
          if (d.kind !== 0 || d.ring !== rings[r]) continue;
          ring = d.ring;
          da = d.a + ring.speed * frm;
          cs = Math.cos(da) * ring.rx * d.rj;
          sn = Math.sin(da) * ring.ry * d.rj;
          cosT = ring.cosTilt;
          sinT = ring.sinTilt;
          x = cx + cs * cosT - sn * sinT;
          y = cy + cs * sinT + sn * cosT;
          dx = -Math.sin(da) * ring.rx * cosT - Math.cos(da) * ring.ry * sinT;
          dy = -Math.sin(da) * ring.rx * sinT + Math.cos(da) * ring.ry * cosT;
          tangent = Math.atan2(dy, dx);
          breath = 0.5 + 0.5 * Math.sin(frm * 0.011 * d.rate + d.ph);
          alpha = (0.4 + 0.36 * breath) * strength * ring.scale * (y > cy ? 1 : 0.86);
          if (alpha < 0.01) continue;
          hue = (ring.hue + d.hueShift + frm * 0.02) % 360;
          size = d.size * ring.scale * (y > cy ? 1 : 0.88) * (0.94 + 0.1 * breath);
          var halo = ctx.createRadialGradient(x, y, 0, x, y, size * 2.1);
          halo.addColorStop(0, "hsla(" + hue + ",100%,74%," + alpha * 0.5 + ")");
          halo.addColorStop(0.45, "hsla(" + ((hue + 16) % 360) + ",100%,68%," + alpha * 0.2 + ")");
          halo.addColorStop(1, "hsla(" + ((hue + 30) % 360) + ",100%,62%,0)");
          ctx.fillStyle = halo;
          ctx.fillRect(x - size * 2.1, y - size * 2.1, size * 4.2, size * 4.2);
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(Math.sin(tangent) * 0.34 + Math.sin(frm * 0.009 + d.ph) * 0.06);
          ctx.scale(size, size);
          ctx.fillStyle = "hsla(" + hue + ",100%,86%," + alpha + ")";
          ctx.fill(glyphs[d.glyph]);
          ctx.restore();
        }
      }
      ctx.restore();
    }
  };
