import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';


function shortNum(n) {
  return Math.round(n*100)/100;
}

function parseData(props) {
  const dat = props.chartData;
  var t_trx = 0;
  dat.data.forEach(i => {
    t_trx += i.trx;
  })
  var ex_rate = dat.usd_total/t_trx;
  var output = [{
    id: 'total',
    addr: 'Total',
    trx: shortNum(t_trx),
    usd: shortNum(dat.usd_total),
  }];
  dat.data.sort((a, b) => (a.trx < b.trx) ? 1:-1)
  dat.data.forEach(i => {
    var a = i.address;
    var is_short = (props.winwidth < 720);
    if (!is_short) {
      is_short = (props.winwidth < 1280 && props.winwidth >= 960);
    }
    if (a.length > 10 && is_short) {
      a = a.substr(1,3) + '...' + a.substr(a.length-3);
    }
    output.push({
      id: i.nickname,
      addr: a,
      trx: shortNum(i.trx),
      usd: shortNum(i.trx*ex_rate),
    })
  });
  return output;
}

export default function Chart(props) {

  const data = parseData(props);

  return (
    <TableContainer className={props.classes.table}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell align="right">TRX</TableCell>
            <TableCell align="right">USD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.addr}</TableCell>
              <TableCell align="right">{row.trx}</TableCell>
              <TableCell align="right">{row.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}