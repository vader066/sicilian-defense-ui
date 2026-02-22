import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { usePlayersFileUpload } from '@/hooks/players'
import { cn } from '@/lib/utils'
import { useCallback, useRef, useState } from 'react'
import {
  FiUploadCloud,
  FiFile,
  FiX,
  FiInfo,
  FiCheckCircle,
} from 'react-icons/fi'

const REQUIRED_COLUMNS = [
  { key: 'first_name', description: 'First name of the player' },
  { key: 'last_name', description: 'Last name of the player' },
  { key: 'programme', description: 'Programme or course of study' },
  { key: 'rating', description: 'Player rating (numeric)' },
  { key: 'username', description: 'Lichess username' },
  { key: 'date_of_birth', description: 'Date of birth (e.g. DD/MM/YYYY)' },
  { key: 'sex', description: 'MALE or FEMALE' },
]

export function UploadFile() {
  const { mutate: uploadFile, isPending } = usePlayersFileUpload()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setSelectedFile(file)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleUpload = () => {
    if (!selectedFile) return
    uploadFile(selectedFile, {
      onSuccess: () => setSelectedFile(null),
    })
  }

  const removeFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto px-4">
      {/* Upload Area */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold">Upload Players CSV</h3>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'relative flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-10 cursor-pointer transition-all duration-200',
            isDragging
              ? 'border-black bg-black/5 scale-[1.01]'
              : 'border-black/20 hover:border-black/40 hover:bg-black/[0.02]',
          )}
        >
          <div
            className={cn(
              'flex items-center justify-center size-14 rounded-full bg-black/5 transition-colors',
              isDragging && 'bg-black/10',
            )}
          >
            <FiUploadCloud className="size-7 text-black/50" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-black/70">
              <span className="text-black underline underline-offset-2">
                Click to browse
              </span>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-black/40 mt-1">
              Only CSV files are supported
            </p>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleInputChange}
          />
        </div>

        {/* Selected File */}
        {selectedFile && (
          <div className="flex items-center justify-between rounded-lg border border-black/10 bg-black/[0.02] px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-green-50">
                <FiFile className="size-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium">{selectedFile.name}</p>
                <p className="text-xs text-black/40">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={removeFile}
                disabled={isPending}
                className="p-1.5 rounded-md hover:bg-black/5 transition-colors text-black/40 hover:text-black/70"
              >
                <FiX className="size-4" />
              </button>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <Button
          type="button"
          onClick={handleUpload}
          disabled={!selectedFile || isPending}
          className="w-full bg-black text-white hover:bg-black/90 disabled:opacity-40 h-11 rounded-lg text-sm font-medium"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Spinner size="small" />
              Uploading...
            </span>
          ) : (
            'Upload File'
          )}
        </Button>
      </div>

      {/* Required Columns Info */}
      <div className="rounded-xl border border-black/10 bg-gradient-to-b from-black/[0.02] to-transparent overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-black/10">
          <FiInfo className="size-4 text-black/50" />
          <h4 className="text-sm font-semibold">Required CSV Columns</h4>
        </div>
        <div className="p-5">
          <p className="text-xs text-black/50 mb-4">
            Your CSV file must include headers matching the following column
            names exactly.
          </p>
          <div className="grid gap-2">
            {REQUIRED_COLUMNS.map((col) => (
              <div
                key={col.key}
                className="flex items-start gap-3 rounded-lg px-3 py-2.5 bg-white border border-black/5 hover:border-black/10 transition-colors"
              >
                <FiCheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                <div className="flex flex-col gap-0.5">
                  <code className="text-xs font-mono font-semibold text-black/80">
                    {col.key}
                  </code>
                  <span className="text-xs text-black/45">
                    {col.description}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
