import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Months } from '../../types/types';
import PageContainer from '@/components/layout/PageContainer';
import { NoMonthsFound } from '@/components/NoElementFound';
import { Skeleton, Typography } from '@mui/material';
import MonthPageSkeleton from '@/components/skeletons/MonthPageSkeleton';

const MonthlyBudget = () => {
  const router = useRouter();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [months, setMonths] = useState<Months | null>(null);
  const [ready, setReady] = useState<boolean>(false);

  const fetchMonths = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/months`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      setMonths(data.allMonths);
      setReady(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const storedJwtToken = localStorage.getItem('jwtToken');
    if (storedJwtToken !== null) setJwtToken(storedJwtToken);
  }, []);

  useEffect(() => {
    if (jwtToken === null) {
      return;
    }
    fetchMonths(jwtToken);
  }, [jwtToken]);

  useEffect(() => {
    if (months) {
      months.forEach((month) => {
        if (month.default) {
          router.push(`/monthly-budget/${month.url}`);
        }
      });
    }
  }, [months, router]);

  return (
    <PageContainer
      title={
        ready && months && months.length === 0 ? (
          'Monthly Budget'
        ) : (
          <Skeleton animation='wave' width={150} sx={{ margin: 'auto' }} />
        )
      }
    >
      {ready ? (
        <>
          {months && months.length > 0 ? (
            <MonthPageSkeleton />
          ) : (
            <NoMonthsFound link={true} />
          )}
        </>
      ) : (
        <MonthPageSkeleton />
      )}
    </PageContainer>
  );
};

export default MonthlyBudget;
