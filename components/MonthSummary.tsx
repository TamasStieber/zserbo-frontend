import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SavingsIcon from '@mui/icons-material/Savings';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { MonthSummaryProps } from '../types/types';
import styles from '../styles/Home.module.css';
import {
  MonthSummaryPrimaryElement,
  MonthSummarySecondaryElement,
} from './MonthSummaryElements';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { categories } from './Categories';
import { addThousandSeparators } from '@/utils/utils';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import Image from 'next/image';

ChartJS.register(ArcElement, Tooltip, Legend);

const MonthSummary = ({
  currentMonth,
  predecessor,
  savings,
}: MonthSummaryProps) => {
  const savingsTitle = currentMonth.closed ? 'Savings at close' : 'All Savings';
  let sumAllSavings = currentMonth.closed ? currentMonth.sumAllSavings : 0;
  let sumPlannedIncome = 0;
  let sumPlannedExpenses = 0;
  let sumActualExpenses = 0;
  let opening = currentMonth.opening;
  let balance = currentMonth.balance;
  let actualRemaining = 0;
  let plannedRemaining = 0;
  let currentMonthPlannedSavings = 0;
  let currentMonthActualSavings = 0;

  savings.forEach((saving) => {
    saving.contributors.forEach((contributor) => {
      if (contributor.monthId === currentMonth._id) {
        currentMonthPlannedSavings += contributor.plan;
        currentMonthActualSavings += contributor.actual;
      }
    });
  })

  if (!currentMonth.closed) {
    savings.forEach((saving) => {
      sumAllSavings += saving.initial;
      saving.contributors.forEach((contributor) => {
        sumAllSavings += contributor.actual;
      });
      saving.spendings.forEach((spending) => {
        sumAllSavings -= spending.amount;
      });
    });
  }

  currentMonth.income.forEach((income) => {
    sumPlannedIncome += income.value;
  });
  currentMonth.budget.forEach((budget) => {
    sumPlannedExpenses += budget.plan;
    sumActualExpenses += budget.actual;
  });

  sumPlannedExpenses += currentMonthPlannedSavings;
  sumActualExpenses += currentMonthActualSavings;
  actualRemaining = balance - sumAllSavings;
  plannedRemaining = sumPlannedIncome + opening - sumPlannedExpenses;

  const sumExpensesByCategory: {
    name: string;
    categoryId: number;
    amount: number;
  }[] = [];

  const savingsChartData = {
    label: 'Savings',
    data: currentMonthActualSavings,
    backgroundColor: 'rgba(200, 50, 0, 1)',
    borderColor: 'rgba(200, 50, 0, 1)',
  };

  currentMonth.budget.forEach((expense) => {
    const found = sumExpensesByCategory.find(
      (element) => element.categoryId === expense.categoryId
    );
    if (found) {
      found.amount += expense.actual;
    } else {
      if (expense.actual > 0) {
        sumExpensesByCategory.push({
          name: expense.name,
          categoryId: expense.categoryId,
          amount: expense.actual,
        });
      }
    }
  });

  const getChartData = () => {
    const labels: string[] = [];
    const data: number[] = [];
    const backgroundColor: string[] = [];
    const borderColor: string[] = [];

    sumExpensesByCategory.forEach((expense) => {
      data.push(expense.amount);
      const found = categories.find(
        (category) => category.id === expense.categoryId
      );
      if (found) {
        labels.push(found.name);
        backgroundColor.push(`rgba(${found.chartColor}, 1)`);
        borderColor.push(`rgba(${found.chartColor}, 1)`);
      }
    });

    if (currentMonthActualSavings > 0) {
      labels.push(savingsChartData.label);
      data.push(savingsChartData.data);
      backgroundColor.push(savingsChartData.backgroundColor);
      borderColor.push(savingsChartData.borderColor);
    }

    return {
      labels: labels,
      datasets: [
        {
          label: 'Amount',
          data: data,
          backgroundColor: backgroundColor,
          borderColor: borderColor,
          borderWidth: 1,
        },
      ],
    };
  };

  const data = getChartData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      tooltip: {
        callbacks: {
          label: (yDatapoint: any) => {
            return `Amount: ${addThousandSeparators(yDatapoint.raw, 'Ft')}`;
          },
        },
      },
      title: {
        display: false,
        text: 'Expenses by categories',
      },
    },
    cutout: 60,
  };

  return (
    <>
      <div className={styles.month_summary}>
        <div className={styles.month_summary_rows}>
          <div className={styles.month_summary_row_primary}>
            <MonthSummaryPrimaryElement
              amount={balance}
              text={'Balance'}
              icon={<AccountBalanceWalletIcon />}
            />
            <MonthSummaryPrimaryElement
              amount={actualRemaining}
              text={'Remaining'}
              icon={<AttachMoneyIcon />}
            />
            <MonthSummaryPrimaryElement
              amount={sumAllSavings}
              text={savingsTitle}
              icon={<SavingsIcon />}
            />
          </div>
          <div className={styles.month_summary_row_secondary}>
            <MonthSummarySecondaryElement amount={opening} text={'Opening'} />
            <MonthSummarySecondaryElement
              amount={sumPlannedIncome}
              text={'Planned income'}
            />
            <MonthSummarySecondaryElement
              amount={sumPlannedExpenses}
              text={'Planned expenses'}
            />
            <MonthSummarySecondaryElement
              amount={sumActualExpenses}
              text={'Actual Expenses'}
            />
            <MonthSummarySecondaryElement
              amount={plannedRemaining}
              text={'Planned Remaining'}
            />
          </div>
        </div>
        <div className={styles.month_summary_chart}>
          {/* <h3>Expenses by categories</h3> */}
          {sumActualExpenses > 0 ? (
            <Doughnut data={data} options={options} />
          ) : (
            <div className={styles.month_summary_not_found}>
              <Image
                src={'/img/not_found.png'}
                alt={'Not found'}
                width='250'
                height='250'
              />
              <h3>No expenses to show</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MonthSummary;
