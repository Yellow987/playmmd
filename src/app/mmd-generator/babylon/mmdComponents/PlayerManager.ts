import { get } from "http";
import { AnimationPresetData, AwsAsset } from "../../constants";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";
import { getMmdRuntime } from "./mmdRuntime";
import { addMmdMotion, cleanupModelInArray, createAndSetMmdModel } from "./mmdModels";
import { MmdDancer } from "../../components/Presets";
import { MmdModel } from "babylon-mmd";


export default class PlayerManager {
  private setMmdDancers: React.Dispatch<React.SetStateAction<MmdDancer[]>>;

  constructor(setMmdDancers: React.Dispatch<React.SetStateAction<MmdDancer[]>>) {
    this.setMmdDancers = setMmdDancers;
  }

  public async setMmdModel(index: number, characterModel: AwsAsset): Promise<MmdModel> {
    // Init dancer
    this.setMmdDancers((prev) => {
      const newMmdDancers = [...prev];
      newMmdDancers[index] = {
        modelData: characterModel,
        isModelLoaded: false,
        animationData: prev[index]?.animationData || null,
        isAnimationLoaded: false,
      };
      return newMmdDancers;
    });

    // handle mmd runtime
    const mmdRuntime: MmdRuntime = getMmdRuntime();
    const isPlaying: boolean = mmdRuntime.isAnimationPlaying;
    if (isPlaying) {
      mmdRuntime.pauseAnimation();
    }

    const mmdModel = await createAndSetMmdModel(index, characterModel);
    
    this.setMmdDancers((prev) => {
      const newMmdDancers = [...prev];
      newMmdDancers[index] = {
        modelData: characterModel,
        isModelLoaded: true,
        animationData: prev[index]?.animationData || null,
        isAnimationLoaded: false,
      };
      return newMmdDancers;
    });
    return mmdModel;
  }

  public async setMmdAnimation(
    index: number,
    animationPresetData: AnimationPresetData,
  ) {
    // Init dancer
    // this.setMmdDancers((prev) => {
    //   const newMmdDancers = [...prev];
    //   newMmdDancers[index] = {
    //     modelData:  prev[index]?.modelData || null,
    //     isModelLoaded: prev[index]?.isModelLoaded || false,
    //     animationData: animationPresetData,
    //     isAnimationLoaded: false,
    //   };
    //   return newMmdDancers;
    // });

    await addMmdMotion(0, animationPresetData.modelAnimationPaths[0]);
  }
}