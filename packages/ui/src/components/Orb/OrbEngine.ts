import {
  OrbState,
  OrbTransitionOptions,
  OrbListener,
  OrbEngineInstance,
} from './Orb.types';

export function createOrbEngine(
  initialState: OrbState = 'idle'
): OrbEngineInstance {
  let currentOptions: OrbTransitionOptions = {
    state: initialState,
    source: 'system',
  };

  const listeners: Set<OrbListener> = new Set();

  function transition(options: OrbTransitionOptions | OrbState): void {
    const nextOptions: OrbTransitionOptions =
      typeof options === 'string' ? { state: options } : options;

    if (
      currentOptions.state === nextOptions.state &&
      currentOptions.source === nextOptions.source
    ) {
      return;
    }

    const prev = currentOptions;
    currentOptions = { ...nextOptions };

    listeners.forEach((listener) => {
      try {
        listener(currentOptions, prev);
      } catch (err) {
        console.error('[OrbEngine] Error in listener execution:', err);
      }
    });
  }

  function getState(): OrbState {
    return currentOptions.state;
  }

  function getOptions(): OrbTransitionOptions {
    return { ...currentOptions };
  }

  function subscribe(listener: OrbListener): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }

  function destroy(): void {
    listeners.clear();
  }

  return {
    transition,
    getState,
    getOptions,
    subscribe,
    destroy,
  };
}
