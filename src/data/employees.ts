export interface Employee {
  id: number
  name: string
  role: string
  attraction: string
}

export const employees: Employee[] = [
  { id: 1, name: 'Alex Johnson', role: 'Ride Operator', attraction: 'Roller Coaster' },
  { id: 2, name: 'Maria Garcia', role: 'Ticket Agent', attraction: 'Main Gate' },
  { id: 3, name: 'Sam Lee', role: 'Food & Beverage', attraction: 'Food Court' },
  { id: 4, name: 'Jordan Smith', role: 'Security', attraction: 'Park Entrance' },
  { id: 5, name: 'Taylor Brown', role: 'Ride Operator', attraction: 'Ferris Wheel' },
]
