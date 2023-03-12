import {
  Box,
  Button,
  TextField,
  FormControlLabel,
  FormGroup,
  Checkbox,
  MenuItem,
} from '@mui/material';
import styles from '../styles/Home.module.css';
import { NewMonthFormProps, MonthNames, FetchMethods } from '../types/types';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  year: yup.number().min(2000).max(2100).required('Year is required'),
  month: yup.string().required('Month is required'),
  comment: yup.string(),
});

const NewMonthForm = ({
  closeHandler,
  submitHandler,
  initialValues,
  months,
  fetchMethod,
}: NewMonthFormProps) => {
  const buttonText = fetchMethod === FetchMethods.post ? 'Add' : 'Update';

  let isFirstMonth = false;

  if (months.length === 0 || fetchMethod === FetchMethods.put) {
    const found = months.find((month) => month._id === initialValues._id);
    isFirstMonth = found && found.predecessor[0].monthId ? false : true;
  }

  if (months.length > 0) {
    initialValues.predecessor = initialValues.predecessor
      ? initialValues.predecessor
      : months[months.length - 1]._id;
  }

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const submitPredecessor = values.predecessor;
      const submitYear = values.year;
      const submitMonth = values.month;
      const submitName = submitYear + ' ' + submitMonth;
      const submitComment = values.comment;
      const submitIsDefault = values.default;

      const submitBody = JSON.stringify({
        predecessor: { monthId: submitPredecessor },
        name: submitName,
        comment: submitComment,
        default: submitIsDefault,
      });

      submitHandler(submitBody, fetchMethod, initialValues._id);
      closeHandler();
    },
  });

  return (
    <div className={styles.month_dialog}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column' }}
        component='form'
        onSubmit={formik.handleSubmit}
      >
        {months.length > 0 && !isFirstMonth ? (
          <TextField
            sx={{ marginTop: 4 }}
            select
            id='predecessor'
            name='predecessor'
            label='Predecessor'
            defaultValue={
              initialValues.predecessor
                ? initialValues.predecessor
                : months[months.length - 1]._id
            }
            onChange={formik.handleChange}
          >
            {months.map((option) => (
              <MenuItem key={option._id} value={option._id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        ) : (
          <></>
        )}
        <Box
          sx={{
            display: 'flex',
            marginTop: 2,
            justifyContent: 'space-between',
          }}
        >
          <TextField
            sx={{ width: '30%', marginRight: 2 }}
            autoFocus
            autoComplete='off'
            variant='outlined'
            id='year'
            name='year'
            label='Year'
            defaultValue={initialValues.year}
            onChange={formik.handleChange}
            error={formik.touched.year && Boolean(formik.errors.year)}
            helperText={formik.touched.year && formik.errors.year}
          ></TextField>
          <TextField
            sx={{ flexGrow: 1 }}
            select
            id='month'
            name='month'
            label='Month'
            defaultValue={initialValues.month}
            onChange={formik.handleChange}
            error={formik.touched.month && Boolean(formik.errors.month)}
            helperText={formik.touched.month && formik.errors.month}
          >
            {MonthNames.map((option) => (
              <MenuItem key={option.name} value={option.name}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <TextField
          sx={{ marginTop: 2 }}
          id='comment'
          name='comment'
          label='Comment'
          multiline
          rows={4}
          defaultValue={initialValues.comment}
          onChange={formik.handleChange}
          error={formik.touched.comment && Boolean(formik.errors.comment)}
          helperText={formik.touched.comment && formik.errors.comment}
        />
        {fetchMethod === FetchMethods.post ? (
          <FormGroup sx={{ margin: 'auto', marginTop: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  defaultChecked={initialValues.default}
                  id='default'
                  name='default'
                  onChange={formik.handleChange}
                />
              }
              label='Default?'
            />
          </FormGroup>
        ) : (
          <></>
        )}
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
    </div>
  );
};

export default NewMonthForm;
