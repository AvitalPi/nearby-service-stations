export const services = [
  { name: "accepts_credit_card", label: "תשלום באשראי" },
  { name: "accepts_cash", label: "תשלום במזומן" },
  { name: "ravkav_services", label: "שירותי רב-קו" },
  { name: "sells_ravkav_reader", label: "מוכר קורא כרטיסי רב-קו" },
  { name: "manned", label: "מאויש" },
  { name: "reload_reservation", label: "מימוש טעינה מוזמנת" },
] as const

export type ServiceName = typeof services[number]["name"]
