import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Savings,
  Saving,
  SavingValues,
  FetchMethods,
  SavingToDelete,
} from '../types/types';
import PageContainer from '../components/layout/PageContainer';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import styles from '../styles/Home.module.css';
import {
  Backdrop,
  Button,
  CircularProgress,
  Skeleton,
  Tooltip,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import SavingDialog from '../components/SavingDialog';
import {
  addThousandSeparators,
  formatDate,
  showErrorToast,
  showSuccessToast,
} from '../utils/utils';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NoSavingsFound } from '@/components/NoElementFound';
import { GradientButton } from '@/components/CustomMUIElements';
import SavingsSkeleton from '@/components/skeletons/SavingsSkeleton';

const Savings: NextPage = () => {
  const router = useRouter();

  const defaultInitialValues = {
    name: undefined,
    goal: undefined,
    initial: 0,
    comment: undefined,
  };

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [savings, setSavings] = useState<Savings>([]);
  const [savingsListUpdated, setSavingsListUpdated] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [fetchMethod, setFetchMethod] = useState<FetchMethods>(
    FetchMethods.post
  );
  const [initialValues, setInitialValues] =
    useState<SavingValues>(defaultInitialValues);
  const [warningOpen, setWarningOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<SavingToDelete | null>(null);

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

  const updateElement = (element: Saving, event: React.MouseEvent) => {
    const { nodeName } = event.target as HTMLTableCellElement;

    if (nodeName !== 'svg' && nodeName !== 'path') {
      setFetchMethod(FetchMethods.put);
      setInitialValues(element);
      handleOpen();
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/savings/${id}`,
          {
            method: 'delete',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await fetchResult.json();

        if (data.error) {
          console.error(data.error);
          setLoading(false);
          showErrorToast();
        } else {
          setLoading(false);
          showSuccessToast({
            subject: data.savingToDelete.name,
            fetchMethod: FetchMethods.delete,
          });
          setSavingsListUpdated(!savingsListUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
  };

  const handleSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    id?: string
  ): Promise<void> => {
    id = id ? id : '';

    const insertSaving = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/savings/${id}`,
          {
            method: fetchMethod,
            body: submitBody,
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const data = await fetchResult.json();

        if (data.error) {
          console.error(data.error);
          setLoading(false);
          showErrorToast();
        } else {
          setLoading(false);
          showSuccessToast({
            subject: data.saving.name,
            fetchMethod: fetchMethod,
          });
          setSavingsListUpdated(!savingsListUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) insertSaving(jwtToken);
  };

  const fetchSavings = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/savings`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      if (data.error) {
        console.error(data.error);
      } else {
        setSavings(data.allSavings);
        setReady(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    const warningDialogProps = { id: id, name: name };
    setItemToDelete(warningDialogProps);
    setWarningOpen(true);
  };

  useEffect(() => {
    const storedJwtToken = localStorage.getItem('jwtToken');
    if (storedJwtToken !== null) setJwtToken(storedJwtToken);
  }, []);

  useEffect(() => {
    if (jwtToken === null) {
      return;
    }
    fetchSavings(jwtToken);
  }, [jwtToken, savingsListUpdated]);

  return (
    <PageContainer title='Savings'>
      {ready ? (
        <>
          {savings.length > 0 ? (
            <div className={styles.savings_container}>
              {savings.map((saving: Saving) => {
                let planned = 0;
                let actual = saving.initial;
                let contributed = 0;
                let spent = 0;

                saving.contributors.forEach((contributor) => {
                  planned += contributor.plan;
                  actual += contributor.actual;
                  contributed += contributor.actual;
                });
                saving.spendings.forEach((spending) => {
                  actual -= spending.amount;
                  spent += spending.amount;
                });
                return (
                  <Tooltip
                    title={
                      saving.date
                        ? `Last modified: ${formatDate(saving.date)}`
                        : ''
                    }
                    arrow
                    enterDelay={500}
                    key={saving._id}
                  >
                    <div
                      key={saving._id}
                      className={styles.saving}
                      onClick={(event) => updateElement(saving, event)}
                    >
                      <div className={styles.saving_title}>
                        <h2>{saving.name}</h2>
                        <span className={styles.delete_button}>
                          <DeleteForeverIcon
                            onClick={() =>
                              handleDeleteClick(saving._id, saving.name)
                            }
                          />
                        </span>
                      </div>
                      <div className={styles.saving_primary}>
                        <span className={styles.saving_actual}>
                          {addThousandSeparators(actual, 'Ft')}
                        </span>
                        {' / '}
                        <span className={styles.saving_goal}>
                          {addThousandSeparators(saving.goal, 'Ft')}
                        </span>
                      </div>
                      <div className={styles.progress_container}>
                        <div
                          className={styles.progress_bar}
                          style={{
                            width:
                              actual / saving.goal > 0
                                ? `${(actual / saving.goal) * 100}%`
                                : 0,
                          }}
                        >
                          {Math.floor((actual / saving.goal) * 100)}%
                        </div>
                      </div>
                      <div className={styles.saving_secondary}>
                        <div className={styles.saving_secondary_element}>
                          <p>Planned</p>
                          {addThousandSeparators(planned, 'Ft')}
                        </div>
                        <div className={styles.saving_secondary_element}>
                          <p>Contributed</p>
                          {addThousandSeparators(contributed, 'Ft')}
                        </div>
                        <div className={styles.saving_secondary_element}>
                          <p>Spent</p>
                          {addThousandSeparators(spent, 'Ft')}
                        </div>
                        <div className={styles.saving_secondary_element}>
                          <p>Initial</p>
                          {addThousandSeparators(saving.initial, 'Ft')}
                        </div>
                      </div>
                      <div className={styles.saving_comment}>
                        {saving.comment}
                      </div>
                    </div>
                  </Tooltip>
                );
              })}
            </div>
          ) : (
            <NoSavingsFound />
          )}
          <Button variant='contained' onClick={addElement}>
            Add
          </Button>
          {/* <GradientButton variant='contained' onClick={addElement}>
            Add
          </GradientButton> */}
          <SavingDialog
            open={open}
            closeHandler={handleClose}
            submitHandler={handleSubmit}
            fetchMethod={fetchMethod}
            initialValues={initialValues}
          />
          <ConfirmationDialog
            open={warningOpen}
            closeHandler={handleWarningClose}
            deleteHandler={handleDelete}
            itemToDelete={itemToDelete}
          />
          <ToastContainer />
          <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={loading}>
            <CircularProgress color='success' />
          </Backdrop>
        </>
      ) : (
        <SavingsSkeleton />
      )}
    </PageContainer>
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
  deleteHandler: (id: string) => Promise<void>;
  itemToDelete: SavingToDelete | null;
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
              deleteHandler(itemToDelete.id);
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

export default Savings;
