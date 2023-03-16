import { Skeleton } from '@mui/material';

const MonthsSkeleton = () => {
  return (
    <>
      <Skeleton
        animation='wave'
        variant='rounded'
        height={54}
        sx={{ marginBottom: '10px', borderRadius: '10px' }}
      />
      <Skeleton
        animation='wave'
        variant='rounded'
        height={54}
        sx={{ marginBottom: '10px', borderRadius: '10px' }}
      />
      <Skeleton
        animation='wave'
        variant='rounded'
        height={54}
        sx={{ marginBottom: '10px', borderRadius: '10px' }}
      />
    </>
  );
};

export default MonthsSkeleton;
