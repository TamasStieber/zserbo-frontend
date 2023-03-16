import styles from '@/styles/Home.module.css';
import { Skeleton } from '@mui/material';

const SavingsSkeleton = () => {
  return (
    <>
      <SavingSkeleton />
      <SavingSkeleton />
      <SavingSkeleton />
    </>
  );
};

const SavingSkeleton = () => {
  return (
    <div className={styles.saving}>
      <div className={styles.saving_title}>
        <h2>
          <Skeleton variant='text' width={150} />
        </h2>
      </div>
      <div className={styles.saving_primary}>
        <Skeleton
          variant='rounded'
          sx={{ width: '100%', marginBottom: 2 }}
          height={40}
          className={styles.saving_primary_element}
        />
      </div>
      <Skeleton
        variant='rounded'
        sx={{ width: '100%' }}
        className={styles.progress_container}
      />
      <div className={styles.saving_secondary}>
        <Skeleton
          variant='rounded'
          width={100}
          className={styles.saving_secondary_element}
        >
          <Skeleton
            variant='rounded'
            width={100}
            className={styles.saving_secondary_element}
          />
        </Skeleton>
        <Skeleton
          variant='rounded'
          width={100}
          className={styles.saving_secondary_element}
        >
          <Skeleton
            variant='rounded'
            width={100}
            className={styles.saving_secondary_element}
          />
        </Skeleton>
      </div>
      <div className={styles.saving_secondary}>
        <Skeleton
          variant='rounded'
          width={100}
          className={styles.saving_secondary_element}
        >
          <Skeleton
            variant='rounded'
            width={100}
            className={styles.saving_secondary_element}
          />
        </Skeleton>
        <Skeleton
          variant='rounded'
          width={100}
          className={styles.saving_secondary_element}
        >
          <Skeleton
            variant='rounded'
            width={100}
            className={styles.saving_secondary_element}
          />
        </Skeleton>
      </div>
      <div className={styles.saving_comment}></div>
    </div>
  );
};

export default SavingsSkeleton;
