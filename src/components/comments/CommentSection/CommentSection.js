import React from 'react';
import uuidv4 from 'uuid';

import { Comment } from '@components/comments';
import * as styles from './CommentSection.module.css';

import firestore from '@utils/firestore';
import { onSnapshot, collection, query, where, doc, getDoc, getDocs } from 'firebase/firestore';

export default function CommentSection({ articleSlug, setParentComment }) {
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    const loadComments = async () => {
      const result = await getDocs(query(collection(firestore, 'comments'), where('slug', '==', articleSlug)));
      const documents = [];
      result.forEach(document => documents.push(document));
      const comments = await Promise.all(
        documents.map(async document => ({
          id: document.id,
          parent: document.data().parent,
          code: document.data().email.split('').map(chr => chr.charCodeAt(0) * 666013 % 100021).join(''),
          name: (await getDoc(doc(firestore, 'users', document.data().email))).data().name,
          date: document.data().timestamp.toDate(),
          content: document.data().content
        }))
      );

      const roots = comments.filter(comment => comment.parent === '');
      roots.sort((a, b) => a.date > b.date ? -1 : +1);
      const sortedComments = [];
      for (const root of roots) {
        sortedComments.push(root);
        const sons = comments.filter(comment => comment.parent === root.id);
        sons.sort((a, b) => a.date < b.date ? -1 : +1);
        sons.forEach(son => sortedComments.push(son));
      };
      setComments(sortedComments);
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
        {comments.map(comment => (
          <Comment
            key={uuidv4()}
            info={comment}
            setParentComment={setParentComment}
          />
        ))}
      </div>
    </section>
  );
};
