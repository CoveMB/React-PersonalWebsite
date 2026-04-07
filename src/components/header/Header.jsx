import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import ScrollParallax from "../animation/ScrollParallax";
import { parallaxDataHeaderCard, parallaxDataHeaderImage } from "../../parallaxEffects/parallaxEffects";
import HeaderCard from "./HeaderCard";
import HeaderWave from "./HeaderWave";

const createPoints = (width, height) => {
  const horizontalStep = width / 20;
  const verticalStep = height / 20;
  const points = [];

  for (let x = 0; x < width; x += horizontalStep) {
    for (let y = 0; y < height; y += verticalStep) {
      const pointX = x + (Math.random() * horizontalStep);
      const pointY = y + (Math.random() * verticalStep);

      points.push({
        active: 0,
        circleActive: 0,
        originX: pointX,
        originY: pointY,
        radius: 2 + (Math.random() * 2),
        x: pointX,
        y: pointY,
      });
    }
  }

  return points;
};

const getDistance = (firstPoint, secondPoint) => ((firstPoint.x - secondPoint.x) ** 2) + ((firstPoint.y - secondPoint.y) ** 2);

const assignClosestPoints = (points) => points.map((point) => ({
  ...point,
  closest: points
    .filter((candidatePoint) => candidatePoint !== point)
    .sort((firstCandidate, secondCandidate) => getDistance(point, firstCandidate) - getDistance(point, secondCandidate))
    .slice(0, 5),
}));

const drawCircle = (context, point) => {
  if (!point.circleActive) {
    return;
  }

  context.beginPath();
  context.arc(point.x, point.y, point.radius, 0, 2 * Math.PI, false);
  context.fillStyle = `rgba(156,217,249,${point.circleActive})`;
  context.fill();
};

const drawLines = (context, point) => {
  if (!point.active) {
    return;
  }

  point.closest.forEach((closestPoint) => {
    context.beginPath();
    context.moveTo(point.x, point.y);
    context.lineTo(closestPoint.x, closestPoint.y);
    context.strokeStyle = `rgba(156,217,249,${point.active})`;
    context.stroke();
  });
};

const updatePointActivity = (point, target) => {
  const distance = Math.abs(getDistance(target, point));

  if (distance < 4000) {
    return { active: 0.3, circleActive: 0.6 };
  }

  if (distance < 20000) {
    return { active: 0.1, circleActive: 0.3 };
  }

  if (distance < 40000) {
    return { active: 0.02, circleActive: 0.1 };
  }

  return { active: 0, circleActive: 0 };
};

const animateScene = (scene) => {
  if (scene.animationEnabled) {
    scene.context.clearRect(0, 0, scene.width, scene.height);

    scene.points.forEach((point) => {
      const pointActivity = updatePointActivity(point, scene.target);
      point.active = pointActivity.active;
      point.circleActive = pointActivity.circleActive;
      drawLines(scene.context, point);
      drawCircle(scene.context, point);
    });
  }

  scene.animationFrameId = window.requestAnimationFrame(() => animateScene(scene));
};

const movePoint = (point, activeTweens) => {
  const tween = gsap.to(point, {
    duration: 1 + Math.random(),
    onComplete: () => {
      activeTweens.delete(tween);
      movePoint(point, activeTweens);
    },
    x: point.originX - 50 + (Math.random() * 100),
    y: point.originY - 50 + (Math.random() * 100),
  });

  activeTweens.add(tween);
};

export default function Header() {
  const canvasReference = useRef(null);
  const largeHeaderReference = useRef(null);

  useEffect(() => {
    const canvasElement = canvasReference.current;
    const largeHeaderElement = largeHeaderReference.current;

    if (!canvasElement || !largeHeaderElement) {
      return undefined;
    }

    const context = canvasElement.getContext("2d");

    if (!context) {
      return undefined;
    }

    const activeTweens = new Set();
    const scene = {
      animationEnabled: true,
      animationFrameId: 0,
      context,
      height: 0,
      points: [],
      target: { x: 0, y: 0 },
      width: 0,
    };

    const resizeScene = () => {
      scene.width = window.innerWidth;
      scene.height = window.innerHeight;
      scene.target = { x: scene.width / 2, y: scene.height / 2 };
      largeHeaderElement.style.height = `${scene.height}px`;
      canvasElement.width = scene.width;
      canvasElement.height = scene.height;
      scene.points = assignClosestPoints(createPoints(scene.width, scene.height));
    };

    const updateAnimationState = () => {
      scene.animationEnabled = window.scrollY <= scene.height;
    };

    const updateTarget = (event) => {
      scene.target = {
        x: event.pageX,
        y: event.pageY,
      };
    };

    resizeScene();
    updateAnimationState();
    scene.points.forEach((point) => movePoint(point, activeTweens));
    animateScene(scene);

    if (!("ontouchstart" in window)) {
      window.addEventListener("mousemove", updateTarget);
    }

    window.addEventListener("resize", resizeScene);
    window.addEventListener("scroll", updateAnimationState);

    return () => {
      window.cancelAnimationFrame(scene.animationFrameId);
      activeTweens.forEach((tween) => tween.kill());
      activeTweens.clear();

      if (!("ontouchstart" in window)) {
        window.removeEventListener("mousemove", updateTarget);
      }

      window.removeEventListener("resize", resizeScene);
      window.removeEventListener("scroll", updateAnimationState);
    };
  }, []);

  return (
    <>
      <ScrollParallax className="stickyHeader" parallaxData={parallaxDataHeaderImage}>
        <div className="demo-1">
          <div className="content">
            <div className="large-header" id="large-header" ref={largeHeaderReference}>
              <canvas id="demo-canvas" ref={canvasReference} />
            </div>
          </div>
        </div>
      </ScrollParallax>
      <ScrollParallax parallaxData={parallaxDataHeaderCard}>
        <HeaderCard />
      </ScrollParallax>
      <HeaderWave />
    </>
  );
}
