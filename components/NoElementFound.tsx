import styles from '../styles/Home.module.css';
import Image from 'next/image';

export function NoMonthsFound({ link }: { link: boolean }) {
  return (
    <div className={styles.month_summary_not_found}>
      <Image
        src={'/img/not_found.png'}
        alt={'Not found'}
        width='300'
        height='300'
      />
      <h3>No months found</h3>
      <p>
        Get started by{' '}
        {link ? (
          <a href={`months/`}>creating a new month</a>
        ) : (
          <>creating a new month</>
        )}
      </p>
    </div>
  );
}

export function NoSavingsFound() {
  return (
    <div className={styles.month_summary_not_found}>
      <Image
        src={'/img/not_found.png'}
        alt={'Not found'}
        width='300'
        height='300'
      />
      <h3>No savings found</h3>
      <p>Get started by creating a new saving</p>
    </div>
  );
}
