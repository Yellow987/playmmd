import { Scene } from "@babylonjs/core/scene";

/**
 * Captures a screenshot from a Babylon.js canvas and returns it as a File object
 * @param canvas - The HTML canvas element from Babylon.js
 * @param scene - The Babylon.js scene (optional, used for ensuring render is complete)
 * @param filename - The filename for the captured image (default: 'screenshot.jpg')
 * @param quality - JPEG quality from 0-1 (default: 0.9)
 * @returns Promise<File> - The captured screenshot as a File object
 */
export const captureCanvasScreenshot = async (
  canvas: HTMLCanvasElement,
  scene?: Scene,
  filename: string = "screenshot.jpg",
  quality: number = 0.9,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    try {
      // Ensure the scene has finished rendering if provided
      if (scene) {
        scene.render();
      }

      // Wait a frame to ensure rendering is complete
      requestAnimationFrame(() => {
        try {
          // Capture the canvas content
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to capture canvas content"));
                return;
              }

              // Convert blob to File object
              const file = new File([blob], filename, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              resolve(file);
            },
            "image/jpeg",
            quality,
          );
        } catch (error) {
          reject(new Error(`Failed to capture screenshot: ${error}`));
        }
      });
    } catch (error) {
      reject(new Error(`Screenshot capture error: ${error}`));
    }
  });
};

/**
 * Optimizes an image file by resizing and compressing it
 * @param file - The input image file
 * @param maxSize - Maximum width/height in pixels (default: 800)
 * @param quality - JPEG quality from 0-1 (default: 0.8)
 * @returns Promise<File> - The optimized image file
 */
export const optimizeImageFile = async (
  file: File,
  maxSize: number = 800,
  quality: number = 0.8,
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = height * (maxSize / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = width * (maxSize / height);
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("Failed to optimize image"));
              return;
            }

            const optimizedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });

            resolve(optimizedFile);
          },
          "image/jpeg",
          quality,
        );
      } catch (error) {
        reject(new Error(`Image optimization failed: ${error}`));
      }
    };

    img.onerror = () => {
      reject(new Error("Failed to load image for optimization"));
    };

    img.src = URL.createObjectURL(file);
  });
};
