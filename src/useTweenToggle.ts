import A from 'react-native-reanimated';
import { TweenAnimationProps, AnimationInputValues } from './common';
import { useTween, ReanimatedValues } from './useTween';
import { useEffect, useRef, useCallback } from 'react';

export interface ToggleAnimationBag<T extends AnimationInputValues> {
  transition: A.Value<number>;
  values: ReanimatedValues<T>;
  reset(): void;
}

export function useTweenToggle<T extends AnimationInputValues>(
  config: () => TweenAnimationProps<T>,
  toggleValue: boolean,
): ToggleAnimationBag<T> {
  const mount = useRef(false);
  const backward = useRef(false);
  const { play, values, stop, transition } = useTween<T>(config);

  useEffect(() => {
    if (!mount.current) {
      mount.current = true;
    } else {
      play(backward.current);
      backward.current = !backward.current;
    }
  }, [toggleValue]);

  const onStop = useCallback(() => {
    stop();
    backward.current = false;
  }, []);

  return {
    values,
    reset: onStop,
    transition,
  };
}
