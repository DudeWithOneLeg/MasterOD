import { useRef, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { isMobile } from "react-device-detect";
import MobileThreeDScene from "./Mobile3Dscene";
import Planets from "./Planets";


export default function ThreeDScene() {
    const containerRef = useRef(null);
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

    // useEffect(() => {
    //     if (containerRef.current) {
    //         const containerWidth = containerRef.current.offsetWidth;
    //         let newScale = 0;
    //         if (isMobile) {
    //             if (containerWidth >= maxWidthpxMob) {
    //                 if (containerWidth > 700) {
    //                     if (containerWidth > 800) {
    //                         newScale =
    //                             (containerWidth / maxWidthpxMob) * 1 - 0.5;
    //                     } else {
    //                         newScale =
    //                             (containerWidth / maxWidthpxMob) * 1 - 0.3;
    //                     }
    //                 } else {
    //                     newScale = (containerWidth / maxWidthpxMob) * 1 - 0.2;
    //                 }
    //             } else {
    //                 newScale = (containerWidth / maxWidthpxMob) * 1 - 0.03;
    //             }
    //         } else {
    //             newScale =
    //                 containerWidth >= maxWidthpxDesk
    //                     ? 1
    //                     : (containerWidth / maxWidthpxDesk) * 1 + 0.1;
    //         }
    //         setScale([newScale, newScale, newScale]);
    //     }
    // }, [containerRef.current]);


    // if (isMobile) {
    //     return <MobileThreeDScene />;
    // } else
        return (
            <div className={`h-full w-full flex flex-row text-white relative`}>
                <div ref={containerRef} className={`w-full h-full relative`}>
                    <Canvas style={{ width: "100%", height: "100%" }}>
                        <Planets />
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
