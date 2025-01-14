"use client"

import { useState, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ImageCropper } from "./image-cropper"
import { Upload } from 'lucide-react'
import { useTheme } from "next-themes"

interface ProfilePictureUploadProps {
  currentPicture: string | null
  onPictureChange: (picture: string) => void
  initials: string
  randomColor: string
  size?: 'small' | 'large'
}

export function ProfilePictureUpload({ currentPicture, onPictureChange, initials, randomColor, size = 'small' }: ProfilePictureUploadProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { resolvedTheme } = useTheme()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setIsUploadDialogOpen(true)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleCroppedImage = (croppedImage: string) => {
    onPictureChange(croppedImage)
    setIsUploadDialogOpen(false)
  }

  const avatarSize = size === 'large' ? 'h-16 w-16' : 'h-10 w-10'
  const initialsSize = size === 'large' ? 'text-3xl' : 'text-xl'

  return (
    <>
      <div className="relative group">
        <Avatar className={`${avatarSize} cursor-pointer`} onClick={handleUploadClick}>
          <AvatarImage src={currentPicture || undefined} alt="Profile" />
          <AvatarFallback className={`${randomColor} ${initialsSize} font-bold text-white`}>{initials}</AvatarFallback>
        </Avatar>
        <div className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${avatarSize}`}>
          <Button variant="ghost" size="sm" className="text-white p-2 h-auto rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 transition-colors" onClick={handleUploadClick}>
            <Upload className={size === 'large' ? 'h-8 w-8' : 'h-6 w-6'} />
          </Button>
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Crop Profile Picture</DialogTitle>
          </DialogHeader>
          {selectedFile && (
            <ImageCropper
              image={URL.createObjectURL(selectedFile)}
              onCropFinish={handleCroppedImage}
              fileSize={selectedFile.size}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

