import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import soldierUrl from "@/assets/models/soldier.glb?url";

interface HumanFigure3DProps {
  active: boolean;
}

/**
 * Swap this single constant to drop in a different human / medical-anatomy
 * model. The asset is imported with `?url` so Vite fingerprints and bundles it
 * locally — the deck stays fully offline (no CDN fetch on defense day).
 */
const MODEL_URL = soldierUrl;
/** Idle clip baked into the bundled model. */
const IDLE_CLIP = "Idle";
/** Slight turn off dead-frontal so the figure reads as a 3D body, not a cutout. */
const BASE_ROTATION_Y = -0.08;

function disposeObject(object: THREE.Object3D) {
  const disposed = new Set<THREE.Material>();

  object.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;

    mesh.geometry?.dispose();

    const material = mesh.material;
    const entries = Array.isArray(material) ? material : [material];
    entries.forEach((entry) => {
      if (!entry || disposed.has(entry)) return;
      disposed.add(entry);
      // Materials don't dispose their own textures — walk the maps off them.
      for (const value of Object.values(entry as unknown as Record<string, unknown>)) {
        if (value instanceof THREE.Texture) value.dispose();
      }
      entry.dispose();
    });
  });
}

export default function HumanFigure3D({ active }: HumanFigure3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let disposed = false;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

    // Image-based lighting for realistic PBR shading — generated in-engine, no
    // external HDR asset, so it stays offline.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

    // Soft paper-warm key + clinical-teal rim, matching the deck skin.
    scene.add(new THREE.HemisphereLight(0xf7f4eb, 0x8fb6be, 1.1));

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(3.2, 6, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 30;
    keyLight.shadow.camera.left = -3;
    keyLight.shadow.camera.right = 3;
    keyLight.shadow.camera.top = 6;
    keyLight.shadow.camera.bottom = -1;
    keyLight.shadow.camera.updateProjectionMatrix();
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9ee1ea, 1.4);
    rimLight.position.set(-4, 2.4, -2.5);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(-1.5, 1, 5);
    scene.add(fillLight);

    // Soft contact shadow under the figure so it feels grounded.
    const shadowGround = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.18 }),
    );
    shadowGround.rotation.x = -Math.PI / 2;
    shadowGround.receiveShadow = true;
    scene.add(shadowGround);

    // Faint teal platform disc to tie the figure to the clinical palette.
    const accentDisc = new THREE.Mesh(
      new THREE.CircleGeometry(1.4, 96),
      new THREE.MeshBasicMaterial({
        color: 0x0d6e85,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      }),
    );
    accentDisc.rotation.x = -Math.PI / 2;
    accentDisc.position.y = 0.002;
    scene.add(accentDisc);

    let model: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let modelHeight = 2;
    let modelWidth = 0.8;
    let modelCenterY = 1;

    const fitCamera = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      const aspect = width / height;
      camera.aspect = aspect;

      const vFov = (camera.fov * Math.PI) / 180;
      const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
      const fitH = modelHeight / 2 / Math.tan(vFov / 2);
      const fitW = modelWidth / 2 / Math.tan(hFov / 2);
      const dist = Math.max(fitH, fitW) * 1.18;

      camera.position.set(0, modelCenterY + modelHeight * 0.04, dist);
      camera.lookAt(0, modelCenterY, 0);
      camera.updateProjectionMatrix();
    };

    const loader = new GLTFLoader();
    loader.load(
      MODEL_URL,
      (gltf) => {
        if (disposed) {
          disposeObject(gltf.scene);
          return;
        }

        const loaded = gltf.scene;
        loaded.traverse((child) => {
          const mesh = child as THREE.Mesh;
          if (!mesh.isMesh) return;
          mesh.castShadow = true;
          mesh.receiveShadow = false;
          mesh.frustumCulled = false;
        });

        // Recenter: feet at y = 0, centered on x/z.
        loaded.updateMatrixWorld(true);
        const box = new THREE.Box3().setFromObject(loaded);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);
        loaded.position.x -= center.x;
        loaded.position.z -= center.z;
        loaded.position.y -= box.min.y;
        loaded.rotation.y = BASE_ROTATION_Y;

        modelHeight = size.y;
        modelWidth = Math.max(size.x, size.z);
        modelCenterY = size.y * 0.5;

        scene.add(loaded);
        model = loaded;

        const clip =
          THREE.AnimationClip.findByName(gltf.animations, IDLE_CLIP) ??
          gltf.animations[0];
        if (clip) {
          mixer = new THREE.AnimationMixer(loaded);
          mixer.clipAction(clip).play();
        }

        fitCamera();
      },
      undefined,
      (error) => {
        console.error("HumanFigure3D: failed to load model", error);
      },
    );

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height, false);
      fitCamera();
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

    let prevTime = 0;
    renderer.setAnimationLoop((time) => {
      const t = time * 0.001;
      const delta = prevTime ? t - prevTime : 0;
      prevTime = t;

      if (activeRef.current) {
        mixer?.update(delta);
        if (model) {
          model.rotation.y = BASE_ROTATION_Y + Math.sin(t * 0.4) * 0.06;
        }
      }

      renderer.render(scene, camera);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(resizeRaf);
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      mixer?.stopAllAction();
      disposeObject(scene);
      envTexture.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (canvas.parentNode === mount) mount.removeChild(canvas);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
