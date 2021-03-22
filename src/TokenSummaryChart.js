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

function parseData(props,addr) {
  const t_trx = props.data.trx[props.data.trx.length-1][0];
  const t_usd = props.data.usd[props.data.usd.length-1][0];
  const ex_rate = t_usd/t_trx;

  var output = [];
  var addr_tokens = {};
  props.data.breakdown.forEach(item => {
    if (['All',item._id].includes(addr)) {
      item.tokens.forEach(i => {
        var t_name = i[0];
        if (t_name.includes("TRX")) {
          t_name = 'TRX';
        }
        if (!(addr_tokens.hasOwnProperty(t_name))) {
          addr_tokens[t_name] = {'amt':0,'trx':0};
        }
        addr_tokens[t_name].amt += i[1];
        addr_tokens[t_name].trx += i[2];
      })
    }
  })

  for (const [k,v] of Object.entries(addr_tokens)) {
    output.push({
      name: k,
      amt: shortNum(v.amt),
      trx: shortNum(v.trx),
      usd: (k === 'USDT') ? shortNum(v.amt):shortNum(v.trx*ex_rate),
    })
  }

  return output.sort((a, b) => { 
    if (addr !== 'All') {
      if (a.name === 'TRX') return -1;
      if (b.name === 'TRX') return 1;
      if (a.name === 'USDT') return -1;
      if (b.name === 'USDT') return 1;
    }
    return b.trx - a.trx; 
  });
}

export default function Chart(props) {
  const addr = props.token_address || 'All';
  const data = parseData(props,addr);

  return (
    <TableContainer className={props.classes.table}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">TRX</TableCell>
            <TableCell align="right">USD</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell align="right">{row.amt}</TableCell>
              <TableCell align="right">{row.trx}</TableCell>
              <TableCell align="right">{row.usd}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}