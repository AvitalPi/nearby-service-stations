export type ServiceStation = {
  id: number
  attributes: string[]
  city: string
  address: string
  activity_hours: string
  comments: string
  operating_company: string
}

export type Filters = { [k: string]: boolean }

export type Coords = { latitude: number; longitude: number }
