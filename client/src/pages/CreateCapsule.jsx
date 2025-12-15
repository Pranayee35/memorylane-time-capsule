import { useState } from "react";

export const CreateCapsule = () => {
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    theme: "",
    unlockType: "date",
    unlockDate: "",
    recipients: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      recipients: formData.recipients.split(","),
    };

    const res = await fetch("http://localhost:5000/api/capsules", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Created capsule:", data);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <input
        name="title"
        placeholder="Title"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <textarea
        name="message"
        placeholder="Message"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="theme"
        placeholder="Theme"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        type="date"
        name="unlockDate"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <input
        name="recipients"
        placeholder="Emails (comma separated)"
        onChange={handleChange}
        className="border p-2 w-full"
      />

      <button className="bg-black text-white px-4 py-2">
        Create Capsule
      </button>
    </form>
  );
};

