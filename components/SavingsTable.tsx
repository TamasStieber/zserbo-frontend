import {
  Contributor,
  ContributorToDelete,
  ContributorValues,
  FetchMethods,
  SavingsTableProps,
} from '../types/types';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from '../styles/Home.module.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
} from '@mui/material';
import { useState } from 'react';
import {
  addThousandSeparators,
  formatDate,
  showWarningToast,
} from '../utils/utils';
import ContributionDialog from './ContributionDialog';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SavingsTable = ({
  savings,
  monthId,
  submitHandler,
  deleteHandler,
}: SavingsTableProps) => {
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
    plan: undefined,
    actual: 0,
  };

  const savingsOfMonth: {
    name: string;
    id: string;
    contributor: Contributor;
  }[] = [];

  savings.forEach((saving) => {
    saving.contributors.forEach((contributor) => {
      if (contributor.monthId === monthId) {
        const savingElement = {
          name: saving.name,
          id: saving._id,
          contributor: contributor,
        };

        savingsOfMonth.push(savingElement);
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
    element: ContributorValues,
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
        <h3>Savings</h3>
        {savingsOfMonth.length > 0 ? (
          <div className={styles.table_container}>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Planned</th>
                  <th>Actual</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {savingsOfMonth.map((element) => (
                  <Tooltip
                    title={
                      element.contributor.date
                        ? `Last modified: ${formatDate(
                            element.contributor.date
                          )}`
                        : ''
                    }
                    arrow
                    enterDelay={500}
                    key={element.contributor._id}
                  >
                    <tr
                      key={element.contributor._id}
                      onClick={(event) =>
                        updateElement(element.id, element.contributor, event)
                      }
                    >
                      <td>{element.name}</td>
                      <td>
                        {addThousandSeparators(element.contributor.plan, 'Ft')}
                      </td>
                      <td>
                        {addThousandSeparators(
                          element.contributor.actual,
                          'Ft'
                        )}
                      </td>
                      <td>
                        <span className={styles.delete_button}>
                          <DeleteForeverIcon
                            onClick={() =>
                              handleDeleteClick(
                                element.contributor._id,
                                element.id,
                                element.name
                              )
                            }
                          />
                        </span>
                      </td>
                    </tr>
                  </Tooltip>
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
      <ContributionDialog
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
  deleteHandler: SavingsTableProps['deleteHandler'];
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
            Do you really want to delete the contribution to {itemToDelete.name}
            ?
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

export default SavingsTable;
