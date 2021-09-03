import React from 'react';
import uuidv4 from 'uuid';

import { Comment } from '@components/others';
import * as styles from './CommentSection.module.css';

import firestore from '@utils/firestore';
import { onSnapshot, collection, query, where, doc, getDoc, getDocs } from 'firebase/firestore';

export default function CommentSection({ articleSlug }) {
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    const loadComments = async () => {
      const result = await getDocs(query(collection(firestore, 'comments'), where('slug', '==', articleSlug)));
      const documents = [];
      result.forEach(document => documents.push(document.data()));
      const comments = await Promise.all(
        documents.map(async document => ({
          name: (await getDoc(doc(firestore, 'users', document.email))).data().name,
          date: document.timestamp.toDate(),
          content: document.content
        }))
      );
      comments.sort((a, b) => a.date > b.date ? -1 : +1);
      setComments(comments);
    };
    const unsubscribeComments = onSnapshot(collection(firestore, 'comments'), loadComments);
    const unsubscribeUsers = onSnapshot(collection(firestore, 'users'), loadComments);
    return () => {
      unsubscribeComments();
      unsubscribeUsers();
    };
  }, [articleSlug]);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        {`${comments.length}${comments.length >= 20 ? ' de' : ''} comentarii`}
      </h2>
      <div>
        {comments.map(comment => <Comment key={uuidv4()} info={comment} />)}
      </div>
    </section>
  );
};
