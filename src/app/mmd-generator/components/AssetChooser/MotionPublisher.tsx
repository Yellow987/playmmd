import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  Button,
  useToast,
} from "@chakra-ui/react";
import { generateClient } from "aws-amplify/api";
import { getCurrentUser } from "aws-amplify/auth";
import { uploadData } from "aws-amplify/storage";
import React, { useRef, useState } from "react";
import { Schema } from "../../../../../amplify/data/resource";
import { MotionFiles } from "./MmdAssetChooserModal";
import { uploadFileToAmplifyStorage } from "@/app/amplifyHandler/amplifyHandler";
import { ASSET_TYPE } from "./MmdAssetChooserModal";

interface Props {
  motionData: MotionFiles;
  onComplete: () => void;
}

const MotionPublisher = (props: Props) => {
  const { motionData, onComplete } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    credits: "",
    isR_18: false,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const toast = useToast();

  const showErrorToast = (description: string) => {
    toast({
      title: "Error",
      description,
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    // Type guard for checkbox input
    const fieldValue =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const client = generateClient<Schema>();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!formData.title || !formData.credits) {
        showErrorToast("Title and credits are required.");
        setIsSubmitting(false);
        return;
      }

      let folderPath: string;
      try {
        folderPath = await uploadFileToAmplifyStorage(
          "song.wav",
          "Motions",
          motionData.songFile!,
        );
        console.log("uploaded song");
        if (motionData.cameraFile) {
          await uploadFileToAmplifyStorage(
            "camera1.vmd",
            "Motions",
            motionData.cameraFile,
            folderPath,
          );
        }
        if (motionData.lipsyncFile) {
          await uploadFileToAmplifyStorage(
            "lipsync1.vmd",
            "Motions",
            motionData.lipsyncFile,
            folderPath,
          );
        }
        if (motionData.facialExpressionFile) {
          await uploadFileToAmplifyStorage(
            "facial1.vmd",
            "Motions",
            motionData.facialExpressionFile,
            folderPath,
          );
        }
        await uploadFileToAmplifyStorage(
          "motion1.vmd",
          "Motions",
          motionData.motionsFiles[0]!,
          folderPath,
        );
        console.log("Succeeded: ", folderPath);
      } catch (error) {
        showErrorToast("Failed to upload file.");
        setIsSubmitting(false);
        return;
      }

      const { username } = await getCurrentUser();
      const { errors, data: newTodo } = await client.models.Motions.create(
        {
          uploaderUsername: username,
          title: formData.title,
          description: formData.description,
          credits: formData.credits,
          pathToFiles: folderPath,
          isR_18: formData.isR_18,
          numberOfDancers: 1,
        },
        {
          authMode: "userPool",
        },
      );

      if (errors) {
        showErrorToast("Failed to submit model.");
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Success",
        description: "Model submitted successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onComplete();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box w="400px" p="4" borderWidth="1px" borderRadius="md" boxShadow="sm">
      <form onSubmit={handleSubmit}>
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
          loadingText="Submitting"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>
      <canvas ref={canvasRef} style={{ width: "0px", height: "0px" }} />
    </Box>
  );
};

export default MotionPublisher;
