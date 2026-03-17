"use client"

import React from "react"
import { CheckCircle2, Smartphone, RefreshCw } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface JoinTypeSelectorProps {
  registrationType: "chg" | "mnp"
  onChange: (type: "chg" | "mnp") => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: (key: string, values?: Record<string, any>) => string
}

export default function JoinTypeSelector({
  registrationType,
  onChange,
  t
}: JoinTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-3.5 mb-8">
      <div className="text-[17px] font-semibold text-[#1d1d1f] flex items-center gap-2 px-1">
        {t('Phone.PlanSelector.select_service_title') || "Select Service"}
      </div>
      
      <div className="grid grid-cols-2 gap-2.5">
        {/* Number Portability (Switch to KT) */}
        <button
          onClick={() => onChange("mnp")}
          className={cn(
            "flex flex-col p-3.5 rounded-[24px] border-2 transition-all text-left relative overflow-hidden group cursor-pointer",
            registrationType === "mnp"
              ? "border-blue-500 bg-blue-50/10 shadow-sm"
              : "border-gray-100 bg-white hover:border-gray-200"
          )}
        >
          <div className="flex flex-col gap-3">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
              registrationType === "mnp" ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
            )}>
              <RefreshCw size={18} />
            </div>
            <div className="flex-1">
              <div className={cn("font-bold text-[14px] mb-0.5 whitespace-nowrap", registrationType === "mnp" ? "text-blue-500" : "text-[#1d1d1f]")}>
                {t('Phone.PlanSelector.mnp_title')}
              </div>
              <div className="text-[11px] text-gray-400 leading-tight">
                {t('Phone.PlanSelector.mnp_desc_short')}
              </div>
            </div>
          </div>
          {registrationType === "mnp" && (
            <div className="absolute top-3 right-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={18} className="text-blue-500 fill-blue-50/50" />
            </div>
          )}
        </button>

        {/* Device Change (Already KT) */}
        <button
          onClick={() => onChange("chg")}
          className={cn(
            "flex flex-col p-3.5 rounded-[24px] border-2 transition-all text-left relative overflow-hidden group cursor-pointer",
            registrationType === "chg"
              ? "border-blue-500 bg-blue-50/10 shadow-sm"
              : "border-gray-100 bg-white hover:border-gray-200"
          )}
        >
          <div className="flex flex-col gap-3">
            <div className={cn(
              "w-9 h-9 rounded-xl flex items-center justify-center transition-colors",
              registrationType === "chg" ? "bg-blue-500 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
            )}>
              <Smartphone size={18} />
            </div>
            <div className="flex-1">
              <div className={cn("font-bold text-[14px] mb-0.5 whitespace-nowrap", registrationType === "chg" ? "text-blue-500" : "text-[#1d1d1f]")}>
                {t('Phone.PlanSelector.chg_title')}
              </div>
              <div className="text-[11px] text-gray-400 leading-tight">
                {t('Phone.PlanSelector.chg_desc_short')}
              </div>
            </div>
          </div>
          {registrationType === "chg" && (
            <div className="absolute top-3 right-3 animate-in fade-in zoom-in duration-300">
              <CheckCircle2 size={18} className="text-blue-500 fill-blue-50/50" />
            </div>
          )}
        </button>
      </div>
    </div>
  )
}
