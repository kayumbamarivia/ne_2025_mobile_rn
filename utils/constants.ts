export const EXPENSE_CATEGORIES = [
  { id: 'dining', label: 'Dining & Takeout', icon: 'utensils' },
  { id: 'mobility', label: 'Mobility & Fuel', icon: 'taxi' },
  { id: 'shelter', label: 'Shelter & Rent', icon: 'building' },
  { id: 'services', label: 'Services & Subscriptions', icon: 'wifi' },
  { id: 'recreation', label: 'Recreation & Hobbies', icon: 'gamepad' },
  { id: 'purchases', label: 'Purchases & Apparel', icon: 'cart-shopping' },
  { id: 'care', label: 'Care & Fitness', icon: 'stethoscope' },
  { id: 'studies', label: 'Studies & Courses', icon: 'book-open' },
  { id: 'trips', label: 'Trips & Vacations', icon: 'luggage' },
  { id: 'grooming', label: 'Grooming & Beauty', icon: 'scissors' },
  { id: 'giving', label: 'Giving & Support', icon: 'hands-helping' },
  { id: 'miscellaneous', label: 'Miscellaneous', icon: 'circle-question' },
] as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['id'];