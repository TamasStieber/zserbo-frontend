import {
  Button,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  BudgetElements,
  FetchMethods,
  Month,
  MonthDetailsProps,
  Months,
  Savings,
} from '../types/types';
import ExpensesTable from './ExpensesTable';
import IncomesTable from './IncomesTable';
import MonthSummary from './MonthSummary';
import SavingsTable from './SavingsTable';
import SpendingsTable from './SpendingsTable';
import UpdateDialog from './UpdateDialog';
import styles from '../styles/Home.module.css';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDate, showErrorToast, showSuccessToast } from '@/utils/utils';
import MonthDetailsContainer from './MonthDetailsContainer';
import { PurpleButton } from './CustomMUIElements';
import MonthPageSkeleton from './skeletons/MonthPageSkeleton';

const MonthDetails = ({ url }: MonthDetailsProps) => {
  const router = useRouter();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [propertiesOpen, setPropertiesOpen] = useState<boolean>(false);
  const [buttonVariant, setButtonVariant] = useState<'outlined' | 'contained'>(
    'outlined'
  );
  const [currentMonth, setCurrentMonth] = useState<Month | null>(null);
  const [months, setMonths] = useState<Months>([]);
  const [savings, setSavings] = useState<Savings>([]);
  const [savingsReady, setSavingsReady] = useState(false);
  const [monthDetailsUpdated, setMonthDetailsUpdated] =
    useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);

  const isMonthClosed = currentMonth ? currentMonth.closed : false;
  const closeButtonText =
    currentMonth && currentMonth.closed ? 'Open Month' : 'Close Month';

  const predecessor: Month | undefined = months.find(
    (month) => month._id === currentMonth?.predecessor[0]?.monthId
  );

  const initialUpdateValues = {
    balance: currentMonth?.balance || 0,
    opening: currentMonth?.opening || 0,
    comment: currentMonth?.comment || '',
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const getHeight = () => {
    const measureHeight = document.getElementById('measure')?.clientHeight;
    if (measureHeight && height !== measureHeight) {
      setHeight(measureHeight);
    }
  };

  getHeight();

  const toggleProperties = () => {
    const propertiesElement = document.getElementById('properties');
    if (propertiesElement) {
      if (propertiesOpen) {
        propertiesElement.style.height = '0';
        setButtonVariant('outlined');
      } else {
        propertiesElement.style.height = height + 'px';
        setButtonVariant('contained');
      }
      setPropertiesOpen(!propertiesOpen);
    }
  };

  const changeMonth = (event: SelectChangeEvent) => {
    setLoading(true);
    router.push(`/monthly-budget/${(event.target as HTMLSelectElement).value}`);
  };

  const fetchSavings = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/savings`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      if (data.error) {
        console.error(data.error);
        showErrorToast();
      } else {
        setSavings(data.allSavings);
        setSavingsReady(true);
      }
    } catch (error) {
      console.error(error);
      showErrorToast();
    }
  };

  const fetchAllMonths = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/months/`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await fetchResult.json();

      if (data.error) {
        console.error(data.error);
        showErrorToast();
      } else {
        setMonths(data.allMonths);
      }
    } catch (error) {
      console.error(error);
      showErrorToast();
    }
  };

  const handleUpdateSubmit = async (submitBody: BodyInit): Promise<void> => {
    const updateMonth = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/${currentMonth?._id}/update/`,
          {
            method: 'put',
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
          setLoading(false);
          showErrorToast();
        } else {
          if (currentMonth) {
            setLoading(false);
            showSuccessToast({
              subject: currentMonth?.name,
              fetchMethod: FetchMethods.put,
            });
            setMonthDetailsUpdated(!monthDetailsUpdated);
          }
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) updateMonth(jwtToken);
  };

  const handleBudgetSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';
    const insertBudget = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/${currentMonth?._id}/budget/${id}`,
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
          setLoading(false);
          showErrorToast();
        } else {
          setLoading(false);
          showSuccessToast({
            subject: result.newBudgetElement.name,
            fetchMethod: fetchMethod,
          });
          setMonthDetailsUpdated(!monthDetailsUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) insertBudget(jwtToken);
  };

  const handleBudgetDelete = async (
    id: string,
    type: BudgetElements
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/${currentMonth?._id}/${type}/${id}`,
          {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await fetchResult.json();

        if (result.error) {
          console.error(result.error);
          setLoading(false);
          showErrorToast();
        } else {
          const found =
            type === BudgetElements.income
              ? currentMonth?.income.find((income) => income._id === id)
              : currentMonth?.budget.find((budget) => budget._id === id);
          if (found) {
            showSuccessToast({
              subject: found.name,
              fetchMethod: FetchMethods.delete,
            });
            setMonthDetailsUpdated(!monthDetailsUpdated);
          } else {
            showErrorToast();
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
  };

  const handleContributionSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    savingId?: string,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';
    const insertSaving = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/savings/${savingId}/contributors/${id}`,
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
          setLoading(false);
          showErrorToast();
        } else {
          setLoading(false);
          showSuccessToast({
            subject: `Contribution to ${result.contributor.name}`,
            fetchMethod: fetchMethod,
          });
          setMonthDetailsUpdated(!monthDetailsUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) insertSaving(jwtToken);
  };

  const handleContributionDelete = async (
    savingId: string,
    id: string
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/savings/${savingId}/contributors/${id}`,
          {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await fetchResult.json();

        if (result.error) {
          console.error(result.error);
          setLoading(false);
          showErrorToast();
        } else {
          setLoading(false);
          showSuccessToast({
            subject: `Contribution to ${result.contributorToDelete.name}`,
            fetchMethod: FetchMethods.delete,
          });
          setMonthDetailsUpdated(!monthDetailsUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
  };

  const handleSpendingSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    savingId?: string,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';
    const insertSpending = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/savings/${savingId}/spendings/${id}`,
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
          setLoading(false);
          showErrorToast();
        } else {
          setLoading(false);
          showSuccessToast({
            subject: `Spending from ${result.spending.name}`,
            fetchMethod: fetchMethod,
          });
          setMonthDetailsUpdated(!monthDetailsUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) insertSpending(jwtToken);
  };

  const handleSpendingDelete = async (
    savingId: string,
    id: string
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/savings/${savingId}/spendings/${id}`,
          {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await fetchResult.json();

        if (result.error) {
          console.error(result.error);
          setLoading(false);
          showErrorToast();
        } else {
          setLoading(false);
          showSuccessToast({
            subject: `Spending from ${result.spendingToDelete.name}`,
            fetchMethod: FetchMethods.delete,
          });
          setMonthDetailsUpdated(!monthDetailsUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
  };

  const toggleMonthClose = () => {
    let sumAllSavings = 0;
    savings.forEach((saving) => {
      saving.contributors.forEach((contributor) => {
        sumAllSavings += contributor.actual;
      });
      saving.spendings.forEach((spending) => {
        sumAllSavings -= spending.amount;
      });
      sumAllSavings += saving.initial;
    });

    const submitBody = {
      closed: !isMonthClosed,
      sumAllSavings: sumAllSavings,
    };
    const updateMonthClose = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/${currentMonth?._id}/toggleclose/`,
          {
            method: 'put',
            body: JSON.stringify(submitBody),
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const result = await fetchResult.json();

        if (result.error) {
          console.error(result.error);
          setLoading(false);
          showErrorToast();
        } else {
          if (currentMonth) {
            setLoading(false);
            showSuccessToast({
              subject: currentMonth?.name,
              customMessage: isMonthClosed
                ? 'has been opened'
                : 'has been closed',
            });
            setMonthDetailsUpdated(!monthDetailsUpdated);
          }
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) updateMonthClose(jwtToken);
  };

  useEffect(() => {
    const storedJwtToken = localStorage.getItem('jwtToken');
    if (storedJwtToken !== null) setJwtToken(storedJwtToken);
  }, []);

  useEffect(() => {
    if (jwtToken === null) {
      return;
    }

    fetchSavings(jwtToken);
    fetchAllMonths(jwtToken);
  }, [jwtToken, monthDetailsUpdated]);

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
          showErrorToast();
        } else {
          setCurrentMonth(data.month);
        }
      } catch (error) {
        console.error(error);
        showErrorToast();
      }
    };

    fetchCurrentMonth(jwtToken);
    setLoading(false);
  }, [jwtToken, url, monthDetailsUpdated]);

  useEffect(() => {
    const measureHeight = document.getElementById('measure')?.clientHeight;
    if (measureHeight && height !== measureHeight) {
      setHeight(measureHeight);
    }

    const propertiesElement = document.getElementById('properties');
    if (propertiesElement && propertiesOpen) {
      propertiesElement.style.height = height + 'px';
    }
  }, [height, propertiesOpen, months]);

  return (
    <>
      {currentMonth && months.length > 0 && savingsReady ? (
        <>
          <FormControl fullWidth>
            <Select
              id='month-selector'
              defaultValue={currentMonth.url}
              onChange={changeMonth}
            >
              {months.map((month) => (
                <MenuItem key={month._id} value={month.url}>
                  {month.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={styles.button_row}>
            <div className={styles.button_row_left}>
              <Button
                sx={{ marginRight: 2 }}
                variant='contained'
                disabled={isMonthClosed}
                onClick={handleOpen}
              >
                Quick Update
              </Button>
              <PurpleButton
                sx={{ marginRight: 2 }}
                variant='contained'
                onClick={toggleMonthClose}
                color='warning'
              >
                {closeButtonText}
              </PurpleButton>
            </div>
            <div className={styles.button_row_right}>
              <Button
                variant={buttonVariant}
                onClick={toggleProperties}
                startIcon={<InfoOutlinedIcon />}
                color='success'
              >
                Info
              </Button>
            </div>
          </div>
          <div id='properties' className={styles.month_properties}>
            <div id='measure'>
              <div className={styles.month_properties_text}>
                <strong>
                  Month is {currentMonth.closed ? 'closed' : 'open'}
                </strong>
                <br />
                <strong>Predecessor:</strong>{' '}
                {predecessor ? (
                  <a href={`/monthly-budget/${predecessor?.url}`}>
                    {predecessor?.name}
                  </a>
                ) : (
                  <>No predecessor (first month)</>
                )}
                <br />
                {currentMonth.date ? (
                  <>
                    <strong>Last modified:</strong>{' '}
                    {formatDate(currentMonth.date)}
                  </>
                ) : (
                  <></>
                )}
                <br />
                {currentMonth.closed && currentMonth.closedAt ? (
                  <>
                    <strong>Closed at:</strong>{' '}
                    {formatDate(currentMonth.closedAt)}
                  </>
                ) : (
                  <></>
                )}
              </div>
              <div className={styles.month_properties_comment}>
                <p>Comment:</p>
                {currentMonth.comment}
              </div>
            </div>
          </div>
          <MonthSummary
            currentMonth={currentMonth}
            predecessor={predecessor}
            savings={savings}
          />
          {/* <div className={styles.column_container}> */}
          <MonthDetailsContainer open={isMonthClosed}>
            <div className={styles.column}>
              <IncomesTable
                incomes={currentMonth.income}
                submitHandler={handleBudgetSubmit}
                deleteHandler={handleBudgetDelete}
              />
              <SavingsTable
                savings={savings}
                monthId={currentMonth._id}
                submitHandler={handleContributionSubmit}
                deleteHandler={handleContributionDelete}
              />
              <SpendingsTable
                savings={savings}
                monthId={currentMonth._id}
                submitHandler={handleSpendingSubmit}
                deleteHandler={handleSpendingDelete}
              />
            </div>
            <div className={styles.column}>
              <ExpensesTable
                expenses={currentMonth.budget}
                submitHandler={handleBudgetSubmit}
                deleteHandler={handleBudgetDelete}
              />
            </div>
            <UpdateDialog
              open={open}
              closeHandler={handleClose}
              submitHandler={handleUpdateSubmit}
              initialValues={initialUpdateValues}
            />
          </MonthDetailsContainer>
          {/* </div> */}
          <ToastContainer />
          <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={loading}>
            <CircularProgress />
          </Backdrop>
        </>
      ) : (
        <MonthPageSkeleton />
      )}
    </>
  );
};

export default MonthDetails;
