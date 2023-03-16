import styles from '@/styles/Home.module.css';
import { Skeleton } from '@mui/material';

const SummarySkeleton = () => {
  return (
    <>
      <Skeleton
        animation='wave'
        variant='rounded'
        height={100}
        sx={{ marginTop: '40px', marginBottom: '100px' }}
      />
      <Skeleton
        animation='wave'
        variant='rounded'
        height={340}
        className={styles.dashboard_chart}
      />
    </>
  );
};

export default SummarySkeleton;
