import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import * as THREE from "three";

interface SceneProps {
  quality: "low" | "high";
  active: boolean;
}

const palette = {
  ivory: "#f5efe3",
  sage: "#779080",
  forest: "#24483a",
  peach: "#eaa27f",
  champagne: "#c4a46a",
  cloud: "#fffaf1",
};

function Cloud({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh castShadow position={[-0.45, 0, 0]}><sphereGeometry args={[0.48, 24, 18]} /><meshPhysicalMaterial color={palette.cloud} roughness={0.35} clearcoat={0.4} /></mesh>
      <mesh castShadow position={[0.05, 0.18, 0]}><sphereGeometry args={[0.66, 24, 18]} /><meshPhysicalMaterial color={palette.cloud} roughness={0.35} clearcoat={0.4} /></mesh>
      <mesh castShadow position={[0.62, -0.02, 0]}><sphereGeometry args={[0.42, 24, 18]} /><meshPhysicalMaterial color={palette.cloud} roughness={0.35} clearcoat={0.4} /></mesh>
    </group>
  );
}

function Star({ position, scale = 1, glow = false }: { position: [number, number, number]; scale?: number; glow?: boolean }) {
  const shape = useMemo(() => {
    const result = new THREE.Shape();
    for (let i = 0; i < 10; i += 1) {
      const radius = i % 2 === 0 ? 0.55 : 0.24;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) result.moveTo(x, y); else result.lineTo(x, y);
    }
    result.closePath();
    return result;
  }, []);

  return (
    <mesh castShadow position={position} scale={scale} rotation={[0.05, -0.2, 0.08]}>
      <extrudeGeometry args={[shape, { depth: 0.18, bevelEnabled: true, bevelSize: 0.08, bevelThickness: 0.08, bevelSegments: 3 }]} />
      <meshPhysicalMaterial color={glow ? palette.champagne : palette.peach} emissive={glow ? palette.champagne : palette.peach} emissiveIntensity={glow ? 0.55 : 0.05} metalness={glow ? 0.6 : 0.05} roughness={0.25} clearcoat={0.5} />
    </mesh>
  );
}

function Moon({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0.1, -0.35, 0.08]}>
      <mesh castShadow>
        <torusGeometry args={[0.75, 0.28, 32, 64, Math.PI * 1.48]} />
        <meshPhysicalMaterial color={palette.champagne} metalness={0.68} roughness={0.2} clearcoat={0.8} />
      </mesh>
      <mesh position={[0.5, 0.5, 0]}><sphereGeometry args={[0.08, 14, 14]} /><meshStandardMaterial color={palette.champagne} emissive={palette.champagne} emissiveIntensity={1.4} toneMapped={false} /></mesh>
    </group>
  );
}

function StringLine({ from, length }: { from: [number, number, number]; length: number }) {
  return (
    <mesh position={[from[0], from[1] - length / 2, from[2]]}>
      <cylinderGeometry args={[0.008, 0.008, length, 8]} />
      <meshStandardMaterial color={palette.champagne} metalness={0.8} roughness={0.24} />
    </mesh>
  );
}

function ShaderParticles({ count }: { count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const angle = i * 2.399963;
      const radius = 2.4 + ((i * 17) % 31) / 15;
      values[i * 3] = Math.cos(angle) * radius;
      values[i * 3 + 1] = ((i * 23) % 61) / 9 - 2.1;
      values[i * 3 + 2] = Math.sin(angle) * radius * 0.45 - 1.2;
    }
    return values;
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uColor: { value: new THREE.Color(palette.champagne) } }), []);

  useFrame((_, rawDelta) => {
    if (material.current) material.current.uniforms.uTime.value += Math.min(rawDelta, 0.05);
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry><bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} /></bufferGeometry>
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={/* glsl */`
          uniform float uTime;
          varying float vTwinkle;
          void main() {
            vec3 p = position;
            float phase = position.x * 1.7 + position.y * 2.3;
            p.y += sin(uTime * 0.45 + phase) * 0.11;
            p.x += cos(uTime * 0.28 + phase) * 0.05;
            vTwinkle = 0.58 + 0.42 * sin(uTime * 1.7 + phase);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = (3.0 + 3.0 * vTwinkle) * (7.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `}
        fragmentShader={/* glsl */`
          uniform vec3 uColor;
          varying float vTwinkle;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            float alpha = smoothstep(0.5, 0.08, d) * vTwinkle;
            gl_FragColor = vec4(uColor, alpha * 0.7);
          }
        `}
      />
    </points>
  );
}

