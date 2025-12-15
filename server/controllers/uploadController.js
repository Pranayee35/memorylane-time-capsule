import cloudinary from "../utils/cloudinary.js";

export const uploadMedia = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "memorylane",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      stream.end(file.buffer);
    });

    res.status(200).json({
      url: result.secure_url,
      type: result.resource_type,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
