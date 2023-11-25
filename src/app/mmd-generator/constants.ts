export enum CharacterModel {
  HATSUNE_MIKU_YYB_10TH = "HATSUNE_MIKU_YYB_10TH",
}

export const defaultCharacterModel = CharacterModel.HATSUNE_MIKU_YYB_10TH;

export type CharacterModelData = {
  name: string;
  folderPath: string;
  fileName: string;
};

export const CHARACTER_MODELS_DATA: {
  [Key in CharacterModel]: CharacterModelData;
} = {
  [CharacterModel.HATSUNE_MIKU_YYB_10TH]: {
    name: "Hatsune Miku YYB 10th",
    folderPath: "/mmd/YYB Hatsune Miku_10th/",
    fileName: "YYB Hatsune Miku_10th_v1.02.pmx",
  },
};

type AniamtionPaths = {
  skeletonPath: string;
  facialPath?: string;
  lipsPath?: string;
};

export type AnimationPresetData = {
  name: string;
  folderPath: string;
  audioPath: string;
  animationPaths: AniamtionPaths;
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
    folderPath: "/mmd/LastChristmas/",
    audioPath: "Audio.wav",
    animationPaths: {
      skeletonPath: "Skeleton.vmd",
      facialPath: "FaceAndLips.vmd",
      lipsPath: "FaceAndLips.vmd",
    },
  },
};
