"use client"

import { useEffect, useState, useCallback } from "react"
import { validateGoogleSheetsAccess } from "@/lib/config-checker"
import { Button } from "@/components/ui/button"
import { RefreshCw, AlertCircle, CheckCircle2, XCircle } from "lucide-react"

interface ConfigStatus {
  name: string
  type: "metrics" | "regular"
  success: boolean
  error?: string
  details?: string
  title?: string
  sheets?: number
}

export function ConfigChecker() {
  const [status, setStatus] = useState<ConfigStatus[]>([])
  const [isChecking, setIsChecking] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkConfig = useCallback(async () => {
    try {
      setIsChecking(true)
      setError(null)
      console.log("Starting configuration check...")

      const results = await validateGoogleSheetsAccess()
      console.log("Configuration check results:", results)

      setStatus(results)
      setLastChecked(new Date())
    } catch (err) {
      console.error("Configuration check failed:", err)
      setError(err instanceof Error ? err.message : "Failed to check configuration")
    } finally {
      setIsChecking(false)
    }
  }, [])

  useEffect(() => {
    checkConfig()
  }, [checkConfig])

  const getStatusIcon = (success: boolean) => {
    if (success) {
      return <CheckCircle2 className="h-5 w-5 text-green-400" />
    }
    return <XCircle className="h-5 w-5 text-red-400" />
  }

  const renderErrorHelp = (status: ConfigStatus) => {
    if (!status.error) return null

    if (status.error.includes("403")) {
      return (
        <div className="mt-2 text-xs space-y-1">
          <p>This usually means:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>The API key doesn't have access to Google Sheets API</li>
            <li>The spreadsheet is not shared with the correct permissions</li>
          </ul>
        </div>
      )
    }

    if (status.error.includes("404")) {
      return (
        <div className="mt-2 text-xs">
          <p>This usually means:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>The spreadsheet ID is incorrect</li>
            <li>The spreadsheet has been deleted</li>
          </ul>
        </div>
      )
    }

    return null
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <p>Configuration check failed: {error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={checkConfig} className="mt-2" disabled={isChecking}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
          Retry Check
        </Button>
      </div>
    )
  }

  if (status.every((s) => s.success)) {
    return null
  }

  return (
    <div className="mb-4 space-y-4">
      {status.map(
        (result, index) =>
          !result.success && (
            <div key={index} className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
              <div className="flex items-start">
                {getStatusIcon(result.success)}
                <div className="ml-3 flex-1">
                  <h4 className="font-medium flex items-center">
                    {result.name} Configuration Error
                    {result.type === "metrics" && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-500/20 rounded-full">Required for Metrics</span>
                    )}
                  </h4>
                  <p className="text-sm mt-1">{result.error}</p>
                  {result.details && <p className="text-xs mt-1 text-red-400/80">Details: {result.details}</p>}
                  {renderErrorHelp(result)}
                </div>
              </div>
            </div>
          ),
      )}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={checkConfig}
          className="text-white/70 hover:text-white"
          disabled={isChecking}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isChecking ? "animate-spin" : ""}`} />
          {isChecking ? "Checking Configuration..." : "Recheck Configuration"}
        </Button>
        {lastChecked && <span className="text-xs text-white/50">Last checked: {lastChecked.toLocaleTimeString()}</span>}
      </div>
    </div>
  )
}

