# Three.js

Three.js is a 3D JS library used to create 3D visuals and experiences for the web. It uses webGL in the background, that is a JS API that is great at creating 3D shapes, light sources, etc. But it doesn’t have the best developer experience by itself, and that is something crucial, especially when working with something as complicated as 3D.

Three.js can be used in any JS web project, it isn’t narrowed down to just React, but to get the best experience possible while rendering 3D on our browsers (with react), `react-three-fiber` comes to make our lives even easier by turning your ThreeJS functions into React components and hooks.

In this article, you’ll be able to build your own 3D object from an SVG, add rotation controls, as well as lighting, so lets dig into it!

(If you want to jump straight to the solution, here's the [github repository](https://github.com/NeoCoast/threejs-logo-blog))

Incase you’re working on this project from the beginning, you can start with a react and typescript vite app:
`npm create vite@latest neocoast-logo-3d-app -- --template react-ts`

We move into the directory:
`cd neocoast-logo-3d-app`

Then install threejs and react-three-fiber, a three.js renderer that makes it even simpler to work with (it even has [react native support](https://r3f.docs.pmnd.rs/getting-started/installation#react-native)!)
`npm install --save three @react-three/fiber`

to run the app, simply:
`npm run dev`

By now we just have the default vite ~ react page, but we can start playing around with three.js

## Actual Three.js

Lets replace the App function with the following:

```
import { Canvas } from '@react-three/fiber'

export default function App() {
  return (
    <Canvas>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </Canvas>
  )
}

```

This piece of code does nothing more than starting off with a white `Canvas` (rendered by react-three-fiber). We create a `mesh`, aka a scene object, which will “wrap” the pieces needed to draw a 3D shape. 

The `boxGeometry` indicates we’re going to be working with a Box-y shape, and the `meshStandardMaterial` will be in charge of the looks of that box

[image1]


Lets now add some color to the box, by adding the `color` property to the material element. But you’ll quickly notice this isn’t enough. As we’re working with 3d rendering, a blue box will look the same as any box would on a dark room, we must add some light sources (just below our mesh its fine):

```jsx

<Canvas>
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="blue"/>
  </mesh>

  <ambientLight intensity={0.1} />
  <directionalLight color="white" position={[0, 0, 5]} />
</Canvas>
```

Now we can actually “see something”

[image2]

Lets add some react to the mix. A simple light intensity controlled input:

```

  const [ambientLightIntensity, setAmbientLightIntensity] = useState(0.1);
  
  (...)

    <>
      <input
        onChange={(e) => {
          setAmbientLightIntensity(e.target.value);
        }}
        type="number"
        value={ambientLightIntensity}
      />
      <Canvas>
				(...)

        <ambientLight intensity={ambientLightIntensity} />
        <directionalLight color="white" position={[0, 0, 5]} />
      </Canvas>
    </>

```

Now we can control the intensity of one of the light sources.

Before moving on, lets tidy up just a little bit:
 

```
// App.jsx
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
```

And on the same directory:

```
// NeocoastLogo.jsx
import { useFrame } from "@react-three/fiber";

const NeocoastLogo = ({ ambientLightIntensity = 1 }) => {

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

```


## U(R)FO - Unidentified Rotating Flying Object

React Three Fiber brings some new hooks to the table. One of them is called `useFrame` , it has a similar behavior as `useEffect`, in the way it runs on “itself” when something updates. In this case `useFrame` runs on each frame update instead of reading from a dependency array.

Be mindful of the code that gets run inside a `useFrame` , its purpose is to do some minor calculations and update just stuff inside the `Canvas` . `useFrame` will crash the app if tried to be called in a component that isn’t inside a `Canvas` component, thats partly why we tidied up before.

To update solely whats inside a `Canvas`, we will work with a reference of the mesh have. Lets dig in!

```
// NeocoastLogo.jsx
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
```

// NeocoastLogo.jsx

By attaching the `meshRef` ref to the mesh, duh, and updating its rotation property on each axis on the useFrame, we get this fancy rotation of our cube:

[video1]


## SVG Loader

We’ve already played around a bit with the different simple options available on Three.js such as light, color, position and rotation, so lets dig into some custom shape.

We have our `neocoastLogo.svg` , and we want to render it, add some depth to it:

[image3]

To do this, we want to import the svg asset, bring in the hook `useLoader` from `react-three-fiber` and the `SVGLoader`  from Three.JS addons (these addons are built in, so no need to install them separately). `useLoader` is a hook that loads assets with a certain *loader*, it renders a fallback using React’s Suspense while its loading. These *loaders* are functions that are able to parse and transform complex assets into groups of simpler shapes, which can be then rendered as meshes. Some loaders are more recommended than others, for example `GLTFLoader`, `OBJLoader`, `TextureLoader`, `FontLoader`, etc, are better maintained than `SVGLoader` but you’d have to have your asset in these formats to use them, and each one of them has their own use case. 

```jsx
// NeocoastLogo.jsx
import { useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/Addons.js";

import neocoastLogo from "./assets/neocoastLogo.svg";

(...)

  const { paths } = useLoader(SVGLoader, neocoastLogo);
  
(...)

      <mesh ref={meshRef}>
        <group
          scale={[0.01, 0.01, 0.01]}
          rotation={[0, Math.PI, 0]}
          position={[2, -1, -1]}
        >
          {paths.map((path, i) =>
            path.toShapes(true).map((shape, j) => (
              <mesh key={`${i}-${j}`}>
                <extrudeGeometry args={[shape, { depth: 50 }]} />
                <meshStandardMaterial color={path.color || "blue"} />
              </mesh>
            ))
          )}
        </group>
      </mesh>
(...)
```

We use `useLoader` to load the logo svg with `SVGLoader`  and we obtain an array with the “paths” of the svg. We replace our box Geometry shape with a `group` , to make sure that every time we play around with the rotation, or any property, we will be applying the changes to the whole svg and not the individual paths. Within this group we can render a mesh for each shape inside each of the paths in the array, by using `toShape` to turn each path into an array of different shapes, and using `extrudeGeometry` to render this complex—but still simpler than the whole svg itself—shape.

As the whole svg is considered a plane image, each of their parts is too. Adding a depth, in this case 50, will render it as a 3D object on screen.

You’ll also notice there’s an initial rotation on the Y axes thats `Math.Pi`, this is because the svg is rendered flipped by default, and the rotation is measured in radians. As for the position, moving it to `[2,-1,-1]` made it look centered enough.

You can also update the code a bit on `App.jsx` to make everything look a bit larger

```jsx
// App.jsx
(...)
      <div style={{ height: "400px", width: "600px" }}>
        <Canvas>
          <NeocoastLogo ambientLightIntensity={ambientLightIntensity} />
        </Canvas>
      </div>
(...)
```

And the partial result is:

[video2]


## Rotation on demand

Still around for more? Great! Lets dig into the last part of this 101, controlling the 3D render. To do so we will be adding with Drei, which is a package that adds helpers and functional abstractions to what we already render with react-three-fiber.

To install, simply: `npm install @react-three/drei` 

Then, we will import `OrbitControls` from `"@react-three/drei"`, add it to our component, and you’ll quickly see you’re able to move the 3d render around. Keep in mind this movement is from the camera and not from the item rendered itself, so it will continue rotating on its own as well.

Now, to tidy things up, and also wrap up, we will update some of the code, removing the “automatic” rotation we have for the render via `useFrame`, which will be replaced with the `autoRotate` property on `OrbitControls` , along with `autoRotateSpeed` to set up the speed to with it rotates automatically of course.

```jsx
// NeocoastLogo.jsx
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
```

You’ll notice the position and rotation of the group was moved again, and that the orbit has its own target property with some numbers. This was updated to have the group in the center, and the make sure the camera turns around the center of the group and not according to other point in the 3D space.

There’s also another `directionalLight`  to have another light source illuminating our space.

With this, you should be able to see our beautiful creation, and move the camera around it freely!

[video3]

Here's the [link to the github repository](https://github.com/NeoCoast/threejs-logo-blog) to check the solution out!

ThreeJS is a powerful tool, and `react-three-fiber` and `drei` simplify a lot of the complexity that comes with rendering 3D world on the web.


### Disclaimers
We might stumble into some warnings/errors from eslint that show unknown properties on the tags that are not that HTML friendly

[image4]

This error is triggered by using a non HTML based property, like “intensity”. Feel free to read [this github issue conversation](https://github.com/jsx-eslint/eslint-plugin-react/issues/3423) that didn’t get anywhere sadly, and also use `react-eslint-plugin`’s [recomendation on these cases](https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/no-unknown-property.md#rule-options)

Source:

https://threejs.org/docs/index.html#manual/en/introduction/Installation

https://r3f.docs.pmnd.rs/getting-started/your-first-scene

https://drei.docs.pmnd.rs/getting-started/introduction

https://github.com/NeoCoast/threejs-logo-blog