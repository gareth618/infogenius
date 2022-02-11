import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';

import { useLocalStorage } from '@utils/hooks';
import { Share, SignIn, Send } from '@utils/icons';
import * as styles from './CommentForm.module.css';
import { ExplicitEditor } from '@components/comments';

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

  const [textareaValue, setTextareaValue] = useLocalStorage(`InfoGenius.commentDraft.${articleSlug}`, '');
  const [inputValue, setInputValue] = useLocalStorage('InfoGenius.userName', '');
  const handleInputChange = event => setInputValue(event.target.value);
  const fixInputInput = event => {
    if (event.code === 'Enter') {
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
        content: textareaValue.trim().split('\n').map(line => line.trimRight()).join('\n'),
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

      const ADMIN = 'bloggareth@gmail.com';
      if (parentComment == null) {
        if (userEmail !== ADMIN) {
          notify(ADMIN, 'new');
        }
      }
      else {
        if (userEmail !== parentComment.email) {
          notify(parentComment.email, 'child');
        }
        const replies = await getDocs(query(
          collection(firestore, 'comments'),
          where('parent', '==', parentComment.id)
        ));
        const emails = new Set();
        replies.forEach(reply => emails.add(reply.data().email));
        emails.delete(parentComment.email);
        emails.delete(userEmail);
        emails.forEach(email => notify(email, 'sibling'));
        if (userEmail !== ADMIN && parentComment.email !== ADMIN && !emails.has(ADMIN)) {
          notify(ADMIN, 'new');
        }
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
        <ExplicitEditor
          input={textareaValue}
          setInput={setTextareaValue}
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
