import styles from '@/styles/Home.module.css';
import { Skeleton } from '@mui/material';

const TableSkeleton = ({ text }: { text: string }) => {
  return (
    <>
      <div className={styles.card}>
        <h3>{text}</h3>
        <div className={styles.table_container}>
          <table>
            <thead>
              <tr>
                <th>
                  <Skeleton animation='wave' variant='rounded' />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <Skeleton animation='wave' variant='rounded' />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton animation='wave' variant='rounded' />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton animation='wave' variant='rounded' />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton animation='wave' variant='rounded' />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton animation='wave' variant='rounded' />
                </td>
              </tr>
              <tr>
                <td>
                  <Skeleton animation='wave' variant='rounded' />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className={styles.card_footer}>
          {/* <Button variant='contained' onClick={addElement}>
                Add
              </Button> */}
        </div>
      </div>
    </>
  );
};

export default TableSkeleton;
