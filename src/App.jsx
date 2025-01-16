import { useState } from "react";
import { Canvas } from "@react-three/fiber";

export default function App() {
  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.1);
  return (
    <>
      <input
        onChange={(e) => {
          setAmbientLightIntensity(e.target.value);
        }}
        type="number"
        value={ambientLightIntensity}
      />
      <Canvas>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial color="blue" />
        </mesh>

        <ambientLight intensity={ambientLightIntensity} />
        <directionalLight color="white" position={[0, 0, 5]} />
      </Canvas>
    </>
  );
}
