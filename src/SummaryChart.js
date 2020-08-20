import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// Generate Order Data
function createData(dat) {
  var tmp = [];
  var t_change = 0;
  var count = 0;
  var d = dat.data;
  for (var i=0; i<d.length; i++) {
    var a = d[i].address;
    if (a.length > 10) {
      a = a.substr(1,3) + '...' + a.substr(a.length-3);
    }
    t_change += d[i].change;
    tmp.push({
      id: count,
      addr: a,
      trx: d[i].trx,
      nick: d[i].nickname,
      diff: d[i].change,
    });
    count++;
  }

  var output = [{
    id: count,
    addr: 'Total',
    trx: dat.trx_total,
    nick: '',
    diff: Math.round(t_change*100)/100,
  }];
  tmp.forEach(i => {output.push(i)});
  return output;
}

// const rows = [
//   createData(
//     0,
//     '16 Mar, 2019',
//     'Elvis Presley',
//     'Tupelo, MS',
//     'VISA ⠀•••• 3719',
//     312.44,
//   ),
//   createData(
//     1,
//     '16 Mar, 2019',
//     'Paul McCartney',
//     'London, UK',
//     'VISA ⠀•••• 2574',
//     866.99,
//   ),
//   createData(
//     2,
//     '16 Mar, 2019',
//     'Tom Scholz',
//     'Boston, MA',
//     'MC ⠀•••• 1253',
//     100.81,
//   ),
//   createData(
//     3,
//     '16 Mar, 2019',
//     'Michael Jackson',
//     'Gary, IN',
//     'AMEX ⠀•••• 2000',
//     654.39,
//   ),
//   createData(
//     4,
//     '15 Mar, 2019',
//     'Bruce Springsteen',
//     'Long Branch, NJ',
//     'VISA ⠀•••• 5919',
//     212.79,
//   ),
// ];

const data = {
  "date": "08/19/20 10:00 AM", 
  "data": [
    {"address": "TLzBpvsrRBLfjK58mLQnaQFWXRMkwYxYUS", "nickname": "Ledger", "trx": 2121407.79, "change": 0.0}, 
    {"address": "TB1vS3FETs7eREwfEf3mRo6vSpbRWBWAzZ", "nickname": "SEED_Arb", "trx": 80074.64, "change": 254.94}, 
    {"address": "TEpK7cZooxRQugwuKqTKayGi865MQKdvVu", "nickname": "SEED", "trx": 3453.03, "change": 54.75}, 
    {"address": "TW4JPwJe4W6pZf2NYpQpErnC9Z1QWpsCnV", "nickname": "SEED_Quick", "trx": 140.13, "change": 0.0}, 
    {"address": "TVmxoHmGxJ1WLgBKmqZhe59vgd8ergkpuV", "nickname": "SEED_Quick2", "trx": 795.07, "change": 0.04}, 
    {"address": "TNrnVb8zD1i4ypH7n1X4vgadLRQmTnPD7S", "nickname": "TERC_Quick1", "trx": 25.04, "change": 0.0}, 
    {"address": "TKgogg5yo3GWSVfdFmvd8MgtYoZVmks7Ge", "nickname": "TERC_Quick2", "trx": 2.01, "change": 0.03}, 
    {"address": "TKur11NMLxYHuhYBBAHJcxhrrSPQ9kJzHw", "nickname": "TWM", "trx": 20.12, "change": 0.0}, 
    {"address": "TAxYw4YMfPuujKHuYWbkDe1fRHMs8HkGcS", "nickname": "TWM_Quick", "trx": 2.49, "change": 0.03}, 
    {"address": "TDLS1TRWnXdC8GMuQmETishHgd3EzfmD5B", "nickname": "TWM_Quick2", "trx": 2.27, "change": 0.03}, 
    {"address": "TBfeXqTbdy3mYXe1znfsurqtcu8kx4zWmh", "nickname": "TRUC", "trx": 0.64, "change": 0.0}, 
    {"address": "TPwRc3Jqjq7uvQT75E4eNFABHcicU356YS", "nickname": "TWM_Arb", "trx": 3545.23, "change": 0.33}, 
    {"address": "TA4vGA6hEpA44AVWPztoFPVJRDuQYd3g4f", "nickname": "Donations", "trx": 98.27, "change": 0.0},
    {"address": "COTI", "nickname": "COTI", "trx": 745324.86, "change": 106238.62},
    {"address": "FUND", "nickname": "FUND", "trx": 66066.83, "change": 13363.74}, 
  ],
  "trx_total": 3020958.44,
  "usd_total": 87607.79
}
const rows = createData(data);

export default function Orders() {
  return (
    <React.Fragment>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Address</TableCell>
            <TableCell>TRX</TableCell>
            <TableCell>Nickname</TableCell>
            <TableCell align="right">Difference</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.addr}</TableCell>
              <TableCell>{row.trx}</TableCell>
              <TableCell>{row.nick}</TableCell>
              <TableCell align="right">{row.diff}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}