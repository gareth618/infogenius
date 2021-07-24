import React from 'react';
import { Helmet } from 'react-helmet';

import { Layout } from '@components/layout';
import { Article } from '@components/articles';

function TrieArticle() {
  const articleMetadata = {
    title: 'Trie în C++. Problema Xor Max de pe InfoArena',
    slug: '/trie-cpp',
    thumbnail: 'trie.png',
    author: 'Iulian Oleniuc',
    date: '06/02/2021',
    categories: [
      { name: 'Algoritmică și structuri de date', slug: '/algoritmica-structuri-de-date' },
      { name: 'Fake category', slug: '/fake-category' }
    ],
    keywords: [
      'trie', 'c++', 'structuri de date', 'arbori',
      'dfs', 'programare dinamică', 'operații pe biți'
    ],
    excerpt: `
      În acest articol voi prezenta structura de date numită trie,
      precum și câteva aplicații interesante ale acesteia. Tria
      este o structură de date arborescentă, ușor de implementat,
      folosită pentru a stoca un set de cuvinte într-o manieră compactă.
      Din acest motiv, putem…
    `,
    content: `
      <p>Pi este un număr care nu are nevoie de nicio introducere. El este definit drept raportul dintre circumferința și diametrul unui cerc, motiv pentru care această constantă apare adesea în formule și ecuații matematice, dar și fizice.</p>
      <p>De fapt, în fizică, $\\pi$ apare de cele mai multe ori înmulțit cu $2$. Din acest motiv, mulți fizicieni doresc să renunțăm la $\\pi$, în favoarea unei constante $\\tau$, egală cu $2 \\pi$. Sau, altfel spus, egală cu raportul dintre circumferința unui cerc și <em>raza</em> sa. Din fericire, nimeni nu i-a băgat încă în seamă :P</p>
      <p>Cum $\\pi \approx 3.14$, matematicienii s-au gândit ca, pe data de 14 a 3-a a fiecărui an, să celebrăm ziua numărului pi. Întâmplător sau nu, această zi are o semnificație deosebită pentru comunitatea științifică:</p>
      <h2>Despre aproximarea numărului pi</h2>
      <p>După cum bine știți, $\\pi$ este un număr irațional, adică are o infinitate de zecimale și nu există niciun tipar după care acestea să se repete. Așadar, nu putem decât să <em>aproximăm</em> valoarea acestei constante. În practică, nu o să avem niciodată nevoie de mai mult de 152 de zecimale ale lui $\\pi$. Iată de ce:</p>
      <p>Să presupunem că știm diametrul unei sfere și dorim să-i calculăm circumferința. Dacă diametrul acestei sfere ar fi egal cu 93 de miliarde de ani-lumină (diametrul universului observabil), o aproximare a lui $\\pi$ la 152 de zecimale ar fi suficientă pentru a obține o eroare cel mult egală cu lungimea Planck – cea mai mică unitate de măsură pentru lungime care are vreo semnificație…</p>
      <p>Cu toate acestea, informaticienilor le place să inventeze algoritmi pentru aproximarea lui pi la câteva milioane, miliarde sau chiar trilioane de zecimale. Spre exemplu, ultimul record a fost atins în ianuarie 2020: După ce a muncit din greu 300 și ceva de zile, un super-calculator a reușit să determine primele 50 de trilioane de zecimale ale lui pi! Doborând recordul de doar 31.4 trilioane, stabilit de Google cu un an înainte.</p>
      <p>În caz că aceste rezultate vi se par inutile, în mare parte aveți dreptate. Doar că, vânătoarea asta după zecimalele lui $\\pi$ este justificată din două motive. În primul rând, este o metodă foarte bună de a pune la încercare puterea computațională a celor mai noi super-calculatoare. În al doilea rând, simpla căutare de algoritmi care să-l aproximeze pe $\\pi$ poate fi o problemă faină de info.</p>
      <p>Prin urmare, în acest articol vă voi prezenta doi algoritmi interesanți pentru aproximarea numărului pi. Ce îmi place la ei este că se bazează pe teoria probabilităților, făcându-i foarte ușor de vizualizat. În plus, demonstrația celui de-al doilea ne arată că, uneori, <em>integralele duble</em> chiar sunt utile.</p>
    `
  };

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ro-RO' }}>
        <title>{articleMetadata.title} – InfoGenius</title>
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="description" content={articleMetadata.excerpt} />
        <meta name="keywords" content={articleMetadata.keywords.join(', ')} />
        <meta name="author" content={articleMetadata.author} />
      </Helmet>
      <Layout displaySidebar={true}>
        <Article metadata={articleMetadata} display="full" />
      </Layout>
    </>
  );
}

export default TrieArticle;
