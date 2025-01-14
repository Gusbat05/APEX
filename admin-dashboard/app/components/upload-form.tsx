"use client"

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }, [])

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)

    // Read the Excel file
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })

      // Assume we're working with the first sheet
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Here you would typically send this data to your backend
      console.log(jsonData)

      // For this example, we'll just simulate an upload delay
      setTimeout(() => {
        setUploading(false)
        router.push('/tables')
      }, 2000)
    }
    reader.readAsArrayBuffer(file)
  }, [file, router])

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file">Excel File</Label>
        <Input id="file" type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
      </div>
      <Button type="submit" disabled={!file || uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </form>
  )
}

