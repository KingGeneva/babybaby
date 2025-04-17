
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Nous définissons isMobile par défaut en se basant sur la taille de la fenêtre
  // plutôt que d'attendre l'effet pour éviter les changements d'affichage
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT : false
  )

  React.useEffect(() => {
    // Définit un délai pour le redimensionnement pour éviter trop d'appels
    let resizeTimer: ReturnType<typeof setTimeout>
    
    const handleResize = () => {
      // Utilise un throttling pour limiter le nombre de mises à jour
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }, 100)
    }
    
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return isMobile
}
