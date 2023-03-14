import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { BudgetElements, Defaults, FetchMethods } from "../types/types";
import PageContainer from "../components/layout/PageContainer";
import styles from "../styles/Home.module.css";
import IncomesTable from "../components/IncomesTable";
import ExpensesTable from "../components/ExpensesTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { showSuccessToast } from "@/utils/utils";
import { Backdrop, CircularProgress, Skeleton } from "@mui/material";

const Defaults: NextPage = () => {
  const router = useRouter();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaults, setDefaults] = useState<Defaults | null>(null);
  const [defaultsListUpdated, setDefaultsListUpdated] =
    useState<boolean>(false);

  const handleDelete = async (
    id: string,
    type: BudgetElements
  ): Promise<void> => {
    const fetchDelete = async (token: string): Promise<void> => {
      try {
        setLoading(true)
        await fetch(`${process.env.BACKEND_URL}/defaults/${type}/${id}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const found =
          type === BudgetElements.income
            ? defaults?.income.find((income) => income._id === id)
            : defaults?.budget.find((budget) => budget._id === id);
        if (found)
          {showSuccessToast({
            subject: found.name,
            fetchMethod: FetchMethods.delete,
          });
          setDefaultsListUpdated(!defaultsListUpdated);
          setLoading(false)
        }
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    };

    if (jwtToken) fetchDelete(jwtToken);
  };

  const fetchDefaults = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/defaults`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await fetchResult.json();

      if (data.error) {
        console.error(data.error);
      } else {
        setDefaults(data.defaults);
        setReady(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (
    submitBody: BodyInit,
    fetchMethod: FetchMethods,
    id?: string
  ): Promise<void> => {
    id = id ? id : "";

    const insertDefault = async (token: string): Promise<void> => {
      setLoading(true)
      try {
        const fetchResult = await fetch(
          `${process.env.BACKEND_URL}/defaults/${id}`,
          {
            method: fetchMethod,
            body: submitBody,
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = await fetchResult.json();

        if (result.error) {
          console.error(result.error);
          setLoading(false)
        } else {
          showSuccessToast({
            subject: result.default.name,
            fetchMethod: fetchMethod,
          });
          setDefaultsListUpdated(!defaultsListUpdated);
          setLoading(false)
        }
      } catch (error) {
        console.error(error);
        setLoading(false)
      }
    };

    if (jwtToken) insertDefault(jwtToken);
  };

  useEffect(() => {
    const storedJwtToken = localStorage.getItem("jwtToken");
    if (storedJwtToken !== null) setJwtToken(storedJwtToken);
  }, []);

  useEffect(() => {
    if (jwtToken === null) {
      return;
    }
    fetchDefaults(jwtToken);
  }, [jwtToken, defaultsListUpdated]);

  return (
    <PageContainer title="Defaults">
      {ready ? (
        <>
          <div className={styles.column_container}>
            <div className={styles.column}>
              <IncomesTable
                incomes={defaults?.income}
                submitHandler={handleSubmit}
                deleteHandler={handleDelete}
              />
            </div>
            <div className={styles.column}>
              <ExpensesTable
                expenses={defaults?.budget}
                submitHandler={handleSubmit}
                deleteHandler={handleDelete}
              />
            </div>
          </div>
          <ToastContainer />
          <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={loading}>
            <CircularProgress color="success" />
          </Backdrop>
        </>
      ) : (
        <>
          <Skeleton
            animation="wave"
            variant="rounded"
            height={500}
            sx={{ marginBottom: "10px", borderRadius: "10px" }}
          />
        </>
      )}
    </PageContainer>
  );
};

export default Defaults;
