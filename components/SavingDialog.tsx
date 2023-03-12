import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  InputAdornment,
  Box,
} from '@mui/material';
import { FetchMethods, SavingDialogProps } from '../types/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addThousandSeparators, parseFinancialInput } from '../utils/utils';

const SavingDialog = ({
  open,
  closeHandler,
  submitHandler,
  fetchMethod,
  initialValues,
}: SavingDialogProps) => {
  const action = fetchMethod === FetchMethods.post ? 'Add new' : 'Update';
  open = !open ? false : open;
  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogTitle sx={{ width: 400 }}>{`${action} saving`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Please enter the details of the saving.
        </DialogContentText>
        <SavingForm
          closeHandler={closeHandler}
          submitHandler={submitHandler}
          fetchMethod={fetchMethod}
          initialValues={initialValues}
        />
      </DialogContent>
    </Dialog>
  );
};

const SavingForm = ({
  closeHandler,
  submitHandler,
  fetchMethod,
  initialValues,
}: SavingDialogProps) => {
  const buttonText = fetchMethod === FetchMethods.post ? 'Add' : 'Update';

  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    goal: yup
      .number()
      .transform((_value, originalValue) => {
        if (typeof originalValue === 'string')
          if (originalValue.includes(' ') || originalValue.includes('+'))
            return parseFinancialInput(originalValue);
        return +originalValue;
      })
      .min(0)
      .required('Goal is required'),
    initial: yup
      .number()
      .transform((_value, originalValue) => {
        if (typeof originalValue === 'string')
          if (originalValue.includes(' ') || originalValue.includes('+'))
            return parseFinancialInput(originalValue);
        return +originalValue;
      })
      .min(0)
      .required('Initial value should at least be 0'),
    comment: yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const name = values.name;
      const goal = parseFinancialInput(values.goal);
      const initial = parseFinancialInput(values.initial);
      const comment = values.comment;

      const submitBody = JSON.stringify({
        name: name,
        goal: goal,
        initial: initial,
        comment: comment,
      });

      submitHandler(submitBody, fetchMethod, initialValues._id);
      closeHandler();
    },
  });

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column' }}
      component='form'
      onSubmit={formik.handleSubmit}
    >
      <TextField
        sx={{ marginTop: 2 }}
        autoFocus={fetchMethod === FetchMethods.post ?? true}
        autoComplete='off'
        variant='outlined'
        id='name'
        name='name'
        label='Name'
        onFocus={(event) => {
          event.target.select();
        }}
        defaultValue={initialValues ? initialValues.name : ''}
        onChange={formik.handleChange}
        error={formik.touched.name && Boolean(formik.errors.name)}
        helperText={formik.touched.name && formik.errors.name}
      ></TextField>
      <Box
        sx={{
          display: 'flex',
          marginTop: 2,
          justifyContent: 'space-between',
        }}
      >
        <TextField
          sx={{ width: '48%' }}
          autoFocus={fetchMethod === FetchMethods.put ?? true}
          autoComplete='off'
          variant='outlined'
          id='goal'
          name='goal'
          label='Goal'
          onFocus={(event) => {
            event.target.select();
          }}
          defaultValue={
            initialValues ? addThousandSeparators(initialValues.goal) : ''
          }
          InputProps={{
            endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
          }}
          onChange={formik.handleChange}
          error={formik.touched.goal && Boolean(formik.errors.goal)}
          helperText={formik.touched.goal && formik.errors.goal}
        ></TextField>
        <TextField
          sx={{ width: '48%' }}
          autoComplete='off'
          variant='outlined'
          id='initial'
          name='initial'
          label='Initial'
          onFocus={(event) => {
            event.target.select();
          }}
          defaultValue={
            initialValues ? addThousandSeparators(initialValues.initial) : ''
          }
          InputProps={{
            endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
          }}
          onChange={formik.handleChange}
          error={formik.touched.initial && Boolean(formik.errors.initial)}
          helperText={formik.touched.initial && formik.errors.initial}
        ></TextField>
      </Box>
      <TextField
        sx={{ marginTop: 2 }}
        id='comment'
        name='comment'
        label='Comment'
        multiline
        rows={4}
        defaultValue={initialValues ? initialValues.comment : ''}
        onChange={formik.handleChange}
        error={formik.touched.comment && Boolean(formik.errors.comment)}
        helperText={formik.touched.comment && formik.errors.comment}
      ></TextField>
      <Box
        sx={{
          marginTop: 4,
          textAlign: 'right',
        }}
      >
        <Button sx={{ width: 100 }} variant='outlined' onClick={closeHandler}>
          Cancel
        </Button>
        <Button
          sx={{ width: 100, marginLeft: 1 }}
          variant='contained'
          type='submit'
        >
          {buttonText}
        </Button>
      </Box>
    </Box>
  );
};

export default SavingDialog;
