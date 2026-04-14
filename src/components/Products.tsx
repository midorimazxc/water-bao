import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Modal from './Modal';

function Fountain3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    const W = canvas.parentElement!.clientWidth;
    const H = canvas.parentElement!.clientHeight;
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, W / H, 0.1, 100);
    camera.position.set(1.8, 2.2, 5.8);
    camera.lookAt(0, 0.5, 0);

    // Lighting
    scene.add(new THREE.AmbientLight(0xd8e4ec, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 4.0);
    key.position.set(5, 10, 7);
    key.castShadow = true;
    key.shadow.mapSize.width = 2048;
    key.shadow.mapSize.height = 2048;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9ab0cc, 2.0);
    fill.position.set(-6, 3, -4);
    scene.add(fill);
    const top = new THREE.DirectionalLight(0xeef4ff, 2.5);
    top.position.set(0, 12, 2);
    scene.add(top);
    const rim = new THREE.DirectionalLight(0xfff8ee, 1.8);
    rim.position.set(3, 4, 8);
    scene.add(rim);
    const bowlGlow = new THREE.PointLight(0xaaddff, 4.0, 3.5);
    bowlGlow.position.set(0.15, 2.35, 0.6);
    scene.add(bowlGlow);

    // Materials
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xb8cad4, metalness: 0.82, roughness: 0.22 });
    const topPlateMat = new THREE.MeshStandardMaterial({ color: 0xc5d5de, metalness: 0.88, roughness: 0.14 });
    const bowlMat = new THREE.MeshStandardMaterial({ color: 0xd0dde5, metalness: 0.95, roughness: 0.06 });
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe0eaf0, metalness: 0.98, roughness: 0.04 });
    const chromeDarkMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.96, roughness: 0.05 });
    const rubberMat = new THREE.MeshStandardMaterial({ color: 0x1a2028, metalness: 0.0, roughness: 0.95 });
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x55aadd,
      metalness: 0.0,
      roughness: 0.02,
      transparent: true,
      opacity: 0.55,
      emissive: 0x002244,
      emissiveIntensity: 0.5,
    });
    const drainMat = new THREE.MeshStandardMaterial({ color: 0x5a6a7a, metalness: 0.9, roughness: 0.15 });

    const g = new THREE.Group();
    scene.add(g);

    // ── BODY COLUMN ──────────────────────────────────────────────
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.55, 3.4, 1.55), bodyMat);
    body.position.y = -0.35;
    body.castShadow = true;
    body.receiveShadow = true;
    g.add(body);

    // Vertical edge highlight strips
    ([ [-0.775, 0.775], [0.775, 0.775], [-0.775, -0.775], [0.775, -0.775] ] as [number,number][]).forEach(([x, z]) => {
      const e = new THREE.Mesh(new THREE.BoxGeometry(0.03, 3.42, 0.03), topPlateMat);
      e.position.set(x, -0.35, z);
      g.add(e);
    });

    // Bottom base plate
    const basePlate = new THREE.Mesh(
      new THREE.BoxGeometry(1.60, 0.06, 1.60),
      new THREE.MeshStandardMaterial({ color: 0x9aacb8, metalness: 0.75, roughness: 0.35 })
    );
    basePlate.position.y = -2.07;
    g.add(basePlate);

    // Rubber feet
    ([ [-0.6, -0.6], [0.6, -0.6], [-0.6, 0.6], [0.6, 0.6] ] as [number,number][]).forEach(([x, z]) => {
      const f = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.06, 0.04, 12), rubberMat);
      f.position.set(x, -2.12, z);
      g.add(f);
    });

    // ── TOP PLATE ────────────────────────────────────────────────
    const topPlate = new THREE.Mesh(new THREE.BoxGeometry(1.60, 0.09, 1.60), topPlateMat);
    topPlate.position.y = 1.425;
    g.add(topPlate);

    // Top rim chrome strip
    const topRim = new THREE.Mesh(new THREE.BoxGeometry(1.62, 0.025, 1.62), chromeMat);
    topRim.position.y = 1.465;
    g.add(topRim);

    // ── BOWL / РАКОВИНА ──────────────────────────────────────────
    // Outer rim flush with top plate
    const bowlRim = new THREE.Mesh(new THREE.CylinderGeometry(0.56, 0.58, 0.05, 48), topPlateMat);
    bowlRim.position.set(-0.05, 1.46, 0.04);
    g.add(bowlRim);

    // Deep round bowl via lathe — wide at top, curves down to narrow bottom
    const bowlPts: THREE.Vector2[] = [
      [0.53, 0.00],
      [0.52, -0.02],
      [0.50, -0.06],
      [0.46, -0.12],
      [0.38, -0.22],
      [0.28, -0.32],
      [0.18, -0.38],
      [0.10, -0.42],
      [0.06, -0.44],
      [0.055, -0.46],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    const bowl = new THREE.Mesh(new THREE.LatheGeometry(bowlPts, 48), bowlMat);
    bowl.position.set(-0.05, 1.46, 0.04);
    g.add(bowl);

    // Bowl inner bottom cap
    const bowlBottom = new THREE.Mesh(new THREE.CircleGeometry(0.054, 24), bowlMat);
    bowlBottom.rotation.x = -Math.PI / 2;
    bowlBottom.position.set(-0.05, 1.00, 0.04);
    g.add(bowlBottom);

    // Water surface sitting in bowl
    const waterDisc = new THREE.Mesh(new THREE.CircleGeometry(0.48, 48), waterMat);
    waterDisc.rotation.x = -Math.PI / 2;
    waterDisc.position.set(-0.05, 1.40, 0.04);
    g.add(waterDisc);

    // Drain ring at center of bowl
    const drainRing = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.018, 20), drainMat);
    drainRing.position.set(-0.05, 1.002, 0.04);
    g.add(drainRing);
    // Drain crosshatch lines
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.006, 0.012), chromeDarkMat);
      bar.rotation.y = i * Math.PI / 4;
      bar.position.set(-0.05, 1.012, 0.04);
      g.add(bar);
    }

    // ── FAUCET / КРАН ─────────────────────────────────────────────
    // Base post on top plate, to the right of bowl
    const fBase = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.055, 0.12, 16), chromeMat);
    fBase.position.set(0.42, 1.52, 0.04);
    g.add(fBase);

    // Base flange
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.018, 16), chromeMat);
    flange.position.set(0.42, 1.48, 0.04);
    g.add(flange);

    // Neck — slight forward lean
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.036, 0.18, 14), chromeMat);
    neck.position.set(0.42, 1.63, 0.04);
    neck.rotation.z = 0.12;
    g.add(neck);

    // Elbow torus curve
    const elbowGeo = new THREE.TorusGeometry(0.06, 0.030, 12, 24, Math.PI * 0.55);
    const elbow = new THREE.Mesh(elbowGeo, chromeMat);
    elbow.position.set(0.38, 1.72, 0.04);
    elbow.rotation.z = Math.PI * 0.6;
    elbow.rotation.y = Math.PI / 2;
    g.add(elbow);

    // Spout horizontal pipe toward bowl
    const spout = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.030, 0.22, 12), chromeMat);
    spout.position.set(0.20, 1.75, 0.04);
    spout.rotation.z = Math.PI / 2;
    g.add(spout);

    // Spout tip angled slightly down
    const spoutTip = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.026, 0.07, 12), chromeDarkMat);
    spoutTip.position.set(0.06, 1.73, 0.04);
    spoutTip.rotation.z = 0.35;
    g.add(spoutTip);

    // Aerator ring
    const aerator = new THREE.Mesh(new THREE.TorusGeometry(0.022, 0.006, 8, 16), chromeDarkMat);
    aerator.position.set(0.04, 1.715, 0.04);
    aerator.rotation.z = Math.PI / 2;
    g.add(aerator);

    // ── LEVER / РЫЧАГ ─────────────────────────────────────────────
    const leverArm = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.15, 0.038), chromeMat);
    leverArm.position.set(0.44, 1.67, 0.04);
    leverArm.rotation.z = -0.3;
    g.add(leverArm);

    const leverTop = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.032, 0.055), chromeDarkMat);
    leverTop.position.set(0.46, 1.74, 0.04);
    leverTop.rotation.z = -0.3;
    g.add(leverTop);

    // Branding disc on faucet
    const brand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.022, 0.022, 0.005, 12),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcccccc, emissiveIntensity: 0.4, roughness: 0.3 })
    );
    brand.rotation.x = Math.PI / 2;
    brand.position.set(0.48, 1.62, 0.076);
    g.add(brand);

    // ── SHADOW ────────────────────────────────────────────────────
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.2, 48),
      new THREE.MeshStandardMaterial({ color: 0x020810, transparent: true, opacity: 0.22 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.14;
    g.add(shadow);

    // ── WATER STREAM PARTICLES ─────────────────────────────────────
    // Parabolic arc from spout tip into bowl
    const DROPS = 60;
    const dPos = new Float32Array(DROPS * 3);
    const dVel: Array<{ vx: number; vy: number; vz: number; life: number }> = [];
    for (let i = 0; i < DROPS; i++) {
      dPos[i * 3] = 0.04;
      dPos[i * 3 + 1] = 1.715;
      dPos[i * 3 + 2] = 0.04;
      dVel.push({
        vx: -0.018 - Math.random() * 0.01,
        vy: -0.012 - Math.random() * 0.014,
        vz: (Math.random() - 0.5) * 0.004,
        life: Math.random(),
      });
    }
    const dGeo = new THREE.BufferGeometry();
    dGeo.setAttribute('position', new THREE.BufferAttribute(dPos, 3));
    const dPts = new THREE.Points(
      dGeo,
      new THREE.PointsMaterial({ color: 0xbbecff, size: 0.032, transparent: true, opacity: 0.85, sizeAttenuation: true })
    );
    g.add(dPts);

    // Splash drops at bowl impact point
    const SPLASH = 25;
    const sPos = new Float32Array(SPLASH * 3);
    const sVel: Array<{ vx: number; vy: number; vz: number; life: number }> = [];
    for (let i = 0; i < SPLASH; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.12;
      sPos[i * 3] = -0.05 + Math.cos(a) * r;
      sPos[i * 3 + 1] = 1.42;
      sPos[i * 3 + 2] = 0.04 + Math.sin(a) * r;
      sVel.push({ vx: (Math.random() - 0.5) * 0.009, vy: 0.003 + Math.random() * 0.005, vz: (Math.random() - 0.5) * 0.009, life: Math.random() });
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    const sPts = new THREE.Points(
      sGeo,
      new THREE.PointsMaterial({ color: 0xddf4ff, size: 0.018, transparent: true, opacity: 0.5, sizeAttenuation: true })
    );
    g.add(sPts);

    // ── INTERACTION ───────────────────────────────────────────────
    let drag = false, pX = 0, pY = 0, rotY = 0.35, rotX = 0.12, autoR = true;
    let touchStartedOnCanvas = false;

    const handleMouseDown = (e: MouseEvent) => { drag = true; autoR = false; pX = e.clientX; pY = e.clientY; };
    const handleTouchStart = (e: TouchEvent) => {
      touchStartedOnCanvas = true;
      drag = true; autoR = false;
      pX = e.touches[0].clientX; pY = e.touches[0].clientY;
    };
    const handleMouseUp = () => { drag = false; setTimeout(() => (autoR = true), 4500); };
    const handleTouchEnd = () => { touchStartedOnCanvas = false; drag = false; setTimeout(() => (autoR = true), 4500); };
    const handleMouseMove = (e: MouseEvent) => {
      if (!drag) return;
      rotY += (e.clientX - pX) * 0.010;
      rotX += (e.clientY - pY) * 0.008;
      rotX = Math.max(-0.45, Math.min(0.65, rotX));
      pX = e.clientX;
      pY = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartedOnCanvas) return;
      e.preventDefault();
      if (!drag) return;
      rotY += (e.touches[0].clientX - pX) * 0.010;
      rotX += (e.touches[0].clientY - pY) * 0.008;
      rotX = Math.max(-0.45, Math.min(0.65, rotX));
      pX = e.touches[0].clientX;
      pY = e.touches[0].clientY;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    let T = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      T += 0.016;
      if (autoR) rotY += 0.0035;
      g.rotation.y = rotY;
      g.rotation.x = rotX;

      // Stream particles
      const dp = dPts.geometry.attributes.position;
      for (let i = 0; i < DROPS; i++) {
        dVel[i].life += 0.022;
        if (dVel[i].life > 1) {
          dVel[i].life = 0;
          dVel[i].vx = -0.017 - Math.random() * 0.009;
          dVel[i].vy = -0.011 - Math.random() * 0.013;
          dVel[i].vz = (Math.random() - 0.5) * 0.004;
          dp.setXYZ(i, 0.04, 1.715, 0.04);
        } else {
          dp.setX(i, dp.getX(i) + dVel[i].vx * 0.5);
          dp.setY(i, dp.getY(i) + dVel[i].vy);
          dp.setZ(i, dp.getZ(i) + dVel[i].vz * 0.3);
          if (dp.getY(i) < 1.41) dVel[i].life = 0.88;
        }
      }
      dp.needsUpdate = true;

      // Splash particles
      const sp = sPts.geometry.attributes.position;
      for (let i = 0; i < SPLASH; i++) {
        sVel[i].life += 0.028;
        if (sVel[i].life > 1) {
          sVel[i].life = 0;
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.08;
          sp.setXYZ(i, -0.05 + Math.cos(a) * r, 1.42, 0.04 + Math.sin(a) * r);
          sVel[i].vx = (Math.random() - 0.5) * 0.008;
          sVel[i].vy = 0.003 + Math.random() * 0.004;
          sVel[i].vz = (Math.random() - 0.5) * 0.008;
        } else {
          sp.setX(i, sp.getX(i) + sVel[i].vx);
          sp.setY(i, sp.getY(i) + sVel[i].vy);
          sp.setZ(i, sp.getZ(i) + sVel[i].vz);
        }
      }
      sp.needsUpdate = true;

      waterDisc.position.y = 1.395 + Math.sin(T * 1.4) * 0.003;
      bowlGlow.intensity = 3.5 + Math.sin(T * 2.0) * 0.7;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="f3d"></canvas>;
}

function Purifier3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    const W = canvas.parentElement!.clientWidth;
    const H = canvas.parentElement!.clientHeight;
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100);
    camera.position.set(-1.2, 0.8, 6.2);
    camera.lookAt(0, 0.2, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 2.0));
    const key = new THREE.DirectionalLight(0xffffff, 3.0);
    key.position.set(4, 8, 6);
    key.castShadow = true;
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xddeeff, 1.5);
    fill.position.set(-5, 2, -3);
    scene.add(fill);
    const top = new THREE.DirectionalLight(0xffffff, 1.8);
    top.position.set(0, 10, 0);
    scene.add(top);
    const panelL = new THREE.PointLight(0x0088cc, 1.8, 6);
    panelL.position.set(0, 1.0, 3);
    scene.add(panelL);

    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf0f2f4, metalness: 0.05, roughness: 0.35 });
    const blackMat = new THREE.MeshStandardMaterial({ color: 0x0d1318, metalness: 0.3, roughness: 0.25 });
    const silverMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.85, roughness: 0.15 });
    const redIndicator = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xcc1100, emissiveIntensity: 1.0, roughness: 0.1 });
    const yellowIndicator = new THREE.MeshStandardMaterial({ color: 0xddaa00, emissive: 0xaa8800, emissiveIntensity: 0.9, roughness: 0.1 });
    const blueIndicator = new THREE.MeshStandardMaterial({ color: 0x0088ff, emissive: 0x0055cc, emissiveIntensity: 1.0, roughness: 0.1 });
    const ventMat = new THREE.MeshStandardMaterial({ color: 0xd0d5da, metalness: 0.1, roughness: 0.5 });

    const g = new THREE.Group();
    scene.add(g);

    const lower = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.8, 1.2), whiteMat);
    lower.position.y = -0.8;
    lower.castShadow = true;
    g.add(lower);

    const upper = new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.6, 1.2), whiteMat);
    upper.position.y = 1.1;
    g.add(upper);

    const div = new THREE.Mesh(
      new THREE.BoxGeometry(1.77, 0.04, 1.22),
      new THREE.MeshStandardMaterial({ color: 0xccced0, metalness: 0.1, roughness: 0.5 })
    );
    div.position.y = 0.3;
    g.add(div);

    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.5, 0.08), blackMat);
    panel.position.set(0, 1.1, 0.64);
    g.add(panel);

    const panelBorder = new THREE.Mesh(
      new THREE.BoxGeometry(1.63, 1.53, 0.06),
      new THREE.MeshStandardMaterial({ color: 0x1a2535, emissive: 0x001133, emissiveIntensity: 0.3, transparent: true, opacity: 0.8 })
    );
    panelBorder.position.set(0, 1.1, 0.62);
    g.add(panelBorder);

    const logoArea = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.14, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaaaaa, emissiveIntensity: 0.5 })
    );
    logoArea.position.set(0, 1.78, 0.69);
    g.add(logoArea);

    [-0.18, 0, 0.18].forEach((x) => {
      const letter = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.09, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.3 })
      );
      letter.position.set(x, 1.78, 0.70);
      g.add(letter);
    });

    const indicatorColors = [
      { x: -0.42, mat: redIndicator, col: 0xff2200 },
      { x: 0, mat: yellowIndicator, col: 0xddaa00 },
      { x: 0.42, mat: blueIndicator, col: 0x0088ff },
    ];

    indicatorColors.forEach(({ x, mat, col }) => {
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.55, 12), mat);
      rod.position.set(x, 1.4, 0.7);
      g.add(rod);
      const rodLight = new THREE.PointLight(col, 0.8, 1.5);
      rodLight.position.set(x, 1.4, 0.8);
      scene.add(rodLight);
    });

    indicatorColors.forEach(({ x }) => {
      const housing = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.3, 16), silverMat);
      housing.position.set(x, 1.05, 0.72);
      g.add(housing);
      const tip = new THREE.Mesh(
        new THREE.CylinderGeometry(0.025, 0.035, 0.12, 12),
        new THREE.MeshStandardMaterial({ color: 0x556677, metalness: 0.9, roughness: 0.1 })
      );
      tip.position.set(x, 0.95, 0.78);
      tip.rotation.x = Math.PI / 2;
      g.add(tip);
      const btn = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, 0.1, 0.06),
        new THREE.MeshStandardMaterial({ color: 0xd0d8e0, metalness: 0.3, roughness: 0.4 })
      );
      btn.position.set(x, 0.83, 0.72);
      g.add(btn);
    });

    const tray = new THREE.Mesh(
      new THREE.BoxGeometry(1.5, 0.06, 0.45),
      new THREE.MeshStandardMaterial({ color: 0xc0c8d0, metalness: 0.6, roughness: 0.3 })
    );
    tray.position.set(0, 0.72, 0.72);
    g.add(tray);

    for (let i = -5; i <= 5; i++) {
      const bar = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.04, 0.42),
        new THREE.MeshStandardMaterial({ color: 0x889aaa, metalness: 0.7, roughness: 0.3 })
      );
      bar.position.set(i * 0.13, 0.74, 0.72);
      g.add(bar);
    }

    for (let i = 0; i < 6; i++) {
      const sl = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.04, 0.04), ventMat);
      sl.position.set(0.5, -1.8 + i * 0.1, -0.62);
      g.add(sl);
    }

    const base = new THREE.Mesh(
      new THREE.BoxGeometry(1.82, 0.1, 1.26),
      new THREE.MeshStandardMaterial({ color: 0xe0e4e8, metalness: 0.1, roughness: 0.5 })
    );
    base.position.y = -2.25;
    g.add(base);

    ([ [-0.7, -0.5], [0.7, -0.5], [-0.7, 0.5], [0.7, 0.5] ] as [number,number][]).forEach(([x, z]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.065, 0.05, 10),
        new THREE.MeshStandardMaterial({ color: 0xbbbbbb, roughness: 0.6 })
      );
      foot.position.set(x, -2.32, z);
      g.add(foot);
    });

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(1.3, 48),
      new THREE.MeshStandardMaterial({ color: 0x020810, transparent: true, opacity: 0.3 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -2.35;
    g.add(shadow);

    const allDrops: Array<{ pts: THREE.Points; vel: Array<{ vy: number; life: number }>; count: number; x: number }> = [];

    indicatorColors.forEach(({ x, col }) => {
      const count = 15;
      const pos = new Float32Array(count * 3);
      const vel: Array<{ vy: number; life: number }> = [];
      for (let i = 0; i < count; i++) {
        pos[i * 3] = x; pos[i * 3 + 1] = 0.95; pos[i * 3 + 2] = 0.82;
        vel.push({ vy: -0.016 - Math.random() * 0.012, life: Math.random() });
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: col, size: 0.035, transparent: true, opacity: 0.65, sizeAttenuation: true }));
      g.add(pts);
      allDrops.push({ pts, vel, count, x });
    });

    let drag = false, pX = 0, pY = 0, rotY = 0.3, rotX = 0.05, autoR = true;
    let touchStartedOnCanvas = false;

    const handleMouseDown = (e: MouseEvent) => { drag = true; autoR = false; pX = e.clientX; pY = e.clientY; };
    const handleTouchStart = (e: TouchEvent) => {
      touchStartedOnCanvas = true;
      drag = true; autoR = false;
      pX = e.touches[0].clientX; pY = e.touches[0].clientY;
    };
    const handleMouseUp = () => { drag = false; setTimeout(() => (autoR = true), 4000); };
    const handleTouchEnd = () => { touchStartedOnCanvas = false; drag = false; setTimeout(() => (autoR = true), 4000); };
    const handleMouseMove = (e: MouseEvent) => {
      if (!drag) return;
      rotY += (e.clientX - pX) * 0.01; rotX += (e.clientY - pY) * 0.01;
      pX = e.clientX; pY = e.clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartedOnCanvas) return;
      e.preventDefault();
      if (!drag) return;
      rotY += (e.touches[0].clientX - pX) * 0.01; rotX += (e.touches[0].clientY - pY) * 0.01;
      pX = e.touches[0].clientX; pY = e.touches[0].clientY;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    let T = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      T += 0.016;
      if (autoR) rotY += 0.005;
      g.rotation.y = rotY;
      g.rotation.x = rotX;

      allDrops.forEach(({ pts, vel, count, x }) => {
        const p = pts.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
          vel[i].life += 0.022;
          if (vel[i].life > 1) {
            vel[i].life = 0;
            p.setXYZ(i, x + (Math.random() - 0.5) * 0.03, 0.94, 0.82);
          } else {
            p.setY(i, p.getY(i) + vel[i].vy);
            if (p.getY(i) < 0.73) vel[i].life = 0.9;
          }
        }
        p.needsUpdate = true;
      });

      panelL.intensity = 1.6 + Math.sin(T * 1.5) * 0.3;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="p3d"></canvas>;
}

