import {
  IAnimationConfig,
  TimingTweenAnimation,
  AnimationState,
  updateStateProc,
} from './../common';
import A, { Easing } from 'react-native-reanimated';

export interface TimingAnimationConfig {
  duration: number;
  easing?: A.EasingFunction;
}

const timingProc = A.proc((
  clock: A.Clock,
  // state
  finished: A.Value<number>,
  position: A.Value<number>,
  time: A.Value<number>,
  frameTime: A.Value<number>,
  // config
  toValue: A.Adaptable<number>,
  duration: A.Adaptable<number>,
) =>
  A.timing(
    clock,
    {
      finished,
      position,
      time,
      frameTime,
    },
    {
      toValue,
      duration,
      easing: Easing.linear,
    },
  ),
);

function timing(
  clock: A.Clock,
  state: {
    finished: A.Value<number>;
    frameTime: A.Value<number>;
    position: A.Value<number>;
    time: A.Value<number>;
  },
  config: {
    toValue: A.Adaptable<number>;
    duration: A.Adaptable<number>;
    easing: A.EasingFunction;
  },
) {
  return timingProc(
    clock,
    state.finished,
    state.position,
    state.time,
    state.frameTime,
    config.toValue,
    config.duration,
  );
  // return A.timing(clock, state, config);
}

export const runTiming = (
  {
    animationState,
    clock,
    oppositeClock,
    value,
    dest,
    resetValue = dest,
    onFinish,
  }: IAnimationConfig,
  props: TimingTweenAnimation<any>,
) => {
  const state = {
    finished: new A.Value(0),
    position: new A.Value(0),
    time: new A.Value(0),
    frameTime: new A.Value(0),
  };

  const config = {
    duration: props.timing.duration,
    toValue: new A.Value(0),
    easing: props.timing.easing || Easing.inOut(Easing.ease),
  };

  return A.block([
    // stops opposite (opposite direction) clock
    A.cond(
      A.clockRunning(oppositeClock),
      A.stopClock(oppositeClock),
      0,
    ),
    A.cond(A.clockRunning(clock), 0, [
      updateStateProc(
        value,
        dest,
        state.finished,
        state.position,
        state.time,
        state.frameTime,
        config.toValue,
      ),
      A.startClock(clock),
    ]),
    timing(clock, state, config),
    // A.cond(A.eq(animationState, AnimationState.START_POINT), [
    //   updateStateProc(
    //     resetValue,
    //     resetValue,
    //     state.finished,
    //     state.position,
    //     state.time,
    //     state.frameTime,
    //     config.toValue,
    //   ),
    //   A.stopClock(clock),
    // ]),
    A.cond(state.finished, A.block([A.stopClock(clock), onFinish])),
    A.set(value, state.position),
  ]);
};
