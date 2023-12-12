const initEngine = null;

function useEngineImpl() {
  const engine = new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
  return engine;
}

export const useEngine = singletonHook(initEngine, useEngineImpl);
