import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableContainer from '@material-ui/core/TableContainer';
import { history } from './data/history.js';
import { coti_data, fund_data } from './data/other_token_data.js';


function shortNum(n,p) {
  const power = Math.pow(10,p);
  return Math.round(n*power)/power;
}

function parseData(props) {
  var dt, day, month, year, curr_trx;
  var curr_usd, total_trx, ex_rate, date_str;
  var output = [];
  var count = 0;
  var last_trx = 0;
  var last_usd = 0;
  var last_day = -1;
  const data = props.data.all_data || history;
  data.forEach(i => {
    dt = new Date(i.epoch*1000);
    day = dt.getDate();
    if (last_day < 0) {last_day = day};
    if (day === 15 && last_day !== 15) {
      curr_trx = 0;
      total_trx = 0;
      i.data.forEach(j => {
        if (j.address !== 'COTI' && j.address !== 'FUND') {
          curr_trx += j.trx;
        }
        total_trx += j.trx;
      })
      if (last_trx === 0) {last_trx = curr_trx};
      if (last_usd === 0) {last_usd = i.usd_total};
      ex_rate = shortNum(i.usd_total/total_trx,4);
      year = String(dt.getFullYear()).substring(2,4);
      month = String(dt.toLocaleString('default', {month:'short'}));
      date_str = month + " " + String(day) + " '" + year;
      curr_usd = shortNum(curr_trx*ex_rate,2);
      output.push({
        month: count,
        date: date_str,
        amt: shortNum(curr_trx,2),
        gain: shortNum(curr_trx - last_trx,2),
        price: '$' + ex_rate,
        value: '$' + curr_usd,
        p_gain: shortNum(100*(curr_trx - last_trx)/last_trx,1) + '%',
        v_gain: shortNum(100*(curr_usd - last_usd)/last_usd,1) + '%',
      });
      count += 1;
      last_trx = curr_trx;
      last_usd = curr_usd;
    }
    last_day = day;
  })
  return output;
}

export default function HistoryChart(props) {

  const chartToken = props.token_id || 'TRX';
  var data;
  if (chartToken === 'TRX') {
    data = parseData(props);
  } else if (chartToken === 'COTI') {
    data = coti_data;
  } else {
    data = fund_data;
  }

  return (
      <TableContainer className={props.classes.table}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {(props.winwidth >= 750) ? (<TableCell>Month</TableCell>):(<TableCell>Date</TableCell>)}
              {(props.winwidth >= 750) ? (<TableCell align="right">Date</TableCell>):null}
              <TableCell align="right">{chartToken}</TableCell>
              {(props.winwidth >= 650) ? (<TableCell align="right">{chartToken} Gain</TableCell>):null}
              {(props.winwidth >= 950) ? (<TableCell align="right">% {chartToken} Gain</TableCell>):null}
              <TableCell align="right">{chartToken} Price</TableCell>
              <TableCell align="right">{chartToken} Value</TableCell>
              {(props.winwidth >= 950) ? (<TableCell align="right">% Value Gain</TableCell>):null}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.month}>
                {(props.winwidth >= 750) ? (<TableCell>{row.month}</TableCell>):(<TableCell>{row.date}</TableCell>)}
                {(props.winwidth >= 750) ? (<TableCell align="right">{row.date}</TableCell>):null}
                <TableCell align="right">{row.amt}</TableCell>
                {(props.winwidth >= 650) ? (<TableCell align="right">{row.gain}</TableCell>):null}
                {(props.winwidth >= 950) ? (<TableCell align="right">{row.p_gain}</TableCell>):null}
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.value}</TableCell>
                {(props.winwidth >= 950) ? (<TableCell align="right">{row.v_gain}</TableCell>):null}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
  );
}