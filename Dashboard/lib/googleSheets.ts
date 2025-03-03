export async function fetchSheetNames(isMetricsSheet = false): Promise<string[]> {
  // Return static list of weeks instead of fetching
  return ["Current Week", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"]
}

export async function fetchUniqueOffices(useMetricsSheet = false): Promise<string[]> {
  try {
    const sheetId = useMetricsSheet
      ? process.env.NEXT_PUBLIC_METRICS_SHEETS_ID
      : process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
    const apiKey = useMetricsSheet
      ? process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY
      : process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY

    // Validate environment variables
    if (!sheetId || !apiKey) {
      console.error("Missing required environment variables for fetchUniqueOffices")
      return []
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Current Week!A:A?key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.values || data.values.length <= 1) {
      return []
    }

    const uniqueOffices = [
      ...new Set(
        data.values
          .slice(1)
          .map((row) => row[0])
          .filter((office) => office && office.trim() !== ""),
      ),
    ].sort()

    return uniqueOffices
  } catch (error) {
    console.error("Error fetching unique offices:", error)
    return []
  }
}

// Cache for office names
let cachedOffices: string[] | null = null
let lastFetchTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getOffices(): Promise<string[]> {
  try {
    const now = Date.now()

    // Return cached offices if they exist and cache hasn't expired
    if (cachedOffices && now - lastFetchTime < CACHE_DURATION) {
      return cachedOffices
    }

    // Fetch new offices
    const offices = await fetchUniqueOffices(true)
    cachedOffices = offices
    lastFetchTime = now

    return offices
  } catch (error) {
    console.error("Error in getOffices:", error)
    return [] // Return empty array as fallback
  }
}

// Add a function to validate environment variables
export function validateGoogleSheetsConfig(): boolean {
  const metricsSheetId = process.env.NEXT_PUBLIC_METRICS_SHEETS_ID
  const metricsApiKey = process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY

  if (!metricsSheetId || !metricsApiKey || !sheetId || !apiKey) {
    console.error("Missing required Google Sheets environment variables:", {
      metricsSheetIdSet: !!metricsSheetId,
      metricsApiKeySet: !!metricsApiKey,
      sheetIdSet: !!sheetId,
      apiKeySet: !!apiKey,
    })
    return false
  }

  return true
}

// Add a direct function to fetch sheet data
export async function fetchSheetData(sheetName: string, isMetricsSheet = false): Promise<any> {
  try {
    const sheetId = isMetricsSheet
      ? process.env.NEXT_PUBLIC_METRICS_SHEETS_ID
      : process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
    const apiKey = isMetricsSheet
      ? process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY
      : process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY

    if (!sheetId || !apiKey) {
      throw new Error("Missing required environment variables")
    }

    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${encodeURIComponent(sheetName)}!A:K?key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error fetching sheet data for ${sheetName}:`, error)
    throw error
  }
}

