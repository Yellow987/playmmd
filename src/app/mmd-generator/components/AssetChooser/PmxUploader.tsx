import { setModels, setModelsLoaded, setNewModel } from "@/redux/mmdModels";
import {
  AbstractEngine,
  ArcRotateCamera,
  Color3,
  CreateGround,
  DefaultRenderingPipeline,
  DirectionalLight,
  Engine,
  HemisphericLight,
  loadAssetContainerAsync,
  Material,
  Nullable,
  Scene,
  ShadowGenerator,
  Vector3,
} from "@babylonjs/core";
import { useRef, useEffect, useState, MutableRefObject } from "react";
import { useDispatch } from "react-redux";
import { BaseRuntime } from "../../babylon/baseRuntime";
import { CharacterModelData } from "../../constants";
import {
  SdefInjector,
  MmdStandardMaterialBuilder,
  MmdStandardMaterialRenderMethod,
  TextureAlphaChecker,
  MmdMesh,
  OiComputeTransformInjector,
  MmdStandardMaterial,
  BpmxConverter,
} from "babylon-mmd";
import { Button, Flex } from "@aws-amplify/ui-react";
import { Box, List, ListItem, VStack } from "@chakra-ui/react";
import { localAssets } from "../../MmdViewer";

async function readDirectories(
  entries: FileSystemEntry[],
  path = "",
): Promise<FileSystemFileEntry[]> {
  const result: FileSystemFileEntry[] = [];

  for (let i = 0; i < entries.length; ++i) {
    const entry = entries[i];
    if (entry.isDirectory) {
      const dirReader = (entry as FileSystemDirectoryEntry).createReader();
      const entries = await new Promise<FileSystemEntry[]>(
        (resolve, reject) => {
          dirReader.readEntries(resolve, reject);
        },
      );
      result.push(...(await readDirectories(entries, path + entry.name + "/")));
    } else {
      result.push(entry as FileSystemFileEntry);
    }
  }

  return result;
}

async function entriesToFiles(entries: FileSystemEntry[]): Promise<File[]> {
  const files: File[] = [];
  const directories = await readDirectories(entries);
  for (let i = 0; i < directories.length; ++i) {
    const entry = directories[i];
    const file = await new Promise<File>((resolve, reject) => {
      entry.file(resolve, reject);
    });
    if (file.webkitRelativePath === "") {
      Object.defineProperty(file, "webkitRelativePath", {
        writable: true,
      });
      (file as any).webkitRelativePath = entry.fullPath;
    }
    files.push(file);
  }
  return files;
}

interface ISceneBuilder {
  build(canvas: HTMLCanvasElement, engine: Engine): Scene | Promise<Scene>;
}

class PmxConverterSceneBuilder implements ISceneBuilder {
  public async build(
    canvas: HTMLCanvasElement,
    engine: AbstractEngine,
  ): Promise<Scene> {
    SdefInjector.OverrideEngineCreateEffect(engine);

    const materialBuilder = new MmdStandardMaterialBuilder();
    materialBuilder.deleteTextureBufferAfterLoad = false;
    materialBuilder.renderMethod =
      MmdStandardMaterialRenderMethod.AlphaEvaluation;

    const scene = new Scene(engine);
    scene.ambientColor = new Color3(0.5, 0.5, 0.5);

    const camera = new ArcRotateCamera(
      "camera",
      0,
      0,
      45,
      new Vector3(0, 10, 0),
      scene,
    );
    camera.maxZ = 5000;
    camera.fov = 30 * (Math.PI / 180);
    camera.speed = 0.5;
    camera.setPosition(new Vector3(0, 10, -45));
    camera.attachControl(canvas, true);

    const hemisphericLight = new HemisphericLight(
      "hemisphericLight",
      new Vector3(0, 1, 0),
      scene,
    );
    hemisphericLight.intensity = 0.5;
    hemisphericLight.specular = new Color3(0, 0, 0);
    hemisphericLight.groundColor = new Color3(1, 1, 1);

    const directionalLight = new DirectionalLight(
      "directionalLight",
      new Vector3(0.5, -1, 1),
      scene,
    );
    directionalLight.intensity = 0.5;
    directionalLight.autoCalcShadowZBounds = false;
    directionalLight.autoUpdateExtends = false;
    directionalLight.shadowMaxZ = 20 * 3;
    directionalLight.shadowMinZ = -30;
    directionalLight.orthoTop = 18 * 3;
    directionalLight.orthoBottom = -1 * 3;
    directionalLight.orthoLeft = -10 * 3;
    directionalLight.orthoRight = 10 * 3;
    directionalLight.shadowOrthoScale = 0;

    const shadowGenerator = new ShadowGenerator(
      1024,
      directionalLight,
      true,
      camera,
    );
    shadowGenerator.transparencyShadow = true;
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.forceBackFacesOnly = false;
    shadowGenerator.bias = 0.01;
    shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_MEDIUM;
    shadowGenerator.frustumEdgeFalloff = 0.1;

    const ground = CreateGround(
      "ground1",
      { width: 100, height: 100, subdivisions: 2, updatable: false },
      scene,
    );
    ground.receiveShadows = true;

    const defaultPipeline = new DefaultRenderingPipeline(
      "default",
      true,
      scene,
    );
    defaultPipeline.samples = 4;
    defaultPipeline.fxaaEnabled = true;
    defaultPipeline.imageProcessingEnabled = false;

    engine.resize(true);
    return scene;
  }
}

