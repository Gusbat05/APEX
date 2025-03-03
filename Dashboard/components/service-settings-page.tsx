import type React from "react"
import { Calendar, Key, CheckCircle, Shield } from "lucide-react"

// Mock data for the account information
const accountInfo = {
  creationDate: "2023-01-15",
  serviceKey: "12345678", // 8-digit service key
  recoveryCode: "R3C0V3RY-C0D3-2023",
  isActive: true, // This would be determined by your actual subscription logic
}

interface ServiceSettingsPageProps {
  onBack: () => void
}

export function ServiceSettingsPage({ onBack }: ServiceSettingsPageProps) {
  return (
    <div className="space-y-6">
      {/* Removed content */}

      <div className="flex flex-col items-center">
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center ${
            accountInfo.isActive ? "bg-green-500" : "bg-red-500"
          } animate-pulse-glow`}
        >
          <CheckCircle className="h-12 w-12 text-white" />
        </div>
        <div className="flex items-center w-full mt-3">
          <div className="flex-grow h-px bg-white/20"></div>
          <p className="text-xl font-semibold text-white px-4 text-center">
            {accountInfo.isActive ? "Active Subscription" : "Inactive Subscription"}
          </p>
          <div className="flex-grow h-px bg-white/20"></div>
        </div>
      </div>

      <div className="space-y-4">
        <InfoItem
          icon={Calendar}
          label="Account Creation Date"
          value={new Date(accountInfo.creationDate).toLocaleDateString()}
        />
        <InfoItem icon={Key} label="Account Service Key" value={accountInfo.serviceKey} />
        <InfoItem icon={Shield} label="Account Recovery Code" value={accountInfo.recoveryCode} />
      </div>
      <style jsx>{`
        .animate-pulse-glow {
          animation: pulseGlow 2s infinite;
        }
        @keyframes pulseGlow {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(255, 255, 255, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
          }
        }
      `}</style>
    </div>
  )
}

interface InfoItemProps {
  icon: React.ElementType
  label: string
  value: string
}

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="flex items-center space-x-4 bg-white/5 rounded-lg p-3">
      <Icon className="h-6 w-6 text-white/70" />
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-sm text-white/70">{value}</p>
      </div>
    </div>
  )
}

