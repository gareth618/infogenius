import React from 'react';
import { useLocalStorage } from '@utils/hooks';

import * as styles from './CommentContext.module.css';
import { Comment, CommentForm, CommentSection } from '@components/comments';

export default function CommentContext({ articleSlug }) {
  const formRef = React.useRef(null);
  const [parentComment, setParentComment] = useLocalStorage(`InfoGenius.parentComment.${articleSlug}`, null);

  const commentSection = React.useMemo(() => (
    <CommentSection
      articleSlug={articleSlug}
      setParentComment={info => {
        setParentComment(info);
        formRef.current.scrollIntoView({ behavior: 'smooth' });
      }}
    />
  ), [articleSlug, setParentComment]);

  return (
    <>
      <CommentForm
        formRef={formRef}
        articleSlug={articleSlug}
        parentComment={parentComment}
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
