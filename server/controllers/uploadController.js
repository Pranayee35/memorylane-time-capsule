import cloudinary from "../utils/cloudinary.js";

export const uploadMedia = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const uploadResult = await cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "memorylane",
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Upload failed", error });
        }

        res.status(200).json({
          url: result.secure_url,
          type: result.resource_type,
        });
      }
    );

    uploadResult.end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
