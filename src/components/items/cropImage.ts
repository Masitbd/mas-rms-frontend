import { Area } from "react-easy-crop";

export const getCroppedImg = (imageSrc: string, crop: Area): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      // Set canvas size to crop dimensions
      canvas.width = crop.width;
      canvas.height = crop.height;

      // Draw cropped image on canvas
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
      const mimeType = imageSrc.startsWith("data:image/png")
        ? "image/png"
        : "image/jpeg";

      // Convert canvas to blob URL
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob); // Blob URL for cropped image
          } else {
            reject(new Error("Failed to create blob"));
          }
        },
        mimeType,
        0.1
      );
    };
    image.onerror = (error) => reject(error);
  });
};
