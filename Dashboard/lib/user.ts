export const user = {
  name: "Mateo Myers",
  email: "mateo.myers@apexmetrics.com",
  role: "Admin",
  company: "Apex Metrics LLC",
}

export function generateGradient(name: string) {
  const hue = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
  return `linear-gradient(135deg, hsl(${hue}, 70%, 35%) 0%, hsl(${(hue + 60) % 360}, 70%, 45%) 100%)`
}

export function generateLessSaturatedGradient(name: string) {
  const hue = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
  return `linear-gradient(135deg, hsl(${hue}, 40%, 50%) 0%, hsl(${(hue + 60) % 360}, 40%, 60%) 100%)`
}

