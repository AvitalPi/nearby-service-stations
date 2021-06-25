import { ServiceStation } from "./types"
import styles from "./ServiceStation.module.css"
import { services } from "./services"

type ServiceStationProps = {
  serviceStations: ServiceStation[]
}

const ServiceStations = ({ serviceStations }: ServiceStationProps) => (
  <ul>
    {serviceStations.map(
      ({
        id,
        address,
        city,
        comments,
        operating_company,
        activity_hours,
        attributes,
      }) => (
        <li key={id} className={styles.station}>
          <div>
            <strong>כתובת</strong>
            {address}, {city}
          </div>

          {comments && (
            <div>
              <strong>הערות</strong>
              {comments}
            </div>
          )}

          {operating_company && (
            <div>
              <strong>מפעיל</strong>
              {operating_company}
            </div>
          )}

          {activity_hours && (
            <div>
              <strong>שעות פעילות</strong>
              {activity_hours}
            </div>
          )}

          <div>
            <strong>שירותים</strong>
            {attributes
              .map(
                (attribute) =>
                  services.find((filter) => filter.name === attribute)?.label
              )
              .join(", ")}
          </div>
        </li>
      )
    )}
  </ul>
)

export default ServiceStations
