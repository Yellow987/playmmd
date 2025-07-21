import React, { MutableRefObject, useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Flex,
  Text,
  Image,
} from "@chakra-ui/react";
import { Schema } from "../../../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getUrl, uploadData } from "aws-amplify/storage";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { localAssets } from "../../MmdViewer";
import { getCurrentUser } from "aws-amplify/auth";
import { Engine, loadAssetContainerAsync, Scene } from "@babylonjs/core";
import { MmdMesh, MmdStandardMaterial } from "babylon-mmd";
import { getMaterialBuilder } from "../../babylon/mmdHooks/useMmdModels";
import { triggerDownloadFromBlob } from "@/app/amplifyHandler/amplifyHandler";
import { TextureAlphaChecker } from "babylon-mmd/esm/Loader/textureAlphaChecker";
import JSZip from "jszip";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface Props {
  mmdMeshRef: MutableRefObject<MmdMesh | null>;
  sceneRef: MutableRefObject<Scene | null>;
  localFilesRef: MutableRefObject<localAssets[]>;
}

const ModelPublisher = (props: Props) => {
  const { mmdMeshRef, sceneRef, localFilesRef } = props;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    credits: "",
    isR_18: false,
    thumbnail: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [capturedPreviewUrl, setCapturedPreviewUrl] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const toast = useToast();

  // Get captured screenshot from Redux store
  const { capturedScreenshotFile, capturedScreenshotDataUrl, capturedAt } =
    useSelector((state: RootState) => state.screenshot);

  // Set captured screenshot as default thumbnail when component mounts or screenshot updates
  useEffect(() => {
    if (capturedScreenshotFile && capturedScreenshotDataUrl) {
      // Use the data URL directly for display
      setCapturedPreviewUrl(capturedScreenshotDataUrl);

      // Only set as form thumbnail if user hasn't manually selected one
      if (
        !formData.thumbnail ||
        formData.thumbnail === capturedScreenshotFile
      ) {
        setFormData((prev) => ({ ...prev, thumbnail: capturedScreenshotFile }));
      }
    } else {
      setCapturedPreviewUrl(null);
    }
  }, [capturedScreenshotFile, capturedScreenshotDataUrl]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    if (e.target instanceof HTMLInputElement && e.target.type === "file") {
      const file = e.target.files?.[0];
      if (file) {
        optimizeImage(file).then((optimizedFile) => {
          setFormData((prev) => ({ ...prev, thumbnail: optimizedFile }));
          // Create preview URL
          const url = URL.createObjectURL(optimizedFile);
          setPreviewUrl(url);
        });
      }
      return;
    }
    const { name, value, type } = e.target;

    // Type guard for checkbox input
    const fieldValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  async function createModelZip(files: File[]): Promise<Blob> {
    const zip = new JSZip();

    // Add all files to the zip, preserving directory structure
    for (const file of files) {
      // Use the webkitRelativePath to maintain folder structure
      const relativePath = file.webkitRelativePath || file.name;
      // Add file to zip
      zip.file(relativePath, file);
    }

    // Generate the zip file
    return await zip.generateAsync({ type: "blob" });
  }

  const arrayBufferToFile = (
    arrayBuffer: ArrayBuffer,
    fileName: string,
  ): File => {
    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
    return new File([blob], fileName, { type: "application/octet-stream" });
  };

  const client = generateClient<Schema>();
  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = document.createElement("img") as HTMLImageElement;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        // Target dimensions (max 800x800 while maintaining aspect ratio)
        const maxSize = 800;
        let width = img.width;
        let height = img.height;

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
            const optimizedFile = new File([blob!], "thumbnail.jpg", {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(optimizedFile);
          },
          "image/jpeg",
          0.8,
        ); // 80% quality JPEG
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    function showErrorToast(description: string) {
      toast({
        title: "Error",
        description,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setIsSubmitting(false);
    }

    if (!formData.title || !formData.credits) {
      showErrorToast("Title and credits are required.");
      return;
    }

    // Get all files from localFilesRef
    if (!localFilesRef.current || localFilesRef.current.length === 0) {
      showErrorToast("No model files found. Please upload a model first.");
      return;
    }

    const { referenceFiles } = localFilesRef.current[0];

    try {
      // Create zip file
      const zipBlob = await createModelZip(referenceFiles);
      const zipFile = new File([zipBlob], `${formData.title}.zip`, {
        type: "application/zip",
      });

      // Upload zip file
      const modelResult = await uploadData({
        path: ({ identityId }) =>
          `models/${identityId}/${formData.title}/${formData.title}.zip`,
        data: zipFile,
      }).result;
      console.log("Model upload succeeded: ", modelResult);

      // Upload thumbnail if exists
      if (formData.thumbnail) {
        await uploadData({
          path: ({ identityId }) =>
            `models/${identityId}/${formData.title}/thumbnail.jpg`,
          data: formData.thumbnail,
        }).result;
        console.log("Thumbnail upload succeeded");
      }

      // Get the folder path from the model result
      if (!modelResult) {
        showErrorToast("Failed to get upload result.");
        return;
      }

      const folderPath = modelResult.path.substring(
        0,
        modelResult.path.lastIndexOf("/"),
      );

      const { username } = await getCurrentUser();
      const { errors, data: newTodo } = await client.models.Models.create(
        {
          uploaderUsername: username,
          title: formData.title,
          description: formData.description,
          credits: formData.credits,
          pathToFiles: folderPath,
          isR_18: formData.isR_18,
        },
        {
          authMode: "userPool",
        },
      );

      if (errors) {
        showErrorToast("Failed to submit model.");
        return;
      }

      toast({
        title: "Success",
        description: "Model submitted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error during operation:", error);
      showErrorToast("Failed to upload files or create database entry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex w="full" h="full" gap={6}>
      {/* Left side - Form */}
      <Box w="50%" p="4" borderWidth="1px" borderRadius="md" boxShadow="sm">
        <form onSubmit={handleSubmit}>
          {(previewUrl || capturedPreviewUrl) && (
            <Box mb="4">
              <Text fontSize="sm" mb="2" color="gray.600">
                Current Thumbnail Preview:
              </Text>
              <Image
                src={previewUrl || capturedPreviewUrl || ""}
                alt="Thumbnail preview"
                maxW="100%"
                maxH="200px"
                objectFit="contain"
                borderRadius="4px"
                border="1px solid"
                borderColor="gray.200"
              />
            </Box>
          )}

          <FormControl mb="4">
            <FormLabel>Thumbnail Image</FormLabel>
            <Input type="file" accept="image/*" onChange={handleChange} p={1} />
            {capturedScreenshotFile && (
              <Text fontSize="xs" color="green.600" mt="1">
                Using captured screenshot as default (you can override by
                selecting a file)
              </Text>
            )}
          </FormControl>

          <FormControl isRequired mb="4">
            <FormLabel>Title</FormLabel>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter title"
            />
          </FormControl>

          <FormControl mb="4">
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
            />
          </FormControl>

          <FormControl isRequired mb="4">
            <FormLabel>Credits</FormLabel>
            <Input
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              placeholder="Enter credits"
            />
          </FormControl>

          <FormControl display="flex" alignItems="center" mb="4">
            <Checkbox
              name="isR_18"
              isChecked={formData.isR_18}
              onChange={handleChange}
            >
              R-18 Content
            </Checkbox>
          </FormControl>

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isSubmitting}
            loadingText="Uploading..."
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </form>
        <canvas ref={canvasRef} style={{ width: "0px", height: "0px" }} />
      </Box>

      {/* Right side - Captured Screenshot Display */}
      <Box w="50%" p="4" borderWidth="1px" borderRadius="md" boxShadow="sm">
        <Text fontSize="lg" fontWeight="bold" mb="4">
          Captured Screenshot
        </Text>

        {capturedScreenshotFile && capturedPreviewUrl ? (
          <Box>
            <Image
              src={capturedPreviewUrl}
              alt="Captured screenshot"
              w="100%"
              maxH="400px"
              objectFit="contain"
              borderRadius="4px"
              border="1px solid"
              borderColor="gray.200"
            />
            <Text fontSize="sm" color="gray.600" mt="2">
              Captured:{" "}
              {capturedAt
                ? new Date(capturedAt).toLocaleString()
                : "Unknown time"}
            </Text>
            <Text fontSize="sm" color="blue.600" mt="1">
              This screenshot will be used as the default thumbnail for your
              model.
            </Text>
          </Box>
        ) : (
          <Box
            w="100%"
            h="400px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="gray.50"
            borderRadius="4px"
            border="2px dashed"
            borderColor="gray.300"
          >
            <Box textAlign="center">
              <Text color="gray.500" fontSize="lg" mb="2">
                📸 No Screenshot Captured
              </Text>
              <Text color="gray.400" fontSize="sm">
                Pause the animation at your desired frame and click the camera
                button to capture a screenshot
              </Text>
            </Box>
          </Box>
        )}
      </Box>
    </Flex>
  );
};

export default ModelPublisher;
