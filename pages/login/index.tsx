import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { VisibilityOff, Visibility } from '@mui/icons-material';
import Head from 'next/head';
import PetsIcon from '@mui/icons-material/Pets';
import styles from '../../styles/Home.module.css';
import Image from 'next/image';
import { WhiteBackgroundTextField } from '@/components/CustomMUIElements';

type TokenResponseType = { token: string };

const showToastMessage = () => {
  toast.error('Invalid username or password', {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: 'light',
  });
};

const validationSchema = yup.object({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

const LoginForm = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },

    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const loginBody = JSON.stringify({
        username: values.username,
        password: values.password,
      });

      const login = await fetch(`${process.env.BACKEND_URL}/login`, {
        method: 'POST',
        body: loginBody,
        headers: { 'Content-Type': 'application/json' },
      });
      const responseBody: TokenResponseType = await login.json();

      if (responseBody.token !== undefined) {
        localStorage.setItem('jwtToken', responseBody.token || '');
        window.location.href = '/';
      } else {
        showToastMessage();
      }
    },
  });

  return (
    <>
      <Head>
        <title>Zserbó - Sign In</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {/* <Box maxWidth='sm' margin='auto'> */}
      <div className={styles.login}>
        <div className={styles.login_title}>
          {/* <PetsIcon />
          <p>Zserbó</p> */}
          <Image src='/img/logo.png' alt='logo' width='80' height='80' />
        </div>
        {/* <Typography sx={{ textAlign: 'center' }} variant='h5'>
          Sign In
        </Typography> */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            width: 400,
          }}
          component='form'
          onSubmit={formik.handleSubmit}
        >
          <WhiteBackgroundTextField
            sx={{ marginTop: 2, width: '100%' }}
            variant='outlined'
            id='username'
            name='username'
            label='Username'
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
          <WhiteBackgroundTextField
            sx={{ marginTop: 2, width: '100%' }}
            variant='outlined'
            id='password'
            name='password'
            label='Password'
            type={isVisible ? 'text' : 'password'}
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            // InputProps={{
            //   endAdornment: (
            //     <InputAdornment position='end'>
            //       <IconButton onClick={() => setIsVisible(!isVisible)}>
            //         {isVisible ? <VisibilityOff /> : <Visibility />}
            //       </IconButton>
            //     </InputAdornment>
            //   ),
            // }}
          />
          <Button
            sx={{ marginTop: 2, width: 150, alignSelf: 'center' }}
            variant='contained'
            type='submit'
          >
            Sign In
          </Button>
        </Box>
        <ToastContainer />
      </div>
      {/* </Box> */}
    </>
  );
};

export default LoginForm;
