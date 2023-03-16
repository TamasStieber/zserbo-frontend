import styles from '@/styles/Home.module.css';
import { Skeleton } from '@mui/material';
import TableSkeleton from './TableSkeleton';

const MonthPageSkeleton = () => {
  return (
    <>
      <Skeleton
        animation='wave'
        variant='rounded'
        sx={{ width: '100%' }}
        height={100}
      />
      <Skeleton
        animation='wave'
        variant='rounded'
        sx={{ width: '100%' }}
        height={300}
        className={styles.month_summary}
      />
      <div className={styles.column_container}>
        <div className={styles.column}>
          <TableSkeleton text='Incomes' />
          <TableSkeleton text='Savings' />
          <TableSkeleton text='Spendings from Savings' />
        </div>
        <div className={styles.column}>
          <TableSkeleton text='Expenses' />
        </div>
      </div>
    </>
  );
};

export default MonthPageSkeleton;
