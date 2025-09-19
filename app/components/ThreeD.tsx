"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls, Bounds } from "@react-three/drei";
import * as THREE from "three";
import { useEffect } from "react";

interface Props {
  three_d: string;
}

const ThreeD = ({ three_d }: Props) => {
  const fbx = useLoader(FBXLoader, three_d);

  useEffect(() => {
    return () => {
      fbx.traverse((child: any) => {
        if (child.isMesh) {
          child.geometry.dispose();
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach((m:any) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      });
    };
  }, [fbx]);

  return <primitive object={fbx} />;
};

const Scene = ({ three_d }: Props) => {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        onCreated={({ gl }) => {
          return () => {
            gl.dispose();
          };
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <Bounds fit clip>
          <ThreeD three_d={three_d} />
        </Bounds>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};

export default Scene;
