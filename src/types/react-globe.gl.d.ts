declare module 'react-globe.gl' {
  import { ComponentType, Ref } from 'react'

  export interface GlobeControls {
  autoRotate: boolean
  autoRotateSpeed: number
  enableZoom: boolean
  addEventListener: (event: string, callback: () => void) => void
  removeEventListener: (event: string, callback: () => void) => void
}

  export interface GlobeInstance {
  controls: () => GlobeControls
  pointOfView: (pov: { altitude?: number; lat?: number; lng?: number }) => void
}

  export interface GlobeProps {
    ref?: Ref<GlobeInstance>
    globeImageUrl?: string
    backgroundImageUrl?: string
    backgroundColor?: string
    width?: number
    height?: number
    // Points
    pointsData?: object[]
    pointLat?: string | ((d: object) => number)
    pointLng?: string | ((d: object) => number)
    pointColor?: string | ((d: object) => string)
    pointAltitude?: number
    pointRadius?: number
    onPointClick?: (point: object) => void
    // HTML markers
    htmlElementsData?: object[]
    htmlLat?: string | ((d: object) => number)
    htmlLng?: string | ((d: object) => number)
    htmlElement?: (d: object) => HTMLElement
  }

  const Globe: ComponentType<GlobeProps>
  export default Globe
}