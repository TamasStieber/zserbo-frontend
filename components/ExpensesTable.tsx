import {
  Budget,
  BudgetElements,
  BudgetElementValues,
  BudgetToDelete,
  ExpenseTableProps,
  FetchMethods,
} from '../types/types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from '../styles/Home.module.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { useState } from 'react';
import BudgetElementDialog from './BudgetElementDialog';
import { addThousandSeparators } from '../utils/utils';
import { categories } from './Categories';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';

const ExpensesTable = ({
  expenses,
  submitHandler,
  deleteHandler,
}: ExpenseTableProps) => {
  const defaultInitialValues = {
    name: undefined,
    value: undefined,
    plan: undefined,
    actual: 0,
    categoryId: undefined,
  };

  const [open, setOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [fetchMethod, setFetchMethod] = useState<FetchMethods>(
    FetchMethods.post
  );
  const [initialValues, setInitialValues] =
    useState<BudgetElementValues>(defaultInitialValues);
  const [itemToDelete, setItemToDelete] = useState<BudgetToDelete | null>(null);

  const elementType = BudgetElements.expense;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleWarningClose = () => {
    setWarningOpen(false), setItemToDelete(null);
  };

  const addElement = () => {
    setFetchMethod(FetchMethods.post);
    setInitialValues(defaultInitialValues);
    handleOpen();
  };

  const updateElement = (element: Budget, event: React.MouseEvent) => {
    const { nodeName } = event.target as HTMLTableCellElement;

    if (nodeName === 'TD') {
      setFetchMethod(FetchMethods.put);
      setInitialValues(element);
      handleOpen();
    }
  };

  const handleDeleteClick = (
    id: string,
    name: string,
    type: BudgetElements
  ) => {
    const warningDialogProps = { id: id, name: name, type: type };
    setItemToDelete(warningDialogProps);
    setWarningOpen(true);
  };

  return (
    <>
      <div className={styles.card}>
        <h3>Expenses</h3>
        {expenses && expenses.length > 0 ? (
          <div className={styles.table_container}>
            <table className={styles.expenses_table}>
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Planned</th>
                  <th>Actual</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => {
                  const Icon = categories[expense.categoryId].icon;
                  return (
                    <tr
                      key={expense.name}
                      onClick={(event) => updateElement(expense, event)}
                    >
                      <td>
                        <div
                          className={styles.icon_container_small}
                          style={{
                            backgroundColor:
                              categories[expense.categoryId].color,
                          }}
                          title={categories[expense.categoryId].name}
                        >
                          <Icon />
                        </div>
                      </td>
                      <td>{expense.name}</td>
                      <td>{addThousandSeparators(expense.plan, 'Ft')}</td>
                      <td>{addThousandSeparators(expense.actual, 'Ft')}</td>
                      <td>
                        <span className={styles.delete_button}>
                          <DeleteForeverIcon
                            onClick={() =>
                              handleDeleteClick(
                                expense._id,
                                expense.name,
                                BudgetElements.expense
                              )
                            }
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className={styles.table_no_items}>There are no items.</div>
        )}
        <div className={styles.card_footer}>
          <Button variant='contained' onClick={addElement}>
            Add
          </Button>
        </div>
      </div>
      <BudgetElementDialog
        open={open}
        closeHandler={handleClose}
        elementType={elementType}
        submitHandler={submitHandler}
        fetchMethod={fetchMethod}
        origin={'defaults'}
        initialValues={initialValues}
      />
      <ConfirmationDialog
        open={warningOpen}
        closeHandler={handleWarningClose}
        deleteHandler={deleteHandler}
        itemToDelete={itemToDelete}
      />
    </>
  );
};

const ConfirmationDialog = ({
  open,
  closeHandler,
  deleteHandler,
  itemToDelete,
}: {
  open: boolean;
  closeHandler: () => void;
  deleteHandler: ExpenseTableProps['deleteHandler'];
  itemToDelete: BudgetToDelete | null;
}) => {
  if (!itemToDelete) {
    return null;
  } else {
    return (
      <Dialog open={open} onClose={closeHandler}>
        <DialogTitle sx={{ color: '#ed6c02', borderTop: '5px solid #ed6c02' }}>
          Warning!
        </DialogTitle>
        <DialogContent>
          <div className={styles.confirmation_dialog}>
            <div
              className={styles.icon_container}
              style={{ color: '#ed6c02', marginRight: '20px' }}
            >
              <WarningOutlinedIcon sx={{ fontSize: '3rem' }} />
            </div>
            Do you really want to delete {itemToDelete.name}?
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler}>Cancel</Button>
          <Button
            variant='contained'
            color='warning'
            onClick={() => {
              deleteHandler(itemToDelete.id, itemToDelete.type);
              closeHandler();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ExpensesTable;
