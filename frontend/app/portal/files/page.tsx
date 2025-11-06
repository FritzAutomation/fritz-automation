'use client';

import { useEffect, useState, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import PortalLayout from '@/components/PortalLayout';
import { getProjectFiles, getProjects, uploadFile } from '@/lib/portalApi';
import type { ProjectFile, Project } from '@/lib/portalApi';

export default function FilesPage() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    project: '',
    name: '',
    description: '',
    category: 'document',
    is_confidential: false,
    file: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, [selectedProject]);

  const fetchData = async () => {
    try {
      const [filesData, projectsData] = await Promise.all([
        getProjectFiles(selectedProject ? Number(selectedProject) : undefined),
        getProjects(),
      ]);
      setFiles(filesData);
      setProjects(projectsData);
      setError('');
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadForm((prev) => ({
        ...prev,
        file,
        name: prev.name || file.name,
      }));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadForm((prev) => ({
        ...prev,
        file,
        name: prev.name || file.name,
      }));
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadForm.file || !uploadForm.project || !uploadForm.name) {
      setError('Please fill in all required fields');
      return;
    }

    // Check file size (50MB limit)
    if (uploadForm.file.size > 50 * 1024 * 1024) {
      setError(`File size must be less than 50MB. Your file is ${(uploadForm.file.size / (1024 * 1024)).toFixed(1)}MB.`);
      return;
    }

    setUploading(true);
    setError('');

    try {
      await uploadFile(
        Number(uploadForm.project),
        uploadForm.name,
        uploadForm.description,
        uploadForm.category,
        uploadForm.is_confidential,
        uploadForm.file
      );

      // Reset form and close modal
      setUploadForm({
        project: '',
        name: '',
        description: '',
        category: 'document',
        is_confidential: false,
        file: null,
      });
      setShowUploadModal(false);

      // Refresh files list
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.file?.[0] || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'document': '📄',
      'credential': '🔐',
      'report': '📊',
      'design': '🎨',
      'code': '💻',
      'other': '📎',
    };
    return icons[category] || '📎';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'document': 'bg-blue-50 text-blue-700 border-blue-200',
      'credential': 'bg-red-50 text-red-700 border-red-200',
      'report': 'bg-green-50 text-green-700 border-green-200',
      'design': 'bg-purple-50 text-purple-700 border-purple-200',
      'code': 'bg-gray-50 text-gray-700 border-gray-200',
      'other': 'bg-yellow-50 text-yellow-700 border-yellow-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  return (
    <ProtectedRoute>
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Files</h1>
              <p className="mt-2 text-gray-600">Access and upload project files</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload File
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Filter */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium text-gray-900">Filter by Project:</label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="flex-1 max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
              >
                <option value="">All Projects</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Files Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : files.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
              <div className="text-6xl mb-4">📎</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Files Available</h3>
              <p className="text-gray-600 mb-4">Upload files to share with your projects.</p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Upload Your First File
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files.map((file) => (
                <div
                  key={file.id}
                  className={`bg-white rounded-xl shadow-md border-2 ${getCategoryColor(file.category)} p-6 hover:shadow-lg transition-shadow`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-4xl">{getCategoryIcon(file.category)}</div>
                    {file.is_confidential && (
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-semibold">
                        🔒 Confidential
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-gray-900 mb-2 truncate" title={file.name}>
                    {file.name}
                  </h3>

                  {file.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{file.description}</p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{file.file_size_display}</span>
                    <span>{new Date(file.created_at).toLocaleDateString()}</span>
                  </div>

                  <a
                    href={file.file_url}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-semibold text-sm"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto my-auto">
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upload File</h2>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleUpload} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                {/* Drag and Drop Area */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 sm:p-8 text-center transition-colors ${
                    dragActive
                      ? 'border-primary bg-primary/5'
                      : uploadForm.file
                      ? 'border-green-400 bg-green-50'
                      : 'border-gray-300 hover:border-primary'
                  }`}
                >
                  {uploadForm.file ? (
                    <div className="space-y-2">
                      <div className="text-5xl">✅</div>
                      <p className="font-semibold text-gray-900">{uploadForm.file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(uploadForm.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={() => setUploadForm((prev) => ({ ...prev, file: null }))}
                        className="text-sm text-red-600 hover:text-red-700 font-medium"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-4xl sm:text-5xl">📁</div>
                      <p className="text-base sm:text-lg font-semibold text-gray-900">
                        Drag and drop your file here
                      </p>
                      <p className="text-sm text-gray-600">or</p>
                      <label className="inline-block px-4 sm:px-6 py-2 sm:py-3 bg-primary text-white rounded-lg font-semibold cursor-pointer hover:bg-primary-light transition-colors text-sm sm:text-base">
                        Browse Files
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-gray-500 mt-2">
                        Maximum file size: 50MB
                      </p>
                    </div>
                  )}
                </div>

                {/* Project Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Project *
                  </label>
                  <select
                    value={uploadForm.project}
                    onChange={(e) => setUploadForm({ ...uploadForm, project: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  >
                    <option value="">Select a project</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                {/* File Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    File Name *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter file name"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={uploadForm.description}
                    onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder="Add a description (optional)"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Category
                  </label>
                  <select
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                  >
                    <option value="document">📄 Document</option>
                    <option value="credential">🔐 Credential</option>
                    <option value="report">📊 Report</option>
                    <option value="design">🎨 Design</option>
                    <option value="code">💻 Code</option>
                    <option value="other">📎 Other</option>
                  </select>
                </div>

                {/* Confidential Checkbox */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    id="confidential"
                    checked={uploadForm.is_confidential}
                    onChange={(e) => setUploadForm({ ...uploadForm, is_confidential: e.target.checked })}
                    className="w-5 h-5 text-primary rounded focus:ring-2 focus:ring-primary"
                  />
                  <label htmlFor="confidential" className="text-sm font-medium text-gray-900 cursor-pointer">
                    🔒 Mark as confidential (contains sensitive information)
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="w-full sm:flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors order-2 sm:order-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !uploadForm.file}
                    className="w-full sm:flex-1 px-6 py-3 bg-gradient-to-r from-primary to-primary-light text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed order-1 sm:order-2"
                  >
                    {uploading ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </PortalLayout>
    </ProtectedRoute>
  );
}
