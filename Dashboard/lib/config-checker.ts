interface SheetInfo {
  id: string
  name: string
  type: "metrics" | "regular"
  apiKey: string
}

export async function validateGoogleSheetsAccess() {
  const sheets: SheetInfo[] = [
    {
      id: process.env.NEXT_PUBLIC_METRICS_SHEETS_ID!,
      name: "Metrics Sheet",
      type: "metrics",
      apiKey: process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY!,
    },
    {
      id: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID!,
      name: "Regular Sheet",
      type: "regular",
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY!,
    },
  ]

  const results = await Promise.all(
    sheets.map(async (sheet) => {
      try {
        console.log(`Checking access to ${sheet.name}...`)

        // First, verify the spreadsheet exists and is accessible
        const metadataResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}?key=${sheet.apiKey}`,
        )

        if (!metadataResponse.ok) {
          const error = await metadataResponse.json()
          console.error(`${sheet.name} metadata error:`, error)
          return {
            name: sheet.name,
            type: sheet.type,
            success: false,
            error: error.error?.message || `HTTP error! status: ${metadataResponse.status}`,
            details: error.error?.status || "Unknown error",
          }
        }

        // Then try to read some data
        const dataResponse = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${sheet.id}/values/A1:B2?key=${sheet.apiKey}`,
        )

        if (!dataResponse.ok) {
          const error = await dataResponse.json()
          console.error(`${sheet.name} data access error:`, error)
          return {
            name: sheet.name,
            type: sheet.type,
            success: false,
            error: error.error?.message || `HTTP error! status: ${dataResponse.status}`,
            details: error.error?.status || "Unknown error",
          }
        }

        const metadata = await metadataResponse.json()
        return {
          name: sheet.name,
          type: sheet.type,
          success: true,
          title: metadata.properties?.title,
          sheets: metadata.sheets?.length || 0,
        }
      } catch (error) {
        console.error(`Error checking ${sheet.name}:`, error)
        return {
          name: sheet.name,
          type: sheet.type,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
          details: "Network or configuration error",
        }
      }
    }),
  )

  return results
}

export async function testSheetAccess(sheetId: string, apiKey: string, range = "A1:B2") {
  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`,
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return {
      success: true,
      data: data.values,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

