import {
  IAnimationConfig,
  SpringTweenAnimation,
  updateStateProc,
} from './../common';
import A from 'react-native-reanimated';

export type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
  restSpeedThreshold: number;
  restDisplacementThreshold: number;
  overshootClamping: boolean;
};

export interface SpringAnimationConfig
  extends Partial<SpringConfig> {}

const springProc = A.proc(
  (
    finished: A.Value<number>,
    velocity: A.Value<number>,
    position: A.Value<number>,
    time: A.Value<number>,
    prevPosition: A.Value<number>,
    toValue: A.Adaptable<number>,
    damping: A.Adaptable<number>,
    mass: A.Adaptable<number>,
    stiffness: A.Adaptable<number>,
    overshootClamping: A.Adaptable<number>,
    restSpeedThreshold: A.Adaptable<number>,
    restDisplacementThreshold: A.Adaptable<number>,
    clock: A.Clock,
  ) =>
    A.spring(
      clock,
      {
        finished,
        velocity,
        position,
        time,
        // @ts-ignore
        prevPosition,
      },
      {
        toValue,
        damping,
        mass,
        stiffness,
        overshootClamping,
        restDisplacementThreshold,
        restSpeedThreshold,
      },
    ),
);

type AnimatedSpringConfig = {
  damping: A.Adaptable<number>;
  mass: A.Adaptable<number>;
  stiffness: A.Adaptable<number>;
  restSpeedThreshold: A.Adaptable<number>;
  restDisplacementThreshold: A.Adaptable<number>;
  overshootClamping: A.Adaptable<number>;
};

const defaultConfig = A.SpringUtils.makeDefaultConfig();

function transformSpringConfigToAnimatedValues(
  config: Partial<SpringConfig>,
): AnimatedSpringConfig {
  return {
    damping: config.damping
      ? new A.Value(config.damping)
      : defaultConfig.damping,
    stiffness: config.stiffness
      ? new A.Value(config.stiffness)
      : defaultConfig.stiffness,
    mass: config.mass ? new A.Value(config.mass) : defaultConfig.mass,
    restDisplacementThreshold: config.restDisplacementThreshold
      ? new A.Value(config.restDisplacementThreshold)
      : defaultConfig.restDisplacementThreshold,
    restSpeedThreshold: config.restSpeedThreshold
      ? new A.Value(config.restSpeedThreshold)
      : defaultConfig.restSpeedThreshold,
    overshootClamping: new A.Value(config.overshootClamping ? 1 : 0),
  };
}

interface RunSpringAnimationConfig extends AnimatedSpringConfig {
  toValue: A.Adaptable<number>;
}

// @ts-ignore
function spring(
  clock: A.Clock,
  state: {
    finished: A.Value<number>;
    velocity: A.Value<number>;
    position: A.Value<number>;
    time: A.Value<number>;
  },
  config: RunSpringAnimationConfig,
) {
  return springProc(
    state.finished,
    state.velocity,
    state.position,
    state.time,
    new A.Value(0),
    config.toValue,
    config.damping,
    config.mass,
    config.stiffness,
    config.overshootClamping,
    config.restSpeedThreshold,
    config.restDisplacementThreshold,
    clock,
  );
}

export const runSpring = (
  { clock, oppositeClock, value, dest, onFinish }: IAnimationConfig,
  props: SpringTweenAnimation<any>,
) => {
  const state = {
    finished: new A.Value(0),
    position: new A.Value(0),
    time: new A.Value(0),
    velocity: new A.Value(0),
  };

  const config = {
    ...transformSpringConfigToAnimatedValues(props.spring),
    toValue: dest,
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
        state.velocity,
        config.toValue,
      ),
      A.startClock(clock),
    ]),
    spring(clock, state, config),
    A.cond(
      state.finished,
      // @ts-ignore
      A.block([A.stopClock(clock), onFinish]),
    ),
    A.set(value, state.position),
  ]);
};
