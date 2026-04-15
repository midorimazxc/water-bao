import { useEffect, useRef } from 'react';

export default function HowItWorks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const btnGoRef = useRef<HTMLButtonElement | null>(null);
  const btnRstRef = useRef<HTMLButtonElement | null>(null);
  const pillsRef = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const cv = canvasRef.current;
    const btnGo = btnGoRef.current;
    const btnRst = btnRstRef.current;
    const pills = pillsRef.current;

    if (!cv || !btnGo || !btnRst) return;

const rawCtx = cv.getContext('2d');
if (!rawCtx) return;

const ctx: CanvasRenderingContext2D = rawCtx;

    const W = 520;
    const H = 780;

    const CX = W / 2;
    const CR_TOP = 20;
    const PIPE_BOT = CR_TOP + 80;
    const FW = 160;
    const FH = 200;
    const FX = CX - FW / 2;
    const FY = PIPE_BOT + 10;
    const STAGE_H = FH / 4;
    const GW = 70;
    const GH = 110;
    const GX = CX - GW / 2;
    const GY = FY + FH + 40;
    const RING_CY = GY + GH + 36;

    let prog = 0;
    let running = false;
    let startT: number | null = null;
    let raf: number | null = null;
    const DUR = 8000;

    let drops: Array<{ x: number; y: number; vy: number; life: number }> = [];
    let glDrops: Array<{ x: number; y: number; vy: number; life: number }> = [];

    const STAGE_CFG = [
      { label: 'Предфильтр', sub: '5 мкм, механика', water: '#00b4d8', glow: '#00e5ff' },
      { label: 'Активный уголь', sub: 'Хлор, металлы, органика', water: '#639922', glow: '#97C459' },
      { label: 'Обратный осмос', sub: 'Бактерии, вирусы, соли', water: '#D85A30', glow: '#F0997B' },
      { label: 'УФ-стерилизация', sub: '99.99% патогенов', water: '#7c3aed', glow: '#a78bfa' },
    ];

    function clamp(v: number, a: number, b: number) {
      return Math.max(a, Math.min(b, v));
    }

    function glow(color: string, blur: number) {
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
    }

    function noGlow() {
      ctx.shadowBlur = 0;
    }

    function roundRectPath(x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function drawCrane(flow: number) {
      ctx.save();

      glow('#00b4d8', 10 * flow);
      ctx.strokeStyle = '#1e3a5f';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';

      ctx.beginPath();
      ctx.moveTo(CX, CR_TOP);
      ctx.lineTo(CX, CR_TOP + 45);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(CX, CR_TOP + 30);
      ctx.lineTo(CX + 2, CR_TOP + 30);
      ctx.stroke();

      noGlow();
      ctx.strokeStyle = '#2a4a72';
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(CX - 18, CR_TOP + 16);
      ctx.lineTo(CX + 18, CR_TOP + 16);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(CX + 18, CR_TOP + 16);
      ctx.lineTo(CX + 18, CR_TOP + 7);
      ctx.stroke();

      glow('#00b4d8', 6 * flow);
      ctx.fillStyle = '#1e3a5f';
      roundRectPath(CX - 8, CR_TOP + 38, 16, 14, 4);
      ctx.fill();

      ctx.fillStyle = '#2a4a72';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.rect(CX - 6 + i * 5, CR_TOP + 52, 3, 5);
        ctx.fill();
      }

      noGlow();

      if (flow > 0) {
        const t = Date.now() / 400;
        const streamX = CX;
        const sy = CR_TOP + 57;
        const ey = FY - 4;

        ctx.save();
        ctx.globalAlpha = flow * 0.9;
        glow('#00e5ff', 12);

        const sg = ctx.createLinearGradient(0, sy, 0, ey);
        sg.addColorStop(0, '#00b4d8');
        sg.addColorStop(1, 'rgba(0,180,216,0.3)');
        ctx.fillStyle = sg;

        const w = 5 * flow;
        ctx.beginPath();
        ctx.moveTo(streamX - w + Math.sin(t) * 1.5, sy);
        ctx.quadraticCurveTo(
          streamX + Math.sin(t + 1) * 2,
          (sy + ey) / 2,
          streamX - w * 0.4 + Math.sin(t + 2) * 1.5,
          ey
        );
        ctx.lineTo(streamX + w * 0.4 + Math.sin(t + 2) * 1.5, ey);
        ctx.quadraticCurveTo(
          streamX + Math.sin(t + 1) * 2,
          (sy + ey) / 2,
          streamX + w + Math.sin(t) * 1.5,
          sy
        );
        ctx.closePath();
        ctx.fill();

        noGlow();
        ctx.restore();
      }

      ctx.restore();
    }

    function drawFilter(fp: number) {
      ctx.save();

      const glowAlpha = clamp(fp, 0, 1);
      glow('rgba(0,180,216,0.4)', 20 * glowAlpha);

      ctx.strokeStyle = 'rgba(0,180,216,0.35)';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(10,25,50,0.85)';
      roundRectPath(FX, FY, FW, FH, 10);
      ctx.fill();
      ctx.stroke();

      noGlow();

      ctx.fillStyle = '#0d2040';
      ctx.strokeStyle = 'rgba(0,180,216,0.4)';
      ctx.lineWidth = 1.5;
      roundRectPath(FX - 10, FY - 12, FW + 20, 18, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0d2040';
      ctx.beginPath();
      ctx.rect(CX - 5, FY - 25, 10, 18);
      ctx.fill();

      ctx.fillStyle = '#0d2040';
      ctx.strokeStyle = 'rgba(0,180,216,0.3)';
      roundRectPath(FX - 10, FY + FH - 6, FW + 20, 18, 5);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0d2040';
      ctx.beginPath();
      ctx.rect(CX - 5, FY + FH + 10, 10, 20);
      ctx.fill();

      ctx.save();
      roundRectPath(FX + 2, FY + 2, FW - 4, FH - 4, 8);
      ctx.clip();

      for (let i = 0; i < 4; i++) {
        const sc = STAGE_CFG[i];
        const sy = FY + i * STAGE_H;
        const frac = clamp(fp * 4 - i, 0, 1);

        if (frac <= 0) {
          ctx.fillStyle = 'rgba(255,255,255,0.02)';
          ctx.fillRect(FX + 2, sy + 2, FW - 4, STAGE_H - 4);
        } else {
          const t = Date.now() / 700;

          ctx.fillStyle = `${sc.water}18`;
          ctx.fillRect(FX + 2, sy + 2, FW - 4, STAGE_H - 4);

          ctx.save();
          ctx.globalAlpha = 0.22 * frac;
          const wh = (STAGE_H - 6) * frac;
          const wy = sy + STAGE_H - 2 - wh;
          ctx.fillStyle = sc.water;

          ctx.beginPath();
          ctx.moveTo(FX + 2, sy + STAGE_H - 2);
          for (let x = 0; x <= FW - 4; x += 3) {
            ctx.lineTo(FX + 2 + x, wy + Math.sin(x / 14 + t + i * 1.2) * 3);
          }
          ctx.lineTo(FX + FW - 2, sy + STAGE_H - 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          ctx.save();
          ctx.globalAlpha = 0.12 + 0.15 * frac;
          ctx.fillStyle = sc.water;
          for (let dx = 10; dx < FW - 6; dx += 12) {
            for (let dy = 8; dy < STAGE_H - 4; dy += 10) {
              ctx.beginPath();
              ctx.arc(FX + dx, sy + dy, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
          ctx.restore();

          if (frac > 0 && frac < 1) {
            glow(sc.glow, 8);
            ctx.strokeStyle = `${sc.water}aa`;
            ctx.lineWidth = 1.5;
            const waveY = sy + STAGE_H - 2 - (STAGE_H - 6) * frac;

            ctx.beginPath();
            for (let x = 0; x <= FW - 4; x += 3) {
              const wx = FX + 2 + x;
              const wy2 = waveY + Math.sin(x / 14 + Date.now() / 700 + i * 1.2) * 3;
              if (x === 0) ctx.moveTo(wx, wy2);
              else ctx.lineTo(wx, wy2);
            }
            ctx.stroke();
            noGlow();
          }
        }

        if (i < 3) {
          ctx.strokeStyle = 'rgba(0,180,216,0.12)';
          ctx.lineWidth = 0.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(FX + 6, sy + STAGE_H);
          ctx.lineTo(FX + FW - 6, sy + STAGE_H);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.save();
        ctx.globalAlpha = frac > 0 ? 1 : 0.3;
        ctx.fillStyle = frac > 0 ? '#fff' : 'rgba(255,255,255,0.3)';
        ctx.font = '500 11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(sc.label, FX + 10, sy + 17);

        ctx.font = '400 9px sans-serif';
        ctx.fillStyle = frac > 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)';
        ctx.fillText(sc.sub, FX + 10, sy + 29);

        ctx.fillStyle = frac > 0 ? sc.water : 'rgba(255,255,255,0.1)';
        ctx.beginPath();
        ctx.arc(FX + FW - 16, sy + 16, 9, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = frac > 0 ? '#fff' : 'rgba(255,255,255,0.3)';
        ctx.font = '500 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(String(i + 1), FX + FW - 16, sy + 20);
        ctx.restore();
      }

      ctx.restore();
      ctx.restore();
    }

    function drawOutPipe(flow: number) {
      if (flow <= 0) return;

      ctx.save();
      ctx.globalAlpha = flow;

      const t = Date.now() / 350;
      glow('#00e595', 10);
      ctx.strokeStyle = '#00b894';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.setLineDash([10, 8]);
      ctx.lineDashOffset = -t * 2;

      ctx.beginPath();
      ctx.moveTo(CX, FY + FH + 28);
      ctx.lineTo(CX, GY - 4);
      ctx.stroke();

      ctx.setLineDash([]);
      noGlow();
      ctx.restore();
    }

    function drawGlass(fill: number, pct: number) {
      ctx.save();

      const wallT = 4;

      ctx.globalAlpha = 0.15;
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.ellipse(GX + GW / 2, GY + GH + 10, GW * 0.4, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(GX + wallT, GY);
      ctx.lineTo(GX + GW - wallT, GY);
      ctx.lineTo(GX + GW, GY + GH);
      ctx.lineTo(GX, GY + GH);
      ctx.closePath();
      ctx.clip();

      if (fill > 0) {
        const t = Date.now() / 900;
        const wh = GH * fill;
        const wy = GY + GH - wh;

        const wg = ctx.createLinearGradient(GX, wy, GX, GY + GH);
        wg.addColorStop(0, '#00b894');
        wg.addColorStop(1, '#00796b');
        ctx.fillStyle = wg;

        ctx.save();
        glow('#00e595', 15 * fill);

        ctx.beginPath();
        ctx.moveTo(GX, GY + GH);
        ctx.lineTo(GX + GW, GY + GH);
        ctx.lineTo(GX + GW, wy);

        for (let x = GW; x >= 0; x -= 3) {
          ctx.lineTo(GX + x, wy + Math.sin(x / 11 + t) * 3 * fill);
        }

        ctx.closePath();
        ctx.fill();

        noGlow();
        ctx.restore();

        const bt = Date.now() / 1000;
        ctx.globalAlpha = 0.4;
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1;

        for (let b = 0; b < 3; b++) {
          const bx = GX + 14 + b * 20 + Math.sin(bt + b * 2.1) * 3;
          const by = wy + wh * 0.25 + Math.sin(bt * 1.3 + b * 1.7) * wh * 0.15;

          ctx.beginPath();
          ctx.arc(bx, by, 2 + b * 0.7, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;
      }

      ctx.restore();

      glow('rgba(0,229,255,0.15)', 8);
      ctx.strokeStyle = 'rgba(120,200,255,0.35)';
      ctx.lineWidth = wallT;
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(GX + wallT, GY);
      ctx.lineTo(GX + wallT, GY + GH);
      ctx.lineTo(GX + GW - wallT, GY + GH);
      ctx.lineTo(GX + GW - wallT, GY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(180,220,255,0.5)';
      ctx.lineWidth = wallT * 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(GX, GY);
      ctx.lineTo(GX + GW, GY);
      ctx.stroke();

      ctx.globalAlpha = 0.2;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(GX + wallT + 4, GY + 8);
      ctx.lineTo(GX + wallT + 4, GY + GH * 0.55);
      ctx.stroke();

      noGlow();
      ctx.restore();

      if (pct > 0) {
        const rx = GX + GW / 2;
        const ry = RING_CY;
        const r = 28;

        ctx.save();

        ctx.strokeStyle = 'rgba(255,255,255,0.08)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(rx, ry, r, 0, Math.PI * 2);
        ctx.stroke();

        const ang = -Math.PI / 2;
        const endAng = ang + Math.PI * 2 * (pct / 100);

        glow('#00e595', 14);
        const ag = ctx.createLinearGradient(rx - r, ry, rx + r, ry);
        ag.addColorStop(0, '#00b4d8');
        ag.addColorStop(1, '#00b894');

        ctx.strokeStyle = ag;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(rx, ry, r, ang, endAng);
        ctx.stroke();

        noGlow();

        ctx.fillStyle = pct >= 100 ? '#00e595' : '#fff';
        ctx.font = '500 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(pct)}%`, rx, ry);
        ctx.textBaseline = 'alphabetic';

        ctx.restore();
      }
    }

    function drawLabels(fp: number, glassFill: number) {
      ctx.save();
      ctx.textAlign = 'center';

      ctx.font = '11px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.35)';
      ctx.fillText('Водопровод', CX, CR_TOP - 4);

      ctx.font = '11px sans-serif';
      ctx.fillStyle = fp > 0 ? 'rgba(0,229,255,0.6)' : 'rgba(255,255,255,0.2)';
      ctx.fillText('Фильтр в разрезе', CX, FY - 20);

      ctx.fillStyle = glassFill > 0.05 ? '#00e595' : 'rgba(255,255,255,0.25)';
      ctx.fillText('Чистая вода', CX, GY - 10);

      ctx.restore();
    }

    function spawnDrops(glassFill: number) {
      if (prog > 0 && prog < 0.3 && Math.random() < 0.45) {
        drops.push({
          x: CX + Math.random() * 4 - 2,
          y: CR_TOP + 58,
          vy: 2 + Math.random(),
          life: 1,
        });
      }

      const outFlow = clamp((prog - 0.72) / 0.18, 0, 1);
      if (outFlow > 0 && prog < 1 && Math.random() < 0.5 * outFlow) {
        glDrops.push({
          x: CX + Math.random() * 4 - 2,
          y: GY - 12,
          vy: 2.5 + Math.random(),
          life: 1,
        });
      }

      drops = drops.filter((d) => {
        d.y += d.vy;
        d.vy += 0.15;
        d.life -= 0.012;
        return d.y < FY && d.life > 0;
      });

      glDrops = glDrops.filter((d) => {
        d.y += d.vy;
        d.vy += 0.15;
        d.life -= 0.01;
        const fillY = GY + GH - GH * glassFill;
        return d.y < fillY && d.life > 0;
      });
    }

    function drawDrops() {
      drops.forEach((d) => {
        ctx.save();
        ctx.globalAlpha = d.life * 0.75;
        glow('#00e5ff', 6);
        ctx.fillStyle = '#00b4d8';
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
        ctx.restore();
      });

      glDrops.forEach((d) => {
        ctx.save();
        ctx.globalAlpha = d.life * 0.8;
        glow('#00e595', 6);
        ctx.fillStyle = '#00b894';
        ctx.beginPath();
        ctx.ellipse(d.x, d.y, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        noGlow();
        ctx.restore();
      });
    }

    function renderInitial() {
      ctx.clearRect(0, 0, W, H);
      drawCrane(0);
      drawFilter(0);
      drawGlass(0, 0);
      drawLabels(0, 0);
    }

    function frame(ts: number) {
      if (startT === null) startT = ts;
      prog = clamp((ts - startT) / DUR, 0, 1);

      ctx.clearRect(0, 0, W, H);

      const craneFlow = clamp(prog / 0.28, 0, 1);
      const filterProg = clamp((prog - 0.12) / 0.6, 0, 1);
      const outFlow = clamp((prog - 0.72) / 0.18, 0, 1);
      const glassFill = clamp((prog - 0.55) / 0.45, 0, 1);
      const pct = Math.round(glassFill * 100);

      drawCrane(craneFlow);
      drawFilter(filterProg);
      drawOutPipe(outFlow);
      drawGlass(glassFill, pct);
      drawLabels(filterProg, glassFill);
      spawnDrops(glassFill);
      drawDrops();

      const si = Math.min(3, Math.floor(filterProg * 4));
      for (let i = 0; i < 4; i++) {
        const el = pills[i];
        if (!el) continue;

        if (filterProg >= (i + 1) / 4) {
          el.className = 'pill done';
        } else if (i === si && filterProg > 0 && filterProg < 1) {
          el.className = 'pill active';
        } else {
          el.className = 'pill';
        }
      }

      if (prog < 1) {
        raf = requestAnimationFrame(frame);
      } else {
        running = false;
        btnGo!.textContent = '✓ Завершено';
        btnGo!.disabled = true;
      }
    }

    function handleGo() {
      if (running) return;

      running = true;
      startT = null;
      prog = 0;
      drops = [];
      glDrops = [];

      btnGo!.textContent = '⏸ Фильтрация...';
      btnGo!.disabled = true;

      for (let i = 0; i < 4; i++) {
        if (pills[i]) pills[i]!.className = 'pill';
      }

      raf = requestAnimationFrame((ts) => {
        startT = ts;
        raf = requestAnimationFrame(frame);
      });
    }

    function handleReset() {
      if (raf !== null) cancelAnimationFrame(raf);

      running = false;
      prog = 0;
      startT = null;
      drops = [];
      glDrops = [];

      btnGo!.textContent = '▶ Демонстрация';
      btnGo!.disabled = false;

      for (let i = 0; i < 4; i++) {
        if (pills[i]) pills[i]!.className = 'pill';
      }

      renderInitial();
    }

    btnGo.addEventListener('click', handleGo);
    btnRst.addEventListener('click', handleReset);

    renderInitial();

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      btnGo.removeEventListener('click', handleGo);
      btnRst.removeEventListener('click', handleReset);
    };
  }, []);

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .how-scene {
  background: transparent;
          border-radius: 16px;
          padding: 36px 20px 40px;
          font-family: var(--font-sans, sans-serif);
          position: relative;
          overflow: hidden;
          min-height: 700px;
        }

        .how-scene::before {
          content: '';
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 400px;
          height: 200px;
          background: radial-gradient(ellipse, rgba(0, 200, 255, 0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .top-label {
          text-align: center;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #00e5ff;
          opacity: 0.6;
          margin-bottom: 6px;
        }

        .sec-title {
          text-align: center;
          font-size: 22px;
          font-weight: 500;
          color: #fff;
          margin-bottom: 28px;
          line-height: 1.35;
        }

        .sec-title em {
          font-style: italic;
          color: #00e5ff;
        }

        .canvas-wrap {
          display: flex;
          justify-content: center;
        }

        .canvas-wrap canvas {
          display: block;
          max-width: 100%;
          height: auto;
        }

        .controls {
          display: flex;
          gap: 12px;
          justify-content: center;
          margin-top: 20px;
          flex-wrap: wrap;
        }

        .btn-go {
          background: linear-gradient(135deg, #00b4d8, #0077b6);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 11px 32px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          letter-spacing: 0.03em;
          box-shadow: 0 0 16px rgba(0, 180, 216, 0.35);
          transition: box-shadow 0.2s, transform 0.1s;
        }

        .btn-go:hover {
          box-shadow: 0 0 28px rgba(0, 180, 216, 0.55);
        }

        .btn-go:active {
          transform: scale(0.97);
        }

        .btn-go:disabled {
          opacity: 0.5;
          cursor: default;
        }

        .btn-rst {
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 8px;
          padding: 11px 22px;
          font-size: 14px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .btn-rst:hover {
          border-color: rgba(255, 255, 255, 0.35);
          color: rgba(255, 255, 255, 0.8);
        }

.pills {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

        .pill {
        position: absolute;
pointer-events: auto;
z-index: 10;

          font-size: 11px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.4s;
        }

        .pill.active {
          background: rgba(0, 180, 216, 0.2);
          color: #00e5ff;
          border-color: rgba(0, 180, 216, 0.4);
        }

        .pill.done {
          background: rgba(0, 229, 149, 0.15);
          color: #00e595;
          border-color: rgba(0, 229, 149, 0.35);

          .pill:nth-child(1) {
  top: 120px;
  left: 60px;
}

.pill:nth-child(2) {
  top: 120px;
  right: 60px;
}

.pill:nth-child(3) {
  bottom: 120px;
  left: 60px;
}

.pill:nth-child(4) {
  bottom: 120px;
  right: 60px;
}
        }
      `}</style>

      <section id="how">
        <div className="how-scene">
          <div className="top-label">Технология очистки</div>

          <h2 className="sec-title">
            От водопровода до <em>чистейшей</em> воды
          </h2>

          <div className="canvas-wrap">
            <canvas ref={canvasRef} width={380} height={570} />
          </div>

          <div className="controls">
            <button ref={btnGoRef} className="btn-go">
              ▶ Демонстрация
            </button>
            <button ref={btnRstRef} className="btn-rst">
              ↺
            </button>
          </div>

          <div className="pills">
            <div
              ref={(el) => {
                pillsRef.current[0] = el;
              }}
              className="pill"
            >
              1 · Предфильтр
            </div>

            <div
              ref={(el) => {
                pillsRef.current[1] = el;
              }}
              className="pill"
            >
              2 · Активный уголь
            </div>

            <div
              ref={(el) => {
                pillsRef.current[2] = el;
              }}
              className="pill"
            >
              3 · Обратный осмос
            </div>

            <div
              ref={(el) => {
                pillsRef.current[3] = el;
              }}
              className="pill"
            >
              4 · УФ-стерилизация

              
            </div>
          </div>
        </div>
      </section>
    </>
    
  );
}