import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

const NeocoastLogo = ({ ambientLightIntensity }) => {
  const meshRef = useRef(null);

  useFrame(() => {
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.z += 0.01;
  });

  return (
    <>
      <mesh ref={meshRef}>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>

      <ambientLight intensity={ambientLightIntensity} />
      <directionalLight color="white" position={[0, 0, 5]} />
    </>
  );
};

export default NeocoastLogo;
