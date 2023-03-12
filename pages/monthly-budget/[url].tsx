import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Month } from '../../types/types';
import PageContainer from '../../components/layout/PageContainer';
import MonthDetails from '../../components/MonthDetails';

const MonthlyBudget = (props: { url: string }) => {
  const router = useRouter();

  const url = props.url;

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState<Month | null>(null);
  const [monthDetailsUpdated, setMonthDetailsUpdated] =
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

        if (data.month) {
          setCurrentMonth(data.month);
        } else {
          router.push('/404');
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCurrentMonth(jwtToken);
  }, [jwtToken, router, url]);

  return currentMonth ? (
    <PageContainer
      title={currentMonth ? `${currentMonth.name} ${closedText}` : ''}
    >
      {/* {months && months.length > 0 && currentMonth ? ( */}
      <MonthDetails url={url} />
    </PageContainer>
  ) : (
    <></>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const url = context.params?.url;

  return { props: { url } };
};

export default MonthlyBudget;
