"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "../../utils/motionPreference";

gsap.registerPlugin(ScrollTrigger);

const easingMap = {
  linear: "none",
};

const propertyMap = {
  opacity: "opacity",
  translateY: "y",
};

const createScrollPlaybackConfig = (step, defaultScrub = false) => {
  const shouldScrub = step.scrub ?? defaultScrub;

  return {
    once: step.once ?? false,
    scrub: shouldScrub,
    toggleActions: shouldScrub ? undefined : "play none none none",
  };
};

const buildAnimationValues = (properties) => properties.reduce(
  (accumulator, propertyDefinition) => {
    const gsapProperty = propertyMap[propertyDefinition.property];

    if (!gsapProperty) {
      return accumulator;
    }

    return {
      from: {
        ...accumulator.from,
        [gsapProperty]: propertyDefinition.startValue,
      },
      to: {
        ...accumulator.to,
        [gsapProperty]: propertyDefinition.endValue,
      },
    };
  },
  { from: {}, to: {} }
);

const createScrollTriggerConfig = ({ step, element }) => {
  if (typeof step.start === "number") {
    return {
      trigger: document.documentElement,
      start: step.start,
      end: step.start + step.duration,
      invalidateOnRefresh: true,
      ...createScrollPlaybackConfig(step, true),
    };
  }

  if (typeof step.start === "string" && step.start !== "self") {
    const targetElement = document.querySelector(step.start);

    if (targetElement) {
      return {
        trigger: targetElement,
        start: step.triggerStart ?? "top 85%",
        end: step.triggerEnd ?? `+=${step.duration ?? 1}`,
        invalidateOnRefresh: true,
        ...createScrollPlaybackConfig(step),
      };
    }
  }

  return {
    trigger: element,
    start: step.triggerStart ?? "top 85%",
    end: step.triggerEnd ?? `+=${step.duration ?? 1}`,
    invalidateOnRefresh: true,
    ...createScrollPlaybackConfig(step),
  };
};

export default function ScrollParallax({ as: Component = "div", children, className = "", parallaxData = [] }) {
  const elementReference = useRef(null);

  useLayoutEffect(() => {
    if (
      !elementReference.current ||
      parallaxData.length === 0 ||
      prefersReducedMotion()
    ) {
      return undefined;
    }

    const context = gsap.context(() => {
      parallaxData.forEach((step) => {
        const animationValues = buildAnimationValues(step.properties ?? []);

        if (Object.keys(animationValues.from).length === 0) {
          return;
        }

        gsap.fromTo(elementReference.current, animationValues.from, {
          ...animationValues.to,
          duration: step.animationDuration ?? 0.55,
          ease: easingMap[step.easing] ?? step.easing ?? "none",
          scrollTrigger: createScrollTriggerConfig({ element: elementReference.current, step }),
        });
      });
    }, elementReference);

    return () => {
      context.revert();
    };
  }, [parallaxData]);

  useLayoutEffect(() => {
    if (
      !elementReference.current ||
      typeof ResizeObserver === "undefined" ||
      prefersReducedMotion()
    ) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    resizeObserver.observe(elementReference.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Component className={className} ref={elementReference}>
      {children}
    </Component>
  );
}
