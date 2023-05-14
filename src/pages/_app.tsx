import LoadingMask from '@/components/common/loadingMask';
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { Router } from 'next/router'
import { useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {

  const [loading, setLoading] = useState(false);

  Router.events.on('routeChangeStart', (url) => {
    setLoading(true);
  })

  Router.events.on('routeChangeComplete', (url) => {
    setLoading(false);
  });

  return (
    <>
      {loading && <LoadingMask />}
      <Component {...pageProps} />
    </>
  );

}
