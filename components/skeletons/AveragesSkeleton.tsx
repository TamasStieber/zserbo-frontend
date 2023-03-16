import styles from '@/styles/Home.module.css';
import { Skeleton } from '@mui/material';

const AveragesSkeleton = () => {
  return (
    <>
      <AverageSkeleton />
      <AverageSkeleton />
      <AverageSkeleton />
      <AverageSkeleton />
      <AverageSkeleton />
    </>
  );
};

const AverageSkeleton = () => {
  return (
    <div className={styles.average}>
      <Skeleton
        animation='wave'
        variant='circular'
        className={styles.average_icon}
        height={50}
      />
      <div className={styles.average_body}>
        <Skeleton
          animation='wave'
          variant='text'
          className={styles.average_primary}
          width={150}
        />
        <Skeleton
          animation='wave'
          variant='text'
          className={styles.average_secondary}
          width={120}
        />
      </div>
    </div>
  );
};

export default AveragesSkeleton;
