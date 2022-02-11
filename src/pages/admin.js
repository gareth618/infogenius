import React from 'react';
import uuidv4 from 'uuid';

import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';

import { ExplicitEditor } from '@components/comments';
import { Layout } from '@components/layout';
import * as styles from '@styles/admin.module.css';

import firestore from '@utils/firestore';
import { onSnapshot, collection, query, orderBy, limit, doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';

function Comment({ info }) {
  const [parent, setParent] = React.useState(info.parent);
  const [content, setContent] = React.useState(info.content);
  const updateComment = async () => {
    const docRef = doc(firestore, 'comments', info.id);
    const docObj = await getDoc(docRef);
    await setDoc(docRef, {
      content,
      email: docObj.data().email,
      parent,
      slug: info.slug,
      timestamp: docObj.data().timestamp
    });
  };

  const [del, setDel] = React.useState(3);
  const incDel = async () => {
    setDel(del - 1);
    if (del === 1) {
      await deleteDoc(doc(firestore, 'comments', info.id));
    }
  };

  return (
    <>
      <ExplicitEditor
        input={content}
        setInput={setContent}
      />
      <div className={styles.menu}>
        <div className={styles.id}>
          {info.id}
        </div>
        <input
          className={styles.parent}
          value={parent}
          onChange={event => setParent(event.target.value)}
        />
        <a
          className={styles.view}
          href={`https://infogenius.ro/${info.slug}/#comment-${info.id}`}
          target="_blank"
          rel="noreferrer"
        >view</a>
        {del > 0 && <button type="button" className={styles.del} onClick={incDel}>delete</button>}
        {del > 1 && <button type="button" className={styles.del} onClick={incDel}>delete</button>}
        {del > 2 && <button type="button" className={styles.del} onClick={incDel}>delete</button>}
        <button type="button" className={styles.update} onClick={updateComment}>update</button>
      </div>
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
          parent: document.data().parent,
          slug: document.data().slug,
          content: document.data().content
        }))
      );
      setComments(comments);
    };
    return onSnapshot(
      query(collection(firestore, 'comments'), orderBy('timestamp', 'desc'), limit(10)),
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
        <div>
          {comments.map(comment => <Comment key={uuidv4()} info={comment} />)}
        </div>
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
