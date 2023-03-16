import { SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { ReactNode } from "react";

export type MenuItem = {
  name: string,
  displayText: string,
  url: string,
  icon: JSX.Element
}

export type Defaults = {
  _id: string,
  income: Income[],
  budget: Budget[],
}

export type Predecessor = {
  _id: string,
  monthId: string
}

export type Income = {
  _id: string,
  name: string,
  value: number,
  date?: Date,
}

export type Budget = {
  _id: string,
  name: string,
  plan: number,
  actual: number,
  categoryId: number
  date?: Date,
}

export type Month = {
  _id: string,
  name: string,
  url: string,
  default: boolean,
  closed: boolean,
  balance: number,
  opening: number,
  predecessor: Predecessor[],
  income: Income[],
  budget: Budget[],
  comment: string,
  sumAllSavings: number,
  date?: Date,
  closedAt?: Date,
}

export type Contributor = {
  _id: string,
  monthId: string,
  plan: number,
  actual: number
  date?: Date,
}

export type Spending = {
  _id: string,
  amount: number,
  monthId: string
  date?: Date,
}

export type Saving = {
  _id: string,
  name: string,
  planned: number,
  actual: number,
  goal: number,
  initial: number,
  comment: string,
  contributors: Contributor[],
  spendings: Spending[]
  date?: Date,
}

export type Savings = Saving[];

export type Months = Month[];

export type FoodEntry = {
  _id: string;
  name: string;
  details: {
    amount: number;
    unit: string;
  };
  createdAt: Date;
};

export type MonthValues = {
  _id?: string
  predecessor?: Predecessor[] | string;
  year?: number | string;
  month?: string;
  comment?: string;
  default?: boolean;
};

// export type NewMonthValues = {
//   predecessor: string,
//   year: number,
//   month: string;
//   comment: string;
//   default: boolean;
// };

export type NewMonthValues = MonthValues;

export type PageContainerProps = {
  title: string | JSX.Element;
  children?: ReactNode;
}

export type IncomeTableProps = {
  incomes: Income[] | undefined,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string,) => Promise<void>,
  deleteHandler: (id: string, type: BudgetElements) => Promise<void>,
}

export type ExpenseTableProps = {
  expenses: Budget[] | undefined,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string,) => Promise<void>,
  deleteHandler: (id: string, type: BudgetElements) => Promise<void>,
}

// export type ConfirmationDialogProps = {
//   open: boolean,
//   closeHandler: () => void,
//   deleteHandler: ExpenseTableProps['deleteHandler'] | SavingsTableProps['deleteHandler'],
//   itemToDelete: BudgetToDelete | ContributorToDelete | null,
// }

export type BudgetToDelete = {
  id: string,
  name: string,
  type: BudgetElements
}

export type ContributorToDelete = {
  id: string,
  savingId: string,
  name: string
}

export type SpendingToDelete = ContributorToDelete;

export type MonthToDelete = {
  id: string,
  name: string,
}

export type SavingToDelete = {
  id: string,
  name: string,
}

export type SavingsTableProps = {
  savings: Savings,
  monthId: string,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string,) => Promise<void>,
  deleteHandler: (savingId: string, id: string) => Promise<void>,
}

export type SpendingsTableProps = {
  savings: Savings,
  monthId: string,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string,) => Promise<void>,
  deleteHandler: (savingId: string, id: string) => Promise<void>,
}

export type NewMonthFormProps = {
  closeHandler: () => void,
  submitHandler: (submitBody: BodyInit, name: string, fetchMethod: FetchMethods, id?: string) => Promise<void>,
  initialValues: NewMonthValues,
  months: Months,
  fetchMethod: FetchMethods
}

export type BudgetElementDialogProps = {
  open?: boolean,
  closeHandler: () => void,
  elementType: BudgetElements,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string,) => Promise<void>,
  fetchMethod: FetchMethods,
  origin: string
  initialValues: BudgetElementValues,
}

export type BudgetElementValues = {
  name: string | undefined,
  value?: number,
  plan?: number,
  actual?: number,
  _id?: string,
  categoryId?: number
}

export type SavingDialogProps = {
  open?: boolean,
  closeHandler: () => void,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string) => Promise<void>,
  fetchMethod: FetchMethods,
  initialValues: SavingValues,
}

export type UpdateDialogProps = {
  open?: boolean,
  closeHandler: () => void,
  submitHandler: (submitBody: BodyInit) => Promise<void>,
  initialValues: UpdateValues,
}

export type ContributionDialogProps = {
  savings: Savings,
  open?: boolean,
  closeHandler: () => void,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string,) => Promise<void>,
  fetchMethod: FetchMethods,
  initialValues: ContributorValues,
  monthId: string
}

export type SpendingDialogProps = {
  savings: Savings,
  open?: boolean,
  closeHandler: () => void,
  submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string,) => Promise<void>,
  fetchMethod: FetchMethods,
  initialValues: SpendingValues,
  monthId: string
}

export type ContributorValues = {
  _id: string | undefined,
  monthId?: string
  plan?: number,
  actual?: number,
  savingId?: string
}

export type SpendingValues = {
  _id: string | undefined,
  monthId?: string
  amount?: number,
  savingId?: string
}

export type SavingValues = {
  name: string | undefined,
  goal?: number,
  initial?: number,
  comment?: string,
  _id?: string
}

export type UpdateValues = {
  balance: number,
  opening?: number,
  comment?: string
}

export type MonthDetailsProps = {
  url: string | string[],
  // months: Months,
  // savings: Savings,
  // submitHandler: (submitBody: BodyInit, fetchMethod: FetchMethods, id?: string, monthId?: string) => Promise<void>,
  // deleteHandler: (id: string, type: BudgetElements) => Promise<void>
}

export type Category = {
  id: number,
  name: string,
  color: string,
  chartColor: string,
  icon: OverridableComponent<SvgIconTypeMap <{}, "svg">> & { muiName: string; }
}

export type MonthSummaryProps = {
  currentMonth: Month;
  predecessor: Month | undefined;
  savings: Savings;
}

export enum BudgetElements {
  income = 'income',
  expense = 'expense'
}

export enum FetchMethods {
  get = 'get',
  post = 'post',
  put = 'put',
  delete = 'delete'
}

export const MonthNames = [
  {name: 'January'},
  {name: 'February'},
  {name: 'March'},
  {name: 'April'},
  {name: 'May'},
  {name: 'June'},
  {name: 'July'},
  {name: 'August'},
  {name: 'September'},
  {name : 'October'},
  {name: 'November'},
  {name: 'December'},
]
