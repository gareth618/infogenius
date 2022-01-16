import React from 'react';
import uuidv4 from 'uuid';

import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import { Layout } from '@components/layout';

import firestore from '@utils/firestore';
import { onSnapshot, collection, query, orderBy, limit, doc, getDoc, setDoc } from 'firebase/firestore';

function Comment({ idComment, initContent }) {
  const [content, setContent] = React.useState(initContent);
  const updateComment = async () => {
    const docRef = doc(firestore, 'comments', idComment);
    const docObj = await getDoc(docRef);
    await setDoc(docRef, {
      content,
      email: docObj.data().email,
      parent: docObj.data().parent,
      slug: docObj.data().slug,
      timestamp: docObj.data().timestamp
    });
  };
  return (
    <>
      <textarea
        style={{
          display: "block",
          marginBottom: "1rem",
          padding: "1rem",
          width: "100%",
          height: "200px",
          resize: "none",
          border: "none",
          borderRadius: ".5rem",
          background: "var(--form-one)",
          color: "var(--text)",
          fontFamily: "'Source Code Pro', monospace"
        }}
        value={content}
        onChange={event => setContent(event.target.value)}
      />
      <button
        style={{
          display: 'block',
          margin: '1rem 0',
          padding: '1rem',
          width: '100%',
          borderRadius: '.5rem',
          color: 'white',
          background: 'dodgerblue',
          fontWeight: 'bold'
        }}
        onClick={updateComment}
      >
        Actualizează!
      </button>
    </>
  );
}

export default function Admin({ data }) {
  const [comments, setComments] = React.useState([]);
  React.useEffect(() => {
    const loadComments = async docs => {
      const documents = [];
      docs.forEach(document => documents.push(document));
      const comments = await Promise.all(
        documents.map(async document => ({
          id: document.id,
          content: document.data().content
        }))
      );
      setComments(comments);
    };
    return onSnapshot(
      query(collection(firestore, 'comments'), orderBy('timestamp', 'desc'), limit(5)),
      docs => loadComments(docs), () => setComments(null)
    );
  }, []);

  const siteTitle = data.site.siteMetadata.title;
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>Panou Admin – {siteTitle}</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </Helmet>
      <Layout>
        {comments.map((comment, index) => (
          <Comment
            key={uuidv4()}
            idComment={comment.id}
            initContent={comment.content}
          />
        ))}
      </Layout>
    </>
  );
};

export const pageQuery = graphql`
  query GetSiteTitleAdmin {
    site {
      siteMetadata {
        title
      }
    }
  }
`;
