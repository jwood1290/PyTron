import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';


export default function HistoryChart(props) {

  const chartToken = props.token_id || 'TRX15';
  const data = props.data[chartToken];
  const tokenDisplay = (chartToken === 'TRX15') ? 'TRX':chartToken;

  return (
      <TableContainer className={props.classes.table}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {(props.winwidth >= 950) ? (<TableCell>Month</TableCell>):(<TableCell>Date</TableCell>)}
              {(props.winwidth >= 950) ? (<TableCell align="right">Date</TableCell>):null}
              <TableCell align="right">{tokenDisplay} Balance</TableCell>
              {(props.winwidth >= 800) ? (<TableCell align="right">{tokenDisplay} Gain</TableCell>):null}
              {(props.winwidth >= 950) ? (<TableCell align="right">% {tokenDisplay} Gain</TableCell>):null}
              {(props.winwidth >= 500) ? (<TableCell align="right">{tokenDisplay} Price</TableCell>):null}
              <TableCell align="right">{tokenDisplay} Value</TableCell>
              {(props.winwidth >= 650) ? (<TableCell align="right">% Value Gain</TableCell>):null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.month}>
                {(props.winwidth >= 950) ? (<TableCell>{row.month}</TableCell>):(<TableCell>{row.date}</TableCell>)}
                {(props.winwidth >= 950) ? (<TableCell align="right">{row.date}</TableCell>):null}
                <TableCell align="right">{row.amt}</TableCell>
                {(props.winwidth >= 800) ? (<TableCell align="right">{row.gain}</TableCell>):null}
                {(props.winwidth >= 950) ? (<TableCell align="right">{row.p_gain}</TableCell>):null}
                {(props.winwidth >= 500) ? (<TableCell align="right">{row.price}</TableCell>):null}
                <TableCell align="right">{row.value}</TableCell>
                {(props.winwidth >= 650) ? (<TableCell align="right">{row.v_gain}</TableCell>):null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}