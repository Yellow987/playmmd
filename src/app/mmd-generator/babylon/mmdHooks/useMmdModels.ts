import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { useState, useEffect, MutableRefObject, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CHARACTER_MODELS_DATA, CharacterModel } from "../../constants";
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
import { getUrl, list } from "aws-amplify/storage";

const useMmdModels = (
  sceneRef: MutableRefObject<Scene>,
  mmdRuntime: MmdRuntime,
): MutableRefObject<MmdModel[]> => {
  const dispatch = useDispatch();
  const mmdCharacterModels = useSelector(
    (state: RootState) => state.mmdModels.models,
  );
  const mmdCharacterModelsRef = useRef<MmdModel[]>([]);
  const prevMmdCharacterModels = useRef<CharacterModel[]>([]);

  useEffect(() => {
    async function loadMmdModel(
      index: number,
      newCharacterModel: CharacterModel,
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
    mmdRuntime.destroyMmdModel(mmdModelToDestroy);
    mmdModelToDestroy.mesh.dispose();
  }

  function getDifferentIndexes(arr1: any[], arr2: any[]): number[] {
    let differentIndexs = [];
    for (let i = 0; i < arr1.length; i++) {
      if (arr1[i] !== arr2[i]) {
        differentIndexs.push(i);
      }
    }
    return differentIndexs;
  }

  async function createMmdModel(
    index: number,
    characterModel: CharacterModel,
  ): Promise<MmdModel> {
    const modelData = CHARACTER_MODELS_DATA[characterModel];
    // const mmdMesh = await SceneLoader.ImportMeshAsync(
    //   undefined,
    //   //String(linkToStorageFile.url),
    //   "https://playmmd-model-assets.s3.amazonaws.com/Sora.bpmx",
    //   "",
    //   sceneRef.current,
    // ).then((result) => result.meshes[0] as Mesh);
    const materialBuilder = new MmdStandardMaterialBuilder();
    materialBuilder.loadOutlineRenderingProperties = (): void => { /* do nothing */ };
    const fileList = await list({
      path: "models/"
    });
    console.log(fileList)
    const linkToStorageFile = await getUrl({
        path: "models/Akabane.bpmx",
    });
    console.log(linkToStorageFile)
    const mmdMesh = await loadAssetContainerAsync(
      // "https://amplify-d2ww8jogafwege-ma-amplifystoragebucket7f87-3kftebnyakak.s3.us-east-1.amazonaws.com/models/Akabane.bpmx?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAUS6VUMSFAEYF6JNO%2F20241128%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20241128T165312Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjELn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIAqqziW8o11GsLrc%2BHXy5kGxYgq9GYBL0Bd7ppHaNkF3AiEA77rapw3Ro9AnAEVBwG%2BrbxI8wvSsbuF6AECwG6GE1bAq0QMIYhAAGgwzMTU1OTEyNTUxNzgiDIH8FExdmPj60pAg4yquA71ZjI8X0e6vwWt54%2FJW60XIn9433Xu3oXY%2FKNwKMcT1orFEVjan4hJ1k1S0okVJpLSoHwcP9UBA5j9dYnE%2BvPeXCzwSfcfH9XS7ha3rz9o8Sr8AwyC8EnQKipGriMigheEBUpvkDGyOZnoKwnieXbva4Zbq0810OE%2F5%2FkW1YqL79SEpzWImVO49XznkYCknM7zJnObUh93s7f1r1PcHkn9YF4isfRT5J25X6ZzXuBlntT%2FUqn0FoG5EEisYb3FUhdSo8I80AtoKCfpPBC4H8oID%2FIIJsysOHj5jSfXxnaiyz%2FN6kYhdyg8xQLtmjrIyTitZ7mDg6Gvtw6sTpuf7DP4ekfBoovDYER3GXNh14dQFtn%2BjuAqEdtw1Ismw1RdKQAr15sWzJ5Wlx5P6C%2BKtRsE2lhOF15JxT1HjAldpP2%2BREv%2FRZJ%2B8DGowSRLCOfU1TrguSt0zPF667RZDv%2BCd%2BxENSkAbPTEYCFTmzkR7ryOaq6ZAlMdpyfH5VRDMROnDyyxESAkydFGlyrzo3hOI5zyo%2Fs6ZqPNM%2FmxcvDOl9rl2uNcSky2bWW8oggL1z1gwlLiiugY6lAL2X1oRRd5wPyFR5Z4E3H0njbEhEcoSTHXYz0Dw%2BCiD8%2Bnv7ZdAMQ67aY8cB3VKaAC85dIRLlxu3E3Mmm%2Be7cFsX7ZJ7Hdb1cUAcuvnQPRHM1W1VadD72URxORmmws5p93g0TPOkDRz9CYKxCE5m9UiNuVlA1xqrja2EM%2B%2Fpxk2hT%2BXo%2Fa%2FsY1l0gmMmBdoMozRVmRBu1pzCOK6yZQl6m9Gemb%2B2WImMSnTP1OYGWGMi%2Bcr68NjiFff4uKWUG5xBy71cRe9NIi3ix2x0PVFX9IvJj6BYSPlna0jZdZF4V3cThJHo9rknyoDgr7MEQ8svc7Up8kTAHv3yQ%2B4QdkKgPNvjM1jkPQSoUPf9tLeg1IciKN1vac%3D&X-Amz-Signature=60c1caa38879f19e5ba33b2e8c1fc283e5eb27a4d4c41f96f90b460104c24e37&X-Amz-SignedHeaders=host&x-id=GetObject",
      // "Akabane.bpmx",
      linkToStorageFile.url.toString(),
      sceneRef.current,
      {
          // onProgress: (event) => engine.loadingUIText = `Loading model... ${event.loaded}/${event.total} (${Math.floor(event.loaded * 100 / event.total)}%)`,
          pluginOptions: {
              mmdmodel: {
                  materialBuilder: materialBuilder,
                  boundingBoxMargin: 60,
                  loggingEnabled: true
              }
          }
      }
  ).then((result) => {
      result.addAllToScene();
      return result.meshes[0] as MmdMesh;
  });

    mmdMesh.receiveShadows = true;
    const camera = sceneRef.current.getCameraById("MmdCamera") as MmdCamera;
    const shadowGenerator = sceneRef.current
      .getLightByName("DirectionalLight")
      ?.getShadowGenerator() as ShadowGenerator;
    shadowGenerator.addShadowCaster(mmdMesh);

    const mmdModel = mmdRuntime.createMmdModel(mmdMesh);
    return mmdModel;
  }

  return mmdCharacterModelsRef;
};

export default useMmdModels;
