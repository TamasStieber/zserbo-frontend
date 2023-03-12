import {
  Button,
  MenuItem,
  FormControl,
  Select,
  SelectChangeEvent,
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
import { showSuccessToast } from '@/utils/utils';

const MonthDetails = ({ url }: MonthDetailsProps) => {
  const router = useRouter();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [propertiesOpen, setPropertiesOpen] = useState<boolean>(false);
  const [buttonVariant, setButtonVariant] = useState<'outlined' | 'contained'>(
    'outlined'
  );
  const [currentMonth, setCurrentMonth] = useState<Month | null>(null);
  const [months, setMonths] = useState<Months>([]);
  const [savings, setSavings] = useState<Savings>([]);
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
    router.push(`/monthly-budget/${(event.target as HTMLSelectElement).value}`);
    // window.location.href = `/monthly-budget/${event.target.value}`;
  };

  const fetchSavings = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/savings`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      setSavings(data.allSavings);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAllMonths = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/months/`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await fetchResult.json();

      setMonths(data.allMonths);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateSubmit = async (submitBody: BodyInit): Promise<void> => {
    const updateMonth = async (token: string): Promise<void> => {
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
        } else {
          if (currentMonth) {
            showSuccessToast({
              subject: currentMonth?.name,
              fetchMethod: FetchMethods.put,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) updateMonth(jwtToken);
    setMonthDetailsUpdated(!monthDetailsUpdated);
  };

  const handleBudgetSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';
    const insertBudget = async (token: string): Promise<void> => {
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
        } else {
          showSuccessToast({
            subject: result.newBudgetElement.name,
            fetchMethod: fetchMethod,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) insertBudget(jwtToken);
    setMonthDetailsUpdated(!monthDetailsUpdated);
  };

  const handleBudgetDelete = async (
    id: string,
    type: BudgetElements
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      try {
        await fetch(
          `${process.env.BACKEND_URL}/months/${currentMonth?._id}/${type}/${id}`,
          {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const found =
          type === BudgetElements.income
            ? currentMonth?.income.find((income) => income._id === id)
            : currentMonth?.budget.find((budget) => budget._id === id);
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
    setMonthDetailsUpdated(!monthDetailsUpdated);
  };

  const handleContributionSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    savingId?: string,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';
    const insertSaving = async (token: string): Promise<void> => {
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
        } else {
          showSuccessToast({
            subject: `Contribution to ${result.contributor.name}`,
            fetchMethod: fetchMethod,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) insertSaving(jwtToken);
    setMonthDetailsUpdated(!monthDetailsUpdated);
  };

  const handleContributionDelete = async (
    savingId: string,
    id: string
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
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
        } else {
          showSuccessToast({
            subject: `Contribution to ${result.contributorToDelete.name}`,
            fetchMethod: FetchMethods.delete,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
    setMonthDetailsUpdated(!monthDetailsUpdated);
  };

  const handleSpendingSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    savingId?: string,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';
    const insertSpending = async (token: string): Promise<void> => {
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
        } else {
          showSuccessToast({
            subject: `Spending from ${result.spending.name}`,
            fetchMethod: fetchMethod,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) insertSpending(jwtToken);
    setMonthDetailsUpdated(!monthDetailsUpdated);
  };

  const handleSpendingDelete = async (
    savingId: string,
    id: string
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
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
        } else {
          showSuccessToast({
            subject: `Spending from ${result.spendingToDelete.name}`,
            fetchMethod: FetchMethods.delete,
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
    setMonthDetailsUpdated(!monthDetailsUpdated);
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
        } else {
          if (currentMonth) {
            showSuccessToast({
              subject: currentMonth?.name,
              customMessage: isMonthClosed
                ? 'has been opened'
                : 'has been closed',
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (jwtToken) updateMonthClose(jwtToken);
    setMonthDetailsUpdated(!monthDetailsUpdated);
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

        setCurrentMonth(data.month);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentMonth(jwtToken);
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
      {/* <select name='month-selector' id='months-selector' onChange={changeMonth}>
        {months.map((month) => (
          <option
            key={month._id}
            value={month.url}
            selected={month.url === currentMonth?.url ? true : false}
          >
            {month.name}
          </option>
        ))}
      </select> */}
      {currentMonth && months.length > 0 ? (
        <>
          <FormControl fullWidth>
            {/* <InputLabel id='month-selector-label'>Month</InputLabel> */}
            <Select
              labelId='month-selector-label'
              id='month-selector'
              defaultValue={currentMonth.url}
              // label='Month'
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
                onClick={handleOpen}
              >
                Quick Update
              </Button>
              <Button
                sx={{ marginRight: 2 }}
                variant='contained'
                onClick={toggleMonthClose}
                color='warning'
              >
                {closeButtonText}
              </Button>
            </div>
            <div className={styles.button_row_right}>
              <Button
                variant={buttonVariant}
                onClick={toggleProperties}
                startIcon={<InfoOutlinedIcon />}
                color='success'
              >
                Properties
              </Button>
            </div>
          </div>
          <div id='properties' className={styles.month_properties}>
            <div id='measure'>
              <div className={styles.month_properties_text}>
                Month is {currentMonth.closed ? 'closed' : 'open'}
                <br />
                Predecessor:{' '}
                {predecessor ? (
                  <a href={`/monthly-budget/${predecessor?.url}`}>
                    {predecessor?.name}
                  </a>
                ) : (
                  <>No predecessor (first month)</>
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
          <div className={styles.column_container}>
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
          </div>
        </>
      ) : (
        <></>
      )}
      <ToastContainer />
    </>
  );
};

export default MonthDetails;
