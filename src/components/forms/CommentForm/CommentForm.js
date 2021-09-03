import React from 'react';
import * as styles from './CommentForm.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

import firestore from '@utils/firestore';
import { collection, doc, setDoc, addDoc, Timestamp } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";

export default function CommentForm({ articleSlug }) {
  const shareArticle = () => window.open(
    `https://www.facebook.com/sharer/sharer.php?u=https://infogenius.ro/${articleSlug}/`,
    'facebook-share-dialog'
  );

  const [userEmail, setUserEmail] = React.useState(null);
  React.useEffect(() => onAuthStateChanged(getAuth(), user => {
    setUserEmail(user == null ? null : user.email.slice(0, -'@gmail.com'.length));
  }), []);
  const logIn = () => {
    signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then(() => { })
      .catch(error => alert(`Ups! S-a produs o eroare în timpul conectării :(\n${error.code}`));
  };
  const logOut = () => {
    signOut(getAuth())
      .then(() => { })
      .catch(error => alert(`Ups! S-a produs o eroare în timpul deconectării :(\n${error.code}`));
  };

  const [inputValue, setInputValue] = React.useState('');
  const handleInputChange = event => setInputValue(event.target.value);
  const fixInputInput = event => {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  };
  React.useEffect(() => {
    if (userEmail != null) {
      const userName = localStorage.getItem(`InfoGenius.userCache.${userEmail}.userName`);
      if (userName != null) setInputValue(userName);
    }
  }, [userEmail]);

  const [textareaValue, setTextareaValue] = React.useState('');
  const handleTextareaChange = event => setTextareaValue(event.target.value);
  React.useEffect(() => {
    if (textareaValue === '') {
      const commentDraft = localStorage.getItem(`InfoGenius.userCache.${userEmail == null ? 'default' : userEmail}.commentDraft.${articleSlug}`);
      if (commentDraft != null) setTextareaValue(commentDraft);
    }
  }, [userEmail, articleSlug, textareaValue]);
  React.useEffect(() => {
    if (textareaValue !== '') {
      window.onbeforeunload = () => {
        localStorage.setItem(`InfoGenius.userCache.${userEmail == null ? 'default' : userEmail}.commentDraft.${articleSlug}`, textareaValue);
      };
    }
  }, [userEmail, articleSlug, textareaValue]);

  const textareaRef = React.useRef(null);
  const fixTextareaInput = event => {
    if (event.code === 'Tab') {
      const pos = textareaRef.current.selectionStart;
      setTextareaValue(
        textareaRef.current.value.slice(0, pos)
        + '  ' +
        textareaRef.current.value.slice(pos)
      );
      setTimeout(() => {
        textareaRef.current.selectionStart = pos + 2;
        textareaRef.current.selectionEnd = pos + 2;
      }, 0);
      event.preventDefault();
    }
  };

  const sendComment = async event => {
    if (userEmail == null) {
      alert(
        'Trebuie să fiți autentificat pentru a lăsa un comentariu.'
        + '\nApăsați pe butonul roșu pentru a vă loga cu Google!'
      );
    }
    else if (textareaValue.length < 10) {
      alert('Comentariul trebuie să conțină cel puțin 10 caractere!');
    }
    else if (inputValue.length < 3) {
      alert('Numele trebuie să fie format din cel puțin 3 caractere!');
    }
    else {
      await setDoc(doc(firestore, 'users', userEmail), {
        name: inputValue
      });
      await addDoc(collection(firestore, 'comments'), {
        slug: articleSlug,
        email: userEmail,
        content: textareaValue,
        timestamp: Timestamp.now()
      });
      localStorage.setItem(`InfoGenius.userCache.${userEmail}.userName`, inputValue);
      localStorage.removeItem(`InfoGenius.userCache.${userEmail}.commentDraft.${articleSlug}`);
      localStorage.removeItem(`InfoGenius.userCache.default.commentDraft.${articleSlug}`);
      setTextareaValue('');
    }
    event.preventDefault();
  };

  return (
    <>
      <div className={styles.buttons}>
        <button type="button" onClick={shareArticle}>
          <FontAwesomeIcon icon={faFacebookF} />
          &nbsp;&nbsp;Distribuie
        </button>
        <button type="button" onClick={userEmail == null ? logIn : logOut}>
          <FontAwesomeIcon icon={faGoogle} />
          &nbsp;&nbsp;{userEmail == null ? 'Conectează-te' : 'Deconectează-te'}
        </button>
      </div>

      <form
        className={styles.commentForm}
        onSubmit={event => event.preventDefault()}
      >
        <h2 className={styles.title}>
          Lasă un comentariu!
        </h2>
        <textarea
          className={styles.comment}
          placeholder="Comentariu"
          value={textareaValue}
          onChange={handleTextareaChange}
          ref={textareaRef}
          onKeyDown={fixTextareaInput}
        />
        <div className={styles.bottom}>
          <input
            className={styles.name}
            placeholder="Nume"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={fixInputInput}
          />
          <button
            className={styles.send}
            type="submit"
            onClick={sendComment}
          >
            Trimite&nbsp;&nbsp;
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </form>
    </>
  );
};
