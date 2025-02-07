import HavokPhysics from "@babylonjs/havok";
import { Scene } from "@babylonjs/core/scene";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Engine } from "@babylonjs/core/Engines/engine";
import { Color3, Color4 } from "@babylonjs/core/Maths/math.color";
import { ParticleSystem } from "@babylonjs/core/Particles/particleSystem";
import { Texture } from "@babylonjs/core/Materials/Textures/texture";
import { MmdAmmoJSPlugin } from "babylon-mmd/esm/Runtime/Physics/mmdAmmoJSPlugin";
import ammo from "ammo.js";
import { HavokPlugin } from "@babylonjs/core/Physics/v2/Plugins/havokPlugin";

let scene: Scene | null = null;

export async function createScene(engine: Engine): Promise<Scene> {
  scene = new Scene(engine);
  scene.enablePhysics(
    new Vector3(0, -20, 0),
    new HavokPlugin(true, await HavokPhysics()),
  );

  // scene.enablePhysics(
  //   new Vector3(0, -9.8 * 10, 0),
  //   new MmdAmmoJSPlugin(true, await ammo()),
  // );

  scene.ambientColor = new Color3(1, 1, 1);

  // Create MMD-style particle effect
  const particleSystem = new ParticleSystem("particles", 2000, scene);
  
  // Texture of each particle
  particleSystem.particleTexture = new Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABCSURBVChTY/z//z8DGHzZ5/AfnwQYYBVA5uEVgAAMAQwJEAABkCwmQZKACWITxCaIIYhNEEMQmyA2QQxBbIIgQQYGAE5YF+dCbQZxAAAAAElFTkSuQmCC");
  
  // Where the particles come from
  particleSystem.emitter = Vector3.Zero(); // the point where particles are emitted from
  particleSystem.minEmitBox = new Vector3(-10, 0, -10); // minimum box dimensions
  particleSystem.maxEmitBox = new Vector3(10, 10, 10); // maximum box dimensions
  
  // Particle colors
  particleSystem.color1 = new Color4(1, 1, 1, 0.3);
  particleSystem.color2 = new Color4(1, 1, 1, 0.3);
  particleSystem.colorDead = new Color4(1, 1, 1, 0);
  
  // Size and lifetime
  particleSystem.minSize = 0.1;
  particleSystem.maxSize = 0.3;
  particleSystem.minLifeTime = 2;
  particleSystem.maxLifeTime = 3.5;
  
  // Emission rate
  particleSystem.emitRate = 100;
  
  // Blend mode
  particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
  
  // Speed and gravity
  particleSystem.minEmitPower = 0.5;
  particleSystem.maxEmitPower = 1;
  particleSystem.gravity = new Vector3(0, -0.1, 0);
  
  // Start the particle system
  particleSystem.start();

  console.log("Scene created with particle effects");
  return scene;
}

export function getScene(): Scene {
  if (!scene) {
    throw new Error("Scene has not been created yet. Call createScene first.");
  }
  return scene;
}

export function cleanupScene(): void {
  console.log("CLEANUP SCENE");
  if (scene) {
    scene.dispose();
    scene = null;
    console.log("CLEANUP SCENE DONE");
  }
}
