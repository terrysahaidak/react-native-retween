import { useMemo, useState, useCallback } from 'react';
import A from 'react-native-reanimated';
import {
  AnimationState,
  AnimationInputValues,
  TweenAnimationProps,
  getAnimationRunner,
  interpolate,
  bInterpolateColor,
} from './common';
import { isRGB } from './utils/fromRgb';

export type ReanimatedValues<T> = { [K in keyof T]: A.Value<number> };

export interface AnimationBag<T extends AnimationInputValues> {
  transition: A.Value<number>;
  values: ReanimatedValues<T>;
  play(backward?: boolean): void;
  stop(): void;
}

interface Animation<T extends AnimationInputValues>
  extends AnimationBag<T> {
  animation: A.Node<any>;
}

function generateTweenAnimation<T extends AnimationInputValues>(
  props: TweenAnimationProps<T>,
): Animation<T> {
  const animationState = new A.Value<AnimationState>(
    AnimationState.START_POINT,
  );
  const keys = Object.keys(props.from);
  const masterValue = new A.Value(0);
  const inputRange: [number, number] = [0, 1];

  const values: ReanimatedValues<T> = keys.reduce(
    (acc, current) => {
      const from = props.from[current];
      const to = props.to[current];

      if (isRGB(from) && isRGB(to)) {
        acc[current] = bInterpolateColor(masterValue, {
          inputRange,
          outputRange: [from, to],
        });
      } else if (typeof from === 'number' && typeof to === 'number') {
        acc[current] = interpolate(masterValue, {
          inputRange,
          outputRange: [from, to],
        });
      } else {
        throw new Error(
          `Unsupported value 'from: ${from}, to: ${to}' of prop ${current}`,
        );
      }

      return acc;
    },
    {} as any,
  );

  const runAnimation = getAnimationRunner<T>(props);

  const forwardAnimationClock = new A.Clock();
  const backwardAnimationClock = new A.Clock();

  const animation = A.block([
    A.cond(
      A.eq(animationState, AnimationState.PLAY_FORWARD),
      // run all the forward animations
      runAnimation(
        {
          clock: forwardAnimationClock,
          oppositeClock: backwardAnimationClock,
          value: masterValue,
          dest: 1,
          onFinish: A.set(animationState, AnimationState.END_POINT),
        },
        props,
      ),
      // 0,
    ),
    A.cond(
      A.eq(animationState, AnimationState.PLAY_BACKWARD),
      // run all the backward animations
      runAnimation(
        {
          clock: backwardAnimationClock,
          oppositeClock: forwardAnimationClock,
          value: masterValue,
          dest: 0,
          onFinish: A.set(animationState, AnimationState.START_POINT),
        },
        props,
      ),
    ),
  ]);

  function play(backward?: boolean) {
    animationState.setValue(
      backward
        ? AnimationState.PLAY_BACKWARD
        : AnimationState.PLAY_FORWARD,
    );
  }

  function stop() {
    animationState.setValue(AnimationState.START_POINT);
  }

  return {
    animation,
    play,
    stop,
    values,
    transition: masterValue,
  };
}

function useReset() {
  const [count, setCount] = useState<number>(0);

  const reset = useCallback<any>(() => {
    setCount((val) => val + 1);
  }, []);

  return [count, reset];
}

export function useTween<TValues extends AnimationInputValues>(
  config: () => TweenAnimationProps<TValues>,
  deps: any[] = [],
): AnimationBag<TValues> {
  // TODO: Find better way to stop/reset animation
  const [count, stop] = useReset();

  const depsToUse = [...deps, count];

  const { play, values, animation, transition } = useMemo<
    Animation<TValues>
  >(() => {
    const animation = config();

    return generateTweenAnimation<TValues>(animation);
  }, depsToUse);

  A.useCode(animation, depsToUse);

  return {
    play,
    stop,
    values,
    transition,
  };
}
