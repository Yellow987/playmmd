import React, { useState, useEffect, FC, useRef } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Image,
} from "@chakra-ui/react";
import { Schema } from "../../../../amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { getUrl, uploadData, remove } from "aws-amplify/storage";
import { ASSET_TYPE } from "./AssetChooser/MmdAssetChooserModal";

interface Props {
  asset: Schema["Models"]["type"] | Schema["Motions"]["type"];
  assetType: ASSET_TYPE;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onDelete?: () => void;
}

const AssetEditor: FC<Props> = (props) => {
  const { asset, assetType, isOpen, onClose, onSuccess, onDelete } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    credits: "",
    isR_18: false,
    thumbnail: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle modal close
  const handleClose = () => {
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  // Cleanup preview URL when component unmounts or when a new URL is set
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  const client = generateClient<Schema>();

  // Initialize form data when asset changes
  useEffect(() => {
    if (asset) {
      setFormData({
        title: asset.title || "",
        description: asset.description || "",
        credits: asset.credits || "",
        isR_18: asset.isR_18 || false,
        thumbnail: null,
      });

      // Load thumbnail preview
      loadThumbnail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset]);

  const loadThumbnail = async () => {
    if (asset?.pathToFiles) {
      try {
        const result = await getUrl({
          path: `${asset.pathToFiles}/thumbnail.jpg`,
        });
        setPreviewUrl(result.url.toString());
      } catch (error) {
        console.log("No thumbnail found for this asset");
        setPreviewUrl(null);
      }
    }
  };

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

  const optimizeImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const img = new window.Image();
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

  const showErrorToast = (description: string) => {
    toast({
      title: "Error",
      description,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.credits) {
        showErrorToast("Title and credits are required.");
        setIsSubmitting(false);
        return;
      }

      // Upload new thumbnail if provided
      if (formData.thumbnail) {
        await uploadData({
          path: `${asset.pathToFiles}/thumbnail.jpg`,
          data: formData.thumbnail,
        }).result;
        console.log("Thumbnail upload succeeded");
      }

      // Update the asset in the database
      const updateData = {
        id: asset.id,
        title: formData.title,
        description: formData.description,
        credits: formData.credits,
        isR_18: formData.isR_18,
      };

      // Add numberOfDancers if it's a Motion asset
      if (assetType === "Motions" && "numberOfDancers" in asset) {
        (updateData as any).numberOfDancers = (
          asset as Schema["Motions"]["type"]
        ).numberOfDancers;
      }
      let errors;

      if (assetType === "Models") {
        const result = await client.models.Models.update(
          updateData as Schema["Models"]["type"],
          {
            authMode: "userPool",
          },
        );
        errors = result.errors;
      } else {
        const result = await client.models.Motions.update(
          updateData as Schema["Motions"]["type"],
          {
            authMode: "userPool",
          },
        );
        errors = result.errors;
      }

      if (errors) {
        showErrorToast("Failed to update asset.");
        console.error("Update errors:", errors);
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Success",
        description: "Asset updated successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onSuccess();
      handleClose();
    } catch (error) {
      console.error("Error during update:", error);
      showErrorToast("Failed to update asset.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${asset.title}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      // 1. Delete all files in S3
      // We'll use a recursive delete approach to clean up all files in the asset's directory
      try {
        // Delete the thumbnail
        await remove({ path: `${asset.pathToFiles}/thumbnail.jpg` });

        // Delete other files based on asset type
        if (assetType === "Models") {
          // Delete the model zip file
          await remove({ path: `${asset.pathToFiles}/${asset.title}.zip` });
        } else if (assetType === "Motions") {
          // Delete motion files
          await remove({ path: `${asset.pathToFiles}/motion1.vmd` });
          await remove({ path: `${asset.pathToFiles}/camera1.vmd` });
          await remove({ path: `${asset.pathToFiles}/song.wav` });
        }
      } catch (error) {
        console.error("Error deleting files from S3:", error);
        // Continue with database deletion even if S3 deletion fails
      }

      // 2. Delete from database
      let errors;
      if (assetType === "Models") {
        const result = await client.models.Models.delete(
          {
            id: asset.id,
          },
          {
            authMode: "userPool",
          },
        );
        errors = result.errors;
      } else {
        const result = await client.models.Motions.delete(
          {
            id: asset.id,
          },
          {
            authMode: "userPool",
          },
        );
        errors = result.errors;
      }

      if (errors) {
        showErrorToast("Failed to delete asset.");
        console.error("Delete errors:", errors);
        setIsDeleting(false);
        return;
      }

      toast({
        title: "Success",
        description: "Asset deleted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      // Call onDelete callback if provided
      if (onDelete) {
        onDelete();
      }

      handleClose();
    } catch (error) {
      console.error("Error during deletion:", error);
      showErrorToast("Failed to delete asset.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit {assetType.slice(0, -1)}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="edit-asset-form" onSubmit={handleSubmit}>
            {previewUrl && (
              <Box mb="4" textAlign="center">
                <Image
                  src={previewUrl}
                  alt="Thumbnail preview"
                  maxH="200px"
                  objectFit="contain"
                  borderRadius="md"
                  mx="auto"
                />
              </Box>
            )}

            <FormControl mb="4">
              <FormLabel>Thumbnail Image</FormLabel>
              <Input
                name="thumbnail"
                type="file"
                accept="image/*"
                onChange={handleChange}
                p={1}
                ref={fileInputRef}
              />
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
          </form>
        </ModalBody>

        <ModalFooter>
          <Flex width="100%" justifyContent="space-between">
            <Button
              colorScheme="red"
              variant="outline"
              onClick={handleDelete}
              isLoading={isDeleting}
              loadingText="Deleting"
            >
              Delete Asset
            </Button>

            <Flex>
              <Button variant="ghost" mr={3} onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                form="edit-asset-form"
                colorScheme="blue"
                isLoading={isSubmitting}
                loadingText="Saving"
              >
                Save Changes
              </Button>
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default AssetEditor;
