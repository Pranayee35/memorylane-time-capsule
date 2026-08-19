import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CountdownTimer } from "../components/CountdownTimer";
import { ThemeBadge } from "../components/ThemeBadge";

export const CapsuleDetails = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [selectedReaction, setSelectedReaction] = useState(null);
const isLoggedIn = !!localStorage.getItem("userEmail");
  // Emoji reactions available
  const reactionEmojis = ["❤️", "😂", "😍", "🔥", "👏", "🎉"];

  useEffect(() => {
    fetchCapsule();
  }, [token]);

  const fetchCapsule = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/api/capsules/access/${token}`);

      if (!res.ok) {
        throw new Error("Capsule not found");
      }

      const data = await res.json();
      setCapsule(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    setCommentError("");

    if (!newComment.trim()) {
      setCommentError("Please write a comment");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/capsules/${capsule._id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          text: newComment,
       }),
      });

      if (!res.ok) {
        throw new Error("Failed to add comment");
      }

      const updated = await res.json();
      setCapsule(updated.capsule);
      setNewComment("");
    } catch (err) {
      setCommentError(err.message);
    }
  };

  const handleAddReaction = async (emoji) => {
    try {
      const res = await fetch(`http://localhost:5000/api/capsules/${capsule._id}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          emoji,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to add reaction");
      }

      const updated = await res.json();
      setCapsule(updated.capsule);
      setSelectedReaction(null);
    } catch (err) {
      console.error("Reaction error:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-slate-300 text-lg">⏳ Loading capsule...</p>
        </div>
      </main>
    );
  }

  if (error || !capsule) {
    return (
      <main className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-red-400 text-lg">❌ {error || "Capsule not found"}</p>
          <Link to="/" className="text-cyan-400 hover:underline mt-4 inline-block">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <Helmet>
        <title>{capsule.title} | MemoryLane</title>
      </Helmet>

      <Link to="/" className="text-cyan-400 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <article className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <ThemeBadge theme={capsule.theme} />
              <h1 className="text-4xl font-bold text-cyan-400 mt-4">{capsule.title}</h1>
              <p className="text-slate-400 text-sm mt-2">
                Created by: <span className="text-slate-200">{capsule.createdBy}</span>
              </p>
            </div>
            <div className="text-right">
              {capsule.privacy === "public" && <span className="text-cyan-400">🌍 Public</span>}
              {capsule.privacy === "private" && <span className="text-red-400">🔒 Private</span>}
              {capsule.privacy === "recipients" && <span className="text-blue-400">👥 Recipients</span>}
            </div>
          </div>

          {/* Countdown or Unlocked Badge */}
          <div className="mb-6">
            {capsule.unlocked ? (
              <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
                ✅ This capsule has been unlocked!
              </div>
            ) : (
              <CountdownTimer unlockDate={capsule.unlockDate} />
            )}
          </div>

          {/* Message */}
          <div className="bg-slate-800 bg-opacity-50 border-l-4 border-cyan-400 p-4 rounded mb-6">
            <p className="text-slate-200 text-lg leading-relaxed">{capsule.message}</p>
          </div>

          {/* Unlock Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400">Unlock Type</p>
              <p className="text-slate-100 font-semibold">
                {capsule.unlockType === "date" ? "📅 Specific Date" : "🎉 Event-based"}
              </p>
            </div>
            {capsule.unlockType === "date" && (
              <div>
                <p className="text-slate-400">Unlock Date</p>
                <p className="text-slate-100 font-semibold">
                  {new Date(capsule.unlockDate).toDateString()}
                </p>
              </div>
            )}
          </div>
        </article>

        {/* Media Section */}
        {capsule.media && capsule.media.length > 0 && (
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">📸 Memories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {capsule.media.map((media, index) => (
                <div key={index} className="rounded-lg overflow-hidden shadow-lg">
                  {media.type === "image" || media.resource_type === "image" ? (
                    <img
                      src={media.url}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-64 object-cover hover:scale-105 transition"
                    />
                  ) : media.type === "video" || media.resource_type === "video" ? (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-purple-900 flex items-center justify-center">
                      <audio
                        src={media.url}
                        controls
                        className="w-full h-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Interactions - Only if Unlocked */}
        {capsule.unlocked && isLoggedIn && (
          <>
            {/* Reactions */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Reactions</h2>

              {/* Current Reactions */}
              {capsule.reactions && capsule.reactions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {capsule.reactions.map((reaction, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddReaction(reaction.emoji)}
                      className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full flex items-center gap-2 transition border border-slate-700"
                    >
                      <span className="text-2xl">{reaction.emoji}</span>
                      <span className="text-slate-300">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Add Reaction */}
              <div className="flex flex-wrap gap-2">
                {reactionEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAddReaction(emoji)}
                    className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg text-2xl transition border border-slate-700"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </section>

            {/* Comments */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">💬 Comments</h2>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  rows="3"
                />
                {commentError && (
                  <p className="text-red-400 text-sm mt-2">{commentError}</p>
                )}
                <button
                  type="submit"
                  className="mt-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Post Comment
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {capsule.comments && capsule.comments.length > 0 ? (
                  capsule.comments.map((comment, index) => (
                    <div key={index} className="bg-slate-800 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-cyan-400">{comment.createdBy}</p>
                        <p className="text-slate-500 text-sm">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-slate-200">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center py-4">No comments yet. Be the first!</p>
                )}
              </div>
            </section>
          </>
        )}
        {capsule.unlocked && !isLoggedIn && (
  <section className="bg-slate-800 rounded-lg p-6 mb-8 text-center">
    <h2 className="text-xl font-bold text-cyan-400 mb-2">
      💬 Want to interact with this memory?
    </h2>

    <p className="text-slate-400 mb-4">
      Register or login to comment, react, and collaborate.
    </p>

    <div className="flex justify-center gap-4">
      <Link
        to="/login"
        state={{from: `/capsule/access/${token}`}}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg"
      >
        Login
      </Link>

      <Link
        to="/register"
        state={{from: `/capsule/access/${token}`}}
        className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg"
      >
        Register
      </Link>
    </div>
  </section>
)}

        {/* Recipients Info */}
        <section className="bg-slate-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-slate-300 mb-3">👥 Recipients</h3>
          <div className="flex flex-wrap gap-2">
            {capsule.recipients.map((recipient, index) => (
              <span
                key={index}
                className="bg-cyan-500 bg-opacity-20 text-cyan-300 px-3 py-1 rounded-full text-sm"
              >
                {recipient}
              </span>
            ))}
          </div>

          {capsule.collaborators && capsule.collaborators.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-slate-300 mb-2">Collaborators</h4>
              <div className="flex flex-wrap gap-2">
                {capsule.collaborators.map((collab, index) => (
                  <span
                    key={index}
                    className="bg-purple-500 bg-opacity-20 text-purple-300 px-3 py-1 rounded-full text-sm"
                  >
                    {collab}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};
                   