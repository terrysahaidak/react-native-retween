import A from 'react-native-reanimated';

type Proc = (...params: A.Adaptable<any>[]) => A.Node<number>;

export function maybeProc<T extends Proc>(animationRunner: T) {
  // wrap animation with a proc only if reanimated supports it
  // fixes compatibility with Expo and old versions of reanimated
  if (typeof A.proc === 'function') {
    return A.proc(animationRunner);
  }

  return animationRunner;
}
