import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Month } from '../../types/types';
import PageContainer from '../../components/layout/PageContainer';
import MonthDetails from '../../components/MonthDetails';
import { Skeleton, Typography } from '@mui/material';
import MonthPageSkeleton from '@/components/skeletons/MonthPageSkeleton';

const MonthlyBudget = (props: { url: string }) => {
  const router = useRouter();

  const url = props.url;

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Month | null>(null);
  useState<boolean>(false);

  const closedText = currentMonth?.closed ? '(Closed)' : '';

  useEffect(() => {
    const storedJwtToken = localStorage.getItem('jwtToken');
    if (storedJwtToken !== null) setJwtToken(storedJwtToken);
  }, []);

  useEffect(() => {
    if (jwtToken === null) {
      return;
    }

    const fetchCurrentMonth = async (token: string): Promise<void> => {
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/${url}`,
          {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await fetchResult.json();

        if (data.error) {
          console.error(data.error);
        } else {
          if (data.month) {
            setCurrentMonth(data.month);
            setReady(true);
          } else {
            router.push('/404');
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentMonth(jwtToken);
  }, [jwtToken, router, url]);

  return (
    <PageContainer
      title={
        ready && currentMonth ? (
          `${currentMonth.name} ${closedText}`
        ) : (
          <Skeleton animation='wave' width={150} sx={{ margin: 'auto' }} />
        )
      }
    >
      {ready ? (
        <>{currentMonth ? <MonthDetails url={url} /> : <></>}</>
      ) : (
        <MonthPageSkeleton />
      )}
    </PageContainer>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const url = context.params?.url;

  return { props: { url } };
};

export default MonthlyBudget;
