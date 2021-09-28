import React from 'react';
import uuidv4 from 'uuid';

import { Comment } from '@components/comments';
import * as styles from './CommentSection.module.css';
import { dateToString, timeToString } from '@utils/helpers';

import firestore from '@utils/firestore';
import { onSnapshot, collection, query, where, doc, getDoc } from 'firebase/firestore';

export default function CommentSection({ articleSlug, setParentComment }) {
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    const loadComments = async docs => {
      const documents = [];
      docs.forEach(document => documents.push(document));
      const comments = await Promise.all(
        documents.map(async document => ({
          id: document.id,
          parent: document.data().parent,
          email: document.data().email,
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

      setComments(sortedComments.map(comment => {
        const cleanComment = { ...comment };
        delete cleanComment.date;
        return {
          date: dateToString(comment.date),
          time: timeToString(comment.date),
          ...cleanComment
        };
      }));
    };

    return onSnapshot(
      query(collection(firestore, 'comments'), where('slug', '==', articleSlug)),
      docs => loadComments(docs), () => setComments(null)
    );
  }, [articleSlug]);

  const commentList = comments == null
    ? (
      <p className={styles.error}>
        Comentariile nu pot fi încărcate, am depășit limita zilnică de citiri din FireStore. Reveniți mâine.
      </p>
    )
    : (
      <div>
        {comments.map(comment => (
          <Comment
            key={uuidv4()}
            info={comment}
            setParentComment={setParentComment}
          />
        ))}
      </div>
    );

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>
        {comments == null
          ? '(?) comentarii'
          : `${comments.length}${comments.length >= 20 ? ' de' : ''} comentarii`}
      </h2>
      {commentList}
    </section>
  );
};
