import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, Html } from "@react-three/drei";
import Model from "./Blackhole"; // Assuming this is your imported model

// A component to apply rotation using useFrame
function RotatingModel(props) {
    // Rendering your model with ref for rotation
    return (
        <group {...props} rotation={[0, 0, -0.2604]}>
            <Model />
        </group>
    );
}

export default function ThreeDScene() {
    const htmlRef = useRef(null);
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerSize({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight,
                });
            }
        };

        window.addEventListener("resize", updateSize);
        updateSize();

        return () => window.removeEventListener("resize", updateSize);
    }, []);
    return (
        <div className="h-full w-full flex flex-row text-white relative">
            <div className="w-1/2 h-full flex items-center justify-center">
                <div className="flex flex-col w-1/2">
                    <h1 className="poppins-regular-italic text-6xl pb-4">
                        {" "}
                        Research Evolved
                    </h1>
                    <p className="text-wrap poppins-regular text-3xl text-zinc-350">
                        Explore beyond the surface with powerful search tools
                        and a platform built for deeper discoveries.
                    </p>
                </div>
            </div>
            <div ref={containerRef} className="w-1/2 h-full relative">
                <Canvas style={{ width: "100%", height: "100%" }}>
                    <Suspense>
                        <PerspectiveCamera
                            position={[0, 0, 4.5]}
                            fov={90}
                            near={0.1}
                            far={1000}
                        >
                            <directionalLight
                                position={[-9, 0, -1]}
                                intensity={6}
                                shadow
                            />
                            {/* <axesHelper /> */}
                            {/* {directionalLightRef.current && <directionalLightHelper
                                light={directionalLightRef}
                                />} */}

                            {/* Use the RotatingModel component inside the Canvas */}
                            {/* <OrbitControls /> */}
                            <RotatingModel />
                        </PerspectiveCamera>
                    </Suspense>
                </Canvas>
                <div
                        className="p-4 text-zinc-500"
                    style={{
                        position: "absolute",
                        bottom: "0%",
                        right: "0%"
                    }}
                >
                    <p>Model Credit: <a target='_blank'href='https://sketchfab.com/3d-models/earth-63d902b12fd14868b4dc2f19dc21d7c2'>Kongle</a></p>
                </div>
            </div>
        </div>
    );
}
