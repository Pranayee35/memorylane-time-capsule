import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CountdownTimer } from "../components/CountdownTimer";

export const CapsuleDetails = () => {
  const { id } = useParams();
  const [capsule, setCapsule] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/capsules/${id}`)
      .then(res => res.json())
      .then(data => setCapsule(data))
      .catch(err => console.error(err));
  }, [id]);

  if (!capsule) {
    return <p className="text-white p-6">Loading...</p>;
  }

  const unlocked = new Date() >= new Date(capsule.unlockDate);

  return (
    <main className="min-h-screen bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold">{capsule.title}</h1>

      <p className="text-slate-400 mt-2">
        Theme: <span className="text-cyan-400">{capsule.theme}</span>
      </p>

      {!unlocked && (
        <div className="mt-4">
          <CountdownTimer unlockDate={capsule.unlockDate} />
          <p className="text-red-400 mt-2">
            Capsule is locked 🔒
          </p>
        </div>
      )}

      {unlocked && (
        <>
          <p className="mt-6 text-lg">{capsule.message}</p>

          {capsule.media && capsule.media.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {capsule.media.map((item, idx) =>
                item.resource_type === "image" ? (
                  <img
                    key={idx}
                    src={item.url}
                    className="rounded-lg"
                    alt="capsule media"
                  />
                ) : (
                  <video
                    key={idx}
                    src={item.url}
                    controls
                    className="rounded-lg"
                  />
                )
              )}
            </div>
          )}
        </>
      )}
    </main>
  );
};
