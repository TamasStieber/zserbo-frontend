import styles from '@/styles/Home.module.css';
import { ReactNode } from 'react';

const MonthDetailsContainer = ({
  open,
  children,
}: {
  open: boolean;
  children: ReactNode;
}) => {
  const display = open ? 'block' : 'none';

  return (
    <div style={{ position: 'relative' }} className={styles.column_container}>
      <div
        style={{
          display: display,
          position: 'absolute',
          width: '100%',
          height: '100%',
          zIndex: 9999,
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
        }}
      ></div>
      {children}
    </div>
  );
};

export default MonthDetailsContainer;
