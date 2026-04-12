import { useEffect, useRef } from "react";
import { getCurrentSection } from "../../navigation/navigationModel";
import { useStore } from "../../store/useStore";

export default function NavigationObserver() {
  const [ state, dispatch ] = useStore();
  const animationFrameReference = useRef(null);
  const positionReference = useRef(state.position);
  const refsOffsetsReference = useRef(state.refsOffsets);

  useEffect(() => {
    positionReference.current = state.position;
    refsOffsetsReference.current = state.refsOffsets;
  }, [ state.position, state.refsOffsets ]);

  useEffect(() => {
    const updatePosition = () => {
      animationFrameReference.current = null;
      const nextPosition = getCurrentSection({
        currentPosition: window.scrollY,
        refsOffsets: refsOffsetsReference.current,
        viewportHeight: window.innerHeight,
      });

      if (positionReference.current !== nextPosition) {
        positionReference.current = nextPosition;
        dispatch("SET_POSITION", nextPosition);
      }
    };

    const schedulePositionUpdate = () => {
      if (animationFrameReference.current !== null) {
        return;
      }

      animationFrameReference.current = window.requestAnimationFrame(
        updatePosition,
      );
    };

    window.addEventListener("scroll", schedulePositionUpdate, {
      passive: true,
    });
    window.addEventListener("resize", schedulePositionUpdate);
    schedulePositionUpdate();

    return () => {
      window.removeEventListener("scroll", schedulePositionUpdate);
      window.removeEventListener("resize", schedulePositionUpdate);

      if (animationFrameReference.current !== null) {
        window.cancelAnimationFrame(animationFrameReference.current);
      }
    };
  }, [ dispatch, state.refsOffsets ]);

  return null;
}
