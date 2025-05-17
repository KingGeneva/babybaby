
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    // Function to check if the device is mobile based on window width
    const checkIfMobile = () => {
      return window.innerWidth < MOBILE_BREAKPOINT
    }
    
    // Set the initial value only in browser environment
    if (typeof window !== 'undefined') {
      setIsMobile(checkIfMobile())
    }
    
    // Throttled resize handler
    let resizeTimer: ReturnType<typeof setTimeout>
    
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        setIsMobile(checkIfMobile())
      }, 100)
    }
    
    // Only add event listener in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener("resize", handleResize)
    }
    
    // Cleanup
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("resize", handleResize)
        clearTimeout(resizeTimer)
      }
    }
  }, [])

  return isMobile
}
