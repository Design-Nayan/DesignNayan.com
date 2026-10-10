/**
 * Resizes and compresses images using HTML5 Canvas before uploading
 * or saving to localStorage, converting large files to optimized WebP.
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 to 1.0 (default: 0.85)
  format?: "image/webp" | "image/jpeg";
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.85,
  format: "image/webp",
};

/**
 * Compresses an image File and returns a compact DataURL string (e.g. data:image/webp;base64,...)
 * Non-image files (like MP4 videos) are passed through safely without modification.
 */
export async function compressImageToDataUrl(
  file: File,
  options: CompressionOptions = {}
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number }> {
  // If not an image (e.g. video files), read as standard data URL without altering
  if (!file.type.startsWith("image/")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () =>
        resolve({
          dataUrl: reader.result as string,
          originalSize: file.size,
          compressedSize: file.size,
        });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const config = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      let { width, height } = img;
      const maxWidth = config.maxWidth || 1920;
      const maxHeight = config.maxHeight || 1920;

      // Calculate proportional dimensions maintaining exact aspect ratio
      if (width > maxWidth || height > maxHeight) {
        if (width / height > maxWidth / maxHeight) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // Draw onto off-screen canvas with high smoothing
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // Fallback if canvas context fails
        const reader = new FileReader();
        reader.onload = () =>
          resolve({
            dataUrl: reader.result as string,
            originalSize: file.size,
            compressedSize: file.size,
          });
        reader.readAsDataURL(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Determine export format (prefer webp, fallback to jpeg)
      const format = config.format || "image/webp";
      let dataUrl = canvas.toDataURL(format, config.quality);

      // If browser doesn't support webp export, fall back to jpeg
      if (format === "image/webp" && !dataUrl.startsWith("data:image/webp")) {
        dataUrl = canvas.toDataURL("image/jpeg", config.quality);
      }

      // Calculate approximate compressed size in bytes from base64 length
      const base64Content = dataUrl.split(",")[1] || "";
      const compressedBytes = Math.round((base64Content.length * 3) / 4);

      resolve({
        dataUrl,
        originalSize: file.size,
        compressedSize: compressedBytes,
      });
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}

/**
 * Human-readable byte size formatter (e.g. "8.4 MB" -> "245 KB")
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}
