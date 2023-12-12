import { Engine } from "@babylonjs/core/Engines/engine";
import { DefaultRenderingPipeline } from "@babylonjs/core/PostProcesses/RenderPipeline/Pipelines/defaultRenderingPipeline";
import { Scene } from "@babylonjs/core/scene";
import { StreamAudioPlayer } from "babylon-mmd/esm/Runtime/Audio/streamAudioPlayer";
import { MmdRuntime } from "babylon-mmd/esm/Runtime/mmdRuntime";

export interface ISceneBuilder {
  build(canvas: HTMLCanvasElement, engine: Engine): Promise<Mmd>;
}

export type Mmd = {
  scene: Scene;
  mmdRuntime: MmdRuntime;
  canvas: HTMLCanvasElement;
  postProcessor: DefaultRenderingPipeline;
  audioPlayer: StreamAudioPlayer;
  baseRuntime?: BaseRuntime;
};

export interface BaseRuntimeInitParams {
  canvas: HTMLCanvasElement;
  engine: Engine;
  sceneBuilder: ISceneBuilder;
}

export class BaseRuntime {
  canvas: HTMLCanvasElement;
  private readonly _engine: Engine;
  scene: Scene;
  private _onTick: () => void;

  private constructor(params: BaseRuntimeInitParams) {
    this.canvas = params.canvas;
    this._engine = params.engine;

    this.scene = null!;
    this._onTick = null!;
  }

  public static async Create(params: BaseRuntimeInitParams): Promise<Mmd> {
    const baseRuntime = new BaseRuntime(params);
    const mmd: Mmd = await baseRuntime._initialize(params.sceneBuilder);
    baseRuntime._onTick = baseRuntime._makeOnTick();
    mmd.baseRuntime = baseRuntime;
    return mmd;
  }

  public run(): void {
    const engine = this._engine;

    window.addEventListener("resize", this._onResize);
    engine.runRenderLoop(this._onTick);
  }

  public dispose(): void {
    window.removeEventListener("resize", this._onResize);
    this._engine.dispose();
  }

  private readonly _onResize = (): void => {
    this._engine.resize();
  };

  private async _initialize(sceneBuilder: ISceneBuilder): Promise<Mmd> {
    return await sceneBuilder.build(this.canvas, this._engine);
  }

  private _makeOnTick(): () => void {
    const scene = this.scene;
    return () => scene.render();
  }
}