function MobileSculpture({ quality }: { quality: "low" | "high" }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef(new THREE.Vector2());
  const { camera, gl } = useThree();

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.set((event.clientX / window.innerWidth - 0.5) * 2, (event.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    if (group.current) {
      const t = clock.elapsedTime;
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.current.x * 0.12 + Math.sin(t * 0.22) * 0.08, 2.3, dt);
      group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.current.y * 0.045 + Math.sin(t * 0.35) * 0.018, 2.3, dt);
      group.current.position.y = Math.sin(t * 0.42) * 0.08;
    }
    const scroll = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, 0.1 - scroll * 0.24, 2, dt);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, scroll * 0.16, 2, dt);
    camera.lookAt(0, -0.15, 0);
    gl.shadowMap.autoUpdate = quality === "high";
  });

  return (
    <group ref={group} position={[0, -0.05, 0]}>
      <mesh castShadow position={[0, 2.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.72, 0.08, 16, quality === "high" ? 80 : 42]} />
        <meshPhysicalMaterial color={palette.champagne} metalness={0.82} roughness={0.18} clearcoat={0.7} />
      </mesh>
      <mesh castShadow position={[0, 2.5, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.07, 0.07, 3.1, 16]} />
        <meshPhysicalMaterial color={palette.champagne} metalness={0.85} roughness={0.18} />
      </mesh>
      <mesh castShadow position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 3.1, 16]} />
        <meshPhysicalMaterial color={palette.champagne} metalness={0.85} roughness={0.18} />
      </mesh>
      <StringLine from={[-1.2, 2.25, 0]} length={1.55} /><Moon position={[-1.2, 0.25, 0]} />
      <StringLine from={[1.2, 2.25, 0.1]} length={1.1} /><Cloud position={[1.2, 0.85, 0.1]} scale={0.72} />
      <StringLine from={[0.05, 2.25, 1.2]} length={2.2} /><Star position={[0.05, -0.3, 1.2]} scale={0.88} glow />
      <StringLine from={[0.05, 2.25, -1.2]} length={1.38} /><Star position={[0.05, 0.43, -1.2]} scale={0.54} />
      <StringLine from={[0.86, 2.25, -0.86]} length={2.5} />
      <group position={[0.86, -0.42, -0.86]} rotation={[0.2, 0.3, -0.18]}>
        <mesh castShadow><torusGeometry args={[0.58, 0.16, 24, 54, Math.PI * 1.55]} /><meshPhysicalMaterial color={palette.sage} roughness={0.28} clearcoat={0.65} /></mesh>
        <mesh castShadow position={[0.12, 0.15, 0.02]}><torusGeometry args={[0.35, 0.12, 20, 42, Math.PI * 1.55]} /><meshPhysicalMaterial color={palette.peach} roughness={0.3} clearcoat={0.5} /></mesh>
      </group>
      <RoundedBox args={[1.35, 0.28, 0.55]} radius={0.14} smoothness={4} castShadow position={[-0.78, -1.5, -0.2]} rotation={[0.15, 0.38, -0.12]}>
        <meshPhysicalMaterial color={palette.forest} roughness={0.32} clearcoat={0.55} />
      </RoundedBox>
      <mesh castShadow position={[1.55, -1.25, 0.5]}><sphereGeometry args={[0.34, 32, 24]} /><meshPhysicalMaterial color={palette.peach} roughness={0.25} clearcoat={0.7} /></mesh>
      <ShaderParticles count={quality === "high" ? 180 : 72} />
    </group>
  );
}

function Scene({ quality }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.7} color={palette.ivory} />
      <directionalLight castShadow position={[4, 7, 6]} intensity={3.1} color={palette.cloud} shadow-mapSize-width={quality === "high" ? 1024 : 512} shadow-mapSize-height={quality === "high" ? 1024 : 512} />
      <pointLight position={[-4, 1, 3]} intensity={26} distance={11} color={palette.peach} />
      <pointLight position={[4, 0, 2]} intensity={18} distance={10} color={palette.sage} />
      <Environment resolution={quality === "high" ? 128 : 64}>
        <Lightformer intensity={3} position={[0, 5, 4]} scale={[8, 3, 1]} color={palette.cloud} />
        <Lightformer intensity={1.6} position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[5, 2, 1]} color={palette.peach} />
      </Environment>
      <MobileSculpture quality={quality} />
      {quality === "high" && <EffectComposer multisampling={0}><Bloom luminanceThreshold={1.05} mipmapBlur intensity={0.32} radius={0.62} /></EffectComposer>}
    </>
  );
}

export default function HeroScene3D({ quality, active }: SceneProps) {
  return (
    <Canvas
      aria-label="Sculpture mobile de chambre d’enfant en mouvement"
      dpr={quality === "high" ? [1, 1.65] : 1}
      frameloop={active ? "always" : "never"}
      shadows={quality === "high"}
      camera={{ position: [0, 0.1, 7.6], fov: 38, near: 0.1, far: 40 }}
      gl={{ antialias: quality === "high", alpha: true, powerPreference: quality === "high" ? "high-performance" : "low-power" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Scene quality={quality} active={active} />
    </Canvas>
  );
}