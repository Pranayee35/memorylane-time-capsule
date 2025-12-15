import { CountdownTimer } from "./CountdownTimer";
import { ThemeBadge } from "./ThemeBadge";
export const CapsuleCard = ({capsule})=>{
    return(
        <article className="bg-slate-900 p-5 rounded-xl shadow">
             <ThemeBadge theme={capsule.theme} />
            <h2 className="text-xl font-semibold mt-2 text-cyan-400">{capsule.title}</h2>
            <p className="text-slate-400 text-sm mt-1">
                Unlocks on {new Date(capsule.unlockDate).toDateString()}
            </p>
            <CountdownTimer unlockDate={capsule.unlockDate}/>
             {capsule.media && capsule.media.length > 0 && (
        <div className="mt-3">
          {capsule.media[0].resource_type === "image" ? (
            <img
              src={capsule.media[0].url}
              alt="Capsule media"
              className="rounded-lg w-full h-40 object-cover"
            />
          ) : (
            <video
              src={capsule.media[0].url}
              controls
              className="rounded-lg w-full h-40 object-cover"
            />
          )}
        </div>
      )}
            <Link
        to={`/capsule/${capsule._id}`}
        className="mt-4 inline-block text-cyan-400 hover:underline"
      >
        View Capsule →
      </Link>
        </article>
    );
};