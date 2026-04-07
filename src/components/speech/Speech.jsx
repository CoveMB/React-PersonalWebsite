import { useEffect, useReducer, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import Spinner from "../Spinner";
import { capitalize } from "../../utils/strings";

const emailActions = {
  fail: "fail",
  sending: "sending",
  success: "success",
  updateSender: "sender",
};

const initialEmailState = {
  errorMessage: "",
  fail: false,
  sender: "",
  sending: false,
  success: false,
};

const reducer = (state, { payload, type }) => {
  switch (type) {
    case emailActions.updateSender:
      return { ...state, sender: payload };
    case emailActions.sending:
      return { ...state, fail: false, sending: true, success: false };
    case emailActions.fail:
      return { ...state, errorMessage: payload, fail: true, sending: false, success: false };
    case emailActions.success:
      return { ...state, fail: false, sending: false, success: true };
    default:
      return state;
  }
};

const delay = (duration) => new Promise((resolve) => {
  window.setTimeout(resolve, duration);
});

const emailExpression = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

export default function Speech() {
  const { listening, resetTranscript, transcript } = useSpeechRecognition();
  const [ emailState, dispatch ] = useReducer(reducer, initialEmailState);
  const [ hasMounted, setHasMounted ] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return null;
  }

  const updateSender = (event) => {
    dispatch({ payload: event.target.value, type: emailActions.updateSender });
  };

  const transcriptCompleted = () => {
    if (transcript.length > 4) {
      return true;
    }

    dispatch({ payload: "Press start to speech a little something", type: emailActions.fail });
    return false;
  };

  const verifyEmail = () => {
    if (emailExpression.test(emailState.sender)) {
      return true;
    }

    dispatch({ payload: "Oups it seem that that you entered an invalid email", type: emailActions.fail });
    return false;
  };

  const sendEmail = async () => {
    const integrationEndpoint = process.env.NEXT_PUBLIC_INTEGRATION_ENDPOINT;

    if (!integrationEndpoint) {
      dispatch({ payload: "Missing NEXT_PUBLIC_INTEGRATION_ENDPOINT for contact form delivery.", type: emailActions.fail });
      return;
    }

    dispatch({ type: emailActions.sending });
    await delay(3000);

    try {
      const response = await fetch(integrationEndpoint, {
        body: JSON.stringify({ sender: emailState.sender, transcript: capitalize(transcript) }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      dispatch({ type: emailActions.success });
    } catch {
      dispatch({ payload: "Oups something went wrong! You can notify me at bmarquiscom@gmail.com", type: emailActions.fail });
    }
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
        <label className="labelFromEmail" htmlFor="from">
          From:
        </label>
        <input
          autoComplete="email"
          className="inputFromEmail"
          id="from"
          inputMode="email"
          name="email"
          onChange={updateSender}
          placeholder="emailicanrespondto@email.com"
          type="email"
        />
        <label className="labelFromEmail" htmlFor="message">
          Message:
        </label>
      </div>
      <div className="paper">
        <div className="paper-content">
          <textarea
            autoComplete="off"
            id="message"
            name="message"
            placeholder="Press the start button and let me know if next monday would be a good time to jump on a call?"
            readOnly
            value={capitalize(transcript)}
          />
        </div>
      </div>
      <div className="speechButtons speechPart">
        {emailState.fail ? <div className="emailFeedback emailErrorFeedback">{emailState.errorMessage}</div> : null}
        {emailState.success ? <div className="emailFeedback emailSuccessFeedback">Thanks! I'll get back to you</div> : null}

        <button className="speechButton" onClick={resetTranscript} type="button">
          Reset
        </button>

        <button className="speechButton" onClick={SpeechRecognition.startListening} type="button">
          Start
        </button>

        {listening ? <FontAwesomeIcon icon={faMicrophone} /> : null}

        {!emailState.sending ? (
          <button className="speechButton speechButtonSend" onClick={handleSendEmail} type="button">
            Send
          </button>
        ) : (
          <div className="speechButtonSend">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}
