'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Loader2, Upload, ImageIcon } from 'lucide-react'

export default function UploadPhotoPage() {
  const router = useRouter()
  const params = useParams()
  const fieldId = params.id as string

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB')
        return
      }
      setSelectedFile(file)
      setPreview(URL.createObjectURL(file))
      setError('')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('Please select a photo')
      return
    }

    setLoading(true)
    setError('')

    // Check if user is logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      setError('You must be logged in to upload photos')
      setLoading(false)
      return
    }

    // Upload to Supabase Storage
    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `${fieldId}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('field-photos')
      .upload(fileName, selectedFile)

    if (uploadError) {
      setError(uploadError.message)
      setLoading(false)
      return
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('field-photos')
      .getPublicUrl(fileName)

    // Save to database
    const { error: dbError } = await supabase
      .from('field_photos')
      .insert([
        {
          field_id: fieldId,
          user_id: user.id,
          image_url: publicUrl,
        }
      ])

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
      return
    }

    router.push(`/fields/${fieldId}`)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="bg-navy-500 text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">Upload Field Photo</h1>
          <p className="text-navy-100">
            Share photos of the field condition with the community
          </p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Photo
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-navy-400 transition-colors">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreview(null)
                      }}
                      className="mt-4 text-red-600 hover:text-red-700 font-medium"
                    >
                      Remove Photo
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Drag and drop a photo here, or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="inline-block bg-navy-500 hover:bg-navy-600 text-white px-6 py-3 rounded-lg font-medium cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full bg-navy-500 hover:bg-navy-600 disabled:bg-navy-300 text-white py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Upload Photo
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}