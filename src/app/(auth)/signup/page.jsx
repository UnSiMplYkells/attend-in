"use client"
import dynamic from "next/dynamic";
import ThemeToggle from "@/app/components/ThemeToggle";
import AuthForm from "../components/AuthForm";
import { usePathname } from "next/navigation";

const PixelBlast = dynamic(() => import("@/app/components/ui/PixelBlast"), {
  ssr: false,
  loading: () => <div className="bg-black w-full h-full" />,
});

export default function Authenticate() {
  const pathname = usePathname();

  return (
    <div className="relative w-full h-screen flex items-center justify-center ">
      <AuthForm pathname={pathname} />
      <PixelBlast
        className="absolute inset-0 z-0 hidden md:block"
        variant="square"
        pixelSize={6}
        color="#e6b469"
        patternScale={4}
        patternDensity={1.3}
        pixelSizeJitter={0.3}
        enableRipples
        rippleSpeed={0.5}
        rippleThickness={0.2}
        rippleIntensityScale={1.6}
        liquid
        liquidStrength={0.2}
        liquidRadius={0.3}
        liquidWobbleSpeed={1.5}
        speed={0.6}
        edgeFade={0}
        transparent
      />
    </div>
  );
}
