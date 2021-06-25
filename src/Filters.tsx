import { services, ServiceName } from "./services"
import { Filters as FiltersType } from "./types"

type FiltersProps = {
  filters: FiltersType
  onToggleFilter: (filterName: ServiceName) => void
}

export const Filters = ({ filters, onToggleFilter }: FiltersProps) => (
  <aside className="filters">
    <ul>
      {services.map((service) => (
        <li key={service.name}>
          <input
            type="checkbox"
            id={service.name}
            checked={filters[service.name]}
            onChange={() => onToggleFilter(service.name)}
          />
          <label htmlFor={service.name}>{service.label}</label>
        </li>
      ))}
    </ul>
  </aside>
)
