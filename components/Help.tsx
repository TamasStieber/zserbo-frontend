import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  Typography,
} from '@mui/material';

const Help = ({
  open,
  closeHandler,
  scroll,
}: {
  open: boolean;
  closeHandler: () => void;
  scroll: DialogProps['scroll'];
}) => {
  return (
    <Dialog open={open} onClose={closeHandler} scroll={scroll}>
      <DialogTitle>Zserbó Help</DialogTitle>
      <DialogContent dividers={scroll === 'paper'}>
        <DialogContentText tabIndex={-1}>
          <Typography variant='h5' gutterBottom>
            1 General
          </Typography>
          <Typography variant='body1' sx={{ marginLeft: 4 }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            iste eveniet placeat velit? Dolores, ex illo consectetur dolor
            possimus eveniet asperiores a, totam, magnam veritatis aperiam
            quidem deserunt ducimus neque.
          </Typography>
          <Typography variant='h5' gutterBottom>
            2 Usage
          </Typography>
          <Typography variant='h6' sx={{ marginLeft: 2 }} gutterBottom>
            2.1 Months
          </Typography>
          <Typography variant='body1' sx={{ marginLeft: 4 }} gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            iste eveniet placeat velit? Dolores, ex illo consectetur dolor
            possimus eveniet asperiores a, totam, magnam veritatis aperiam
            quidem deserunt ducimus neque.
          </Typography>
          <Typography variant='h6' sx={{ marginLeft: 2 }} gutterBottom>
            2.2 Budget Elements
          </Typography>
          <Typography variant='body1' sx={{ marginLeft: 4 }} gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            iste eveniet placeat velit? Dolores, ex illo consectetur dolor
            possimus eveniet asperiores a, totam, magnam veritatis aperiam
            quidem deserunt ducimus neque.
          </Typography>
          <Typography variant='h6' sx={{ marginLeft: 2 }} gutterBottom>
            2.3 Savings
          </Typography>
          <Typography variant='body1' sx={{ marginLeft: 4 }} gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            iste eveniet placeat velit? Dolores, ex illo consectetur dolor
            possimus eveniet asperiores a, totam, magnam veritatis aperiam
            quidem deserunt ducimus neque.
          </Typography>
          <Typography variant='h5' gutterBottom>
            3 Defaults
          </Typography>
          <Typography variant='h6' sx={{ marginLeft: 2 }} gutterBottom>
            3.1 Adding Defaults
          </Typography>
          <Typography variant='body1' sx={{ marginLeft: 4 }} gutterBottom>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus
            iste eveniet placeat velit? Dolores, ex illo consectetur dolor
            possimus eveniet asperiores a, totam, magnam veritatis aperiam
            quidem deserunt ducimus neque.
          </Typography>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Help;
