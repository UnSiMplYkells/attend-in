"use client"
import ThemeToggle from '../components/ThemeToggle'
import Footer from './components/Footer'
import Navigation from './components/Navigation'
import { usePathname } from "next/navigation"
import dynamic from "next/dynamic"

const Beams = dynamic(() => import("../components/ui/Beams"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black" />,
})

export default function Layout({ children }) {
  const pathname = usePathname()

  return (
    <div className="relative min-h-screen">

      <div className="fixed inset-0 z-0 overflow-hidden">
        {pathname === "/" && (
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
        )}
        <Beams
          beamWidth={1.8}
          beamHeight={25}
          beamNumber={25}
          lightColor="#dcbcbc"
          speed={3}
          noiseIntensity={2}
          scale={0.2}
          rotation={40}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">

        {pathname !== "/" && (
          <header className="w-full">
            <div className="mx-auto max-w-[1440px] px-4">
              <Navigation />
            </div>
          </header>
        )}

        <main className="flex-1 w-full">
          <div className="mx-auto max-w-[1440px] px-4">
            {children}
          </div>
        </main>

        {pathname !== "/" && (
          <footer className="w-full">
            <div className="mx-auto max-w-[1440px] px-4">
              <Footer />
            </div>
          </footer>
        )}

      </div>
    </div>
  )
}
