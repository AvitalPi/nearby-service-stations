import { useEffect, useState } from "react"

export default function useCoords() {
  const [coords, setCoords] =
    useState<{ latitude: number; longitude: number }>()

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
