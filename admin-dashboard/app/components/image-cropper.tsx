"use client"

import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button } from "@/components/ui/button"

interface ImageCropperProps {
  image: string
  onCropFinish: (croppedImage: string) => void
  fileSize: number
}

export function ImageCropper({ image, onCropFinish, fileSize }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [isFileTooLarge, setIsFileTooLarge] = useState(false)
  const [naturalWidth, setNaturalWidth] = useState(0)
  const [naturalHeight, setNaturalHeight] = useState(0)
  const [maxZoom, setMaxZoom] = useState(1)

  useEffect(() => {
    setIsFileTooLarge(fileSize > 10 * 1024 * 1024)

    const img = new Image()
    img.onload = () => {
      setNaturalWidth(img.naturalWidth)
      setNaturalHeight(img.naturalHeight)
      const aspectRatio = img.naturalWidth / img.naturalHeight
      const containerAspectRatio = 300 / 300 // Assuming a 300x300 container
      setMaxZoom(Math.max(1, aspectRatio / containerAspectRatio))
    }
    img.src = image
  }, [fileSize, image])

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image()
      image.addEventListener('load', () => resolve(image))
      image.addEventListener('error', error => reject(error))
      image.setAttribute('crossOrigin', 'anonymous')
      image.src = url
    })

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: { width: number; height: number; x: number; y: number }
  ) => {
    const image = await createImage(imageSrc)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      return null
    }

    canvas.width = pixelCrop.width
    canvas.height = pixelCrop.height

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    )

    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty')
          return
        }
        resolve(URL.createObjectURL(blob))
      }, 'image/jpeg')
    })
  }

  const handleCropSubmit = useCallback(async () => {
    if (croppedAreaPixels && !isFileTooLarge) {
      const croppedImage = await getCroppedImg(image, croppedAreaPixels)
      if (croppedImage) {
        onCropFinish(croppedImage)
      }
    }
  }, [croppedAreaPixels, image, onCropFinish, isFileTooLarge])

  return (
    <div className="space-y-4">
      <div className="h-[300px] relative">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={onCropChange}
          onZoomChange={onZoomChange}
          onCropComplete={onCropComplete}
          cropShape="round"
          showGrid={true}
          minZoom={1}
          maxZoom={maxZoom}
          restrictPosition={true}
        />
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          File size limit: 10MB
        </p>
        <Button 
          onClick={handleCropSubmit} 
          disabled={isFileTooLarge}
          className={isFileTooLarge ? "bg-red-500 hover:bg-red-600" : ""}
        >
          {isFileTooLarge ? "File exceeds 10MB" : "Apply"}
        </Button>
      </div>
    </div>
  )
}

