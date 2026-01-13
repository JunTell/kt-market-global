"use client"

import React, { useState, useRef, useEffect, forwardRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Check, Search } from "lucide-react"
import { cn } from "@/shared/lib/utils"

interface SelectProps {
    options: readonly string[] | string[]
    value: string
    onChange: (value: string) => void
    label?: string
    placeholder?: string
    className?: string
    disabled?: boolean
}

const Select = forwardRef<HTMLDivElement, SelectProps>(({
    options,
    value,
    onChange,
    label,
    placeholder = "Select an option",
    className,
    disabled = false,
}, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const searchInputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Filter options based on search term
    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    )

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => {
                if (searchInputRef.current) {
                    searchInputRef.current.focus()
                }
            }, 100)
        }
    }, [isOpen])

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSelect = (option: string) => {
        onChange(option)
        setIsOpen(false)
    }

    return (
        <div className={cn("relative w-full mb-6", className)} ref={containerRef}>
            {label && (
                <label className="block text-[13px] text-[#86868b] mb-2 font-medium">
                    {label}
                </label>
            )}

            <div
                ref={ref}
                className={cn(
                    "w-full p-4 text-base rounded-lg border bg-white flex items-center justify-between cursor-pointer transition-all duration-200 select-none",
                    isOpen ? "border-[#4285F4] ring-2 ring-[#4285F4]/10" : "border-[#E5E7EB] hover:border-[#4285F4]",
                    disabled && "opacity-50 cursor-not-allowed bg-gray-50",
                    className
                )}
                onClick={() => {
                    if (!disabled) {
                        setIsOpen(!isOpen)
                        if (!isOpen) setSearchTerm("")
                    }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault()
                        setIsOpen(!isOpen)
                    }
                }}
            >
                <span className={cn("block truncate", !value && "text-gray-400")}>
                    {value || placeholder}
                </span>
                <ChevronDown
                    className={cn(
                        "w-5 h-5 text-gray-400 transition-transform duration-200",
                        isOpen && "transform rotate-180 text-[#4285F4]"
                    )}
                />
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-gray-100 max-h-[300px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
                    >
                        <div className="p-2 sticky top-0 bg-white z-10 border-b border-gray-100">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-transparent focus:bg-white focus:border-[#4285F4] rounded-lg outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>
                        </div>
                        <div className="p-1.5">
                            {filteredOptions.map((option) => (
                                <div
                                    key={option}
                                    className={cn(
                                        "flex items-center justify-between px-4 py-3 rounded-lg text-[15px] cursor-pointer transition-colors",
                                        value === option
                                            ? "bg-[#4285F4]/5 text-[#4285F4] font-medium"
                                            : "text-[#1d1d1f] hover:bg-gray-50"
                                    )}
                                    onClick={() => handleSelect(option)}
                                >
                                    <span className="truncate">{option}</span>
                                    {value === option && (
                                        <Check className="w-4 h-4 text-[#4285F4]" />
                                    )}
                                </div>
                            ))}
                            {filteredOptions.length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-400 text-center">
                                    No options available
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
})

Select.displayName = "Select"

export default Select
