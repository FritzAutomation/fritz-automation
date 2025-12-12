import { createClient } from '@/lib/supabase/server'

interface FileRecord {
  id: string
  filename: string
  original_filename: string
  storage_path: string
  file_size: number | null
  mime_type: string | null
  created_at: string
  ticket?: {
    ticket_number: string
    subject: string
  }
}

export default async function FilesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  let files: FileRecord[] = []

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from('files')
      .select(`
        *,
        ticket:tickets(ticket_number, subject)
      `)
      .eq('uploaded_by', user.id)
      .order('created_at', { ascending: false })

    files = data || []
  } catch {
    // Database might not exist yet
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (mimeType: string | null) => {
    if (!mimeType) return '📄'
    if (mimeType.startsWith('image/')) return '🖼️'
    if (mimeType.startsWith('video/')) return '🎬'
    if (mimeType.startsWith('audio/')) return '🎵'
    if (mimeType.includes('pdf')) return '📕'
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊'
    if (mimeType.includes('document') || mimeType.includes('word')) return '📝'
    if (mimeType.includes('zip') || mimeType.includes('archive')) return '📦'
    return '📄'
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Files</h1>
        <p className="text-slate-600 mt-1">View and manage your uploaded files</p>
      </div>

      {files.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">File</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Related Ticket</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Size</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Uploaded</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {files.map((file) => (
                <tr key={file.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(file.mime_type)}</span>
                      <div>
                        <p className="font-medium text-slate-900">{file.original_filename}</p>
                        <p className="text-xs text-slate-500">{file.mime_type || 'Unknown type'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {file.ticket ? (
                      <div>
                        <p className="text-sm font-medium text-primary">{file.ticket.ticket_number}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[200px]">{file.ticket.subject}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {formatFileSize(file.file_size)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(file.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No files yet</h3>
          <p className="text-slate-600">Files you upload to support tickets will appear here.</p>
        </div>
      )}
    </div>
  )
}
