const NeocoastLogo = ({ ambientLightIntensity }) => {
  return (
    <>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="blue" />
      </mesh>

      <ambientLight intensity={ambientLightIntensity} />
      <directionalLight color="white" position={[0, 0, 5]} />
    </>
  );
};

export default NeocoastLogo;
