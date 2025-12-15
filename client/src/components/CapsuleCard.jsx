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
            <button className="mt-4 text-cyan-400 hover:underline">View Capsule →</button>
        </article>
    );
};