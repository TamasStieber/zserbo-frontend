import * as React from 'react';
import { menuItems } from './MenuItems';
import { useRouter } from 'next/router';
import { MenuItem } from '../../types/types';
import styles from '../../styles/Home.module.css';
import PetsIcon from '@mui/icons-material/Pets';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { DialogProps } from '@mui/material';
import * as _ from 'lodash';
import Help from '../Help';
import Sidebar from './Sidebar';

export default function Navbar() {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const pathname = '/' + router.pathname.split('/')[1];

  const handleSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  const handleHelpOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    router.push('/login');
  };

  return (
    <>
      <div className={styles.navbar}>
        <div className={styles.title} onClick={() => router.push('/')}>
          <PetsIcon />
          <h1>Zserbó</h1>
        </div>
        {/* <hr /> */}
        <div className={styles.navbar_elements}>
          {menuItems.map((menuItem: MenuItem) => {
            return (
              <div
                className={
                  menuItem.url === pathname
                    ? styles.navbar_link_active
                    : styles.navbar_link
                }
                key={menuItem.name}
                // href={menuItem.url}
                onClick={() => router.push(menuItem.url)}
              >
                {/* {menuItem.icon} */}
                {_.toUpper(menuItem.displayText)}
              </div>
            );
          })}
        </div>
        <div className={styles.navbar_end}>
          <div
            title='Menu'
            className={`${styles.navbar_end_item} ${styles.navbar_menu_button}`}
          >
            <MenuIcon onClick={handleSidebarOpen} />
          </div>
          <div
            title='Help'
            className={
              pathname === '/help'
                ? styles.navbar_end_item_active
                : styles.navbar_end_item
            }
          >
            {/* <HelpOutlineOutlinedIcon onClick={handleHelpOpen('paper')} /> */}
            <HelpOutlineOutlinedIcon onClick={() => router.push('/help')} />
          </div>
          <div title='Logout' className={styles.navbar_end_item}>
            <LogoutOutlinedIcon onClick={handleLogout} />
          </div>
        </div>
      </div>
      {/* <Help open={open} closeHandler={handleClose} scroll={scroll} /> */}
      <Sidebar
        open={sidebarOpen}
        closeHandler={handleSidebarClose}
        helpOpenHandler={handleHelpOpen}
        logoutHandler={handleLogout}
      />
    </>
  );
}
