import { Drawer, Divider, DialogProps } from '@mui/material';
import { menuItems } from './MenuItems';
import { useRouter } from 'next/router';
import { MenuItem } from '../../types/types';
import styles from '../../styles/Home.module.css';
import PetsIcon from '@mui/icons-material/Pets';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import * as _ from 'lodash';

const Sidebar = ({
  open,
  closeHandler,
  helpOpenHandler,
  logoutHandler,
}: {
  open: boolean;
  closeHandler: () => void;
  helpOpenHandler: (scroll: DialogProps['scroll']) => void;
  logoutHandler: () => void;
}) => {
  const router = useRouter();

  const pathname = '/' + router.pathname.split('/')[1];
  return (
    <Drawer anchor='left' open={open} onClose={closeHandler}>
      <div style={{ width: '70vw' }} className={styles.sidebar}>
        <div className={styles.title} onClick={() => router.push('/')}>
          <PetsIcon />
          <h1>Zserbó</h1>
        </div>
        <hr />
        {menuItems.map((menuItem: MenuItem) => {
          return (
            <div
              className={
                menuItem.url === pathname
                  ? styles.sidebar_link_active
                  : styles.sidebar_link
              }
              key={menuItem.name}
              onClick={() => router.push(menuItem.url)}
            >
              {_.toUpper(menuItem.displayText)}
            </div>
          );
        })}
        <div className={styles.sidebar_end}>
          <div title='Help' className={styles.sidebar_end_item}>
            <HelpOutlineOutlinedIcon onClick={() => helpOpenHandler('paper')} />
          </div>
          <div title='Logout' className={styles.sidebar_end_item}>
            <LogoutOutlinedIcon onClick={logoutHandler} />
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default Sidebar;
