declare module 'react-globe.gl' {
  import { ComponentType, Ref } from 'react'
  
  interface GlobeInstance {
    controls: () => {
      autoRotate: boolean
      autoRotateSpeed: number
    }
  }

  interface GlobeProps {
    ref?: Ref<GlobeInstance>
    globeImageUrl?: string
    backgroundImageUrl?: string
    backgroundColor?: string
    pointsData?: object[]
    pointLat?: string | ((d: object) => number)
    pointLng?: string | ((d: object) => number)
    pointColor?: string | ((d: object) => string)
    pointAltitude?: number
    pointRadius?: number
    onPointClick?: (point: object) => void
    width?: number
    height?: number
  }

  const Globe: ComponentType<GlobeProps>
  export default Globe
}