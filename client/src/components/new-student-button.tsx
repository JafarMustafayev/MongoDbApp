"use client"

import { Plus } from "lucide-react"

interface NewStudentButtonProps {
  onClick: () => void
}

export default function NewStudentButton({ onClick }: NewStudentButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-indigo-600 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      <Plus className="h-4 w-4" />
      <span>Yeni tələbə</span>
    </button>
  )
}
