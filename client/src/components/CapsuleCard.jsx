import { CountdownTimer } from "./CountdownTimer";
import { ThemeBadge } from "./ThemeBadge";
import { Link } from "react-router-dom";

export const CapsuleCard = ({capsule})=>{
    // NEW: Determine if capsule is unlocked
    const isUnlocked = capsule.unlocked || (capsule.unlockDate && new Date(capsule.unlockDate) <= new Date());

    return(
        <article className={`${isUnlocked ? 'bg-gradient-to-br from-green-900 to-slate-900' : 'bg-gradient-to-br from-slate-900 to-slate-800'} p-6 rounded-xl shadow-lg hover:shadow-2xl transition border ${isUnlocked ? 'border-green-700' : 'border-slate-700'}`}>
            
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <ThemeBadge theme={capsule.theme} />
                {isUnlocked && <span className="text-green-400 font-semibold text-sm">✅ Unlocked</span>}
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold mt-2 text-cyan-400 line-clamp-2">{capsule.title}</h2>
            
            {/* Created By */}
            <p className="text-slate-500 text-xs mt-1">
                Created by: {capsule.createdBy || "Unknown"}
            </p>

            {/* Unlock Info */}
            <p className="text-slate-400 text-sm mt-2">
                📅 {new Date(capsule.unlockDate).toDateString()}
            </p>

            {/* Countdown Timer */}
            <div className="mt-3">
                <CountdownTimer unlockDate={capsule.unlockDate}/>
            </div>

            {/* Media Preview */}
            {capsule.media && capsule.media.length > 0 && (
                <div className="mt-4 rounded-lg overflow-hidden">
                    {capsule.media[0].resource_type === "image" || capsule.media[0].type === "image" ? (
                        <img
                            src={capsule.media[0].url}
                            alt="Capsule media"
                            className="w-full h-40 object-cover hover:scale-105 transition"
                        />
                    ) : capsule.media[0].resource_type === "video" || capsule.media[0].type === "video" ? (
                        <video
                            src={capsule.media[0].url}
                            className="w-full h-40 object-cover"
                        />
                    ) : (
                        <div className="w-full h-40 bg-purple-900 flex items-center justify-center">
                            <span className="text-2xl">🎵</span>
                        </div>
                    )}
                    {capsule.media.length > 1 && (
                        <p className="text-slate-400 text-xs p-2 bg-slate-800">
                            +{capsule.media.length - 1} more media
                        </p>
                    )}
                </div>
            )}

            {/* Footer */}
            <div className="mt-4 flex justify-between items-center">
                <div className="text-slate-500 text-xs">
                    👥 {capsule.recipients?.length || 0} recipient{capsule.recipients?.length !== 1 ? 's' : ''}
                </div>
                <Link
                    to={`/capsule/${capsule._id}`}
                    className="px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white rounded font-medium text-sm transition"
                >
                    View →
                </Link>
            </div>
        </article>
    );
};