export default function Products() {
  const [modal, setModal] = useState<string | null>(null);

  return (
    <section id="products" className="pad">
      <div className="wrap">
        <div className="prod-intro reveal">
          <span className="sec-tag">Наши продукты</span>
          <h2 className="sec-h2">
            Два решения
            <br />
            для <em>идеальной</em> воды
          </h2>
          <p className="body-t">
            Профессиональное оборудование с полным сервисным циклом — от доставки до замены фильтров.
          </p>
        </div>
        <div className="prod-grid">
          <div className="prod-card reveal">
            <div className="prod-stage">
              <Fountain3D />
              <div className="prod-badge">Для общественных мест</div>
              <div className="prod-drag">вращать</div>
            </div>
            <div className="prod-body">
              <div className="prod-num">01 —</div>
              <div className="prod-name">
                Питьевой
                <br />
                фонтанчик
              </div>
              <div className="prod-sub">Нержавеющая сталь · Бесконтактный</div>
              <p className="prod-desc">
                Настенный питьевой фонтанчик с бесконтактным датчиком и встроенным охлаждением. Корпус из порошкового
                покрытия, вандалоустойчивый. Для коридоров, спортзалов и уличных зон.
              </p>
              <div className="prod-specs">
                <div className="spec-item"><span className="spec-dot"></span>ИК-датчик</div>
                <div className="spec-item"><span className="spec-dot"></span>Фильтр тонкой очистки</div>
                <div className="spec-item"><span className="spec-dot"></span>Охлаждение до +7°C</div>
                <div className="spec-item"><span className="spec-dot"></span>До 600 л/сутки</div>
                <div className="spec-item"><span className="spec-dot"></span>Мед. нержавейка</div>
                <div className="spec-item"><span className="spec-dot"></span>Настенный монтаж</div>
              </div>
              <button 
  className="prod-cta"
  onClick={() => setModal("fountain")}
>
  Узнать подробнее →
</button>
            </div>
          </div>

          <div className="prod-card reveal2">
            <div className="prod-stage">
              <Purifier3D />
              <div className="prod-badge">Для офисов и кухонь</div>
              <div className="prod-drag">вращать</div>
            </div>
            <div className="prod-body">
              <div className="prod-num">02 —</div>
              <div className="prod-name">
                Пурификатор
                <br />
                воды
              </div>
              <div className="prod-sub">Обратный осмос · 3 температуры</div>
              <p className="prod-desc">
                Напольный диспенсер BAO с тремя кранами: горячая, нормальная и холодная вода. Встроенная система глубокой
                очистки, LED-индикация, элегантный белый корпус.
              </p>
              <div className="prod-specs">
                <div className="spec-item"><span className="spec-dot"></span>Горячая / Норм / Холодная</div>
                <div className="spec-item"><span className="spec-dot"></span>Обратный осмос</div>
                <div className="spec-item"><span className="spec-dot"></span>УФ-стерилизация</div>
                <div className="spec-item"><span className="spec-dot"></span>99.97% очистки</div>
                <div className="spec-item"><span className="spec-dot"></span>LED-индикация</div>
                <div className="spec-item"><span className="spec-dot"></span>Напольный монтаж</div>
              </div>
             <button 
  className="prod-cta"
  onClick={() => setModal("purifier")}
>
  Узнать подробнее →
</button>
            </div>
          </div>
        </div>
      </div>
      <Modal isOpen={modal === "fountain"} onClose={() => setModal(null)}>
  <h2 style={{ marginBottom: 10 }}>Питьевой фонтанчик</h2>

  <p style={{ color: "#9fc0d4", lineHeight: "1.6" }}>
    Надёжное решение для школ, ТРЦ и общественных пространств.
    Полностью автоматическая подача воды с фильтрацией и охлаждением.
  </p>

  {/* ВИДЕО */}
  <div style={{ marginTop: 20 }}>
<video
  width="100%"
  height="260"
  controls
  style={{ borderRadius: 8, objectFit: "cover" }}
>
  <source src="https://dpbyblauovgdabyyrfai.supabase.co/storage/v1/object/public/video/fontanchik.mp4" type="video/mp4" />
</video>
  </div>

  <ul style={{ marginTop: 20, color: "#9fc0d4" }}>
    <li>✔ Бесконтактный датчик</li>
    <li>✔ Охлаждение воды до +7°C</li>
    <li>✔ Вандалоустойчивый корпус</li>
    <li>✔ До 600 л/сутки</li>
  </ul>
</Modal>
<Modal isOpen={modal === "purifier"} onClose={() => setModal(null)}>
  <h2 style={{ marginBottom: 10 }}>Пурификатор воды</h2>

  <p style={{ color: "#9fc0d4", lineHeight: "1.6" }}>
    Идеальное решение для офисов и дома.
    Глубокая очистка воды с системой обратного осмоса и УФ.
  </p>

  {/* ВИДЕО */}
  <div style={{ marginTop: 20 }}>
<video
  width="100%"
  height="260"
  controls
  style={{ borderRadius: 8, objectFit: "cover" }}
>
  <source src="https://dpbyblauovgdabyyrfai.supabase.co/storage/v1/object/public/video/purifaer.mp4" type="video/mp4" />
</video>
  </div>

  <ul style={{ marginTop: 20, color: "#9fc0d4" }}>
    <li>✔ 3 температуры воды</li>
    <li>✔ Обратный осмос</li>
    <li>✔ УФ-стерилизация</li>
    <li>✔ 99.97% очистки</li>
  </ul>
</Modal>
    </section>
  );
}
