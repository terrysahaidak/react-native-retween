import A from 'react-native-reanimated';
import {
  TimingAnimationConfig,
  runTiming,
} from './animations/runTiming';
import {
  SpringAnimationConfig,
  runSpring,
} from './animations/runSpring';

export enum AnimationState {
  START_POINT = 0,
  PLAY_FORWARD = 1,
  END_POINT = 2,
  PLAY_BACKWARD = 3,
}

export interface IAnimationConfig {
  animationState: A.Value<AnimationState>;
  clock: A.Clock;
  oppositeClock: A.Clock;
  value: A.Value<number>;
  dest: A.Adaptable<number>;
  resetValue?: A.Adaptable<number>;
  onFinish?: A.Adaptable<number>;
}

export interface AnimationInputValues {
  [key: string]: number;
}

export interface AnimationValues {
  [key: string]: A.Value<number>;
}

export interface TimingTweenAnimation<T> {
  timing: TimingAnimationConfig;
  from: T;
  to: T;
}

export interface TweenAnimationValues {
  from: AnimationValues;
  to: AnimationValues;
}

export interface SpringTweenAnimation<T> {
  spring: SpringAnimationConfig;
  from: T;
  to: T;
}

export type TweenAnimationProps<T> =
  | TimingTweenAnimation<T>
  | SpringTweenAnimation<T>; //| KeyframesAnimation<T>;

export function isSpring<T>(
  param: TweenAnimationProps<T>,
): param is SpringTweenAnimation<T> {
  return (
    typeof (param as SpringTweenAnimation<T>).spring !== 'undefined'
  );
}

export function isTiming<T>(
  param: TweenAnimationProps<T>,
): param is TimingTweenAnimation<T> {
  return (
    typeof (param as TimingTweenAnimation<T>).timing !== 'undefined'
  );
}

type AnimationRunner<T> = (
  config: IAnimationConfig,
  props: TweenAnimationProps<T>,
) => A.Node<number>;

export function getAnimationRunner<T>(
  props: TweenAnimationProps<T>,
): AnimationRunner<T> {
  if (isTiming(props)) {
    return runTiming;
  } else if (isSpring(props)) {
    return runSpring;
  } else {
    throw new Error('Unsupported animation');
  }
}

export const updateStateProc = A.proc((
  // custom
  value: A.Value<number>,
  dest: A.Adaptable<number>,
  // state
  finished: A.Value<number>,
  position: A.Value<number>,
  time: A.Value<number>,
  frameTime: A.Value<number>,
  // config
  toValue: A.Value<number>,
) =>
  A.block([
    A.set(finished, 0),
    A.set(time, 0),
    A.set(position, value),
    A.set(frameTime, 0),
    A.set(toValue, dest),
  ]),
);
