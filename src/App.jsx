import { useState } from "react";
import { Canvas } from "@react-three/fiber";

import NeocoastLogo from "./NeocoastLogo";

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
      <div style={{ height: "400px", width: "600px" }}>
        <Canvas>
          <NeocoastLogo ambientLightIntensity={ambientLightIntensity} />
        </Canvas>
      </div>
    </>
  );
}
