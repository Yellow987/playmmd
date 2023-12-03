import type { Engine } from "@babylonjs/core/Engines/engine";
import type { Scene } from "@babylonjs/core/scene";

export interface ISceneBuilder {
  build(canvas: HTMLCanvasElement, engine: Engine): Scene | Promise<Scene>;
}

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

  public static async Create(
    params: BaseRuntimeInitParams,
  ): Promise<BaseRuntime> {
    const runtime = new BaseRuntime(params);
    runtime.scene = await runtime._initialize(params.sceneBuilder);
    runtime._onTick = runtime._makeOnTick();
    return runtime;
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

  private async _initialize(sceneBuilder: ISceneBuilder): Promise<Scene> {
    return await sceneBuilder.build(this.canvas, this._engine);
  }

  private _makeOnTick(): () => void {
    const scene = this.scene;
    return () => scene.render();
  }
}
