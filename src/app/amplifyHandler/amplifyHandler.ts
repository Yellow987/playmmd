import { downloadData } from "aws-amplify/storage";

export async function downloadFromAmplifyStorageAsFile(
  filePath: string,
): Promise<string> {
  let blob;
  try {
    const downloadResult = await downloadData({
      path: filePath,
    }).result;
    blob = await downloadResult.body.blob();
    // Alternatively, you can use `downloadResult.body.blob()`
    // or `downloadResult.body.json()` get read body in Blob or JSON format.
    console.log("Succeed: ", blob);
  } catch (error) {
    console.log("Error : ", error);
  }

  if (!blob) {
    throw new Error("Failed to download blob");
  }

  triggerDownloadFromBlob(blob, "model.bmpx");

  return URL.createObjectURL(blob);
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

// export async function downloadFromAmplifyStorageAsFile(
//   filePath: string,
// ): Promise<File> {
//   let blob;
//   try {
//     const downloadResult = await downloadData({
//       path: ({ identityId }) => `models/${identityId}/model.bmpx`,
//     }).result;
//     blob = await downloadResult.body.blob();
//     // Alternatively, you can use `downloadResult.body.blob()`
//     // or `downloadResult.body.json()` get read body in Blob or JSON format.
//     console.log("Succeed: ", blob);
//   } catch (error) {
//     console.log("Error : ", error);
//   }
//   return new File([blob!], "awsmodelfile", { type: blob!.type });
// }
