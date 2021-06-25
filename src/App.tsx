import { useCallback, useEffect, useState } from "react"
import "./App.css"
import ServiceStations from "./ServiceStations"
import { ServiceStation } from "./types"
import { services, ServiceName } from "./services"
import { Filters } from "./Filters"
import useCoords from "./useCoords"

function App() {
  const [filtersState, setFiltersState] = useState(
    Object.fromEntries(services.map((filter) => [filter.name, false]))
  )
  const [serviceStations, setServiceStations] = useState<ServiceStation[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

  const coords = useCoords()

  const toggleFilter = (filterName: ServiceName) =>
    setFiltersState({
      ...filtersState,
      [filterName]: !filtersState[filterName],
    })

  const search = useCallback(async () => {
    if (!coords) return

    setLoading(true)

    const searchParams = new URLSearchParams({
      lat: coords.latitude.toString(),
      lon: coords.longitude.toString(),
    })

    const attributes = Object.entries(filtersState)
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
      setErrorMessage(error)
    } finally {
      setLoading(false)
    }
  }, [coords, filtersState])

  useEffect(() => {
    if (coords) search()
  }, [coords, search])

  return (
    <div className="App">
      <h1>עמדות שירות</h1>
      <main>
        <Filters filtersState={filtersState} onToggleFilter={toggleFilter} />

        <div className="stations">
          {loading ? (
            <div>טוען...</div>
          ) : errorMessage ? (
            <div>שגיאה בקבלת נתונים</div>
          ) : (
            <ServiceStations serviceStations={serviceStations} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
