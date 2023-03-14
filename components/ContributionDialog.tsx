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
import { FetchMethods, ContributionDialogProps } from '../types/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { addThousandSeparators, formatInput, parseFinancialInput, replaceEmptyValue } from '../utils/utils';

const ContributionDialog = ({
  savings,
  open,
  closeHandler,
  submitHandler,
  fetchMethod,
  initialValues,
  monthId,
}: ContributionDialogProps) => {
  const action = fetchMethod === FetchMethods.post ? 'Add new' : 'Update';
  open = !open ? false : open;
  return (
    <Dialog open={open} onClose={closeHandler}>
      <DialogTitle sx={{ width: 400 }}>{`${action} saving`}</DialogTitle>
      <DialogContent dividers>
        <DialogContentText sx={{ marginBottom: 2 }}>
          Please enter the details of the saving.
        </DialogContentText>
        <ContributionForm
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

const ContributionForm = ({
  savings,
  closeHandler,
  submitHandler,
  fetchMethod,
  initialValues,
  monthId,
}: ContributionDialogProps) => {
  const buttonText = fetchMethod === FetchMethods.post ? 'Add' : 'Update';

  const validationSchema = yup.object({
    plan: yup
      .number()
      .transform((_value, originalValue) => {
        if (typeof originalValue === 'string')
          if (originalValue.includes(' ') || originalValue.includes('+'))
            return parseFinancialInput(originalValue);
        return +originalValue;
      })
      .min(0)
      .required('Plan is required'),
    actual: yup
      .number()
      .transform((_value, originalValue) => {
        if (typeof originalValue === 'string')
          if (originalValue.includes(' ') || originalValue.includes('+'))
            return parseFinancialInput(originalValue);
        return +originalValue;
      })
      .min(0)
      .required('Actual value should at least be 0'),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const savingId = values.savingId
        ? values.savingId
        : savings[savings.length - 1]._id;
      const plan = parseFinancialInput(values.plan);
      const actual = parseFinancialInput(values.actual);

      const submitBody = JSON.stringify({
        monthId: monthId,
        plan: plan,
        actual: actual,
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
          variant='outlined'
          id='plan'
          name='plan'
          label='Plan'
          onChangeCapture={(event) => (formatInput(event.target))}
          onBlur={(event) => replaceEmptyValue(event.target)}
          onFocus={(event) => {
            event.target.select();
          }}
          defaultValue={
            initialValues ? addThousandSeparators(initialValues.plan) : ''
          }
          InputProps={{
            endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
          }}
          onChange={formik.handleChange}
          error={formik.touched.plan && Boolean(formik.errors.plan)}
          helperText={formik.touched.plan && formik.errors.plan}
        ></TextField>
        <TextField
          sx={{ width: '48%' }}
          autoComplete='off'
          variant='outlined'
          id='actual'
          name='actual'
          label='Actual'
          onChangeCapture={(event) => (formatInput(event.target))}
          onBlur={(event) => replaceEmptyValue(event.target)}
          onFocus={(event) => {
            event.target.select();
          }}
          defaultValue={
            initialValues ? addThousandSeparators(initialValues.actual) : ''
          }
          InputProps={{
            endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
          }}
          onChange={formik.handleChange}
          error={formik.touched.actual && Boolean(formik.errors.actual)}
          helperText={formik.touched.actual && formik.errors.actual}
        ></TextField>
      </Box>
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

export default ContributionDialog;
