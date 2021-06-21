import { useCallback, useEffect, useState } from "react"
import "./App.css"
import ServiceStations from "./ServiceStations"
import { ServiceStation } from "./types"
import { services, ServiceName } from "./services"

function App() {
  const [filtersState, setFiltersState] = useState(
    Object.fromEntries(services.map((filter) => [filter.name, false]))
  )
  const [coords, setCoords] =
    useState<{ latitude: number; longitude: number }>()
  const [serviceStations, setServiceStations] = useState<ServiceStation[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState("")

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

  useEffect(() => {
    if (coords) search()
  }, [coords, search])

  return (
    <div className="App">
      <h1>עמדות שירות</h1>
      <main>
        <aside className="filters">
          <ul>
            {services.map((filter) => (
              <li key={`item_${filter.name}`}>
                <input
                  type="checkbox"
                  id={filter.name}
                  checked={filtersState[filter.name]}
                  onChange={() => toggleFilter(filter.name)}
                />
                <label htmlFor={filter.name}>{filter.label}</label>
              </li>
            ))}
          </ul>
        </aside>

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
