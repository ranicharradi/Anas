import { useEffect, useRef } from "react";
import * as THREE from "three";

interface HumanFigure3DProps {
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

function addCapsule(
  group: THREE.Group,
  material: THREE.Material,
  radius: number,
  length: number,
  position: THREE.Vector3Tuple,
  rotation: THREE.Euler | THREE.Vector3Tuple = [0, 0, 0],
  scale: THREE.Vector3Tuple = [1, 1, 1],
) {
  const mesh = new THREE.Mesh(
    new THREE.CapsuleGeometry(radius, length, 18, 36),
    material,
  );
  mesh.position.set(...position);
  mesh.rotation.copy(rotation instanceof THREE.Euler ? rotation : new THREE.Euler(...rotation));
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
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
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

function addMarker(group: THREE.Group, color: number, position: THREE.Vector3Tuple, scale = 1) {
  const markerGroup = new THREE.Group();
  markerGroup.position.set(...position);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.12 * scale, 0.016 * scale, 12, 40),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }),
  );
  markerGroup.add(ring);

  const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.042 * scale, 24, 16),
    new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.2,
      roughness: 0.35,
    }),
  );
  markerGroup.add(dot);

  group.add(markerGroup);
  return markerGroup;
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

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0.5, 8.2);
    camera.lookAt(0, 0.55, 0);

    const ambient = new THREE.HemisphereLight(0xf7f4eb, 0x8fb6be, 2.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(2.8, 4.8, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x9ee1ea, 1.8);
    rimLight.position.set(-3.5, 2.2, 2.4);
    scene.add(rimLight);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(2.25, 96),
      new THREE.MeshBasicMaterial({
        color: 0x0d6e85,
        transparent: true,
        opacity: 0.08,
        side: THREE.DoubleSide,
      }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -2.22;
    scene.add(ground);

    const figure = new THREE.Group();
    figure.rotation.y = -0.24;
    scene.add(figure);

    const skin = new THREE.MeshPhysicalMaterial({
      color: 0xdcc8b9,
      roughness: 0.48,
      metalness: 0.02,
      clearcoat: 0.16,
      clearcoatRoughness: 0.8,
    });
    const core = new THREE.MeshPhysicalMaterial({
      color: 0xcfe6ea,
      transparent: true,
      opacity: 0.34,
      roughness: 0.42,
      metalness: 0.02,
      clearcoat: 0.35,
      clearcoatRoughness: 0.5,
    });
    const clinic = 0x0d6e85;
    const coral = 0xcf5a4e;

    addSphere(figure, skin, 0.42, [0, 2.42, 0], [0.92, 1.06, 0.9]);
    addCapsule(figure, skin, 0.14, 0.28, [0, 1.9, 0], [0, 0, 0], [0.82, 1, 0.82]);
    addCapsule(figure, skin, 0.5, 1.15, [0, 0.96, 0], [0, 0, 0], [0.92, 1.04, 0.58]);
    addSphere(figure, skin, 0.48, [0, -0.05, 0], [1.35, 0.72, 0.78]);

    addCapsule(figure, core, 0.31, 0.08, [0, 0.86, 0.08], [0, 0, 0], [1.08, 0.76, 0.36]);
    addCapsule(figure, core, 0.25, 0.16, [0, 0.12, 0.1], [0, 0, 0], [1.12, 0.58, 0.42]);

    addCapsule(figure, skin, 0.13, 0.92, [-0.74, 0.94, 0], [0, 0, -0.5]);
    addCapsule(figure, skin, 0.12, 0.82, [-0.98, 0.08, 0.05], [0, 0, -0.22]);
    addSphere(figure, skin, 0.14, [-1.06, -0.52, 0.08], [0.86, 1, 0.72]);
    addCapsule(figure, skin, 0.13, 0.92, [0.74, 0.94, 0], [0, 0, 0.5]);
    addCapsule(figure, skin, 0.12, 0.82, [0.98, 0.08, 0.05], [0, 0, 0.22]);
    addSphere(figure, skin, 0.14, [1.06, -0.52, 0.08], [0.86, 1, 0.72]);

    addCapsule(figure, skin, 0.17, 1.18, [-0.3, -1.12, 0], [0, 0, 0.08]);
    addCapsule(figure, skin, 0.17, 1.18, [0.3, -1.12, 0], [0, 0, -0.08]);
    addSphere(figure, skin, 0.16, [-0.31, -1.9, 0.12], [1.1, 0.42, 0.78]);
    addSphere(figure, skin, 0.16, [0.31, -1.9, 0.12], [1.1, 0.42, 0.78]);

    const markers = [
      addMarker(figure, clinic, [0, 2.63, 0.36], 1.05),
      addMarker(figure, coral, [0, 0.86, 0.48], 1.08),
      addMarker(figure, coral, [0.08, -0.12, 0.52], 1.04),
      addMarker(figure, clinic, [-0.22, 0.12, 0.52], 0.92),
      addMarker(figure, clinic, [0.34, -0.18, 0.48], 0.88),
      addMarker(figure, coral, [-0.34, -0.34, 0.45], 0.9),
    ];

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (width === 0 || height === 0) return;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    renderer.setAnimationLoop((time) => {
      if (!activeRef.current) {
        renderer.render(scene, camera);
        return;
      }

      const t = time * 0.001;
      figure.rotation.y = -0.24 + Math.sin(t * 0.55) * 0.045;
      figure.position.y = Math.sin(t * 0.78) * 0.025;

      markers.forEach((marker, index) => {
        const pulse = 1 + Math.sin(t * 2.2 + index * 0.7) * 0.08;
        marker.scale.setScalar(pulse);
      });

      renderer.render(scene, camera);
    });

    return () => {
      resizeObserver.disconnect();
      renderer.setAnimationLoop(null);
      disposeObject(scene);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" aria-hidden="true" />;
}
