import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CapsuleCard } from "../components/CapsuleCard";
import { Helmet } from "react-helmet-async";

export const Dashboard = () => {
  const [capsules, setCapsules] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unlocked, locked
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCapsules();
  }, [filter]);

  const fetchCapsules = async () => {
    try {
      setLoading(true);
      const queryParam = filter !== "all" ? `?filter=${filter}` : "";
      const res = await fetch(`http://localhost:5000/api/capsules${queryParam}`, {
      headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
     },
   });
      if (!res.ok) {
        throw new Error("Failed to fetch capsules");
      }
      
      const data = await res.json();
      setCapsules(data);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
      setCapsules([]);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    navigate("/login");
  }

  return (
    <main className="min-h-screen bg-slate-950 p-8">
      <Helmet>
        <title>MemoryLane | Digital Time Capsule Platform</title>
        <meta
          name="description"
          content="Preserve family memories as digital time capsules that unlock in the future."
        />
      </Helmet>

      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
            🎁 MemoryLane
          </h1>
          <p className="text-slate-400">Digital Time Capsule Platform</p>
        </div>
        <div className="flex gap-10">
          <Link
          to="/create"
          className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg"
        >
          + Create Capsule
        </Link>
        <button onClick={handleLogout}className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold text-white transition shadow-lg"
         >Logout
        </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="mb-8 flex gap-3 flex-wrap">
        {["all", "locked", "unlocked"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === f
                ? "bg-cyan-500 text-white"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700"
            }`}
          >
            {f === "all" && "📦 All Capsules"}
            {f === "locked" && "🔒 Locked"}
            {f === "unlocked" && "✅ Unlocked"}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-6">
          ❌ Error: {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-slate-300 text-lg">⏳ Loading capsules...</p>
        </div>
      )}

      {/* Capsules Grid */}
      {!loading && (
        <>
          {capsules.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capsules.map((capsule) => (
                <CapsuleCard key={capsule._id} capsule={capsule} />
              ))}
            </section>
          ) : (
            <div className="text-center py-12 bg-slate-800 rounded-lg">
              <p className="text-slate-400 text-lg">
                {filter === "all"
                  ? "No capsules yet. Create one to get started! 🚀"
                  : `No ${filter} capsules yet.`}
              </p>
              <Link
                to="/create"
                className="text-cyan-400 hover:underline mt-4 inline-block"
              >
                Create your first capsule →
              </Link>
            </div>
          )}
        </>
      )}
    </main>
  );
};