interface Props {
  localFilesRef: MutableRefObject<localAssets[]>;
  mmdMeshRef: MutableRefObject<MmdMesh | null>;
  setPersistentMmdMesh: (mesh: MmdMesh | null) => void;
}

const PmxUploader = (props: Props) => {
  const { localFilesRef, mmdMeshRef, setPersistentMmdMesh } = props;
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> =
    useRef<HTMLCanvasElement>(null);
  const runtimeRef: React.MutableRefObject<BaseRuntime | null> =
    useRef<BaseRuntime | null>(null);
  const inited = useRef(false);

  useEffect(() => {
    const initializeRuntime = async () => {
      if (canvasRef.current === null) return;
      const canvas = canvasRef.current;
      const engine = new Engine(
        canvas,
        false,
        {
          preserveDrawingBuffer: false,
          stencil: false,
          antialias: false,
          alpha: false,
          premultipliedAlpha: false,
          powerPreference: "high-performance",
          doNotHandleTouchAction: true,
          doNotHandleContextLost: true,
          audioEngine: false,
        },
        true,
      );

      const runtime = await BaseRuntime.Create({
        canvas,
        engine,
        sceneBuilder: new PmxConverterSceneBuilder(),
      });

      runtime.run();
      runtimeRef.current = runtime;
      canvasRef.current = runtime.canvas;
      // const width = 400;
      // const height = 800;
      // const pixelRatio = window.devicePixelRatio || 1;
      // canvas.width = width * pixelRatio;
      // canvas.height = height * pixelRatio;
      // canvas.style.width = `${width}px`;
      // canvas.style.height = `${height}px`;

      return () => {
        engine.dispose();
      };
    };

    if (inited.current) return;
    inited.current = true;
    initializeRuntime();

    return () => {
      runtimeRef.current?.scene.dispose();
      runtimeRef.current?.engine.dispose();
    };
  }, []);

  const dispath = useDispatch();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);

  const handleMmdUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files) return;

    setFiles(Array.from(files));
  };

  const loadModelAsync = async (file: File): Promise<void> => {
    if (mmdMeshRef.current !== null) {
      for (const subMesh of mmdMeshRef.current.metadata.meshes) {
        //TODO enable shadowGenerator.removeShadowCaster(subMesh);
      }
      mmdMeshRef.current.dispose(false, true);
      mmdMeshRef.current = null;
      setPersistentMmdMesh(null);
    }
    const materialBuilder = new MmdStandardMaterialBuilder();
    materialBuilder.deleteTextureBufferAfterLoad = false;
    materialBuilder.renderMethod =
      MmdStandardMaterialRenderMethod.AlphaEvaluation;

    const fileRelativePath = file.webkitRelativePath as string;
    mmdMeshRef.current = await loadAssetContainerAsync(
      file,
      runtimeRef.current!.scene,
      {
        rootUrl: fileRelativePath.substring(
          0,
          fileRelativePath.lastIndexOf("/") + 1,
        ),
        pluginOptions: {
          mmdmodel: {
            materialBuilder: materialBuilder,
            buildSkeleton: true,
            buildMorph: true,
            boundingBoxMargin: 0,
            preserveSerializationData: true,
            loggingEnabled: true,
            referenceFiles: files,
          },
        },
      },
    ).then((result) => {
      result.addAllToScene();
      const mmdMesh = result.meshes[0] as MmdMesh;
      localFilesRef.current = [{ modelFile: file, referenceFiles: files }];
      // Store the mesh in the persistent state
      setPersistentMmdMesh(mmdMesh);
      console.log("Model loaded and stored in persistent state", mmdMesh);
      return mmdMesh;
    });
  };

  const handleFileClick = async (file: File) => {
    loadModelAsync(file);
  };

  function isFileMmd(file: File) {
    const fileExtension = file.name.split(".").pop()!.toLowerCase();
    return fileExtension === "pmx" || fileExtension === "pmd";
  }

  const useModel = () => {
    const newModel = {
      name: "LocalModel",
      path: "",
      isLocalModel: true,
    } as CharacterModelData;
    dispath(setNewModel({ model: newModel, i: 0 }));
  };

  return (
    <Flex width="100%" height="100%" maxHeight="75vh">
      <Box width="20%">
        <VStack spacing={4} align="stretch" height="100%">
          {/* File Upload Button */}
          <Button onClick={() => fileInputRef.current?.click()}>
            Upload File
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }} // Hide the input element
            onChange={handleMmdUpload}
            webkitdirectory="true" // Enables folder selection
            directory="true" // Redundant, but for compatibility
          />

          {/* Scrollable List */}
          <Box
            flex="1"
            overflowY="auto"
            border="1px solid"
            borderColor="gray.300"
            borderRadius="md"
            maxH="75vh"
            p={2}
          >
            <List spacing={2}>
              {files.map((file, index) => (
                <ListItem
                  key={index}
                  p={1}
                  fontSize="sm"
                  bg="gray.50"
                  borderRadius="md"
                  cursor={isFileMmd(file) ? "pointer" : ""}
                  _hover={{ bg: "gray.100" }} // Optional: Add hover effect
                  onClick={() => {
                    if (isFileMmd(file)) {
                      handleFileClick(file); // Call the conditional callback
                    }
                  }}
                >
                  {file.name}
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Bottom Button */}
          <Button onClick={useModel}>Use Model</Button>
        </VStack>
      </Box>
      <Box flex="1">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </Box>
    </Flex>
  );
};

export default PmxUploader;
