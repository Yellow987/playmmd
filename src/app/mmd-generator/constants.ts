export enum CharacterModel {
  HATSUNE_MIKU_YYB_10TH = "HATSUNE_MIKU_YYB_10TH",
  SORA = "SORA",
  Akabane = "Akabane",
}

export const defaultCharacterModel = CharacterModel.HATSUNE_MIKU_YYB_10TH;

export type CharacterModelData = {
  name: string;
  path: string;
  isLocalModel: boolean;
  isZipModel?: boolean;
};

export const CHARACTER_MODELS_DATA: {
  [Key in CharacterModel]: CharacterModelData;
} = {
  [CharacterModel.HATSUNE_MIKU_YYB_10TH]: {
    name: "Hatsune Miku YYB 10th",
    path: "https://playmmd-model-assets.s3.amazonaws.com/YYB+Hatsune+Miku_10th_v1.02.bpmx",
    isLocalModel: false,
  },
  [CharacterModel.SORA]: {
    name: "Sora",
    path: "https://playmmd-model-assets.s3.amazonaws.com/Sora.bpmx",
    isLocalModel: false,
  },
  [CharacterModel.Akabane]: {
    name: "Akabane",
    path: "mmd/Akabane.bpmx",
    isLocalModel: true,
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
  FIGHTING_MY_WAY = "FIGHTING_MY_WAY",
  TAME_LIE_ONE_STEP = "TAME_LIE_ONE_STEP",
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
  [AnimationPreset.FIGHTING_MY_WAY]: {
    name: "Fighting My Way",
    audioPath: "/mmd/Animations/FightingMyWay/Audio.wav",
    modelAnimationPaths: [
      {
        skeletonPath: "/mmd/Animations/FightingMyWay/Motion.vmd",
        facialPath: "/mmd/Animations/FightingMyWay/Motion.vmd",
        lipsPath: "/mmd/Animations/FightingMyWay/Motion.vmd",
      },
    ],
    cameraPath: "/mmd/Animations/FightingMyWay/Camera.vmd",
  },
  [AnimationPreset.TAME_LIE_ONE_STEP]: {
    name: "Tame Lie One Step",
    audioPath: "/mmd/Animations/TameLieOneStep/Audio.wav",
    modelAnimationPaths: [
      {
        skeletonPath: "/mmd/Animations/TameLieOneStep/Motion.vmd",
        facialPath: "/mmd/Animations/TameLieOneStep/Motion.vmd",
        lipsPath: "/mmd/Animations/TameLieOneStep/Motion.vmd",
      },
    ],
    cameraPath: "/mmd/Animations/TameLieOneStep/Camera.vmd",
  },
};
