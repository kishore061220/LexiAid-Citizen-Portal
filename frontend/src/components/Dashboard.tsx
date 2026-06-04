/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Upload,
  FileText,
  Trash2,
  User,
  Mail,
  Phone,
  Edit2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  createdAt: string;
}

interface Document {
  id: number;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedAt: string;
}

interface AnalysisItem {
  id: number;
  analysisType: string;
  summary: string;
  statutes: string;
  recommendations: string;
  analyzedAt: string;
}

interface DashboardProps {
  token: string;
  activeTab: "dashboard" | "upload" | "history" | "profile";
  onSectionChange?: (section: string) => void;
}

export default function Dashboard({ token, activeTab, onSectionChange }: DashboardProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [history, setHistory] = useState<AnalysisItem[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ fullName: "", phone: "" });
  const [alert, setAlert] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = "http://localhost:3000/api";

  useEffect(() => {
    fetchProfile();
    fetchHistory();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setEditData({ fullName: data.fullName, phone: data.phone || "" });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_BASE}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${API_BASE}/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  const handleUploadFile = async () => {
    if (!uploadedFile) {
      setAlert({ type: "error", text: "Please select a file" });
      return;
    }

    try {
      const content = await uploadedFile.text();
      const response = await fetch(`${API_BASE}/upload-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: uploadedFile.name,
          fileType: uploadedFile.type,
          content
        })
      });

      if (response.ok) {
        setAlert({ type: "success", text: "Document uploaded successfully" });
        setUploadedFile(null);
        fetchDocuments();
        
        // Auto-analyze document
        const result = await response.json();
        await analyzeDocument(result.documentId, content);
      } else {
        setAlert({ type: "error", text: "Upload failed" });
      }
    } catch (err: any) {
      setAlert({ type: "error", text: err.message });
    }
  };

  const analyzeDocument = async (documentId: number, content: string) => {
    try {
      await fetch(`${API_BASE}/analyze-document`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          documentId,
          content,
          analysisType: "legal"
        })
      });
      fetchHistory();
    } catch (err) {
      console.error("Error analyzing document:", err);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`${API_BASE}/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editData)
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.user);
        setIsEditing(false);
        setAlert({ type: "success", text: "Profile updated successfully" });
      }
    } catch (err: any) {
      setAlert({ type: "error", text: err.message });
    }
  };

  const handleDeleteHistory = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/history/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        setAlert({ type: "success", text: "History deleted" });
        fetchHistory();
      }
    } catch (err: any) {
      setAlert({ type: "error", text: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm z-50 ${
            alert.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {alert.type === "success" ? (
            <CheckCircle2 size={20} />
          ) : (
            <AlertCircle size={20} />
          )}
          <span>{alert.text}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-navy mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {profile?.fullName}!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Documents</p>
                <p className="text-3xl font-bold text-navy">{documents.length}</p>
              </div>
              <FileText size={32} className="text-gold" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Analyses</p>
                <p className="text-3xl font-bold text-navy">{history.length}</p>
              </div>
              <Upload size={32} className="text-gold" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Member Since</p>
                <p className="text-lg font-bold text-navy">
                  {new Date(profile?.createdAt || "").toLocaleDateString()}
                </p>
              </div>
              <User size={32} className="text-gold" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="flex border-b border-gray-200 flex-wrap">
            {["dashboard", "upload", "history", "profile"].map((tab) => (
              <button
                key={tab}
                onClick={() => onSectionChange?.(tab)}
                className={`px-4 py-3 font-medium text-sm transition-colors capitalize ${
                  activeTab === tab
                    ? "border-b-2 border-gold text-gold"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Upload Tab */}
            {activeTab === "upload" && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gold rounded-lg p-8 text-center hover:bg-gold hover:bg-opacity-5 transition-colors">
                  <Upload size={48} className="mx-auto text-gold mb-4" />
                  <label className="cursor-pointer">
                    <p className="text-lg font-medium text-navy mb-2">
                      Drop your legal document here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      or click to browse (PDF, DOC, TXT)
                    </p>
                    <input
                      type="file"
                      onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.txt"
                    />
                  </label>
                </div>
                {uploadedFile && (
                  <div className="flex justify-between items-center p-4 bg-blue-50 rounded">
                    <span className="text-sm font-medium">{uploadedFile.name}</span>
                    <button
                      onClick={handleUploadFile}
                      className="px-4 py-2 bg-gold text-navy rounded font-medium hover:bg-yellow-400 transition-colors"
                    >
                      Upload & Analyze
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {history.length === 0 ? (
                  <p className="text-center text-gray-500">No analysis history yet</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-navy capitalize">
                            {item.analysisType} Analysis
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(item.analyzedAt).toLocaleString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{item.summary}</p>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Statutes:</strong> {item.statutes}</p>
                        <p><strong>Recommendations:</strong> {item.recommendations}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4 max-w-md">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <User size={20} className="text-gold" />
                      <div>
                        <p className="text-xs text-gray-500">Full Name</p>
                        <p className="font-medium">{profile?.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <Mail size={20} className="text-gold" />
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="font-medium">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                      <Phone size={20} className="text-gold" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="font-medium">{profile?.phone || "Not provided"}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gold text-navy rounded font-medium hover:bg-yellow-400 transition-colors"
                    >
                      <Edit2 size={16} />
                      Edit Profile
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editData.fullName}
                        onChange={(e) =>
                          setEditData({ ...editData, fullName: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({ ...editData, phone: e.target.value })
                        }
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-gold"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleUpdateProfile}
                        className="flex-1 px-4 py-2 bg-gold text-navy rounded font-medium hover:bg-yellow-400 transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 px-4 py-2 bg-gray-300 text-gray-800 rounded font-medium hover:bg-gray-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-navy mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => onSectionChange?.("upload")}
                      className="p-4 border border-gold rounded-lg hover:bg-gold hover:bg-opacity-10 transition-colors text-left"
                    >
                      <Upload size={24} className="text-gold mb-2" />
                      <p className="font-medium text-navy">Upload Document</p>
                      <p className="text-sm text-gray-600">Analyze legal documents</p>
                    </button>
                    <button
                      onClick={() => onSectionChange?.("history")}
                      className="p-4 border border-gold rounded-lg hover:bg-gold hover:bg-opacity-10 transition-colors text-left"
                    >
                      <FileText size={24} className="text-gold mb-2" />
                      <p className="font-medium text-navy">View History</p>
                      <p className="text-sm text-gray-600">Check past analyses</p>
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-navy mb-4">Recent Analyses</h3>
                  {history.length === 0 ? (
                    <p className="text-gray-500">No analyses yet</p>
                  ) : (
                    <div className="space-y-2">
                      {history.slice(0, 3).map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-700">{item.summary.substring(0, 50)}...</span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.analyzedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
