import { useEffect, useState } from "react"
import { Coords } from "./types"

export default function useCoords() {
  const [coords, setCoords] = useState<Coords>()

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ latitude, longitude })
      },
      (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`)
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 10000,
      }
    )
  }, [])

  return coords
}
