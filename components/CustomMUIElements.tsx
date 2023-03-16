import { Button, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const WhiteBackgroundTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'white',
  },
});

export const GradientButton = styled(Button)({
  backgroundImage: 'linear-gradient(100deg, #bb28cd, #735bcc)',
  '&:hover': {
    backgroundImage: 'linear-gradient(100deg, #cb38dd, #836bdc)',
  },
});

export const PurpleButton = styled(Button)({
  backgroundColor: '#bb28cd',
  '&:hover': {
    backgroundColor: '#cb38dd',
  },
});
