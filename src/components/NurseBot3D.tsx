import { useEffect, useRef } from "react";
import * as THREE from "three";

interface NurseBot3DProps {
  active: boolean;
}

function disposeObject(object: THREE.Object3D) {
  const disposedMaterials = new Set<THREE.Material>();

  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return;

    const { geometry, material } = child;
    geometry.dispose();

    if (Array.isArray(material)) {
      material.forEach((entry) => {
        if (disposedMaterials.has(entry)) return;
        entry.dispose();
        disposedMaterials.add(entry);
      });
    } else if (!disposedMaterials.has(material)) {
      material.dispose();
      disposedMaterials.add(material);
    }
  });
}

function addSphere(
  group: THREE.Group,
  material: THREE.Material,
  radius: number,
  position: THREE.Vector3Tuple,
  scale: THREE.Vector3Tuple = [1, 1, 1],
) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 48, 32), material);
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  group.add(mesh);
  return mesh;
}

function addCapsule(
  group: THREE.Group,
  material: THREE.Material,
  radius: number,
  length: number,
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector3Tuple = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, length, 18, 32),
    material,
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function addCylinder(
  group: THREE.Group,
  material: THREE.Material,
  radiusTop: number,
  radiusBottom: number,
  height: number,
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector3Tuple = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(
    new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 40),
    material,
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function addBox(
  group: THREE.Group,
  material: THREE.Material,
  size: THREE.Vector3Tuple,
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector3Tuple = [0, 0, 0],
) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

function addTorus(
  group: THREE.Group,
  material: THREE.Material,
  radius: number,
  tube: number,
  position: THREE.Vector3Tuple,
  rotation: THREE.Vector3Tuple = [0, 0, 0],
  arc = Math.PI * 2,
) {
  const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 16, 64, arc),
    material,
  );
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  group.add(mesh);
  return mesh;
}

