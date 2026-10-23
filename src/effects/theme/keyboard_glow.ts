  themeEffects.keyboard_glow = {
    init: function(c2) {
      _keyboardGlowPulses.length = 0;
      ensureKeyboardGlowListener();
      const p = [];
      for (let i = 0; i < 90; i++) {
        p.push({
          x: Math.random() * c2.width,
          y: c2.height * (0.82 + Math.random() * 0.18),
          vx: (Math.random() - 0.5) * 0.12,
          vy: -(0.08 + Math.random() * 0.2),
          size: 0.7 + Math.random() * 1.6,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() * 360
        });
      }
      return p;
    },
    draw: function(ctx, w, h, p, int, frm) {
      ctx.clearRect(0, 0, w, h);
      const strength = int / 100;
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      function drawRadialGlow(cx, cy, rxValue, ryValue, hue, alpha) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(rxValue, ryValue);
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
        glow.addColorStop(0, "hsla(" + hue + ",100%,72%," + alpha + ")");
        glow.addColorStop(0.42, "hsla(" + (hue + 12) + ",100%,66%," + alpha * 0.62 + ")");
        glow.addColorStop(1, "hsla(" + (hue + 24) + ",100%,60%,0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, 1, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      for (let i = 0; i < 9; i++) {
        const hue = (i * 38 + frm * 0.7) % 360;
        drawRadialGlow(
          w * ((i + 0.5) / 9) + Math.sin(frm * 0.006 + i) * w * 0.018,
          h + 8,
          w * 0.12,
          h * 0.14,
          hue,
          0.14 * strength
        );
      }
      for (let i = 0; i < 5; i++) {
        const hue = (i * 62 + frm * 0.35) % 360;
        drawRadialGlow(w * ((i + 0.5) / 5), -4, w * 0.2, h * 0.1, hue, 0.075 * strength);
      }
      for (let i = 0; i < 4; i++) {
        const hue = (i * 75 + frm * 0.5) % 360;
        const y = h * ((i + 0.5) / 4);
        drawRadialGlow(-5, y, w * 0.1, h * 0.2, hue, 0.085 * strength);
        drawRadialGlow(w + 5, y, w * 0.1, h * 0.2, hue + 140, 0.085 * strength);
      }
      for (let i = 0; i < p.length; i++) {
        const d = p[i];
        d.phase += 0.008;
        d.x += d.vx + Math.sin(d.phase + frm * 0.004) * 0.1;
        d.y += d.vy * (0.65 + strength * 0.5);
        if (d.y < h * 0.8) {
          d.y = h * (0.98 + Math.random() * 0.03);
          d.x = Math.random() * w;
        }
        const hue = (d.hue + frm * 0.5) % 360;
        const alpha = (0.12 + 0.22 * (0.5 + 0.5 * Math.sin(d.phase))) * strength;
        ctx.fillStyle = "hsla(" + hue + ",100%,72%," + alpha * 0.12 + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "hsla(" + hue + ",100%,78%," + alpha + ")";
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fill();
      }
      let edgeFlashAlpha = 0;
      let edgeFlashHue = 0;
      for (let i = _keyboardGlowPulses.length - 1; i >= 0; i--) {
        const pulse = _keyboardGlowPulses[i];
        pulse.age += 1;
        const progress = pulse.age / pulse.life;
        if (progress >= 1) {
          _keyboardGlowPulses.splice(i, 1);
          continue;
        }
        const attack = Math.min(1, progress / 0.05);
        const fade = Math.pow(1 - progress, 2.2);
        const alpha = Math.min(1, 0.96 * attack * fade * strength);
        const edgeEnvelope = attack * Math.pow(1 - progress, 0.72);
        const edgeAlpha = Math.min(1, 0.86 * edgeEnvelope * strength);
        if (edgeAlpha > edgeFlashAlpha) {
          edgeFlashAlpha = edgeAlpha;
          edgeFlashHue = pulse.hue;
        }
        const columnHeight = (64 + progress * 26) * pulse.size;
        drawRadialGlow(pulse.x, pulse.y + 2, 58 * pulse.size, 17 * pulse.size, pulse.hue, alpha * 0.25);
        for (let layer = 0; layer <= 8; layer++) {
          const t = layer / 8;
          const y = pulse.y - t * columnHeight;
          const x = pulse.x + Math.sin(t * Math.PI + frm * 0.03) * 1.6;
          const radiusX = (38 - t * 9) * pulse.size;
          const radiusY = (14 - t * 3) * pulse.size;
          drawRadialGlow(
            x,
            y,
            radiusX,
            radiusY,
            pulse.hue,
            alpha * (0.07 + (1 - t) * 0.1)
          );
        }
        for (let layer = 0; layer <= 6; layer++) {
          const t = layer / 6;
          const y = pulse.y - t * columnHeight * 0.96;
          drawRadialGlow(
            pulse.x,
            y,
            (18 - t * 4) * pulse.size,
            (10 - t * 2.4) * pulse.size,
            pulse.hue + 8,
            alpha * (0.07 + (1 - t) * 0.08)
          );
        }
        for (let layer = 0; layer <= 6; layer++) {
          const t = layer / 6;
          const y = pulse.y - t * columnHeight * 0.92;
          drawRadialGlow(
            pulse.x,
            y,
            (7 - t * 1.8) * pulse.size,
            (9 - t * 2.2) * pulse.size,
            pulse.hue + 14,
            alpha * (0.12 + (1 - t) * 0.14)
          );
        }
        for (let mote = 0; mote < 2; mote++) {
          const moteY = pulse.y - columnHeight * (0.45 + mote * 0.28 + progress * 0.2);
          const moteX = pulse.x + Math.sin(mote * 2.7 + progress * 4) * 3;
          ctx.fillStyle = "hsla(" + (pulse.hue + mote * 18) + ",100%,88%," + alpha * (0.3 - mote * 0.08) + ")";
          ctx.beginPath();
          ctx.arc(moteX, moteY, Math.max(0.45, (0.9 - mote * 0.2) * fade), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (edgeFlashAlpha > 0.015) {
        const flash = edgeFlashAlpha;
        const topHeight = Math.max(34, h * 0.075);
        const sideWidth = Math.max(38, w * 0.055);
        const topGradient = ctx.createLinearGradient(0, 0, 0, topHeight);
        topGradient.addColorStop(0, "hsla(" + edgeFlashHue + ",100%,74%," + flash * 0.3 + ")");
        topGradient.addColorStop(0.42, "hsla(" + (edgeFlashHue + 12) + ",100%,70%," + flash * 0.11 + ")");
        topGradient.addColorStop(1, "hsla(" + (edgeFlashHue + 22) + ",100%,68%,0)");
        ctx.fillStyle = topGradient;
        ctx.fillRect(0, 0, w, topHeight);
        const leftGradient = ctx.createLinearGradient(0, 0, sideWidth, 0);
        leftGradient.addColorStop(0, "hsla(" + edgeFlashHue + ",100%,74%," + flash * 0.28 + ")");
        leftGradient.addColorStop(0.42, "hsla(" + (edgeFlashHue + 12) + ",100%,70%," + flash * 0.1 + ")");
        leftGradient.addColorStop(1, "hsla(" + (edgeFlashHue + 22) + ",100%,68%,0)");
        ctx.fillStyle = leftGradient;
        ctx.fillRect(0, 0, sideWidth, h);
        const rightGradient = ctx.createLinearGradient(w, 0, w - sideWidth, 0);
        rightGradient.addColorStop(0, "hsla(" + edgeFlashHue + ",100%,74%," + flash * 0.28 + ")");
        rightGradient.addColorStop(0.42, "hsla(" + (edgeFlashHue + 12) + ",100%,70%," + flash * 0.1 + ")");
        rightGradient.addColorStop(1, "hsla(" + (edgeFlashHue + 22) + ",100%,68%,0)");
        ctx.fillStyle = rightGradient;
        ctx.fillRect(w - sideWidth, 0, sideWidth, h);
      }
      ctx.restore();
    }
  };
