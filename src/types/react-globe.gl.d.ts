declare module 'react-globe.gl' {
  import { ComponentType } from 'react'
  
  interface GlobeProps {
    globeImageUrl?: string
    backgroundImageUrl?: string
    pointsData?: object[]
    pointLat?: string | ((d: object) => number)
    pointLng?: string | ((d: object) => number)
    pointColor?: string | ((d: object) => string)
    pointAltitude?: number
    pointRadius?: number
    onPointClick?: (point: object) => void
    width?: number
    height?: number
    backgroundColor?: string
  }

  const Globe: ComponentType<GlobeProps>
  export default Globe
}