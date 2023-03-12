import styles from '../styles/Home.module.css';
import { addThousandSeparators } from '../utils/utils';

export const MonthSummaryPrimaryElement = ({
  amount,
  text,
  icon,
}: {
  amount: number;
  text: string;
  icon: JSX.Element;
}) => {
  return (
    <div className={styles.month_summary_element}>
      <div className={styles.month_summary_icon}>{icon}</div>
      <div className={styles.month_summary_content}>
        <div className={styles.month_summary_primary_amount}>
          {addThousandSeparators(amount, 'Ft')}
        </div>
        <div className={styles.month_summary_primary_text}>{text}</div>
      </div>
    </div>
  );
};

export const MonthSummarySecondaryElement = ({
  amount,
  text,
}: {
  amount: number;
  text: string;
}) => {
  return (
    <div className={styles.month_summary_element}>
      <div className={styles.month_summary_content}>
        <div className={styles.month_summary_secondary_amount}>
          {addThousandSeparators(amount, 'Ft')}
        </div>
        <div className={styles.month_summary_secondary_text}>{text}</div>
      </div>
    </div>
  );
};
