import React, { MutableRefObject, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const toast = useToast();

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
      const img = new Image();
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
    function showErrorToast(description: string) {
      toast({
        title: "Error",
        description,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
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
    }
  };

  return (
    <Box w="400px" p="4" borderWidth="1px" borderRadius="md" boxShadow="sm">
      <form onSubmit={handleSubmit}>
        {previewUrl && (
          <Box mb="4">
            <img
              src={previewUrl}
              alt="Thumbnail preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                borderRadius: "4px",
              }}
            />
          </Box>
        )}

        <FormControl mb="4">
          <FormLabel>Thumbnail Image</FormLabel>
          <Input type="file" accept="image/*" onChange={handleChange} p={1} />
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

        <Button type="submit" colorScheme="teal" width="full">
          Submit
        </Button>
      </form>
      <canvas ref={canvasRef} style={{ width: "0px", height: "0px" }} />
    </Box>
  );
};

export default ModelPublisher;
