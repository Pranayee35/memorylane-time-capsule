import { CountdownTimer } from "./CountdownTimer";
import { ThemeBadge } from "./ThemeBadge";
export const CapsuleCard = ()=>{
    return(
        <article className="bg-slate-900 p-5 rounded-xl shadow">
            <ThemeBadge theme="Family"/>
            <h2 className="text-xl font-semibold mt-2">Letter to My Future Self</h2>
            <p className="text-slate-400 text-sm mt-1">
                Unlocks on <time dateTime="2026-12-25">25 Dec 2026</time>
            </p>
            <CountdownTimer unlockDate="2026-12-25" />
            <button className="mt-4 text-cyan-400 hover:underline">View Capsule →</button>
        </article>
    );
};