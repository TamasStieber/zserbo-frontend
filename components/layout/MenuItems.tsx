import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import WalletIcon from '@mui/icons-material/Wallet';
import SavingsIcon from '@mui/icons-material/Savings';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const menuItems = [
  // {
  //   name: 'dashboard',
  //   displayText: 'Dashboard',
  //   url: '/',
  //   icon: <LeaderboardIcon />,
  // },
  {
    name: 'monthlyBudget',
    displayText: 'Monthly Budget',
    url: '/monthly-budget',
    icon: <WalletIcon />,
  },
  {
    name: 'savings',
    displayText: 'Savings',
    url: '/savings',
    icon: <SavingsIcon />,
  },
  {
    name: 'months',
    displayText: 'Months',
    url: '/months',
    icon: <CalendarMonthIcon />,
  },
  {
    name: 'defaults',
    displayText: 'Defaults',
    url: '/defaults',
    icon: <ContentCopyIcon />,
  },
  {
    name: 'averages',
    displayText: 'Averages',
    url: '/averages',
    icon: <ContentCopyIcon />,
  },
];
