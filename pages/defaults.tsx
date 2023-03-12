import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BudgetElements, Defaults, FetchMethods } from '../types/types';
import PageContainer from '../components/layout/PageContainer';
import styles from '../styles/Home.module.css';
import IncomesTable from '../components/IncomesTable';
import ExpensesTable from '../components/ExpensesTable';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { showSuccessToast } from '@/utils/utils';

const Defaults: NextPage = () => {
  const router = useRouter();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [defaults, setDefaults] = useState<Defaults | null>(null);
  const [defaultsListUpdated, setDefaultsListUpdated] =
    useState<boolean>(false);

  const handleDelete = async (
    id: string,
    type: BudgetElements
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      try {
        await fetch(`${process.env.BACKEND_URL}/defaults/${type}/${id}`, {
          method: 'delete',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const found =
          type === BudgetElements.income
            ? defaults?.income.find((income) => income._id === id)
            : defaults?.budget.find((budget) => budget._id === id);
        if (found)
          showSuccessToast({
            subject: found.name,
            fetchMethod: FetchMethods.delete,
          });
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
    setDefaultsListUpdated(!defaultsListUpdated);
  };

  const fetchDefaults = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/defaults`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      setDefaults(data.defaults);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';

    const insertDefault = async (token: string): Promise<void> => {
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/defaults/${id}`,
          {
            method: fetchMethod,
            body: submitBody,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await fetchResult.json();

        if (result.error) {
          console.error(result.error);
        } else {
          showSuccessToast({
            subject: result.default.name,
            fetchMethod: fetchMethod,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) insertDefault(jwtToken);
    setDefaultsListUpdated(!defaultsListUpdated);
  };

  useEffect(() => {
    const storedJwtToken = localStorage.getItem('jwtToken');
    if (storedJwtToken !== null) setJwtToken(storedJwtToken);
  }, []);

  useEffect(() => {
    if (jwtToken === null) {
      return;
    }
    fetchDefaults(jwtToken);
  }, [jwtToken, defaultsListUpdated]);

  return (
    <PageContainer title='Defaults'>
      <div className={styles.column_container}>
        <div className={styles.column}>
          <IncomesTable
            incomes={defaults?.income}
            submitHandler={handleSubmit}
            deleteHandler={handleDelete}
          />
        </div>
        <div className={styles.column}>
          <ExpensesTable
            expenses={defaults?.budget}
            submitHandler={handleSubmit}
            deleteHandler={handleDelete}
          />
        </div>
      </div>
      <ToastContainer />
    </PageContainer>
  );
};

export default Defaults;
