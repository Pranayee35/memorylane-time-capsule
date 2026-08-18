import { useEffect, useState } from "react";

export const CountdownTimer = ({unlockDate}) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isUnlocked: false
    });

    useEffect(() => {
        // Set interval to update every second
        const interval = setInterval(() => {
            const now = new Date();
            const unlock = new Date(unlockDate);
            const diff = unlock - now;

            if (diff <= 0) {
                setTimeLeft({
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0,
                    isUnlocked: true
                });
                clearInterval(interval);
            } else {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                setTimeLeft({
                    days,
                    hours,
                    minutes,
                    seconds,
                    isUnlocked: false
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [unlockDate]);

    if (timeLeft.isUnlocked) {
        return (
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-2 rounded-lg font-semibold text-center">
                🎉 Unlocked! Ready to view
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium">
            <div className="flex items-center justify-between gap-2">
                <span>⏳ Time until unlock:</span>
                <div className="flex gap-1 text-xs font-bold">
                    <div className="bg-black bg-opacity-30 px-2 py-1 rounded">
                        {timeLeft.days}d
                    </div>
                    <div className="bg-black bg-opacity-30 px-2 py-1 rounded">
                        {String(timeLeft.hours).padStart(2, '0')}h
                    </div>
                    <div className="bg-black bg-opacity-30 px-2 py-1 rounded">
                        {String(timeLeft.minutes).padStart(2, '0')}m
                    </div>
                    <div className="bg-black bg-opacity-30 px-2 py-1 rounded">
                        {String(timeLeft.seconds).padStart(2, '0')}s
                    </div>
                </div>
            </div>
        </div>
    );
};