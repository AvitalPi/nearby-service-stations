import { useState } from "react"
import "./App.css"
import { Filters } from "./Filters"
import { ServiceName, services } from "./services"
import ServiceStations from "./ServiceStations"
import useCoords from "./useCoords"
import useServiceStations from "./useServiceStations"

function App() {
  const [filters, setFilters] = useState(
    Object.fromEntries(services.map((filter) => [filter.name, false]))
  )

  const coords = useCoords()

  const { loading, serviceStations, error } = useServiceStations(
    filters,
    coords
  )

  const toggleFilter = (filterName: ServiceName) =>
    setFilters({
      ...filters,
      [filterName]: !filters[filterName],
    })

  return (
    <div className="App">
      <h1>עמדות שירות</h1>
      <main>
        <Filters filters={filters} onToggleFilter={toggleFilter} />

        <div className="stations">
          {loading ? (
            <div>טוען...</div>
          ) : error ? (
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
