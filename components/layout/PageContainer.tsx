import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './Navbar';
import Head from 'next/head';
import { PageContainerProps } from '../../types/types';
import styles from '../../styles/Home.module.css';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function PageContainer({ title, children }: PageContainerProps) {
  const router = useRouter();

  const [isLoggedIn, setLoggedIn] = useState<Boolean>(false);
  const [loginCheckReady, setLoginCheckReady] = useState<Boolean>(false);

  const checkLogin = () => {
    const storedJwtToken = localStorage.getItem('jwtToken');
    if (storedJwtToken === null) router.push('/login');
    else setLoggedIn(true);
    setLoginCheckReady(true);
  };

  useEffect(() => {
    checkLogin();
  });

  return (
    <>
      {loginCheckReady && isLoggedIn ? (
        <>
          <Head>
            <title>Zserbó</title>
            <link rel='icon' href='/favicon.ico' />
          </Head>
          <CssBaseline />
          <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
              <div className={styles.page_title}>
                <h2>{title}</h2>
              </div>
              <hr />
              <div className={styles.page_content}>{children}</div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
