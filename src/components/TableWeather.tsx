import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Item from '../interface/Item';
import { useEffect, useState } from 'react';

interface MyProp {
  itemsIn: Item[];
}

export default function BasicTable(props: MyProp) {
  const [rows, setRows] = useState<Item[]>([]);

  useEffect(() => {
    setRows(props.itemsIn); 
  }, [props]);

  return (
    <TableContainer component={Paper}>
      <Table aria-label="weather table">
        {/* Cabeceras de la tabla */}
        <TableHead>
          <TableRow>
            <TableCell align="center">Hora de inicio</TableCell>
            <TableCell align="center">Hora de fin</TableCell>
            <TableCell align="center">Precipitación</TableCell>
            <TableCell align="center">Humedad</TableCell>
            <TableCell align="center">Nubosidad</TableCell>
          </TableRow>
        </TableHead>
        {/* Cuerpo de la tabla */}
        <TableBody>
          {rows.map((row, idx) => (
            <TableRow
              key={idx}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row" align="center">
                {row.dateStart}
              </TableCell>
              <TableCell align="center">{row.dateEnd}</TableCell>
              <TableCell align="center">{row.precipitation}</TableCell>
              <TableCell align="center">{row.humidity}</TableCell>
              <TableCell align="center">{row.clouds}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}