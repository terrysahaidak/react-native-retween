import A from 'react-native-reanimated';
import {
  TimingAnimationConfig,
  runTiming,
} from './animations/runTiming';
import {
  SpringAnimationConfig,
  runSpring,
} from './animations/runSpring';

export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export enum AnimationState {
  START_POINT = 0,
  PLAY_FORWARD = 1,
  END_POINT = 2,
  PLAY_BACKWARD = 3,
}

export interface IAnimationConfig {
  clock: A.Clock;
  oppositeClock: A.Clock;
  value: A.Value<number>;
  dest: A.Adaptable<number>;
  onFinish?: A.Node<number>;
}

export type AnimatedInputValue = number | RGBColor;

export interface AnimationInputValues {
  [key: string]: AnimatedInputValue;
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

type AnimationRunner = (
  config: IAnimationConfig,
  // FIXME: Find a better type
  props: any,
) => A.Node<number>;

export function getAnimationRunner<T>(
  props: TweenAnimationProps<T>,
): AnimationRunner {
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

const interpolateProc = A.proc(
  (
    value: A.Value<number>,
    input1: A.Adaptable<number>,
    input2: A.Adaptable<number>,
    output1: A.Adaptable<number>,
    output2: A.Adaptable<number>,
  ) =>
    A.interpolate(value, {
      inputRange: [input1, input2],
      outputRange: [output1, output2],
      extrapolate: A.Extrapolate.EXTEND,
    }),
);

export function interpolate(
  value: A.Value<number>,
  config: {
    inputRange: [number, number];
    outputRange: [number, number];
  },
) {
  return interpolateProc(
    value,
    config.inputRange[0],
    config.inputRange[1],
    config.outputRange[0],
    config.outputRange[1],
  );
}

export const bInterpolateColorProc = A.proc(
  (
    animationValue: A.Value<number>,
    input1: A.Adaptable<number>,
    input2: A.Adaptable<number>,
    r1: A.Adaptable<number>,
    r2: A.Adaptable<number>,
    g1: A.Adaptable<number>,
    g2: A.Adaptable<number>,
    b1: A.Adaptable<number>,
    b2: A.Adaptable<number>,
  ) =>
    A.color(
      A.round(
        A.interpolate(animationValue, {
          inputRange: [input1, input2],
          outputRange: [r1, r2],
          extrapolate: A.Extrapolate.EXTEND,
        }),
      ),
      A.round(
        A.interpolate(animationValue, {
          inputRange: [input1, input2],
          outputRange: [g1, g2],
          extrapolate: A.Extrapolate.EXTEND,
        }),
      ),
      A.round(
        A.interpolate(animationValue, {
          inputRange: [input1, input2],
          outputRange: [b1, b2],
          extrapolate: A.Extrapolate.EXTEND,
        }),
      ),
    ),
);

export const bInterpolateColor = (
  value: A.Adaptable<number>,
  config: {
    inputRange: [number, number];
    outputRange: [RGBProp, RGBProp];
  },
) =>
  bInterpolateColorProc(
    value,
    config.inputRange[0],
    config.inputRange[1],
    config.outputRange[0].r,
    config.outputRange[1].r,
    config.outputRange[0].g,
    config.outputRange[1].g,
    config.outputRange[0].b,
    config.outputRange[1].b,
  );
