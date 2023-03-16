import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Month,
  Months,
  MonthValues,
  MonthToDelete,
  FetchMethods,
} from '../types/types';
import PageContainer from '../components/layout/PageContainer';
import Radio from '@mui/material/Radio';
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
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import NewMonthForm from '../components/NewMonthForm';
import WarningOutlinedIcon from '@mui/icons-material/WarningOutlined';
import {
  addThousandSeparators,
  formatDate,
  showErrorToast,
  showSuccessToast,
} from '../utils/utils';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NoMonthsFound } from '@/components/NoElementFound';

const Months: NextPage = () => {
  const router = useRouter();

  const initialValuesForEmptyModal: MonthValues = {
    predecessor: '',
    year: '',
    month: '',
    comment: '',
    default: true,
  };

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [months, setMonths] = useState<Months>([]);
  const [monthListUpdated, setMonthListUpdated] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MonthToDelete | null>(null);
  const [fetchMethod, setFetchMethod] = useState<FetchMethods>(
    FetchMethods.post
  );
  const [initialValues, setInitialValues] = useState<MonthValues>(
    initialValuesForEmptyModal
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleWarningClose = () => {
    setWarningOpen(false), setItemToDelete(null);
  };

  const addElement = () => {
    setFetchMethod(FetchMethods.post);
    setInitialValues(initialValuesForEmptyModal);
    handleOpen();
  };

  const updateElement = (element: Month, event: React.MouseEvent) => {
    const { nodeName } = event.target as HTMLTableCellElement;

    if (
      nodeName !== 'svg' &&
      nodeName !== 'path' &&
      nodeName !== 'A' &&
      nodeName !== 'INPUT'
    ) {
      setFetchMethod(FetchMethods.put);
      const initialValuesPrep = {
        _id: element._id,
        predecessor:
          element.predecessor.length > 0 ? element.predecessor[0].monthId : '',
        year: element.name.split(' ')[0],
        month: element.name.split(' ')[1],
        comment: element.comment,
        default: element.default,
      };
      setInitialValues(initialValuesPrep);

      handleOpen();
    }
  };

  const updateDefault = async (id: string): Promise<void> => {
    const fetchUpdate = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/update-default/${id}`,
          {
            method: 'post',
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
          const found = months.find((month) => month._id === data.id);
          if (found) {
            showSuccessToast({
              subject: found.name,
              customMessage: 'has been set to default',
            });
            setMonthListUpdated(!monthListUpdated);
          } else {
            showErrorToast();
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    if (jwtToken) fetchUpdate(jwtToken);
  };

  const handleDelete = async (id: string): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/${id}`,
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
            subject: data.monthToDelete.name,
            fetchMethod: FetchMethods.delete,
          });
          setMonthListUpdated(!monthListUpdated);
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
    const insertMonth = async (token: string): Promise<void> => {
      id = id ? id : '';
      setLoading(true);
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/months/${id}`,
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
            subject: data.month.name,
            fetchMethod: fetchMethod,
          });
          setMonthListUpdated(!monthListUpdated);
        }
      } catch (error) {
        console.error(error);
        setLoading(false);
        showErrorToast();
      }
    };

    if (jwtToken) insertMonth(jwtToken);
  };

  const fetchMonths = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/months`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      if (data.error) {
        console.error(data.error);
      } else {
        setMonths(data.allMonths);
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
    fetchMonths(jwtToken);
  }, [jwtToken, monthListUpdated]);

  return (
    <PageContainer title='Manage Months'>
      {ready ? (
        <>
          {months.length > 0 ? (
            <>
              {months.map((month: Month) => {
                let sumIncome = 0;
                let sumExpenses = 0;

                month.income.forEach((income) => {
                  sumIncome += income.value;
                });
                month.budget.forEach((expense) => {
                  sumExpenses += expense.actual;
                });
                return (
                  <Tooltip
                    title={
                      month.date
                        ? `Last modified: ${formatDate(month.date)}`
                        : ''
                    }
                    arrow
                    enterDelay={500}
                    key={month._id}
                  >
                    <div
                      key={month._id}
                      className={styles.row}
                      onClick={(event) => updateElement(month, event)}
                    >
                      <Radio
                        checked={month.default}
                        onClick={() => updateDefault(month._id)}
                      />
                      <div style={{ width: '5%', textAlign: 'center' }}>
                        {month.closed ? 'Closed' : 'Open'}
                      </div>
                      <div style={{ width: '22%', textAlign: 'center' }}>
                        <a href={`monthly-budget/${month.url}`}>{month.name}</a>
                      </div>
                      <div style={{ width: '22%' }}>
                        All Income: {addThousandSeparators(sumIncome, 'Ft')}
                      </div>
                      <div style={{ width: '22%' }}>
                        All Expenses: {addThousandSeparators(sumExpenses, 'Ft')}
                      </div>
                      <span className={styles.delete_button}>
                        <DeleteForeverIcon
                          onClick={() =>
                            handleDeleteClick(month._id, month.name)
                          }
                        />
                      </span>
                    </div>
                  </Tooltip>
                );
              })}{' '}
            </>
          ) : (
            <NoMonthsFound link={false} />
          )}
          <Button variant='contained' onClick={addElement}>
            Add
          </Button>
          <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Add new month</DialogTitle>
            <DialogContent dividers>
              <DialogContentText>
                Please enter the details of the month.
              </DialogContentText>
              <NewMonthForm
                closeHandler={handleClose}
                submitHandler={handleSubmit}
                initialValues={initialValues}
                months={months}
                fetchMethod={fetchMethod}
              />
            </DialogContent>
          </Dialog>
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
        <>
          <Skeleton
            animation='wave'
            variant='rounded'
            height={54}
            sx={{ marginBottom: '10px', borderRadius: '10px' }}
          />
          <Skeleton
            animation='wave'
            variant='rounded'
            height={54}
            sx={{ marginBottom: '10px', borderRadius: '10px' }}
          />
          <Skeleton
            animation='wave'
            variant='rounded'
            height={54}
            sx={{ marginBottom: '10px', borderRadius: '10px' }}
          />
        </>
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
  itemToDelete: MonthToDelete | null;
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

export default Months;
