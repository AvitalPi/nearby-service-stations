import { services, ServiceName } from "./services"

type FiltersProps = {
  filtersState: { [k: string]: boolean }
  onToggleFilter: (filterName: ServiceName) => void
}

export const Filters = ({ filtersState, onToggleFilter }: FiltersProps) => (
  <aside className="filters">
    <ul>
      {services.map((service) => (
        <li key={service.name}>
          <input
            type="checkbox"
            id={service.name}
            checked={filtersState[service.name]}
            onChange={() => onToggleFilter(service.name)}
          />
          <label htmlFor={service.name}>{service.label}</label>
        </li>
      ))}
    </ul>
  </aside>
)
