import React, { Fragment, useEffect } from 'react';
import { useStore } from '../store/useStore';


const navBtns = (props) => {
  const [state, dispatch] = useStore();
  const { scrollTo } = props;

  useEffect(() => {
    const updatePosition = () => {
      const currentPosition = window.scrollY;

      if (state.refsOffsets) {
        if (currentPosition > state.refsOffsets.ongoing - 400) {
          if (state.position !== "ongoing") {
            dispatch("SET_POSITION", "ongoing");
          }
        } else if (currentPosition > state.refsOffsets.features - 400
          && currentPosition < state.refsOffsets.ongoing - 400) {
          if (state.position !== "features") {
            dispatch("SET_POSITION", "features");
          }
        } else if (currentPosition < state.refsOffsets.features - 400
          && currentPosition > state.refsOffsets.cards - 400) {
          if (state.position !== "cards") {
            dispatch("SET_POSITION", "cards");
          }
        } else if (currentPosition < state.refsOffsets.cards - 400) {
          if (state.position !== "top") {
            dispatch("SET_POSITION", "top");
          }
        }
      }
    };

    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition);
    };
  });

  const getNavBtnClasses = (navBtn) => {
    if (navBtn === state.position) {
      return `NavBtn activateBtn NavBtn${navBtn}`;
    }
    return `NavBtn NavBtn${navBtn}`;
  };

  return (
    <Fragment>
      <button className={getNavBtnClasses("top")} onClick={() => dispatch("GO_TO_REF", "top")} />
      <button className={getNavBtnClasses("cards")} onClick={() => dispatch("GO_TO_REF", "cards")} />
      <button className={getNavBtnClasses("features")} onClick={() => dispatch("GO_TO_REF", "features")} />
      <button className={getNavBtnClasses("ongoing")} onClick={() => dispatch("GO_TO_REF", "ongoing")} />
    </Fragment>
  );
};

export default navBtns;
