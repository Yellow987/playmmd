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
import { Schema } from "../../../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { getUrl, uploadData } from "aws-amplify/storage";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { BpmxConverter } from "babylon-mmd/esm/Loader/Optimized/bpmxConverter";
import { localAssets } from "../MmdViewer";
import { getCurrentUser } from "aws-amplify/auth";
import { Engine, loadAssetContainerAsync, Scene } from "@babylonjs/core";
import { MmdMesh, MmdStandardMaterial } from "babylon-mmd";
import { getMaterialBuilder } from "../babylon/mmdHooks/useMmdModels";
import { triggerDownloadFromBlob } from "@/app/amplifyHandler/amplifyHandler";
import { TextureAlphaChecker } from "babylon-mmd/esm/Loader/textureAlphaChecker";

interface Props {
  mmdMeshRef: MutableRefObject<MmdMesh | null>;
  sceneRef: MutableRefObject<Scene | null>;
}

const ModelPublisher = (props: Props) => {
  const { mmdMeshRef, sceneRef } = props;
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    credits: "",
    isR_18: false,
  });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const toast = useToast();

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

  async function convertPmxToBmpx(): Promise<ArrayBuffer> {
    const mesh = mmdMeshRef.current!;
    const meshes = mesh!.metadata.meshes;
    const translucentMaterials: boolean[] = [];
    const alphaEvaluateResults: number[] = [];
    const textureAlphaChecker = new TextureAlphaChecker(sceneRef.current!);

    const materials = mesh!.metadata.materials;
    translucentMaterials.length = materials.length;
    alphaEvaluateResults.length = materials.length;
    for (let i = 0; i < materials.length; ++i) {
      const material = materials[i] as MmdStandardMaterial;
      const diffuseTexture = material.diffuseTexture;
      if (diffuseTexture) {
        diffuseTexture.hasAlpha = true;
        material.useAlphaFromDiffuseTexture = true;
      }

      if (material.alpha < 1) {
        translucentMaterials[i] = true;
      } else if (!diffuseTexture) {
        translucentMaterials[i] = false;
      } else {
        translucentMaterials[i] = true;
        const referencedMeshes = meshes.filter(
          (m: { material: any }) => m.material === material,
        );
        for (const referencedMesh of referencedMeshes) {
          const isOpaque =
            await textureAlphaChecker.hasFragmentsOnlyOpaqueOnGeometry(
              diffuseTexture,
              referencedMesh,
              null,
            );
          if (isOpaque) {
            translucentMaterials[i] = false;
            break;
          }
        }
      }

      alphaEvaluateResults[i] = material.transparencyMode ?? -1;
    }

    const converter = new BpmxConverter();
    const bmpxArrayBuffer = converter.convert(mesh, {
      includeSkinningData: true,
      includeMorphData: true,
      translucentMaterials: translucentMaterials,
      alphaEvaluateResults: alphaEvaluateResults,
    });
    return bmpxArrayBuffer;
  }

  const arrayBufferToFile = (
    arrayBuffer: ArrayBuffer,
    fileName: string,
  ): File => {
    const blob = new Blob([arrayBuffer], { type: "application/octet-stream" });
    return new File([blob], fileName, { type: "application/octet-stream" });
  };

  const client = generateClient<Schema>();
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

    const bpmx = await convertPmxToBmpx();
    const file = arrayBufferToFile(bpmx, "model.bpmx");

    let result = null;
    try {
      result = await uploadData({
        path: ({ identityId }) =>
          `models/${identityId}/${formData.title}/model.bpmx`,
        data: file,
      }).result;
      console.log("Succeeded: ", result);
    } catch (error) {
      showErrorToast("Failed to upload file.");
    }
    if (!result) return;
    const folderPath = result.path.substring(0, result.path.lastIndexOf("/"));

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

        <Button type="submit" colorScheme="teal" width="full">
          Submit
        </Button>
      </form>
      <canvas ref={canvasRef} style={{ width: "0px", height: "0px" }} />
    </Box>
  );
};

export default ModelPublisher;
