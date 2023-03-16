import { addThousandSeparators } from '@/utils/utils';
import React from 'react';
import styles from '../styles/Home.module.css';

const DashboardAverage = ({
  average,
  primary,
  secondary,
  icon,
}: {
  average: number;
  primary: string;
  secondary: string;
  icon: JSX.Element;
}) => {
  return (
    <div className={styles.dashboard_average}>
      <div className={styles.dashboard_average_icon_container}>
        <div className={styles.dashboard_average_icon}>{icon}</div>
      </div>
      <div className={styles.dashboard_average_body}>
        <div className={styles.dashboard_average_primary}>
          {addThousandSeparators(average, 'Ft')}
        </div>
        <div className={styles.dashboard_average_secondary}>
          <h3>{primary}</h3>
          <p>{secondary}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardAverage;
