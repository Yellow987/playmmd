// getModelFile.ts
/**
 * Fetches a file from the given URL and returns it as an object of type `File`.
 *
 * @param url - The URL of the file to download.
 * @param fileName - The desired name for the returned `File` object.
 * @returns A Promise that resolves to a `File` object.
 */
export async function getModelFile(
  url: string,
  fileName: string,
): Promise<File> {
  try {
    // Fetch the file data from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    // Convert the response to a Blob object
    const fileBlob = await response.blob();

    // Create a File object using the Blob and the given file name
    return new File([fileBlob], fileName, { type: fileBlob.type });
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error; // Propagate the error for error handling in the calling code
  }
}
