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
import { UpdateDialogProps } from '../types/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addThousandSeparators, formatInput, parseFinancialInput, replaceEmptyValue } from '../utils/utils';

const UpdateDialog = ({
  open,
  closeHandler,
  submitHandler,
  initialValues,
}: UpdateDialogProps) => {
  open = !open ? false : open;
  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogTitle sx={{ width: 400 }}>Update finances</DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Quick month update
        </DialogContentText>
        <UpdateForm
          closeHandler={closeHandler}
          submitHandler={submitHandler}
          initialValues={initialValues}
        />
      </DialogContent>
    </Dialog>
  );
};

const UpdateForm = ({
  closeHandler,
  submitHandler,
  initialValues,
}: UpdateDialogProps) => {
  const validationSchema = yup.object({
    balance: yup
      .number()
      .transform((_value, originalValue) => {
        if (typeof originalValue === 'string')
          if (originalValue.includes(' ') || originalValue.includes('+'))
            return parseFinancialInput(originalValue);
        return +originalValue;
      })
      .min(0)
      .required('Income value is required'),
    opening: yup
      .number()
      .transform((_value, originalValue) => {
        if (typeof originalValue === 'string')
          if (originalValue.includes(' ') || originalValue.includes('+'))
            return parseFinancialInput(originalValue);
        return +originalValue;
      })
      .min(0)
      .required('Income value is required'),
    comment: yup.string(),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const balance = parseFinancialInput(values.balance);
      const opening = parseFinancialInput(values.opening);
      const comment = values.comment;

      const submitBody = JSON.stringify({
        balance: balance,
        opening: opening,
        comment: comment,
      });

      submitHandler(submitBody);
      closeHandler();
    },
  });

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column' }}
      component='form'
      onSubmit={formik.handleSubmit}
    >
      <Box
        sx={{
          display: 'flex',
          marginTop: 2,
          justifyContent: 'space-between',
        }}
      >
        <TextField
          sx={{ width: '48%' }}
          autoFocus={true}
          autoComplete='off'
          id='balance'
          name='balance'
          label='Balance'
          onChangeCapture={(event) => (formatInput(event.target))}
          onBlur={(event) => replaceEmptyValue(event.target)}
          onFocus={(event) => {
            event.target.select();
          }}
          defaultValue={
            initialValues ? addThousandSeparators(initialValues.balance) : ''
          }
          InputProps={{
            endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
          }}
          onChange={formik.handleChange}
          error={formik.touched.balance && Boolean(formik.errors.balance)}
          helperText={formik.touched.balance && formik.errors.balance}
        ></TextField>
        <TextField
          sx={{ width: '48%' }}
          autoComplete='off'
          id='opening'
          name='opening'
          label='Opening'
          onChangeCapture={(event) => (formatInput(event.target))}
          onBlur={(event) => replaceEmptyValue(event.target)}
          onFocus={(event) => {
            event.target.select();
          }}
          defaultValue={
            initialValues ? addThousandSeparators(initialValues.opening) : ''
          }
          InputProps={{
            endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
          }}
          onChange={formik.handleChange}
          error={formik.touched.opening && Boolean(formik.errors.opening)}
          helperText={formik.touched.opening && formik.errors.opening}
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
      />
      <Box
        sx={{
          marginTop: 4,
          textAlign: 'right',
        }}
      >
        <Button sx={{ width: 100 }} variant='contained' type='submit'>
          Update
        </Button>
        <Button
          sx={{ width: 100, marginLeft: 1 }}
          variant='outlined'
          onClick={closeHandler}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateDialog;
