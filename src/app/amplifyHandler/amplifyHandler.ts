import { downloadData, getUrl } from "aws-amplify/storage";

export async function downloadFromAmplifyStorageAsFile(
  filePath: string,
): Promise<string> {
  return getUrlFromPath(filePath);
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

  // triggerDownloadFromBlob(blob, "model.bpmx");

  // return new File([blob], "model", { type: "application/octet-stream" });
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
