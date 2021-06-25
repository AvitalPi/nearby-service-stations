import { useCallback, useEffect, useState } from "react"
import { Coords, Filters, ServiceStation } from "./types"

export default function useServiceStations(filters: Filters, coords?: Coords) {
  const [serviceStations, setServiceStations] = useState<ServiceStation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const search = useCallback(async () => {
    if (!coords) return

    setLoading(true)

    const searchParams = new URLSearchParams({
      lat: coords.latitude.toString(),
      lon: coords.longitude.toString(),
    })

    const attributes = Object.entries(filters)
      .filter((filter) => filter[1])
      .map((filter) => filter[0])

    if (attributes.length > 0) {
      searchParams.append("attributes", attributes.join(","))
    }

    try {
      const response = await fetch(
        `https://ravkavonline.co.il/api/pos/service-station/search/?${searchParams}`,
        {
          headers: {
            "Accept-Language": "he",
          },
        }
      )

      if (!response.ok) throw new Error(response.statusText)

      const data = await response.json()

      if (data.error) throw new Error(data.error)

      setServiceStations(
        data.data.results.map(
          (result: { service_station: ServiceStation }) =>
            result.service_station
        )
      )
    } catch (error) {
      setError(error)
    } finally {
      setLoading(false)
    }
  }, [coords, filters])

  useEffect(() => {
    if (coords) search()
  }, [coords, search])

  return { loading, serviceStations, error }
}
