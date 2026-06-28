"use client";

import { useEffect, useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function FloatingSphere({
  position,
  color,
  size,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  size: number;
  speed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.getElapsedTime() * speed;
    
    // Smooth custom floating motion
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.4;
    meshRef.current.position.x = position[0] + Math.cos(time + position[1]) * 0.3;
    
    // Gentle rotation
    meshRef.current.rotation.x = time * 0.05;
    meshRef.current.rotation.y = time * 0.08;

    // React to cursor pointer coordinates
    const targetX = state.pointer.x * 2.5;
    const targetY = state.pointer.y * 2.5;
    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.015;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.015;
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[size, 64, 64]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.15}
        metalness={0.1}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        transmission={0.7} // High transmission for translucent glassmorphic look
        thickness={2.0}
        ior={1.33} // Water/Glass index of refraction
        attenuationColor="#ffffff"
        attenuationDistance={1.0}
      />
    </mesh>
  );
}

function ParticleSystem() {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    pointsRef.current.rotation.y = time * 0.015;
    pointsRef.current.rotation.x = time * 0.008;
  });

  const count = 100;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#F4B6C2"
        size={0.06}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.4}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Background3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none opacity-40 md:opacity-60 transition-opacity duration-1000">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.5} />
        
        {/* Soft, colorful directional lights to highlight glass contours */}
        <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
        <directionalLight position={[-8, -5, -2]} intensity={1.5} color="#F4B6C2" />
        <directionalLight position={[0, -5, 5]} intensity={1.0} color="#ec9eb2" />
        <pointLight position={[0, 0, 5]} intensity={1.5} color="#ffffff" />

        {/* Translucent floating structures */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <FloatingSphere position={[-2.5, 1.5, 0]} color="#F4B6C2" size={0.9} speed={0.8} />
        </Float>
        <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.8}>
          <FloatingSphere position={[2.8, -1.2, -1]} color="#EC9EB2" size={1.2} speed={0.5} />
        </Float>
        <Float speed={2.5} rotationIntensity={0.3} floatIntensity={1.2}>
          <FloatingSphere position={[0.5, 2.2, -2]} color="#ffffff" size={0.7} speed={1.2} />
        </Float>
        <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.9}>
          <FloatingSphere position={[-1.8, -2.0, 1]} color="#fce7eb" size={0.6} speed={0.7} />
        </Float>

        <ParticleSystem />
      </Canvas>
    </div>
  );
}
