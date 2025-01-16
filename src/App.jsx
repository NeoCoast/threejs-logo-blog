import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import NeocoastLogo from './NeocoastLogo';

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
        <NeocoastLogo ambientLightIntensity={ambientLightIntensity} />
      </Canvas>
    </>
  );
}
