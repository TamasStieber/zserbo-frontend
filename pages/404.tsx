import { Box, Button, Typography } from '@mui/material';
import { blue } from '@mui/material/colors';
import { useRouter } from 'next/router';

const primary = blue[300];

export default function NotFound() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: primary,
      }}
    >
      <Typography variant='h1' style={{ color: 'white' }}>
        404
      </Typography>
      <Typography variant='h6' style={{ color: 'white' }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </Typography>
      <Button variant='contained' onClick={handleClick}>
        Back Home
      </Button>
    </Box>
  );
}
