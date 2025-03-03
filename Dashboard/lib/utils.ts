import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add this phone number formatting utility function
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "")

  // Check if the input is valid
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)

  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }

  // If the phone number doesn't match the expected format, return the original
  return phoneNumber
}

// Add this at the top of the file
export const getEnvironmentVariables = () => {
  const metricsSheetId = process.env.NEXT_PUBLIC_METRICS_SHEETS_ID
  const metricsApiKey = process.env.NEXT_PUBLIC_METRICS_SHEETS_API_KEY
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY

  // Log the environment variables status (without exposing the actual values)
  console.log("Environment variables status:", {
    metricsSheetId: !!metricsSheetId,
    metricsApiKey: !!metricsApiKey,
    sheetId: !!sheetId,
    apiKey: !!apiKey,
  })

  if (!metricsSheetId || !metricsApiKey || !sheetId || !apiKey) {
    console.error("Missing required environment variables:", {
      metricsSheetIdSet: !!metricsSheetId,
      metricsApiKeySet: !!metricsApiKey,
      sheetIdSet: !!sheetId,
      apiKeySet: !!apiKey,
    })
    return null
  }

  // Validate the format of the sheet IDs (they should be long strings)
  if (metricsSheetId.length < 10 || sheetId.length < 10) {
    console.error("Invalid sheet ID format")
    return null
  }

  // Validate the API keys (they should be long strings)
  if (metricsApiKey.length < 10 || apiKey.length < 10) {
    console.error("Invalid API key format")
    return null
  }

  return {
    metricsSheetId,
    metricsApiKey,
    sheetId,
    apiKey,
  }
}

