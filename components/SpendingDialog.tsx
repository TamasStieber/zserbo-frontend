import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Box,
} from '@mui/material';
import { FetchMethods, SpendingDialogProps } from '../types/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addThousandSeparators, parseFinancialInput } from '../utils/utils';

const SpendingDialog = ({
  savings,
  open,
  closeHandler,
  submitHandler,
  fetchMethod,
  initialValues,
  monthId,
}: SpendingDialogProps) => {
  const action = fetchMethod === FetchMethods.post ? 'Add new' : 'Update';
  open = !open ? false : open;
  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogTitle sx={{ width: 400 }}>{`${action} spending`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Please enter the details of the spending.
        </DialogContentText>
        <SpendingForm
          savings={savings}
          closeHandler={closeHandler}
          submitHandler={submitHandler}
          fetchMethod={fetchMethod}
          initialValues={initialValues}
          monthId={monthId}
        />
      </DialogContent>
    </Dialog>
  );
};

const SpendingForm = ({
  savings,
  closeHandler,
  submitHandler,
  fetchMethod,
  initialValues,
  monthId,
}: SpendingDialogProps) => {
  const buttonText = fetchMethod === FetchMethods.post ? 'Add' : 'Update';

  const validationSchema = yup.object({
    amount: yup
      .number()
      .transform((_value, originalValue) => {
        if (typeof originalValue === 'string')
          if (originalValue.includes(' ') || originalValue.includes('+'))
            return parseFinancialInput(originalValue);
        return +originalValue;
      })
      .min(0)
      .required('Amount is required'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const savingId = values.savingId
        ? values.savingId
        : savings[savings.length - 1]._id;
      const amount = parseFinancialInput(values.amount);

      const submitBody = JSON.stringify({
        monthId: monthId,
        amount: amount,
      });

      submitHandler(submitBody, fetchMethod, savingId, initialValues._id);

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
        select
        id='savingId'
        name='savingId'
        label='Saving'
        disabled={initialValues.savingId ? true : false}
        defaultValue={
          initialValues.savingId
            ? initialValues.savingId
            : savings[savings.length - 1]._id
        }
        onChange={formik.handleChange}
      >
        {savings.map((saving) => (
          <MenuItem key={saving._id} value={saving._id}>
            {saving.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        sx={{ marginTop: 2 }}
        autoFocus={true}
        autoComplete='off'
        variant='outlined'
        id='amount'
        name='amount'
        label='Amount'
        onFocus={(event) => {
          event.target.select();
        }}
        defaultValue={
          initialValues ? addThousandSeparators(initialValues.amount) : ''
        }
        InputProps={{
          endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
        }}
        onChange={formik.handleChange}
        error={formik.touched.amount && Boolean(formik.errors.amount)}
        helperText={formik.touched.amount && formik.errors.amount}
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

export default SpendingDialog;
