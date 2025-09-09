"use client";
import RippleHero from "@/components/RippleHero";
import Desaparecidos from "@/components/Desaparecidos";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";
import { Suspense, useState } from "react";
import { FloatingActions } from "@/components/ui/FloatingActions";
import ModalMapaCasos from "@/components/ui/ModalMapaCasos";
import ModalEstatisticasAvancadas from "@/components/ui/ModalEstatisticasAvancadas";
import ModalComoAjudar from "@/components/ui/ModalComoAjudar";

export default function Home() {
  const [openMapa, setOpenMapa] = useState(false);
  const [openEstatisticas, setOpenEstatisticas] = useState(false);
  const [openComoAjudar, setOpenComoAjudar] = useState(false);
  return (
    <main
      className="min-h-screen bg-white  transition-colors"
      suppressHydrationWarning
    >
      <Nav />
      <RippleHero />
      <section className="relative bg-white">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin w-12 h-12 text-blue-500 mx-auto mb-4">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <p className="text-slate-600 text-center">Carregando...</p>
              </div>
            </div>
          }
        >
          <Desaparecidos />
        </Suspense>
      </section>
      <Footer />
      <ModalMapaCasos isOpen={openMapa} onClose={() => setOpenMapa(false)} />
      <ModalEstatisticasAvancadas
        isOpen={openEstatisticas}
        onClose={() => setOpenEstatisticas(false)}
      />
      <ModalComoAjudar
        isOpen={openComoAjudar}
        onClose={() => setOpenComoAjudar(false)}
      />
      <FloatingActions
        onOpenMapa={() => setOpenMapa(true)}
        onOpenEstatisticas={() => setOpenEstatisticas(true)}
        onOpenComoAjudar={() => setOpenComoAjudar(true)}
      />
    </main>
  );
}
