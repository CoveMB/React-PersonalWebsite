import React, { Fragment, useState } from 'react';
import Spinner from '../Spinner';

const headerForm = () => {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [succes, setsucces] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSending(true);
    setTimeout(() => {
      fetch(process.env.ZAPPIER_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ email }),
      }).then(() => {
        setSending(false);
        setsucces(true);
      }).catch(() => alert("There was an error, please try again"));
    }, 3000);
    setEmail("");
  };

  const emailBodyContent = () => {
    if (succes) {
      return <h2 className="emailSucces">Merci, on vous contact prochainement!</h2>;
    } else if (sending) {
      return <Spinner />;
    }
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="emailInput">Email addresse</label>
          <input
            ref={emailInput => emailInput && emailInput.focus()}
            type="email"
            required
            className="form-control"
            id="emailInput"
            value={email}
            placeholder="Laissez nous votre email"
            onChange={(e) => { setEmail(e.target.value); }}
          />
        </div>
        <button type="submit" className="btn btnVizz">Soumettre</button>
      </form>
    );
  };

  return (
    <Fragment>
      <h2 style={{ marginBottom: "10px" }}>Participez au développement de VizzMD</h2>
      {emailBodyContent()}
    </Fragment>
  );
};

export default headerForm;
