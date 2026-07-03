import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { threeColors } from '../tokens';

/**
 * Volumetric 3D maple leaf that gently sways (<=65deg on every axis) and morphs
 * leaf <-> circle, emitting violet sparkles while it transforms.
 * Ported from the Claude Design prototype's `_setupLeaf`.
 */
export default function MapleLeaf() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let rafId = 0;
    let cleanup: (() => void) | null = null;
    let cancelled = false;

    const setup = () => {
      if (cancelled) return;
      const W = wrap.clientWidth;
      const H = wrap.clientHeight;
      if (!W || !H) {
        rafId = requestAnimationFrame(setup);
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(33, W / H, 0.1, 100);
      camera.position.set(0, 0.05, 4.9);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      wrap.appendChild(renderer.domElement);

      // --- maple-leaf silhouette (explicit half, mirrored, then edge-subdivided).
      // Classic FIVE-lobe layout with an actual narrow stem, not a lower spike:
      //   top spike (shared, dominant) → upper-side lobe → lower-side lobe →
      //   ABRUPT shoulder → narrow parallel-sided stem → stem tip (shared).
      // The two consecutive stem-width points (0.09 → 0.07) force a near-
      // vertical thin rectangle rather than a triangular pointed corner.
      const half = [
        [0.00, 1.30],  // central spike — taller so it dominates the outline
        [0.28, 0.60],  // sinus 1 — deep valley between center and upper-side
        [0.98, 0.68],  // upper-side lobe tip (diagonal top-right)
        [0.44, 0.02],  // sinus 2 — between upper-side and lower-side
        [0.88, -0.40], // lower-side lobe tip (diagonal bottom-right)
        [0.42, -0.62], // sinus 3 — deep valley before the stem
        [0.09, -0.66], // stem shoulder — abrupt jump inward to stem width
        [0.07, -1.20], // stem tip (shared with mirrored half at x=0)
      ];
      const corners: number[][] = [];
      for (let i = 0; i < half.length; i++) corners.push([half[i][0], half[i][1]]);
      for (let i = half.length - 1; i >= 1; i--) corners.push([-half[i][0], half[i][1]]);
      // Enough subdivisions for smooth edges between lobe tips — with only 5
      // acute peaks left, higher SUB no longer rounds them into blobs.
      const SUB = 5;
      const boundary: number[][] = [];
      for (let i = 0; i < corners.length; i++) {
        const a = corners[i];
        const b = corners[(i + 1) % corners.length];
        for (let k = 0; k < SUB; k++) {
          const f = k / SUB;
          boundary.push([a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]);
        }
      }
      const N = boundary.length;
      const RAD = 0.98;
      // leaf outline + circle target matched BY INDEX (same winding) so every
      // interpolated outline stays a simple polygon (no self-intersection).
      const leafXY = boundary.map((p) => [p[0], p[1]]);
      const circXY = boundary.map((_, i) => {
        const ang = Math.PI / 2 - 2 * Math.PI * (i / N);
        return [Math.cos(ang) * RAD, Math.sin(ang) * RAD];
      });
      const curXY = leafXY.map((p) => [p[0], p[1]]);

      // Beveled extruded solid rebuilt per frame from curXY. Moderate bevel
      // keeps the lobe tips readable (0.17 / 0.085 previously rounded them
      // into blobs).
      const EX = {
        depth: 0.32,
        bevelEnabled: true,
        bevelThickness: 0.10,
        bevelSize: 0.048,
        bevelSegments: 3,
        curveSegments: 1,
        steps: 1,
      };
      const buildGeo = (pts: number[][]) => {
        const shp = new THREE.Shape();
        shp.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) shp.lineTo(pts[i][0], pts[i][1]);
        shp.closePath();
        const g = new THREE.ExtrudeGeometry(shp, EX);
        g.center();
        g.computeVertexNormals();
        return g;
      };
      let geo = buildGeo(curXY);

      const mat = new THREE.MeshStandardMaterial({
        color: threeColors.violet500,
        roughness: 0.34,
        metalness: 0.28,
        emissive: threeColors.violetDeep,
        emissiveIntensity: 0.32,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.scale.setScalar(0.98);
      mesh.castShadow = true;
      mesh.frustumCulled = false;
      const leafGroup = new THREE.Group();
      leafGroup.add(mesh);
      scene.add(leafGroup);

      // shadow catcher
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.ShadowMaterial({ opacity: 0.32 })
      );
      plane.position.z = -1.1;
      plane.receiveShadow = true;
      scene.add(plane);

      // lighting
      scene.add(new THREE.AmbientLight(threeColors.violetAmbient, 0.5));
      const key = new THREE.DirectionalLight(threeColors.paper, 1.6);
      key.position.set(-2.4, 3.0, 3.4);
      key.castShadow = true;
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 14;
      Object.assign(key.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3 });
      scene.add(key);
      const rim = new THREE.DirectionalLight(threeColors.violetLight, 1.1);
      rim.position.set(3, -1, -2);
      scene.add(rim);

      // --- particle burst emitted while the shape is actively transforming ---
      const P = 240;
      const pPos = new Float32Array(P * 3);
      const pVel = new Float32Array(P * 3);
      const pLife = new Float32Array(P);
      const pMax = new Float32Array(P);
      const pSize = new Float32Array(P);
      const pAlpha = new Float32Array(P);
      for (let i = 0; i < P; i++) {
        pLife[i] = 1;
        pMax[i] = 1;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
      pGeo.setAttribute('aAlpha', new THREE.BufferAttribute(pAlpha, 1));
      pGeo.setAttribute('aSize', new THREE.BufferAttribute(pSize, 1));
      const pMat = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uColor: { value: new THREE.Color(threeColors.violet400) },
          uDpr: { value: Math.min(window.devicePixelRatio, 2) },
        },
        vertexShader:
          'uniform float uDpr; attribute float aAlpha; attribute float aSize; varying float vA; void main(){ vA=aAlpha; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=aSize*uDpr; gl_Position=projectionMatrix*mv; }',
        fragmentShader:
          'uniform vec3 uColor; varying float vA; void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard; float a=smoothstep(0.5,0.0,d)*vA; gl_FragColor=vec4(uColor,a); }',
      });
      const points = new THREE.Points(pGeo, pMat);
      points.frustumCulled = false;
      scene.add(points);

      const tmp = new THREE.Vector3();
      const emit = (n: number) => {
        for (let e = 0; e < n; e++) {
          let s = -1;
          for (let i = 0; i < P; i++) {
            if (pAlpha[i] <= 0.001) {
              s = i;
              break;
            }
          }
          if (s < 0) break;
          const r = (Math.random() * N) | 0;
          tmp
            .set(curXY[r][0] * 0.92, curXY[r][1] * 0.92, (Math.random() - 0.5) * 0.34)
            .applyMatrix4(leafGroup.matrixWorld);
          pPos[s * 3] = tmp.x;
          pPos[s * 3 + 1] = tmp.y;
          pPos[s * 3 + 2] = tmp.z;
          const len = tmp.length() || 1;
          const dx = tmp.x / len;
          const dy = tmp.y / len;
          const dz = tmp.z / len;
          const sp = 0.7 + Math.random() * 1.2;
          pVel[s * 3] = dx * sp + (Math.random() - 0.5) * 0.6;
          pVel[s * 3 + 1] = dy * sp + (Math.random() - 0.5) * 0.6 + 0.25;
          pVel[s * 3 + 2] = dz * sp + (Math.random() - 0.5) * 0.6;
          pLife[s] = 0;
          pMax[s] = 0.5 + Math.random() * 0.5;
          pSize[s] = 3 + Math.random() * 6;
          pAlpha[s] = 0.85;
        }
      };

      let prevTs = performance.now();
      let prevT = 0;
      // Full cycle: hold leaf → morph to circle → hold circle → morph back.
      // Longer overall period + explicit hold plateaus give the eye time to
      // read each end shape before it starts changing again.
      const MORPH_PERIOD_S = 11;
      const HOLD_LEAF = 0.22;   // 22% of the cycle sitting on the leaf
      const MORPH_UP = 0.26;    // 26% morphing leaf → circle
      const HOLD_CIRCLE = 0.22; // 22% sitting on a clean circle
      // (remaining 30% morphs back)
      const smoothstep = (x: number) => x * x * (3 - 2 * x);
      const loop = (ts: number) => {
        const sTime = ts * 0.001;
        const dt = Math.min(0.05, Math.max(0.001, (ts - prevTs) * 0.001));
        prevTs = ts;

        // Piecewise cycle amount, smoothstep-eased on both transitions.
        const cyclePhase = (sTime % MORPH_PERIOD_S) / MORPH_PERIOD_S;
        let cycle: number;
        if (cyclePhase < HOLD_LEAF) {
          cycle = 0;
        } else if (cyclePhase < HOLD_LEAF + MORPH_UP) {
          cycle = smoothstep((cyclePhase - HOLD_LEAF) / MORPH_UP);
        } else if (cyclePhase < HOLD_LEAF + MORPH_UP + HOLD_CIRCLE) {
          cycle = 1;
        } else {
          const morphDown = 1 - HOLD_LEAF - MORPH_UP - HOLD_CIRCLE;
          cycle = 1 - smoothstep(
            (cyclePhase - HOLD_LEAF - MORPH_UP - HOLD_CIRCLE) / morphDown
          );
        }

        // Sub-breath only in the middle of morph — endpoints stay pinned so
        // the "circle" plateau really is a perfect circle.
        const midMask = 4 * cycle * (1 - cycle);
        const breath = 0.025 * Math.sin(sTime * 1.9) * midMask;
        const t = Math.max(0, Math.min(1, cycle + breath));

        // Per-vertex jitter for organic imperfection — fades out as we
        // approach the circle so the ring stays mathematically clean.
        const jitterAmp = 0.014;
        const jitterT = sTime * 0.9;
        const jitterScale = (1 - cycle) * (1 - cycle);
        for (let i = 0; i < N; i++) {
          const jx = Math.sin(jitterT + i * 0.71) * jitterAmp * jitterScale;
          const jy = Math.cos(jitterT * 1.13 + i * 0.87) * jitterAmp * jitterScale;
          curXY[i][0] = leafXY[i][0] + (circXY[i][0] - leafXY[i][0]) * t + jx;
          curXY[i][1] = leafXY[i][1] + (circXY[i][1] - leafXY[i][1]) * t + jy;
        }
        const ng = buildGeo(curXY);
        mesh.geometry.dispose();
        mesh.geometry = ng;
        geo = ng;

        const MAXR = 1.134; // 65deg cap on every axis
        const clampR = (v: number) => Math.max(-MAXR, Math.min(MAXR, v));
        leafGroup.rotation.y = clampR(
          0.85 * Math.sin(sTime * 0.34) + 0.24 * Math.sin(sTime * 0.63 + 1.2)
        );
        leafGroup.rotation.x = clampR(
          0.26 + 0.34 * Math.sin(sTime * 0.19 + 1.1) + 0.12 * Math.sin(sTime * 0.61)
        );
        leafGroup.rotation.z = clampR(0.3 * Math.sin(sTime * 0.13 + 0.7));
        // Breathing pulse — slightly stronger than before to sell the motion.
        mesh.scale.setScalar(0.97 + 0.03 * Math.sin(sTime * 1.15));
        leafGroup.updateMatrixWorld();

        // sparkles while actively morphing
        const dT = Math.abs(t - prevT) / dt;
        prevT = t;
        const emitN = Math.min(3, Math.floor(dT * 7));
        if (emitN > 0) emit(emitN);

        for (let i = 0; i < P; i++) {
          if (pAlpha[i] <= 0.001) continue;
          pLife[i] += dt;
          if (pLife[i] >= pMax[i]) {
            pAlpha[i] = 0;
            continue;
          }
          pVel[i * 3] *= 0.96;
          pVel[i * 3 + 1] = pVel[i * 3 + 1] * 0.96 - 0.3 * dt;
          pVel[i * 3 + 2] *= 0.96;
          pPos[i * 3] += pVel[i * 3] * dt;
          pPos[i * 3 + 1] += pVel[i * 3 + 1] * dt;
          pPos[i * 3 + 2] += pVel[i * 3 + 2] * dt;
          pAlpha[i] = 0.75 * (1 - pLife[i] / pMax[i]);
        }
        pGeo.attributes.position.needsUpdate = true;
        pGeo.attributes.aAlpha.needsUpdate = true;
        pGeo.attributes.aSize.needsUpdate = true;

        renderer.render(scene, camera);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);

      cleanup = () => {
        geo.dispose();
        mat.dispose();
        pGeo.dispose();
        pMat.dispose();
        plane.geometry.dispose();
        (plane.material as THREE.Material).dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    };

    setup();

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (cleanup) cleanup();
    };
  }, []);

  return <div ref={wrapRef} style={{ width: '100%', height: '100%' }} />;
}
