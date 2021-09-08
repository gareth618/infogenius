import React from 'react';
import * as styles from './CommentContext.module.css';
import { Comment, CommentForm, CommentSection } from '@components/comments';

export default function CommentContext({ articleSlug }) {
  const formRef = React.useRef(null);
  const [parentComment, setParentComment] = React.useState(null);

  const commentSection = React.useMemo(() => (
    <CommentSection
      articleSlug={articleSlug}
      setParentComment={info => {
        setParentComment(info);
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }}
    />
  ), [articleSlug]);

  return (
    <>
      <CommentForm
        formRef={formRef}
        articleSlug={articleSlug}
        parentCommentId={parentComment?.id}
        setParentComment={setParentComment}
      />
      {parentComment && (
        <>
          <div className={styles.replyText}>Îi răspunzi comentariului:</div>
          <Comment info={parentComment} setParentComment={setParentComment} preview />
        </>
      )}
      {commentSection}
    </>
  );
};
