import { CountdownTimer } from "./CountdownTimer";
import { ThemeBadge } from "./ThemeBadge";
export const CapsuleCard = ()=>{
    return(
        <article>
            <ThemeBadge/>
            <h2>Letter to My Future Self</h2>
            <p>
                Unlocks on <time dateTime="2026-12-25">25 Dec 2026</time>
            </p>
            <CountdownTimer unlockDate="2026-12-25" />
            <button>View Capsule →</button>
        </article>
    );
};