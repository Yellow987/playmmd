import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect, MutableRefObject, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CHARACTER_MODELS_DATA,
  CharacterModel,
  CharacterModelData,
} from "../../constants";
import "@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent";
import { Scene } from "@babylonjs/core/scene";
import { MmdModel } from "babylon-mmd/esm/Runtime/mmdModel";
import { SceneLoader } from "@babylonjs/core/Loading/sceneLoader";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MmdCamera } from "babylon-mmd/esm/Runtime/mmdCamera";
import { ShadowGenerator } from "@babylonjs/core/Lights/Shadows/shadowGenerator";
import { RootState } from "@/redux/store";
import { setModelsLoaded } from "@/redux/mmdModels";
import { MmdStandardMaterialBuilder } from "babylon-mmd/esm/Loader/mmdStandardMaterialBuilder";
import type { MmdMesh } from "babylon-mmd/esm/Runtime/mmdMesh";
import { loadAssetContainerAsync } from "@babylonjs/core/Loading/sceneLoader";
import { downloadData, getUrl, list } from "aws-amplify/storage";
import { addShadowCaster } from "./useLighting";
import { BaseRuntime } from "../baseRuntime";
import { localAssets } from "../../MmdViewer";
import {
  downloadFromAmplifyStorageAsUrl,
  downloadAndExtractZip,
} from "@/app/amplifyHandler/amplifyHandler";

export function getMaterialBuilder(): MmdStandardMaterialBuilder {
  const materialBuilder = new MmdStandardMaterialBuilder();
  // materialBuilder.loadOutlineRenderingProperties = (): void => {
  //   /* do nothing */
  // };
  materialBuilder.deleteTextureBufferAfterLoad = false;

  return materialBuilder;
}

const useMmdModels = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntime: MmdRuntime,
  localFilesRef: MutableRefObject<localAssets[]>,
  mmdCharacterModelsRef: MutableRefObject<MmdModel[]>,
  runtimeRef: MutableRefObject<BaseRuntime | null>,
): MutableRefObject<MmdModel[]> => {
  const dispatch = useDispatch();
  const mmdCharacterModels = useSelector(
    (state: RootState) => state.mmdModels.models,
  );
  const prevMmdCharacterModels = useRef<CharacterModelData[]>([]);

  useEffect(() => {
    async function loadMmdModel(
      index: number,
      newCharacterModel: CharacterModelData,
    ) {
      console.log("Loading model", newCharacterModel);
      const newMmdModel = await createMmdModel(index, newCharacterModel);
      console.log("Model loaded", newCharacterModel);
      mmdCharacterModelsRef.current[index] = newMmdModel;
      dispatch(setModelsLoaded([true]));
    }

    //Swap changed models
    const length = prevMmdCharacterModels.current.length;
    for (let i = 0; i < length; i++) {
      const currentModel = prevMmdCharacterModels.current[i];
      if (currentModel !== mmdCharacterModels[i]) {
        releaseMmdModel(mmdCharacterModelsRef.current[i]);
        loadMmdModel(i, mmdCharacterModels[i]);
      }
    }

    //Load new models
    for (let i = length; i < mmdCharacterModels.length; i++) {
      loadMmdModel(i, mmdCharacterModels[i]);
    }

    //Release unneeded models
    for (let i = mmdCharacterModels.length; i < length; i++) {
      releaseMmdModel(mmdCharacterModelsRef.current[i]);
    }
    prevMmdCharacterModels.current = mmdCharacterModels;
  }, [mmdCharacterModels]);

  function releaseMmdModel(mmdModelToDestroy: MmdModel) {
    console.log("Releasing model");
    mmdRuntime.destroyMmdModel(mmdModelToDestroy);
    mmdModelToDestroy.mesh.dispose();
  }

  async function createMmdModel(
    index: number,
    characterModelData: CharacterModelData,
  ): Promise<MmdModel> {
    // Create a local copy of characterModelData that we can modify
    let modelData = { ...characterModelData };
    const materialBuilder = getMaterialBuilder();

    // runtimeRef.current!.engine.displayLoadingUI();

    // Handle zip models
    if (characterModelData.isZipModel && !characterModelData.isLocalModel) {
      try {
        console.log("Loading zip model:", characterModelData.path);
        // Download and extract the zip file
        const extractedFiles = await downloadAndExtractZip(
          characterModelData.path,
        );

        // Find the PMX file in the extracted files
        const pmxFile = extractedFiles.find(
          (file) =>
            file.name.toLowerCase().endsWith(".pmx") ||
            file.name.toLowerCase().endsWith(".pmd"),
        );

        if (!pmxFile) {
          throw new Error("No PMX/PMD file found in the zip archive");
        }

        // Store the extracted files in localFilesRef for reference
        localFilesRef.current = [
          {
            modelFile: pmxFile,
            referenceFiles: extractedFiles,
          },
        ];

        // Set isLocalModel to true since we now have local files
        // Use the copy instead of modifying the original
        modelData.isLocalModel = true;
      } catch (error) {
        console.error("Error extracting zip model:", error);
        throw error;
      }
    }

    const mmdMesh = await loadAssetContainerAsync(
      modelData.isLocalModel
        ? localFilesRef.current[0]?.modelFile
          ? localFilesRef.current[0].modelFile
          : modelData.path
        : await downloadFromAmplifyStorageAsUrl(modelData.path),
      sceneRef.current,
      {
        onProgress: (event) =>
          (runtimeRef.current!.engine.loadingUIText = `Loading model... ${event.loaded}/${event.total} (${Math.floor((event.loaded * 100) / event.total)}%)`),
        rootUrl:
          modelData.isLocalModel && localFilesRef.current[0]
            ? (
                localFilesRef.current[0].modelFile.webkitRelativePath as string
              ).substring(
                0,
                (
                  localFilesRef.current[0].modelFile
                    .webkitRelativePath as string
                ).lastIndexOf("/") + 1,
              )
            : undefined,
        pluginOptions: {
          mmdmodel: {
            materialBuilder: materialBuilder,
            preserveSerializationData: true,
            boundingBoxMargin: 60,
            loggingEnabled: true,
            referenceFiles:
              modelData.isLocalModel && localFilesRef.current[0]
                ? localFilesRef.current[0].referenceFiles
                : undefined,
          },
        },
      },
    ).then((result) => {
      result.addAllToScene();
      // runtimeRef.current!.engine.hideLoadingUI();
      return result.meshes[0] as MmdMesh;
    });

    const meshes = mmdMesh!.metadata.meshes;
    for (let i = 0; i < meshes.length; ++i) {
      const mesh = meshes[i];
      addShadowCaster(mesh, sceneRef.current);
      mesh.alphaIndex = i;
    }

    const mmdModel = mmdRuntime.createMmdModel(mmdMesh);
    return mmdModel;
  }

  return mmdCharacterModelsRef;
};

export default useMmdModels;
