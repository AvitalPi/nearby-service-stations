import { ServiceStation as ServiceStationType } from "./types"
import styles from "./ServiceStation.module.css"
import { services } from "./services"

type ServiceStationProps = {
  serviceStation: ServiceStationType
}

const ServiceStation = ({
  serviceStation: {
    address,
    city,
    comments,
    activity_hours,
    attributes,
    operating_company,
  },
}: ServiceStationProps) => {
  return (
    <li className={styles.station}>
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
}

export default ServiceStation
