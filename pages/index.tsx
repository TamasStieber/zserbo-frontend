import { categories } from '@/components/Categories';
import PageContainer from '@/components/layout/PageContainer';
import { NextPage } from 'next';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import styles from '../styles/Home.module.css';
import { addThousandSeparators } from '@/utils/utils';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined';
import { Months, Savings } from '@/types/types';
import DashboardAverage from '@/components/DashboardAverage';
import { NoMonthsFound } from '@/components/NoElementFound';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Home: NextPage = () => {
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [months, setMonths] = useState<Months | null>(null);
  const [savings, setSavings] = useState<Savings | null>(null);

  let averageIncome = { amount: 0, count: 0, average: 0 };
  let averageExpenses = { amount: 0, count: 0, average: 0 };
  let sumAllSavings = 0;

  const averagesByCategories: {
    name: string;
    categoryId: number;
    amount: number;
    count: number;
    average: number;
  }[] = categories.map((category) => {
    return {
      name: category.name,
      categoryId: category.id,
      amount: 0,
      count: 0,
      average: 0,
    };
  });

  savings?.forEach((saving) => {
    sumAllSavings += saving.initial;
    saving.contributors.forEach((contributor) => {
      sumAllSavings += contributor.actual;
    });
    saving.spendings.forEach((spending) => {
      sumAllSavings -= spending.amount;
    });
  });

  const getAverages = () => {
    months?.forEach((month) => {
      let monthIncomeSum = 0;
      let monthExpensesSum = 0;
      month.income.forEach((income) => {
        if (income.value > 0) {
          averageIncome.amount += income.value;
          monthIncomeSum++;
        }
      });
      month.budget.forEach((budget) => {
        if (budget.actual > 0) {
          averageExpenses.amount += budget.actual;
          monthExpensesSum++;
        }
      });
      if (monthIncomeSum > 0) averageIncome.count++;
      if (monthExpensesSum > 0) averageExpenses.count++;
    });
    averageIncome.average = Math.round(
      averageIncome.amount / averageIncome.count
    );
    averageExpenses.average = Math.round(
      averageExpenses.amount / averageExpenses.count
    );

    if (isNaN(averageIncome.average)) averageIncome.average = 0;
    if (isNaN(averageExpenses.average)) averageExpenses.average = 0;
  };

  const getAveragesByCategories = () => {
    months?.forEach((month) => {
      month.budget.forEach((budget) => {
        const found = averagesByCategories.find(
          (element) => element.categoryId === budget.categoryId
        );
        if (budget.actual > 0) {
          if (found) {
            found.amount += budget.actual;
            found.count++;
            found.average = Math.round(found.amount / found.count);
          }
        }
      });
    });

    const labels = averagesByCategories.map((element) => element.name);
    const dataset: {
      label: string;
      data: number[];
      backgroundColor: string[];
    } = {
      label: 'Amount',
      data: [],
      backgroundColor: [],
    };
    averagesByCategories.forEach((element) => {
      dataset.data.push(element.average);
      dataset.backgroundColor.push(
        `rgba(${categories[element.categoryId].chartColor}, 1)`
      );
    });

    return {
      labels,
      datasets: [dataset],
    };
  };

  const getExpensesData = () => {
    const labels: string[] = [];
    const actualData: number[] = [];
    const planData: number[] = [];
    const datasets: any[] = [];

    months?.forEach((month) => {
      let sumAllExpenses = 0;
      let sumAllPlans = 0;

      labels.push(month.name);

      month.budget.forEach((budget) => {
        sumAllExpenses += budget.actual;
        sumAllPlans += budget.plan;
      });

      actualData.push(sumAllExpenses);
      planData.push(sumAllPlans);
    });

    datasets.push({
      label: 'Actual Expenses',
      data: actualData,
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 1)',
    });
    datasets.push({
      label: 'Planned Expenses',
      data: planData,
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 1)',
    });

    return {
      labels,
      datasets: datasets,
    };
  };

  getAverages();

  const averagesByCategoriesData = getAveragesByCategories();
  const expensesData = getExpensesData();

  const expensesChartOptions = {
    // maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${addThousandSeparators(
              context.parsed.y,
              'Ft'
            )}`;
          },
        },
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => {
            return addThousandSeparators(value, 'Ft');
          },
        },
      },
    },
  };

  const averagesByCategoriesChartOptions = {
    // maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `${context.dataset.label}: ${addThousandSeparators(
              context.parsed.y,
              'Ft'
            )}`;
          },
        },
      },
      title: {
        display: false,
        text: 'Chart.js Line Chart',
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => {
            return addThousandSeparators(value, 'Ft');
          },
        },
      },
    },
  };

  const fetchMonths = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(process.env.BACKEND_URL + '/months', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      setMonths(data.allMonths);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchSavings = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(process.env.BACKEND_URL + '/savings', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      setSavings(data.allSavings);
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
    fetchSavings(jwtToken);
  }, [jwtToken]);

  return (
    <PageContainer title='Dashboard'>
      {months && months.length > 0 ? (
        <>
          <div className={styles.dashboard_averages}>
            <DashboardAverage
              average={averageIncome.average}
              primary={'Average Income'}
              secondary={'Across all months'}
              icon={<TrendingUpIcon style={{ color: '#398f1f' }} />}
            />
            <DashboardAverage
              average={averageExpenses.average}
              primary={'Average Expenses'}
              secondary={'Across all months'}
              icon={<TrendingDownIcon style={{ color: '#b30000' }} />}
            />
            <DashboardAverage
              average={sumAllSavings}
              primary={'All Savings'}
              secondary={'Across all months'}
              icon={<SavingsOutlinedIcon style={{ color: '#1976d2' }} />}
            />
          </div>
          <div className={styles.dashboard_charts}>
            <div className={styles.dashboard_chart}>
              <h3>Planned and actual Expenses</h3>
              <div className={styles.dashboard_chart_body}>
                <Line options={expensesChartOptions} data={expensesData} />
              </div>
            </div>
            <div className={styles.dashboard_chart}>
              <h3>Average actual Expenses by Categories</h3>
              <div className={styles.dashboard_chart_body}>
                <Bar
                  options={averagesByCategoriesChartOptions}
                  data={averagesByCategoriesData}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <NoMonthsFound link={true} />
      )}
    </PageContainer>
  );
};

export default Home;
