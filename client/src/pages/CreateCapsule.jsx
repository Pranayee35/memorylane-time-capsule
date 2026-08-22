import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const CreateCapsule = () => {
  const navigate = useNavigate();
  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/login");
  }
}, [navigate]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // NEW: Media upload state
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    theme: "",
    unlockType: "date",
    unlockDate: "",
    recipients: "",
    privacy: "private",
    createdBy: localStorage.getItem("userEmail") || "Anonymous",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // NEW: Handle media file uploads to Cloudinary
  const handleMediaSelect = async (e) => {
    const files = Array.from(e.target.files);
    setUploadingMedia(true);
    setUploadError("");

    try {
      const uploadedMedia = [];

      for (const file of files) {
        const formDataForUpload = new FormData();
        formDataForUpload.append("file", file);

        // Upload to Cloudinary via backend
        const uploadRes = await fetch("http://localhost:5000/api/upload", {
          method: "POST",
          body: formDataForUpload,
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload media");
        }

        const uploadedData = await uploadRes.json();
        uploadedMedia.push({
          url: uploadedData.url,
          type: uploadedData.type,
          resource_type: uploadedData.type,
        });

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          setMediaPreview((prev) => [
            ...prev,
            {
              url: e.target.result,
              type: uploadedData.type,
              name: file.name,
            },
          ]);
        };
        reader.readAsDataURL(file);
      }

      setMediaFiles([...mediaFiles, ...uploadedMedia]);
      setSuccessMessage(`✅ ${uploadedMedia.length} media file(s) uploaded successfully`);
    } catch (error) {
      console.error("Media upload error:", error);
      setUploadError(`❌ Media upload failed: ${error.message}`);
    } finally {
      setUploadingMedia(false);
    }
  };

  // NEW: Remove media from preview
  const removeMedia = (index) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
    setMediaPreview(mediaPreview.filter((_, i) => i !== index));
  };

  // Submit form to create capsule
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadError("");
    setSuccessMessage("");

    try {
      if (!formData.title || !formData.message || !formData.theme) {
        throw new Error("Please fill in all required fields");
      }

      if (formData.unlockType === "date" && !formData.unlockDate) {
        throw new Error("Please select an unlock date");
      }

      if (!formData.recipients) {
        throw new Error("Please add at least one recipient");
      }

      const payload = {
        ...formData,
        recipients: formData.recipients
          .split(",")
          .map((r) => r.trim())
          .filter((r) => r),
        media: mediaFiles,
      };

      const res = await fetch("http://localhost:5000/api/capsules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to create capsule");
      }

      const data = await res.json();
      console.log("✅ Created capsule:", data);
      setSuccessMessage("🎉 Capsule created successfully! Redirecting...");

      // Redirect after success
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error("Create capsule error:", error);
      setUploadError(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <Helmet>
        <title>Create Capsule | MemoryLane</title>
      </Helmet>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-400 mb-8">Create Digital Time Capsule</h1>

        {/* Error Messages */}
        {uploadError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
            {uploadError}
          </div>
        )}

        {/* Success Messages */}
        {successMessage && (
          <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-200 px-4 py-3 rounded-lg mb-4">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Capsule Title *
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Family Summer 2025"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Message *
            </label>
            <textarea
              name="message"
              placeholder="Write a personal message for when the capsule unlocks..."
              value={formData.message}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            ></textarea>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Theme *
            </label>
            <select
              name="theme"
              value={formData.theme}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              required
            >
              <option value="">Select a theme</option>
              <option value="childhood">🧸 Childhood</option>
              <option value="family">👨‍👩‍👧‍👦 Family</option>
              <option value="love">💕 Love & Relationships</option>
              <option value="travel">✈️ Travel & Adventures</option>
              <option value="milestones">🎓 Milestones</option>
              <option value="memories">📸 Memories</option>
              <option value="other">📝 Other</option>
            </select>
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Privacy Level
            </label>
            <select
              name="privacy"
              value={formData.privacy}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="private">🔒 Private (Only recipients)</option>
              <option value="recipients">👥 Recipients Only</option>
              <option value="public">🌍 Public</option>
            </select>
          </div>

          {/* Unlock Type */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Unlock Type *
            </label>
            <select
              name="unlockType"
              value={formData.unlockType}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              required
            >
              <option value="date">📅 Specific Date</option>
              <option value="event">🎉 Event-based</option>
            </select>
          </div>

          {/* Unlock Date */}
          {formData.unlockType === "date" && (
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                Unlock Date *
              </label>
              <input
                type="date"
                name="unlockDate"
                value={formData.unlockDate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                required={formData.unlockType === "date"}
              />
            </div>
          )}

          {/* Recipients */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              Recipients * (comma separated emails)
            </label>
            <input
              type="text"
              name="recipients"
              placeholder="john@example.com, jane@example.com"
              value={formData.recipients}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              required
            />
          </div>

          {/* NEW: Media Upload */}
          <div>
            <label className="block text-slate-300 font-medium mb-2">
              📸 Add Media (Images, Videos, Audio)
            </label>
            <div className="bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-500 transition">
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleMediaSelect}
                disabled={uploadingMedia}
                className="hidden"
                id="media-input"
              />
              <label htmlFor="media-input" className="cursor-pointer">
                <p className="text-slate-300 font-medium">
                  {uploadingMedia ? "Uploading..." : "Click to upload or drag files"}
                </p>
                <p className="text-slate-500 text-sm">
                  Supported: JPG, PNG, MP4, WebM, MP3, WAV
                </p>
              </label>
            </div>
          </div>

          {/* Media Preview */}
          {mediaPreview.length > 0 && (
            <div>
              <label className="block text-slate-300 font-medium mb-2">
                📋 Uploaded Media ({mediaPreview.length})
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {mediaPreview.map((media, index) => (
                  <div key={index} className="relative bg-slate-800 rounded-lg overflow-hidden group">
                    {media.type === "image" ? (
                      <img
                        src={media.url}
                        alt={media.name}
                        className="w-full h-32 object-cover"
                      />
                    ) : media.type === "video" ? (
                      <video
                        src={media.url}
                        className="w-full h-32 object-cover"
                        controls
                      />
                    ) : (
                      <div className="w-full h-32 flex items-center justify-center bg-purple-900">
                        🎵 Audio
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || uploadingMedia}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg transition"
          >
            {loading ? "Creating Capsule..." : "🎁 Create Capsule"}
          </button>
        </form>
      </div>
    </main>
  );
};

