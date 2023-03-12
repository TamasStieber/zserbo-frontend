import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  TextField,
  InputAdornment,
  Box,
  DialogActions,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  BudgetElementDialogProps,
  BudgetElements,
  Category,
  FetchMethods,
} from '../types/types';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useState } from 'react';
import { addThousandSeparators, parseFinancialInput } from '../utils/utils';
import { categories } from './Categories';
import styles from '../styles/Home.module.css';

const BudgetElementDialog = ({
  open,
  closeHandler,
  elementType,
  submitHandler,
  fetchMethod,
  origin,
  initialValues,
}: BudgetElementDialogProps) => {
  const action = fetchMethod === FetchMethods.post ? 'Add new' : 'Update';
  open = !open ? false : open;
  return (
    <>
      <Dialog open={open} onClose={closeHandler}>
        <DialogTitle
          sx={{ width: 400 }}
        >{`${action} ${elementType}`}</DialogTitle>
        <DialogContent dividers>
          <DialogContentText sx={{ marginBottom: 2 }}>
            Please enter the details of the {elementType}.
          </DialogContentText>
          <BudgetForm
            closeHandler={closeHandler}
            elementType={elementType}
            submitHandler={submitHandler}
            fetchMethod={fetchMethod}
            origin={origin}
            initialValues={initialValues}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

const BudgetForm = ({
  closeHandler,
  elementType,
  submitHandler,
  fetchMethod,
  origin,
  initialValues,
}: BudgetElementDialogProps) => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>(
    initialValues.categoryId
      ? categories[initialValues.categoryId]
      : categories[0]
  );
  const handleCategoriesOpen = () => setCategoriesOpen(true);
  const handleCategoriesClose = () => setCategoriesOpen(false);

  const selectCategory = (category: Category) => {
    setSelectedCategory(category);
    handleCategoriesClose();
  };

  const buttonText = fetchMethod === FetchMethods.post ? 'Add' : 'Update';

  const validationSchema =
    elementType === BudgetElements.income
      ? yup.object({
          name: yup.string().required('Name is required'),
          value: yup
            .number()
            .transform((_value, originalValue) => {
              if (typeof originalValue === 'string')
                if (originalValue.includes(' ') || originalValue.includes('+'))
                  return parseFinancialInput(originalValue);
              return +originalValue;
            })
            .min(0)
            .required('Income value is required'),
        })
      : yup.object({
          name: yup.string().required('Name is required'),
          plan: yup
            .number()
            .transform((_value, originalValue) => {
              if (typeof originalValue === 'string')
                if (originalValue.includes(' ') || originalValue.includes('+'))
                  return parseFinancialInput(originalValue);
              return +originalValue;
            })
            .min(0)
            .required('Planned value is required'),
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
      const name = values.name;
      const value = parseFinancialInput(values.value);
      const plan = parseFinancialInput(values.plan);
      const actual = parseFinancialInput(values.actual);
      const categoryId = selectedCategory.id;

      const submitBody = JSON.stringify({
        name: name,
        value: value,
        plan: plan,
        actual: actual,
        categoryId: categoryId,
      });

      submitHandler(submitBody, fetchMethod, initialValues._id);
      closeHandler();
    },
  });

  return (
    <>
      {elementType === BudgetElements.expense ? (
        <div className={styles.dialog_select_category}>
          <div className={styles.dialog_selected_category}>
            <div
              className={styles.icon_container}
              style={{ backgroundColor: selectedCategory.color }}
            >
              {<selectedCategory.icon />}
            </div>
            {selectedCategory.name}
          </div>
          <div className={styles.dialog_select_category_button}>
            <Button onClick={handleCategoriesOpen}>Change Category</Button>
          </div>
        </div>
      ) : (
        <></>
      )}
      <Box
        sx={{ display: 'flex', flexDirection: 'column' }}
        component='form'
        onSubmit={formik.handleSubmit}
      >
        <TextField
          sx={{ flexGrow: 1, marginTop: 2 }}
          autoFocus={fetchMethod === FetchMethods.post ? true : false}
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
        {elementType === BudgetElements.income ? (
          <TextField
            sx={{ flexGrow: 1, marginTop: 2 }}
            autoFocus={fetchMethod === FetchMethods.put ? true : false}
            autoComplete='off'
            variant='outlined'
            id='value'
            name='value'
            label='Value'
            onFocus={(event) => {
              event.target.select();
            }}
            defaultValue={
              initialValues ? addThousandSeparators(initialValues.value) : ''
            }
            InputProps={{
              endAdornment: <InputAdornment position='end'>Ft</InputAdornment>,
            }}
            onChange={formik.handleChange}
            error={formik.touched.value && Boolean(formik.errors.value)}
            helperText={formik.touched.value && formik.errors.value}
          ></TextField>
        ) : (
          <Box
            sx={{
              display: 'flex',
              marginTop: 2,
              justifyContent: 'space-between',
            }}
          >
            <TextField
              sx={{ width: '48%' }}
              autoComplete='off'
              id='plan'
              name='plan'
              label='Planned'
              onFocus={(event) => {
                event.target.select();
              }}
              defaultValue={
                initialValues ? addThousandSeparators(initialValues.plan) : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>Ft</InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.plan && Boolean(formik.errors.plan)}
              helperText={formik.touched.plan && formik.errors.plan}
            ></TextField>
            <TextField
              sx={{ width: '48%' }}
              autoFocus={fetchMethod === FetchMethods.put ?? true}
              autoComplete='off'
              id='actual'
              name='actual'
              label='Actual'
              onFocus={(event) => {
                event.target.select();
              }}
              defaultValue={
                initialValues ? addThousandSeparators(initialValues.actual) : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>Ft</InputAdornment>
                ),
              }}
              onChange={formik.handleChange}
              error={formik.touched.actual && Boolean(formik.errors.actual)}
              helperText={formik.touched.actual && formik.errors.actual}
            ></TextField>
          </Box>
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

      <Dialog open={categoriesOpen} onClose={handleCategoriesClose}>
        <DialogTitle>Select a category</DialogTitle>
        <DialogContent>
          <div>
            <List>
              {categories.map((category) => (
                <ListItem
                  key={category.id}
                  onClick={() => selectCategory(category)}
                  disablePadding
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <div
                        className={styles.icon_container}
                        style={{ backgroundColor: category.color }}
                      >
                        {<category.icon />}
                      </div>
                    </ListItemIcon>
                    <ListItemText primary={category.name} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCategoriesClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BudgetElementDialog;
