import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import { useLocalStorage } from '@utils/hooks';
import { Share, SignIn, Send } from '@utils/icons';
import * as styles from './CommentForm.module.css';

import firestore from '@utils/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, addDoc, getDocs, collection, query, where, Timestamp } from 'firebase/firestore';

export default function CommentForm({ formRef, articleSlug, parentComment, setParentComment }) {
  const siteURL = useStaticQuery(
    graphql`
      query GetSiteURL {
        site {
          siteMetadata {
            siteUrl
          }
        }
      }
    `
  ).site.siteMetadata.siteUrl;
  const shareArticle = () => window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${siteURL}/${articleSlug}/`,
    'facebook-share-dialog'
  );

  const [userEmail, setUserEmail] = React.useState(null);
  React.useEffect(() => onAuthStateChanged(getAuth(), user => {
    setUserEmail(user == null ? null : user.email)
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

  const [inputValue, setInputValue] = useLocalStorage('InfoGenius.userName', '');
  const handleInputChange = event => setInputValue(event.target.value);
  const fixInputInput = event => {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  };

  const [textareaValue, setTextareaValue] = useLocalStorage(`InfoGenius.commentDraft.${articleSlug}`, '');
  const handleTextareaChange = event => setTextareaValue(event.target.value);

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
      const senderDocRef = doc(firestore, 'users', userEmail);
      const senderDocOld = await getDoc(senderDocRef);
      await setDoc(senderDocRef, senderDocOld.exists()
        ? { name: inputValue, notifications: senderDocOld.data().notifications }
        : { name: inputValue, notifications: [] }
      );
      const commentId = (await addDoc(collection(firestore, 'comments'), {
        parent: parentComment == null ? '' : parentComment.id,
        slug: articleSlug,
        email: userEmail,
        content: textareaValue,
        timestamp: Timestamp.now()
      })).id;

      const notify = async (email, type) => {
        const docRef = doc(firestore, 'users', email);
        const docOld = await getDoc(docRef);
        const notifications = docOld.data().notifications;
        notifications.push({
          type,
          slug: articleSlug,
          name: inputValue,
          comment: commentId
        });
        await setDoc(docRef, {
          name: docOld.data().name,
          notifications
        });
      };

      if (parentComment != null) {
        if (userEmail !== parentComment.email) {
          notify(parentComment.email, 'reply');
        }
        const result = await getDocs(query(
          collection(firestore, 'comments'),
          where('slug', '==', articleSlug),
          where('parent', '==', parentComment.id)
        ));
        const emails = new Set();
        result.forEach(document => emails.add(document.data().email));
        emails.delete(parentComment.email);
        emails.delete(userEmail);
        emails.forEach(email => notify(email, 'comment'));
      }
      setTextareaValue('');
      setParentComment(null);
    }
    event.preventDefault();
  };

  return (
    <>
      <div className={styles.buttons}>
        <button type="button" onClick={shareArticle}>
          <Share />&nbsp;&nbsp;Distribuie
        </button>
        <button type="button" onClick={userEmail == null ? logIn : logOut}>
          <SignIn />&nbsp;&nbsp;{userEmail == null ? 'Conectează-te' : 'Deconectează-te'}
        </button>
      </div>

      <form
        ref={formRef}
        className={styles.commentForm}
        onSubmit={event => event.preventDefault()}
      >
        <h2 className={styles.title}>
          Lasă un comentariu!
        </h2>
        <textarea
          ref={textareaRef}
          className={styles.comment}
          placeholder="Comentariu"
          value={textareaValue}
          onChange={handleTextareaChange}
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
            Trimite&nbsp;&nbsp;<Send />
          </button>
        </div>
      </form>
    </>
  );
};
