import Earth from "./Earth";
import Mars from "./Mars";
import { DirectionalLightHelper } from "three";
import { Suspense, useRef, useState, useEffect } from "react";
import {
    PerspectiveCamera,
    OrbitControls,
    ScrollControls,
    Scroll,
    OrthographicCamera,
    useScroll,
    useHelper
} from "@react-three/drei";
import stars from '../../assets/images/stars.jpg'

export default function Planets() {
    const lightRef = useRef();
    const [width, setWidth] = useState(window.innerWidth);

    // Attach DirectionalLightHelper to visualize the axes of the light
    useHelper(lightRef, DirectionalLightHelper, 1, "red");
    // Rendering your model with ref for rotation
    return (
        <Suspense>
            <OrthographicCamera makeDefault position={[0, 0, 0]} zoom={1500}>
                <spotLight
                    position={[1, -1, 0]}
                    intensity={9}
                    shadow
                    ref={lightRef}
                />

                {/* <OrbitControls /> */}
                <ScrollControls pages={3} damping={0.25} controls={null}>
                    <Scroll
                        html
                        className={`w-full h-[300%] flex flex-col items-start justify-start fixed r-0 l-0`}
                    >
                        <section
                            className={`flex flex-col p-5 justify-center rounded-xl w-1/2 h-1/3`}
                        >
                            <h1
                                className={`poppins-regular-italic ${
                                    width < 640
                                        ? "text-3xl"
                                        : "sm:text-3xl md:text-3xl lg:text-3xl xl:text-6xl"
                                } pb-2`}
                            >
                                {" "}
                                Research Evolved
                            </h1>
                            <p
                                className={`text-wrap poppins-regular ${
                                    width < 640
                                        ? "text-xl"
                                        : "sm:text-xl md:text-xl lg:text-xl xl:text-3xl"
                                } text-zinc-400`}
                            >
                                Explore beyond the surface with powerful search
                                tools and a platform built for deeper
                                discoveries.
                            </p>
                        </section>
                        <section className="w-full h-1/3 flex justify-end items-center border">

                            <section
                                className={`flex flex-col p-5 justify-center rounded-xl w-1/2 h-full`}
                            >
                                <h1
                                    className={`poppins-regular-italic ${
                                        width < 640
                                            ? "text-3xl"
                                            : "sm:text-3xl md:text-3xl lg:text-3xl xl:text-6xl"
                                    } pb-2`}
                                >
                                    {" "}
                                    Research Evolved
                                </h1>
                                <p
                                    className={`text-wrap poppins-regular ${
                                        width < 640
                                            ? "text-xl"
                                            : "sm:text-xl md:text-xl lg:text-xl xl:text-3xl"
                                    } text-zinc-400`}
                                >
                                    Explore beyond the surface with powerful
                                    search tools and a platform built for deeper
                                    discoveries.
                                </p>
                            </section>
                        </section>
                        <section className="w-full h-1/3 flex justify-end itms-center">
                            <section
                                className={`flex flex-col p-5 justify-center rounded-xl w-1/2 h-full`}
                            >
                                <h1
                                    className={`poppins-regular-italic ${
                                        width < 640
                                            ? "text-3xl"
                                            : "sm:text-3xl md:text-3xl lg:text-3xl xl:text-6xl"
                                    } pb-2`}
                                >
                                    {" "}
                                    Research Evolved
                                </h1>
                                <p
                                    className={`text-wrap poppins-regular ${
                                        width < 640
                                            ? "text-xl"
                                            : "sm:text-xl md:text-xl lg:text-xl xl:text-3xl"
                                    } text-zinc-400`}
                                >
                                    Explore beyond the surface with powerful
                                    search tools and a platform built for deeper
                                    discoveries.
                                </p>
                            </section>
                        </section>
                    </Scroll>
                    <group>
                        <Earth />
                        <Mars />
                    </group>
                </ScrollControls>
            </OrthographicCamera>
        </Suspense>
    );
}
