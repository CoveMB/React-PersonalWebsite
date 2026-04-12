const createAnimationProperty = ({
  endValue,
  property,
  startValue,
}) => ({
  endValue,
  property,
  startValue,
});

const createSubtleRevealParallaxStep = ({
  animationDuration = 0.55,
  distance = 24,
  triggerStart = "top 85%",
} = {}) => ({
  animationDuration,
  duration: 1,
  easing: "power2.out",
  once: true,
  properties: [
    createAnimationProperty({
      endValue: 1,
      property: "opacity",
      startValue: 0,
    }),
    createAnimationProperty({
      endValue: 0,
      property: "translateY",
      startValue: distance,
    }),
  ],
  scrub: false,
  start: "self",
  triggerStart,
});

export const subtleRevealParallaxData = [createSubtleRevealParallaxStep()];
