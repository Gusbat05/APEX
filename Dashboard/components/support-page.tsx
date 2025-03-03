"use client"

import { ArrowLeft, HelpCircle, Mail, Phone, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { formatPhoneNumber } from "@/lib/utils"

export function SupportPage({ onBack }: { onBack: () => void }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      className={`px-4 pt-4 pb-2 flex flex-col transition-all duration-300 ease-in-out ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ height: "520px" }}
    >
      <div className="flex-grow overflow-y-auto flex flex-col">
        <div className="flex-grow flex flex-col">
          <div>
            <div className="flex items-center mb-4">
              <HelpCircle className="w-6 h-6 mr-2 text-white" />
              <h3 className="text-xl font-bold text-white mr-3">Support</h3>
              <div className="flex-grow h-px bg-white/20"></div>
            </div>
            <h4 className="text-lg font-semibold text-white mb-2">Need Help? We're Here for You!</h4>
            <p className="text-base text-white/80 mb-2">
              We're committed to providing the best experience possible. Have any questions, encounter an issue, or have
              suggestions? Feel free to reach out—we're happy to help!
            </p>
            <div className="border-t border-white/10 my-6"></div>
            <h4 className="text-lg font-semibold text-white my-2 text-center">
              Reach out through the following channels:
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {[
              { icon: Mail, label: "Email", value: "support@apex.com", href: "mailto:support@apex.com" },
              { icon: Phone, label: "Phone", value: formatPhoneNumber("5551234567"), href: "tel:5551234567" },
              { icon: Globe, label: "Website", value: "Visit our website", href: "https://www.apextech.com/support" },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-white/10 hover:bg-white/20 rounded-lg p-4 flex flex-col items-center justify-center text-center h-[150px] transition-all duration-300 ease-in-out"
              >
                <item.icon className="w-8 h-8 mb-2 text-white opacity-80 transition-all duration-300 ease-in-out transform group-hover:scale-110" />
                <span className="font-semibold text-white mb-1">{item.label}</span>
                {item.href ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-white text-sm relative inline-block group/link"
                  >
                    <span className="relative z-10">{item.value}</span>
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 ease-out group-hover/link:scale-x-100"></span>
                  </a>
                ) : (
                  <span className="text-white/80 text-sm relative inline-block group/link">
                    <span className="relative z-10">{item.value}</span>
                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-white transform scale-x-0 origin-center transition-transform duration-300 ease-out group-hover/link:scale-x-100"></span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-auto pt-4">
        <Button
          variant="ghost"
          className="group relative flex w-full items-center justify-start gap-2 rounded-lg px-3 py-3 text-sm font-medium transition-colors overflow-hidden text-white/70 hover:text-white"
          onClick={onBack}
        >
          <span className="relative z-10 flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2 transition-all duration-200 ease-in-out group-hover:scale-110 group-hover:filter group-hover:drop-shadow-glow" />
            Back
          </span>
          <span className="absolute inset-0 z-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
        </Button>
      </div>
    </div>
  )
}

