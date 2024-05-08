export enum CharacterModel {
  HATSUNE_MIKU_YYB_10TH = "HATSUNE_MIKU_YYB_10TH",
  SORA = "SORA",
}

export const defaultCharacterModel = CharacterModel.HATSUNE_MIKU_YYB_10TH;

export type CharacterModelData = {
  name: string;
  url: string;
};

export const CHARACTER_MODELS_DATA: {
  [Key in CharacterModel]: CharacterModelData;
} = {
  [CharacterModel.HATSUNE_MIKU_YYB_10TH]: {
    name: "Hatsune Miku YYB 10th",
    url: "https://playmmd-model-assets.s3.amazonaws.com/YYB+Hatsune+Miku_10th_v1.02.bpmx",
  },
  [CharacterModel.SORA]: {
    name: "Sora",
    url: "https://playmmd-model-assets.s3.amazonaws.com/Sora.bpmx",
  },
};

export type ModelAniamtionPaths = {
  skeletonPath: string;
  facialPath?: string;
  lipsPath?: string;
};

export type AnimationPresetData = {
  name: string;
  audioPath: string;
  modelAnimationPaths: ModelAniamtionPaths[];
  cameraPath?: string;
};

export enum AnimationPreset {
  LAST_CHRISTMAS = "LAST_CHRISTMAS",
}

export const ANIMATION_PRESETS_DATA: {
  [Key in AnimationPreset]: AnimationPresetData;
} = {
  [AnimationPreset.LAST_CHRISTMAS]: {
    name: "Last Christmas",
    audioPath: "/mmd/Animations/LastChristmas/Audio.wav",
    modelAnimationPaths: [
      {
        skeletonPath: "/mmd/Animations/LastChristmas/Skeleton.vmd",
        facialPath: "/mmd/Animations/LastChristmas/FaceAndLips.vmd",
        lipsPath: "/mmd/Animations/LastChristmas/FaceAndLips.vmd",
      },
    ],
  },
};
