import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DataType {
  name: string;
  surname: string;
  id: string;
}

interface Props {
  data: DataType[];
  title: string;
  onActionPressed: (id: string) => Promise<void>;
}

export function UserDataTableComponent(props: Props) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          width: '80%',
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Typography variant={'h4'}>{props.title}</Typography>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant={'h6'} align={'center'}>
                    {t('name')}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant={'h6'} align={'center'}>
                    {t('action')}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {props.data.map((item) => {
                return (
                  <TableRow>
                    <TableCell>
                      <Typography>{item.name + ' ' + item.surname}</Typography>
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
                      <Button onClick={() => props.onActionPressed(item.id)}>{t('delete')}</Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}
