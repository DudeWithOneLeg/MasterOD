import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import Model from "./Blackhole";
import { isMobile } from "react-device-detect";

// A component to apply rotation using useFrame
function RotatingModel(props) {
    // Rendering your model with ref for rotation
    return (
        <group rotation={[0, 0, -0.2604]}>
            <Model {...props} />
        </group>
    );
}

export default function ThreeDScene() {
    const containerRef = useRef(null);
    const [scale, setScale] = useState(1);
    const maxWidthpxDesk = 1078;
    const maxWidthpxMob = 575;
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        if (containerRef.current) {
            const containerWidth = containerRef.current.offsetWidth;
            let newScale = 0;
            if (isMobile) {
                if (containerWidth >= maxWidthpxMob) {
                    if (containerWidth > 700) {
                        if (containerWidth > 800) {
                            newScale =
                                (containerWidth / maxWidthpxMob) * 1 - 0.5;
                        } else {
                            newScale =
                                (containerWidth / maxWidthpxMob) * 1 - 0.3;
                        }
                    } else {
                        newScale = (containerWidth / maxWidthpxMob) * 1 - 0.2;
                    }
                } else {
                    newScale = (containerWidth / maxWidthpxMob) * 1 - 0.03;
                }
            } else {
                newScale =
                    containerWidth >= maxWidthpxDesk
                        ? 1
                        : (containerWidth / maxWidthpxDesk) * 1 + 0.1;
            }
            setScale(newScale);
        }
    }, [containerRef.current]);

    return (
        <div
            className={`h-full w-full flex flex-${
                isMobile ? "col" : "row"
            } text-white relative`}
        >
            <div
                className={`w-${isMobile ? "full" : "1/2"} h-${
                    isMobile ? "1/3" : "full"
                } flex items-center justify-center ${isMobile ? "p-5" : ""}`}
            >
                <div className={`flex flex-col p-5 rounded-xl shadow-lg shadow-zinc-700 w-${isMobile ? "2/3" : "1/2"}`}>
                    <h1
                        className={`poppins-regular-italic ${
                            width < 640
                                ? "text-3xl"
                                : "sm:text-3xl md:text-3xl lg:text-3xl xl:text-6xl"
                        } pb-4`}
                    >
                        {" "}
                        Research Evolved
                    </h1>
                    <p
                        className={`text-wrap poppins-regular ${
                            width < 640
                                ? "text-xl"
                                : "sm:text-xl md:text-xl lg:text-xl xl:text-3xl"
                        } text-zinc-350`}
                    >
                        Explore beyond the surface with powerful search tools
                        and a platform built for deeper discoveries.
                    </p>
                </div>
            </div>
            <div
                ref={containerRef}
                className={`w-${isMobile ? "full" : "1/2"} h-${
                    isMobile ? "full" : "full"
                } relative`}
            >
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

                            {/* <OrbitControls /> */}
                            <RotatingModel scale={scale} />
                        </PerspectiveCamera>
                    </Suspense>
                </Canvas>
                <div
                    className="p-4 text-zinc-500"
                    style={{
                        position: "absolute",
                        bottom: "0%",
                        right: "0%",
                    }}
                >
                    <p>
                        Model Credit:{" "}
                        <a
                            target="_blank"
                            href="https://sketchfab.com/3d-models/earth-63d902b12fd14868b4dc2f19dc21d7c2"
                        >
                            Kongle
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
