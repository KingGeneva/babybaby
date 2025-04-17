
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false) // Défaut à false pour éviter de l'hydratation

  React.useEffect(() => {
    // Vérifier immédiatement la taille de l'écran
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Configuration de l'écouteur d'événement
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
