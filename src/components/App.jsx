import React, { Fragment, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';

import OpacityParallax from './hoc/OpacityParallax';

import NavBtns from './NavBtns';
import NavBar from './navbar/NavBar';
import Header from './header/Header';
import Story from './speech/Speech';
import QualificationContainer from './qualifications/QualificationContainer';
import Projects from './projects/Projects';
import ParalaxTitle from './ParalaxTitle';
import Footer from './footer/Footer';

const app = () => {

  const dispatch = useStore(false)[1];

  const cardsRef = useRef();
  const featuresRef = useRef();
  const ongoingRef = useRef();

  const adjustOffsets = () => {

    const offsetsToSet =    {
      top     : 0,
      cards   : cardsRef.current.offsetTop,
      features: featuresRef.current.offsetTop,
      ongoing : ongoingRef.current.offsetTop
    };

    dispatch('SET_REFS', offsetsToSet);

  };

  useEffect(() => {

    const updateSize = () => {

      adjustOffsets();

    };

    window.addEventListener('resize', updateSize);
    updateSize();

    return () => {

      window.removeEventListener('resize', updateSize);

    };

  }, []);

  return (
    <>
      <NavBtns />
      <NavBar />
      <Header />
      <OpacityParallax nextId="#projects">
        <div className="normalizedBackground" id="cardsDiv" ref={cardsRef}>
          <ParalaxTitle title="My Peculiarities" />
          <QualificationContainer />
        </div>
      </OpacityParallax>
      <OpacityParallax nextId="#story">
        <div className="normalizedBackgroundWhite" ref={featuresRef}>
          <ParalaxTitle title="Some Of My Projects" idElement="projects" />
          <Projects />
        </div>
      </OpacityParallax>
      <div className="normalizedBackgroundWhite" ref={ongoingRef}>
        <ParalaxTitle title="Speech me an email!" idElement="story" />
        <Story />
      </div>
      <Footer />
    </>
  );

};

export default app;
