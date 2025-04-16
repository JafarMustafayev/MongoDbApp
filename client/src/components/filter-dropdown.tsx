"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Filter } from "lucide-react"

interface FilterDropdownProps {
  options: string[]
  onSelect: (option: string | null) => void
  selectedOption: string | null
}

export default function FilterDropdown({ options, onSelect, selectedOption }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Filter className="h-4 w-4" />
        <span>{selectedOption || "Filter"}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              onClick={() => {
                onSelect(null)
                setIsOpen(false)
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Hamısı
            </button>
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  onSelect(option)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-2 text-sm ${
                  selectedOption === option
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                }`}
                role="menuitem"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
