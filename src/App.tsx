import { useCallback, useEffect, useState } from "react"
import "./App.css"
import ServiceStation from "./ServiceStation"
import { ServiceStation as ServiceStationType } from "./types"
import { services } from "./services"

function App() {
  const [filtersState, setFiltersState] = useState(
    Object.fromEntries(services.map((filter) => [filter.name, false]))
  )
  const [coords, setCoords] =
    useState<{ latitude: number; longitude: number }>()
  const [serviceStationList, setServiceStationList] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleFilter = (filterName: keyof typeof filtersState) =>
    setFiltersState({
      ...filtersState,
      [filterName]: !filtersState[filterName],
    })

  const search = useCallback(() => {
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

    fetch(
      `https://ravkavonline.co.il/api/pos/service-station/search/?${searchParams}`,
      {
        headers: {
          "Accept-Language": "he",
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setServiceStationList(
          data.data.results.map(
            (result: { service_station: ServiceStationType }) =>
              result.service_station
          )
        )
        setLoading(false)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [coords, filtersState])

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords
        setCoords({ latitude, longitude })
        console.log(pos.coords)
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
            <div>Loading...</div>
          ) : (
            <ul>
              {serviceStationList.map((station: ServiceStationType) => (
                <ServiceStation key={station.id} serviceStation={station} />
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
