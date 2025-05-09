
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Initialize the value when the component mounts (client-side only)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Throttled resize handler
    let resizeTimer: ReturnType<typeof setTimeout>
    
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      }, 100)
    }
    
    window.addEventListener("resize", handleResize)
    
    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(resizeTimer)
    }
  }, [])

  return isMobile
}
