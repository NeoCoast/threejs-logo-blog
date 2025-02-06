import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/Addons.js";

import neocoastLogo from "./assets/neocoastLogo.svg";

const NeocoastLogo = ({ ambientLightIntensity }) => {
  const meshRef = useRef(null);

  const { paths } = useLoader(SVGLoader, neocoastLogo);

  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.z += 0.01;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <group
          scale={[0.01, 0.01, 0.01]}
          rotation={[0, Math.PI, 0]}
          position={[2, -1, -1]}
        >
          {paths.map((path, i) =>
            path.toShapes().map((shape, j) => (
              <mesh key={`${i}-${j}`}>
                <extrudeGeometry args={[shape, { depth: 50 }]} />
                <meshStandardMaterial color={path.color || "blue"} />
              </mesh>
            ))
          )}
        </group>
      </mesh>

      <ambientLight intensity={ambientLightIntensity} />
      <directionalLight color="white" position={[0, 0, 5]} />
    </>
  );
};

export default NeocoastLogo;
