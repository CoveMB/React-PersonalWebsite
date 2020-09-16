import React, { useReducer } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophoneAlt } from '@fortawesome/free-solid-svg-icons';
import Spinner from '../Spinner';

const emailActions = {
  sending     : 'sending',
  fail        : 'fail',
  success     : 'success',
  updateSender: 'sender'
};

const reducer = (state, { type, payload }) => {

  switch (type) {

    case emailActions.updateSender:

      return {
        ...state, sender: payload
      };

    case emailActions.sending:

      return {
        ...state, success: false, sending: true, fail: false
      };

    case emailActions.fail:
      return {
        ...state, success: false, sending: false, fail: true, errorMessage: payload
      };

    case emailActions.success:
      return {
        ...state, success: true, sending: false, fail: false
      };

    default:
      return state;

  }

};

const initialEmailState = {
  success     : false,
  sending     : false,
  fail        : false,
  sender      : '',
  errorMessage: ''
};

const Speech = () => {

  const { transcript, resetTranscript, listening } = useSpeechRecognition();

  const [ emailState, dispatch ] = useReducer(reducer, initialEmailState);

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {

    return null;

  }

  const updateSender = (event) => {

    dispatch({
      type: emailActions.updateSender, payload: event.target.value
    });

  };

  const transcriptCompleted = () => {

    if (transcript.length > 4) return true;

    dispatch({
      type: emailActions.fail, payload: 'Press start to speech a little something'
    });

    return false;

  };

  const verifyEmail = () => {

    const testEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailState.sender);

    if (testEmail) {

      return (true);

    }

    dispatch({
      type: emailActions.fail, payload: 'Oups it seem that that you entered an invalid email'
    });

    return false;

  };

  const sendEmail = async () => {

    dispatch({ type: emailActions.sending });

    await setTimeout(async () => {

      try {

        await fetch(process.env.INTEGRATION_ENDPOINT, {
          method : 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            sender    : emailState.sender,
            transcript: transcript.charAt(0).toUpperCase() + transcript.slice(1)
          }),
        });

        dispatch({ type: emailActions.success });

      } catch {

        dispatch({
          type: emailActions.fail, payload: 'Oups something went wrong! You can notify me at bmarquiscom@gmail.com'
        });

      }

    }, 3000);

  };

  const handleSendEmail = async () => {

    if (transcriptCompleted() && verifyEmail()) {

      await sendEmail();
      resetTranscript();

    }

  };

  return (
    <div className="cardBox flexColumnMobile">
      <div className="speechPart">
        <label
          htmlFor="from"
          className="labelFromEmail"
        >
          From:
        </label>
        <input
          name="from"
          className="inputFromEmail"
          placeholder="emailicanrespondto@email.com"
          type="email"
          onChange={updateSender}
        />
        <label
          htmlFor="message"
          className="labelFromEmail"
        >
          Message:
        </label>
      </div>
      <div className="paper">
        <div className="paper-content">
          <textarea
            onChange={() => {}}
            value={transcript}
            placeholder="Press the start button and let me know if next monday would be a good time to jump on a call?"
          />
        </div>
      </div>
      <div className="speechButtons speechPart">

        {emailState.fail
        && <div className="emailFeedback emailErrorFeedback">{emailState.errorMessage}</div>}

        {emailState.success
        && <div className="emailFeedback emailSuccessFeedback">Thanks! I'll get back to you</div>}

        <button
          className="speechButton"
          type="button"
          onClick={resetTranscript}
        >
          Reset
        </button>

        <button
          className="speechButton"
          type="button"
          onClick={SpeechRecognition.startListening}
        >
          Start
        </button>

        {listening && <FontAwesomeIcon icon={faMicrophoneAlt} />}

        { !emailState.sending
          ? (
            <button
              className="speechButton speechButtonSend"
              type="button"
              onClick={handleSendEmail}
            >
              Send
            </button>
          )
          : (
            <div className="speechButtonSend">
              {' '}
              <Spinner />
              {' '}
            </div>
          )}
      </div>

    </div>
  );

};

export default Speech;
