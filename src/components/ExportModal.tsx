'use client'
import { useState } from 'react'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (fileName: string) => void
  defaultName: string
  title: string
}

export function ExportModal({ isOpen, onClose, onConfirm, defaultName, title }: ExportModalProps) {
  const [fileName, setFileName] = useState(defaultName)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onConfirm(fileName)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du fichier
            </label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Entrez le nom du fichier"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Exporter
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}