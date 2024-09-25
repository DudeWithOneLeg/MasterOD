import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useGLTF, useScroll } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Jupiter() {
  const group = useRef();
  const [initialPosition] = useState(new THREE.Vector3(.4, -2.4, 0)); // X = 0.3, Y = 0, Z = 0
  const { scene } = useGLTF('../../../models/models/jupiter.gltf');
  const scroll = useScroll();

  useFrame(() => {
    if (group.current) {
      // Keep rotating the model
      group.current.rotation.y += 0.0002; // Rotate around Y-axis

      // Update the position relative to the initial position
      const yPos = initialPosition.y + ((scroll.offset * 4) * 1.2);
      group.current.position.set(initialPosition.x, yPos, initialPosition.z); // Maintain Y and Z values

      // console.log(group.current.position.y);
    }
  });

  return (
    <group ref={group} rotation={[0, 0, -0.2604]} >
      <primitive object={scene} scale={[.0043, .0043, .0043]}/>
    </group>
  );
}
