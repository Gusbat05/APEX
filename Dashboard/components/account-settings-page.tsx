import type React from "react"
import { useState } from "react"
import { User, Building, Mail, Lock, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { user } from "@/lib/user"

interface AccountSettingsPageProps {
  onBack: () => void
}

interface UserInfo {
  name: string
  company: string
  email: string
  password: string
}

export function AccountSettingsPage({ onBack }: AccountSettingsPageProps) {
  const [editMode, setEditMode] = useState<keyof UserInfo | null>(null)
  const [updatedInfo, setUpdatedInfo] = useState<UserInfo>({
    name: user.name,
    company: user.company,
    email: user.email,
    password: "********", // Placeholder for password
  })

  const handleEdit = (field: keyof UserInfo) => {
    setEditMode(field)
  }

  const handleSave = (field: keyof UserInfo) => {
    // If the input is empty, revert to the original value
    if (updatedInfo[field].trim() === "") {
      setUpdatedInfo((prev) => ({ ...prev, [field]: user[field as keyof typeof user] }))
    } else {
      // Here you would typically send the updated info to your backend
      // For now, we'll just update the local state
      console.log(`Updated ${field}: ${updatedInfo[field]}`)
    }
    setEditMode(null)
  }

  const handleCancel = (field: keyof UserInfo) => {
    setEditMode(null)
    setUpdatedInfo((prev) => ({ ...prev, [field]: user[field as keyof typeof user] }))
  }

  const renderField = (field: keyof UserInfo, icon: React.ReactNode, label: string) => (
    <div
      className={`flex items-center justify-between bg-white/5 rounded-lg p-3 transition-all duration-300 ease-in-out relative hover:bg-white/10 overflow-hidden ${
        editMode === field ? "h-[110px] edit-mode" : "h-[68px]"
      }`}
    >
      <div className="flex items-center space-x-4 flex-grow">
        <div className="w-5 h-5 text-white/70 flex-shrink-0 -mt-1">{icon}</div>
        <div className="w-full">
          <p className="text-sm font-medium text-white header-text-animate">{label}</p>
          {editMode === field ? (
            <Input
              value={updatedInfo[field]}
              onChange={(e) => setUpdatedInfo((prev) => ({ ...prev, [field]: e.target.value }))}
              className="bg-white/10 border-white/20 text-white w-[calc(100%-100px)] transition-all duration-300 ease-in-out opacity-0 animate-fade-in"
              type={field === "password" ? "password" : "text"}
            />
          ) : (
            <p className="text-sm text-white/70 transition-all duration-300 ease-in-out transform">
              {updatedInfo[field]}
            </p>
          )}
        </div>
      </div>
      <div className={`absolute right-3 top-0 bottom-0 flex items-center transition-all duration-300 ease-in-out`}>
        {editMode === field ? (
          <div className="flex space-x-2 opacity-0 animate-fade-in absolute bottom-6 right-0">
            {" "}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSave(field)}
              className="text-green-400 hover:text-green-300 hover:bg-green-400/20 w-10 h-10 p-0"
            >
              <Check className="h-4 w-4 stroke-[4px]" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCancel(field)}
              className="text-red-400 hover:text-red-300 hover:bg-red-400/20 w-10 h-10 p-0"
            >
              <X className="h-4 w-4 stroke-[4px]" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(field)}
            className="group relative text-sm text-white/70 hover:text-white overflow-hidden w-[72px] h-10"
          >
            <span className="relative z-10">Edit</span>
            <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
          </Button>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      {renderField("name", <User />, "Name")}
      {renderField("company", <Building />, "Company")}
      {renderField("email", <Mail />, "Email")}
      {renderField("password", <Lock />, "Password")}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out forwards;
          animation-delay: 0.3s;
        }
        .header-text-animate {
          transition: transform 0.3s ease-out;
        }
        .edit-mode .header-text-animate {
          transform: translateY(-4px);
        }
      `}</style>
    </div>
  )
}