export default function NurseBot3D({ active }: NurseBot3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    // Pin the canvas to fill its container in CSS so its layout size never
    // depends on the drawing-buffer dimensions. Without this, setSize(…, false)
    // leaves the canvas unstyled and, at devicePixelRatio > 1, the buffer grows
    // the container, which re-triggers the ResizeObserver -> runaway resize loop.
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    mount.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.4, 5.6);
    camera.lookAt(0, 0.33, 0);

    // Soft, paper-warm key + clinical teal rim, matching the deck skin.
    scene.add(new THREE.HemisphereLight(0xfbf7ee, 0x9fc4cc, 2.2));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(3, 5, 4.2);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x8fd9e6, 1.5);
    rimLight.position.set(-3.6, 1.8, 2.2);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(0, -1, 5);
    scene.add(fillLight);

    // --- Palette (deck tokens) ---
    const SHELL = 0xf3efe6; // cream plastic body
    const TEAL = 0x0d6e85; // clinic accent
    const TEAL_SOFT = 0xcfe6ea;
    const CORAL = 0xcf5a4e; // medical cross
    const VISOR = 0x10303a; // dark face glass
    const EYE = 0x6fdcec; // glowing eyes

    const shell = new THREE.MeshPhysicalMaterial({
      color: SHELL,
      roughness: 0.45,
      metalness: 0.04,
      clearcoat: 0.5,
      clearcoatRoughness: 0.45,
    });
    const teal = new THREE.MeshPhysicalMaterial({
      color: TEAL,
      roughness: 0.34,
      metalness: 0.12,
      clearcoat: 0.6,
      clearcoatRoughness: 0.4,
    });
    const tealSoft = new THREE.MeshStandardMaterial({
      color: TEAL_SOFT,
      roughness: 0.5,
      metalness: 0.05,
    });
    const coral = new THREE.MeshStandardMaterial({
      color: CORAL,
      roughness: 0.42,
      metalness: 0.04,
    });
    const visor = new THREE.MeshPhysicalMaterial({
      color: VISOR,
      roughness: 0.12,
      metalness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: EYE,
      emissive: 0x35c6db,
      emissiveIntensity: 0.9,
      roughness: 0.3,
    });
    const chestMat = new THREE.MeshStandardMaterial({
      color: TEAL,
      emissive: TEAL,
      emissiveIntensity: 0.4,
      roughness: 0.35,
      metalness: 0.1,
    });
    const glowMat = new THREE.MeshBasicMaterial({
      color: TEAL,
      transparent: true,
      opacity: 0.5,
    });

    const bot = new THREE.Group();
    bot.rotation.y = -0.16;
    bot.scale.setScalar(0.94);
    scene.add(bot);

    // --- Body ---
    addSphere(bot, shell, 0.74, [0, -0.12, 0], [1.02, 1.2, 0.96]); // torso (egg)
    addCylinder(bot, shell, 0.18, 0.2, 0.2, [0, 0.52, 0]); // neck

    // Chest emblem: glowing teal ring + coral cross
    const chestRing = addTorus(bot, chestMat, 0.22, 0.035, [0, 0.06, 0.66]);
    addBox(bot, coral, [0.05, 0.2, 0.03], [0, 0.06, 0.69]);
    addBox(bot, coral, [0.2, 0.05, 0.03], [0, 0.06, 0.69]);

    // --- Arms ---
    // Resting left arm
    addCapsule(bot, shell, 0.12, 0.46, [-0.74, -0.02, 0.04], [0, 0, 0.34]);
    addSphere(bot, shell, 0.15, [-0.92, -0.52, 0.06]);

    // Waving right arm (own group so it can pivot at the shoulder)
    const waveArm = new THREE.Group();
    waveArm.position.set(0.66, 0.3, 0.06);
    bot.add(waveArm);
    addCapsule(waveArm, shell, 0.12, 0.5, [0.22, 0.24, 0], [0, 0, -0.9]);
    addSphere(waveArm, shell, 0.155, [0.47, 0.52, 0.02]);

    // --- Head ---
    const head = new THREE.Group();
    head.position.set(0, 1.02, 0);
    bot.add(head);

    addSphere(head, shell, 0.66, [0, 0, 0], [1.02, 0.94, 0.98]); // skull
    addSphere(head, visor, 0.5, [0, 0.0, 0.3], [0.98, 0.62, 0.64]); // visor band

    const leftEye = addSphere(head, eyeMat, 0.085, [-0.2, 0.02, 0.62], [1, 1.1, 1]);
    const rightEye = addSphere(head, eyeMat, 0.085, [0.2, 0.02, 0.62], [1, 1.1, 1]);
    const eyes = [leftEye, rightEye];

    // Friendly coral cheek dots
    addSphere(head, coral, 0.06, [-0.44, -0.16, 0.5], [1, 1, 0.4]);
    addSphere(head, coral, 0.06, [0.44, -0.16, 0.5], [1, 1, 0.4]);

    // Nurse cap with coral cross
    addCylinder(head, shell, 0.34, 0.36, 0.18, [0, 0.6, -0.02], [-0.12, 0, 0]);
    addBox(head, coral, [0.045, 0.17, 0.02], [0, 0.62, 0.32], [-0.45, 0, 0]);
    addBox(head, coral, [0.17, 0.045, 0.02], [0, 0.62, 0.32], [-0.45, 0, 0]);

    // Headset: over-the-head band, ear cups, mic boom
    addTorus(head, teal, 0.72, 0.045, [0, 0.0, 0], [0, 0, 0], Math.PI);
    addSphere(head, teal, 0.14, [-0.72, 0.0, 0.02], [0.6, 1, 1]);
    addSphere(head, teal, 0.14, [0.72, 0.0, 0.02], [0.6, 1, 1]);
    addCapsule(head, teal, 0.026, 0.5, [-0.5, -0.28, 0.4], [0.5, 0, 0.7]);
    addSphere(head, tealSoft, 0.06, [-0.22, -0.42, 0.6]);

    // --- Hover base (no legs) ---
    const hoverRing = addTorus(
      bot,
      glowMat,
      0.5,
      0.05,
      [0, -1.32, 0],
      [Math.PI / 2, 0, 0],
    );

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(1.6, 96),
      new THREE.MeshBasicMaterial({
        color: TEAL,
        transparent: true,
        opacity: 0.07,
        side: THREE.DoubleSide,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.6;
    scene.add(ground);

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    // Defer to rAF so the observer callback never resizes synchronously
    // (avoids "ResizeObserver loop completed with undelivered notifications").
    let resizeRaf = 0;
    const resizeObserver = new ResizeObserver(() => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(resize);
    });
    resizeObserver.observe(mount);
    resize();

    renderer.setAnimationLoop((time) => {
      if (!activeRef.current) {
        renderer.render(scene, camera);
        return;
      }

      const t = time * 0.001;

      // Gentle float + sway
      bot.position.y = Math.sin(t * 0.9) * 0.06;
      bot.rotation.y = -0.16 + Math.sin(t * 0.5) * 0.06;

      // Head idle motion
      head.rotation.z = Math.sin(t * 0.7) * 0.04;
      head.rotation.x = Math.sin(t * 0.5) * 0.03;

      // Eyes glow + periodic blink
      eyeMat.emissiveIntensity = 0.8 + Math.sin(t * 3) * 0.25;
      const blink = t % 4.2 < 0.12 ? 0.12 : 1;
      eyes.forEach((eye) => eye.scale.set(1, 1.1 * blink, 1));

      // Chest emblem pulse
      const chestPulse = 1 + Math.sin(t * 2.2) * 0.07;
      chestRing.scale.setScalar(chestPulse);
      chestMat.emissiveIntensity = 0.35 + Math.sin(t * 2.2) * 0.2;

      // Friendly wave
      waveArm.rotation.z = Math.sin(t * 2.6) * 0.22;

      // Hover ring breathing
      const hover = 1 + Math.sin(t * 1.4) * 0.08;
      hoverRing.scale.set(hover, hover, 1);
      glowMat.opacity = 0.4 + Math.sin(t * 1.4) * 0.14;

      renderer.render(scene, camera);
    });

    return () => {
      cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      disposeObject(scene);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
