import {
  ContributorToDelete,
  ContributorValues,
  FetchMethods,
  Spending,
  SpendingsTableProps,
  SpendingValues,
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
import { addThousandSeparators, showWarningToast } from '../utils/utils';
import SpendingDialog from './SpendingDialog';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SpendingsTable = ({
  savings,
  monthId,
  submitHandler,
  deleteHandler,
}: SpendingsTableProps) => {
  const [warningOpen, setWarningOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContributorToDelete | null>(
    null
  );

  const handleWarningClose = () => {
    setWarningOpen(false), setItemToDelete(null);
  };

  const defaultInitialValues = {
    _id: undefined,
    monthId: undefined,
    value: undefined,
  };

  const spendingsOfMonth: {
    name: string;
    id: string;
    spending: Spending;
  }[] = [];

  savings.forEach((saving) => {
    saving.spendings.forEach((spending) => {
      if (spending.monthId === monthId) {
        const spendingElement = {
          name: saving.name,
          id: saving._id,
          spending: spending,
        };

        spendingsOfMonth.push(spendingElement);
      }
    });
  });

  const [open, setOpen] = useState(false);
  const [fetchMethod, setFetchMethod] = useState<FetchMethods>(
    FetchMethods.post
  );
  const [initialValues, setInitialValues] =
    useState<ContributorValues>(defaultInitialValues);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const addElement = () => {
    if (savings.length > 0) {
      setFetchMethod(FetchMethods.post);
      setInitialValues(defaultInitialValues);
      handleOpen();
    } else {
      showWarningToast('There are no savings yet');
    }
  };

  const updateElement = (
    savingId: string,
    element: SpendingValues,
    event: React.MouseEvent
  ) => {
    const { nodeName } = event.target as HTMLTableCellElement;

    if (nodeName === 'TD') {
      setFetchMethod(FetchMethods.put);
      element.savingId = savingId;
      setInitialValues(element);
      handleOpen();
    }
  };

  const handleDeleteClick = (id: string, savingId: string, name: string) => {
    const warningDialogProps = { id: id, savingId: savingId, name: name };
    setItemToDelete(warningDialogProps);
    setWarningOpen(true);
  };

  return (
    <>
      <div className={styles.card}>
        <h3>Spendings from Savings</h3>
        {spendingsOfMonth.length > 0 ? (
          <div className={styles.table_container}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {spendingsOfMonth.map((element) => (
                  <tr
                    key={element.spending._id}
                    onClick={(event) =>
                      updateElement(element.id, element.spending, event)
                    }
                  >
                    <td>{element.name}</td>
                    <td>
                      {addThousandSeparators(element.spending.amount, 'Ft')}
                    </td>
                    <td>
                      <span className={styles.delete_button}>
                        <DeleteForeverIcon
                          onClick={() =>
                            handleDeleteClick(
                              element.spending._id,
                              element.id,
                              element.name
                            )
                          }
                        />
                      </span>
                    </td>
                  </tr>
                ))}
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
      <SpendingDialog
        savings={savings}
        open={open}
        closeHandler={handleClose}
        submitHandler={submitHandler}
        fetchMethod={fetchMethod}
        initialValues={initialValues}
        monthId={monthId}
      />
      <ConfirmationDialog
        open={warningOpen}
        closeHandler={handleWarningClose}
        deleteHandler={deleteHandler}
        itemToDelete={itemToDelete}
      />
      <ToastContainer />
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
  deleteHandler: SpendingsTableProps['deleteHandler'];
  itemToDelete: ContributorToDelete | null;
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
            Do you really want to delete the spending from {itemToDelete.name}?
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeHandler}>Cancel</Button>
          <Button
            variant='contained'
            color='warning'
            onClick={() => {
              deleteHandler(itemToDelete.savingId, itemToDelete.id);
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

export default SpendingsTable;
