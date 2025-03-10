import { useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/Addons.js";

import neocoastLogo from "./assets/neocoastLogo.svg";
import { OrbitControls } from "@react-three/drei";

const NeocoastLogo = ({ ambientLightIntensity }) => {

  const { paths } = useLoader(SVGLoader, neocoastLogo);

  return (
    <>
      <OrbitControls
        target={[1 - Math.PI, 1, 0]}
        autoRotate
        autoRotateSpeed={20}
      />
      <mesh>
        <group
          scale={[0.01, 0.01, 0.01]}
          rotation={[0, Math.PI, 0]}
          position={[0, 0, 0]}
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
      <directionalLight color="white" position={[0, 0, -5]} />
    </>
  );
};

export default NeocoastLogo;
