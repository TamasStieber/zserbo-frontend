import styles from '@/styles/Home.module.css';
import TableSkeleton from './TableSkeleton';

const DefaultsSkeleton = () => {
  return (
    <div className={styles.column_container}>
      <div className={styles.column}>
        <TableSkeleton text='Incomes' />
      </div>
      <div className={styles.column}>
        <TableSkeleton text='Expenses' />
      </div>
    </div>
  );
};

export default DefaultsSkeleton;
