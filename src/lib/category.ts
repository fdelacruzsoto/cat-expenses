export function getCategoryColor(category: string): string {
  switch (category) {
    case "Food":
      return "bg-green-100 text-green-800"
    case "Furniture":
      return "bg-amber-100 text-amber-800"
    case "Accessory":
      return "bg-purple-100 text-purple-800"
    case "Toy":
      return "bg-blue-100 text-blue-800"
    case "Healthcare":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}