import React from 'react';
import PropTypes from 'prop-types';

export default function HTML(props) {
  return (
    <html lang="ro-RO" {...props.htmlAttributes}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=UA-103171287-1" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag() { dataLayer.push(arguments); }
          gtag('js', new Date());
          gtag('config', 'UA-103171287-1');
        ` }} />

        <script src="https://cdn.onesignal.com/sdks/OneSignalSDK.js" async="" />
        <script dangerouslySetInnerHTML={{ __html: `
          window.OneSignal = window.OneSignal || [];
          OneSignal.push(function() {
            OneSignal.init({
              appId: '1677b417-ac7f-4fb3-b870-b7fbf9bea9cb',
              safari_web_id: 'web.onesignal.auto.11512f5d-61af-48e1-99c6-cc09fe5cc2c2',
              notifyButton: { enable: true }
            });
          });
        ` }} />

        <script dangerouslySetInnerHTML={{ __html: '(adsbygoogle = window.adsbygoogle || []).push({ });' }} />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2051821579024751" crossOrigin="anonymous" />

        <meta httpEquiv="x-ua-compatible" content="ie=edge" />
        <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        {props.headComponents}
      </head>
      <body {...props.bodyAttributes}>
        {props.preBodyComponents}
        <div
          key="body"
          id="___gatsby"
          dangerouslySetInnerHTML={{ __html: props.body }}
        />
        {props.postBodyComponents}
      </body>
    </html>
  );
};

HTML.propTypes = {
  htmlAttributes: PropTypes.object,
  headComponents: PropTypes.array,
  bodyAttributes: PropTypes.object,
  preBodyComponents: PropTypes.array,
  body: PropTypes.string,
  postBodyComponents: PropTypes.array,
};
