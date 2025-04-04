import { downloadData, getUrl, uploadData } from "aws-amplify/storage";
import { ASSET_TYPE } from "../mmd-generator/components/AssetChooser/MmdAssetChooserModal";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";

export async function downloadFromAmplifyStorageAsUrl(
  filePath: string,
): Promise<string> {
  return getUrlFromPath(filePath);
}

export async function downloadFromAmplifyStorageAsFile(
  filePath: string,
  fileName: string,
): Promise<File> {
  let blob;
  try {
    const downloadResult = await downloadData({
      path: filePath,
    }).result;
    blob = await downloadResult.body.blob();
    console.log("Succeed: ", blob);
  } catch (error) {
    console.log("Error : ", error);
  }

  if (!blob) {
    throw new Error("Failed to download blob");
  }

  triggerDownloadFromBlob(blob, fileName);

  return new File([blob], fileName, { type: "application/octet-stream" });
}

async function getUrlFromPath(path: string): Promise<string> {
  const url = await getUrl({
    path: path,
  }).then((result) => {
    return result.url.toString();
  });
  return url;
}

export function triggerDownloadFromBlob(blob: Blob, fileName: string): void {
  // Create a URL for the Blob
  const url = URL.createObjectURL(blob);

  // Create an anchor element
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName; // Set the filename for the downloaded file

  // Append the anchor to the document
  document.body.appendChild(anchor);

  // Programmatically click the anchor to trigger the download
  anchor.click();

  // Clean up by removing the anchor and revoking the object URL
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export async function uploadFileToAmplifyStorage(
  fileName: string,
  assetType: ASSET_TYPE,
  file: File,
  folderPath?: string,
): Promise<string> {
  let uuid: string;
  if (!folderPath) uuid = uuidv4();

  const result = await uploadData({
    path: ({ identityId }) => {
      const path = folderPath
        ? `${folderPath}/${fileName}`
        : `${assetType.toLocaleLowerCase()}/${identityId}/${uuid}/${fileName}`;
      console.log("path: ", path);
      return path;
    },
    data: file,
  }).result;

  if (folderPath) {
    return folderPath;
  } else {
    return (folderPath = result.path.substring(
      0,
      result.path.lastIndexOf("/"),
    ));
  }
}

/**
 * Downloads a zip file from Amplify Storage, extracts it, and returns the extracted files
 * @param zipFilePath Path to the zip file in Amplify Storage
 * @returns Promise resolving to an array of extracted files
 */
export async function downloadAndExtractZip(
  zipFilePath: string,
): Promise<File[]> {
  try {
    // Download the zip file
    const downloadResult = await downloadData({
      path: zipFilePath,
    }).result;

    const zipBlob = await downloadResult.body.blob();

    // Load the zip file
    const zip = await JSZip.loadAsync(zipBlob);

    // Extract all files
    const extractedFiles: File[] = [];
    const filePromises: Promise<void>[] = [];

    zip.forEach((relativePath, zipEntry) => {
      if (!zipEntry.dir) {
        const promise = zipEntry.async("blob").then((blob) => {
          const file = new File([blob], zipEntry.name, {
            type: getMimeType(zipEntry.name),
            lastModified: zipEntry.date.getTime(),
          });

          // Add webkitRelativePath property to maintain folder structure
          Object.defineProperty(file, "webkitRelativePath", {
            writable: true,
            value: relativePath,
          });

          extractedFiles.push(file);
        });

        filePromises.push(promise);
      }
    });

    // Wait for all files to be extracted
    await Promise.all(filePromises);

    return extractedFiles;
  } catch (error) {
    console.error("Error downloading and extracting zip:", error);
    throw new Error("Failed to download and extract zip file");
  }
}

/**
 * Gets the MIME type based on file extension
 * @param filename The filename to check
 * @returns The MIME type string
 */
function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "pmx":
    case "pmd":
      return "application/octet-stream";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "tga":
      return "image/x-tga";
    case "bmp":
      return "image/bmp";
    case "spa":
    case "sph":
      return "application/octet-stream";
    default:
      return "application/octet-stream";
  }
}
