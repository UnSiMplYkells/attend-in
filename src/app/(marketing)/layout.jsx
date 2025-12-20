"use client"
import ThemeToggle from '../components/ThemeToggle';
import Beams from '../components/ui/Beams';
import Footer from './components/Footer'
import Navigation from './components/Navigation'
import { usePathname } from "next/navigation";

export default function layout({children}) {
  const pathname = usePathname();

  return (
    <div className="relative flex flex-col max-w-[1320px] m-auto">
      <div className="absolute inset-0 z-0 overflow-hidden">
        {pathname === "/" && 
          <Beams
            beamWidth={2.4}
            beamHeight={25}
            beamNumber={30}
            lightColor="#dcbcbc"
            speed={3.2}
            noiseIntensity={1.8}
            scale={0.15}
            rotation={40}
          />
        }
        <Beams
          beamWidth={1}
          beamHeight={25}
          beamNumber={25}
          lightColor="#dcbcbc"
          speed={3}
          noiseIntensity={2}
          scale={0.2}
          rotation={40}
        />
      </div>
      {pathname !== "/" && <Navigation />}
      <div className="flex-1">{children}</div>
      {pathname !== "/" && <Footer />}
    </div>
  );
}