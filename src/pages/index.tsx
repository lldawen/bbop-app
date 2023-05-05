import Head from 'next/head'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Header from '@/components/common/header';
import LandingPage from '@/components/landing/landingpage';
import { ThemeOptions, createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e65100',
    },
    secondary: {
      main: '#ed6c02',
    },
  },
});

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>Brgy Bagongpook Online Portal</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <>
        <Header />
        <LandingPage />
      </>
    </ThemeProvider>
  )
}