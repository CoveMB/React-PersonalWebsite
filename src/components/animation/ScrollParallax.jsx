"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const easingMap = {
  easeIn: "power1.in",
  linear: "none",
};

const propertyMap = {
  opacity: "opacity",
  scale: "scale",
  translateX: "x",
  translateY: "y",
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
      scrub: true,
    };
  }

  if (typeof step.start === "string" && step.start !== "self") {
    const endTrigger = document.querySelector(step.start);

    if (endTrigger) {
      return {
        trigger: endTrigger,
        start: "top top",
        end: `+=${step.duration}`,
        invalidateOnRefresh: true,
        scrub: true,
      };
    }
  }

  return {
    trigger: element,
    start: "top bottom",
    end: `+=${step.duration}`,
    invalidateOnRefresh: true,
    scrub: true,
  };
};

export default function ScrollParallax({ as: Component = "div", children, className = "", parallaxData = [] }) {
  const elementReference = useRef(null);

  useLayoutEffect(() => {
    if (!elementReference.current || parallaxData.length === 0) {
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
          ease: easingMap[step.easing] ?? step.easing ?? "none",
          scrollTrigger: createScrollTriggerConfig({ element: elementReference.current, step }),
        });
      });
    }, elementReference);

    return () => {
      context.revert();
    };
  }, [parallaxData]);

  return (
    <Component className={className} ref={elementReference}>
      {children}
    </Component>
  );
}
