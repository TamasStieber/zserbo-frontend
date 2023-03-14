import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Months } from "../types/types";
import PageContainer from "../components/layout/PageContainer";
import styles from "../styles/Home.module.css";
import { Button, ButtonGroup, IconButton, Skeleton } from "@mui/material";
import TextField from "@mui/material/TextField";
import { addThousandSeparators } from "../utils/utils";
import { categories } from "@/components/Categories";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { NoMonthsFound } from "@/components/NoElementFound";

const Averages: NextPage = () => {
  const router = useRouter();

  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [ready, setReady] = useState<boolean>(false);
  const [months, setMonths] = useState<Months | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [orderBy, setOrderBy] = useState<"name" | "value">("name");
  const [orderDirection, setOrderDirection] = useState<"up" | "down">("up");

  const orderByNameButtonVariant =
    orderBy === "name" ? "contained" : "outlined";
  const orderByValueButtonVariant =
    orderBy === "value" ? "contained" : "outlined";
  const upButtonVariant = orderDirection === "up" ? "contained" : "outlined";
  const downButtonVariant =
    orderDirection === "down" ? "contained" : "outlined";

  const fetchMonths = async (token: string): Promise<void> => {
    try {
      const fetchResult = await fetch(`${process.env.BACKEND_URL}/months`, {
        method: "GET",
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

  const averages: {
    name: string;
    categoryId: number;
    amount: number;
    count: number;
  }[] = [];

  if (months) {
    months.forEach((month) => {
      month.budget.forEach((budget) => {
        if (budget.actual > 0) {
          const found = averages.find(
            (average) => average.name === budget.name
          );
          if (found) {
            found.amount += budget.actual;
            found.count++;
          } else {
            const newAverage = {
              name: budget.name,
              categoryId: budget.categoryId,
              amount: budget.actual,
              count: 1,
            };
            averages.push(newAverage);
          }
        }
      });
    });
  }

  const filteredAverages: {
    name: string;
    categoryId: number;
    amount: number;
    count: number;
  }[] = averages.filter((element) =>
    element.name.toLowerCase().includes(filter)
  );

  if (orderBy === "name" && orderDirection === "up") {
    filteredAverages.sort((a, b) => a.name.localeCompare(b.name, "hu"));
  }
  if (orderBy === "name" && orderDirection === "down") {
    filteredAverages.sort((a, b) => b.name.localeCompare(a.name, "hu"));
  }
  if (orderBy === "value" && orderDirection === "up") {
    filteredAverages.sort((a, b) => a.amount - b.amount);
  }
  if (orderBy === "value" && orderDirection === "down") {
    filteredAverages.sort((a, b) => b.amount - a.amount);
  }

  const filterAverages = (event: React.ChangeEvent) => {
    setFilter((event.target as HTMLInputElement).value);
  };

  useEffect(() => {
    const storedJwtToken = localStorage.getItem("jwtToken");
    if (storedJwtToken !== null) setJwtToken(storedJwtToken);
    if (jwtToken) fetchMonths(jwtToken);
  }, [jwtToken]);

  useEffect(() => {});

  return (
    <PageContainer title="Averages">
      {ready ? (
        <>
          {months && months.length > 0 ? (
            <div className={styles.averages_container}>
              <div className={styles.averages_head}>
                <div className={styles.averages_title}>
                  Averages of actual expenses across all months
                </div>
                <div className={styles.averages_sort}>
                  Order by:
                  <ButtonGroup sx={{ marginLeft: 2 }}>
                    <Button
                      variant={orderByNameButtonVariant}
                      onClick={() => setOrderBy("name")}
                    >
                      Name
                    </Button>
                    <Button
                      variant={orderByValueButtonVariant}
                      onClick={() => setOrderBy("value")}
                    >
                      Value
                    </Button>
                  </ButtonGroup>
                  <ButtonGroup sx={{ marginLeft: 2 }}>
                    <Button
                      variant={upButtonVariant}
                      onClick={() => setOrderDirection("up")}
                    >
                      <KeyboardArrowUpIcon />
                    </Button>
                    <Button
                      variant={downButtonVariant}
                      onClick={() => setOrderDirection("down")}
                    >
                      <KeyboardArrowDownIcon />
                    </Button>
                  </ButtonGroup>
                </div>
                <div className={styles.averages_search}>
                  <TextField
                    label="Search"
                    size="small"
                    onChange={(event) => filterAverages(event)}
                  />
                </div>
              </div>
              <div className={styles.averages_body}>
                {filteredAverages.length > 0 ? (
                  <>
                    {filteredAverages.map((average) => {
                      const Icon = categories[average.categoryId].icon;
                      return (
                        <div
                          key={average.name}
                          className={styles.average}
                          style={{
                            backgroundColor: `rgba(${
                              categories[average.categoryId].chartColor
                            }, 0.1)`,
                          }}
                        >
                          <div
                            className={styles.average_icon}
                            style={{
                              backgroundColor:
                                categories[average.categoryId].color,
                            }}
                          >
                            <Icon />
                          </div>
                          <div className={styles.average_body}>
                            <div className={styles.average_primary}>
                              {addThousandSeparators(
                                Math.round(average.amount / average.count),
                                "Ft"
                              )}
                            </div>
                            <div className={styles.average_secondary}>
                              {average.name}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <>No expenses found</>
                )}
              </div>
            </div>
          ) : (
            <NoMonthsFound link={true} />
          )}
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
export default Averages;
