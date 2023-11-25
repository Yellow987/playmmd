type CharacterModel = {
  name: string;
  folderPath: string;
  fileName: string;
};

export const characterModels: CharacterModel[] = [
  {
    name: "Hatsune Miku YYB 10th",
    folderPath: "/mmd/YYB Hatsune Miku_10th/",
    fileName: "YYB Hatsune Miku_10th_v1.02.pmx",
  },
];

type AniamtionPaths = {
  skeletonPath: string;
  facialPath?: string;
  lipsPath?: string;
};

type AnimationPreset = {
  name: string;
  folderPath: string;
  audioPath: string;
  animationPaths: AniamtionPaths;
  cameraPath?: string;
};

export const animationPresets: AnimationPreset[] = [
  {
    name: "Last Christmas",
    folderPath: "/mmd/LastChristmas/",
    audioPath: "Audio.wav",
    animationPaths: {
      skeletonPath: "Skeleton.vmd",
      facialPath: "FaceAndLips.vmd",
      lipsPath: "FaceAndLips.vmd",
    },
  },
];
