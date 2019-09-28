import { useMemo, useState, useCallback } from 'react';
import A from 'react-native-reanimated';
import {
  AnimationState,
  AnimationInputValues,
  TweenAnimationProps,
  getAnimationRunner,
} from './common';

type ReanimatedValues<T> = { [K in keyof T]: A.Value<number> };

interface AnimationBag<T extends AnimationInputValues> {
  values: ReanimatedValues<T>;
  // stop(): void;
  play(backward?: boolean): void;
  stop(): void;
  // pause(): void;
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

  const values: ReanimatedValues<T> = keys.reduce(
    (acc, current) => {
      acc[current] = new A.Value(props.from[current]);

      return acc;
    },
    {} as any,
  );

  const runAnimation = getAnimationRunner<T>(props);

  const { forwardAnimations, backwardAnimations } = keys.reduce(
    (acc, key, index) => {
      const from = props.from[key];
      const to = props.to[key];
      const currentValue = values[key];

      const forwardAnimationClock = new A.Clock();
      const backwardAnimationClock = new A.Clock();
      const first = index === 0;

      const forwardAnimation = runAnimation(
        {
          animationState,
          clock: forwardAnimationClock,
          oppositeClock: backwardAnimationClock,
          value: currentValue,
          dest: to,
          resetValue: from,
          onFinish: first
            ? 0
            : A.set(animationState, AnimationState.END_POINT),
        },
        props,
      );

      const backwardAnimation = runAnimation(
        {
          animationState,
          clock: backwardAnimationClock,
          oppositeClock: forwardAnimationClock,
          value: currentValue,
          dest: from,
          onFinish: first
            ? 0
            : A.set(animationState, AnimationState.START_POINT),
        },
        props,
      );

      acc.forwardAnimations.push(forwardAnimation);

      acc.backwardAnimations.push(backwardAnimation);

      return acc;
    },
    {
      forwardAnimations: [],
      backwardAnimations: [],
    },
  );

  const animation = A.block([
    A.cond(
      A.eq(animationState, AnimationState.PLAY_FORWARD),
      // run all the forward animations
      A.block(forwardAnimations),
      // 0,
    ),
    A.cond(
      A.eq(animationState, AnimationState.PLAY_BACKWARD),
      // run all the backward animations
      A.block(backwardAnimations),
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
  };
}

function useReset() {
  const [count, setCount] = useState(0);

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

  const { play, values, animation } = useMemo<Animation<TValues>>(
    () => {
      const animation = config();

      return generateTweenAnimation<TValues>(animation);
    },
    depsToUse,
  );

  A.useCode(animation, depsToUse);

  return {
    play,
    stop,
    values,
  };
}
