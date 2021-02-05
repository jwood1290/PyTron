import { history } from './data/history.js';
import { other_data } from './data/other_token_data.js';

const { EJSON } = require('bson');

function shortNum(n,p) {
  const power = Math.pow(10,p);
  return Math.round(n*power)/power;
}

function get_even_data(data,n) {
  const skip = Math.floor(data.length/(n-1));
  var output = [];
  for (var i=0; i < n-1; i++) {
    output.push(data[i*skip]);
  }
  output.push(data[data.length-1]);
  return output;
}

function parseData(data) {
  var dt, day, month, year, curr_trx;
  var curr_usd, total_trx, ex_rate, date_str;
  var output = [];
  var count = 0;
  var last_trx = 0;
  var last_usd = 0;
  var last_day = -1;
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
        p_gain: shortNum(100*(curr_trx - last_trx)/last_trx,2) + '%',
        v_gain: shortNum(100*(curr_usd - last_usd)/last_usd,2) + '%',
      });
      count += 1;
      last_trx = curr_trx;
      last_usd = curr_usd;
    }
    last_day = day;
  })
  return output;
}

async function get_24h_history(url) {
  return fetch(url)
  .then(res => res.json())
  .then(
    res => EJSON.parse(JSON.stringify(res)),
    err => console.log('Error in get_24h_history: ' + err)
  ).catch(err => console.log(err))
}

async function get_data(url,demo) {
  var all_data = [];
  var reduced_data = [];
  if (demo) {
    all_data = history;
  } else {
    try {
      all_data = await get_24h_history(url);
    } catch (err) {
      console.log(err);
      all_data = history;
    }
  }
  const TRX15 = parseData(all_data);
  reduced_data = get_even_data(all_data,10);

  var trx = [];
  var usd = [];
  var last = [];
  var amt, dt;
  reduced_data.forEach(i => {
    amt = 0;
    i.data.forEach(j => {
      amt = amt + j.trx;
    })
    dt = new Date(i.epoch*1000);
    var year = String(dt.getFullYear()).substring(2,4);
    var month = dt.toLocaleString('default', {month:'short'});
    var date_abbr = month + " '" + year;
    amt = Math.round(amt*100)/100;
    trx.push([amt,date_abbr]);
    usd.push([i.usd_total,date_abbr]);
    last = i;
  })
  return {trx,usd,last,TRX15};
}

async function get_others(url) {
  return fetch(url)
  .then(res => res.json())
  .then(
    res => EJSON.parse(JSON.stringify(res)),
    err => console.log('Error in get_24h_history: ' + err)
  ).catch(err => console.log(err))
}

async function get_other_history(url,demo) {
  var data = {};
  if (demo) {
    data = other_data;
  } else {
    try {
      data = await get_others(url);
    } catch (err) {
      console.log(err);
      data = other_data;
    }
  }

  var output = {};
  const key_arr = Object.keys(data);
  key_arr.forEach(k => {
    if (k !== '_id' && k !== 'last_updated') {
      var count = 0;
      var last_amt = 0;
      data[k].forEach(i => {
        const dt = new Date(i.epoch*1000);
        const year = String(dt.getFullYear()).substring(2,4);
        const month = dt.toLocaleString('default', {month:'short'});
        const day = String(dt.getDate());
        const date_abbr = month + " " + day + " '" + year;
        const gain = i.amount - last_amt;
        if (last_amt > 0) {
          console.log([(100*(i.amount - last_amt)/last_amt),last_amt,gain]);
        }
        const p_gain = (last_amt > 0) ? (shortNum(100*(i.amount - last_amt)/last_amt,2) + '%'):'';
        const v_gain = (last_amt > 0) ? (shortNum(i.p_gain,2) + '%'):'';
        const val = i.amount*i.usd;
        if (!(k in output)) {
          output[k] = []; 
        }
        output[k].push({
          month:count,
          date:date_abbr,
          amt:shortNum(i.amount,2),
          gain:(gain > 0) ? shortNum(gain,2):0,
          p_gain:p_gain,
          price:(i.usd > 0) ? '$' + shortNum(i.usd,4):'',
          value:(val > 0) ? '$' + shortNum(val,2):'',
          v_gain:v_gain,
          avg_p:(i.b_price) ? '$' + shortNum(i.b_price,4):'',
        })
        count = count + 1;
        last_amt = i.amount;
      })
    }
  })
  return output;  
}

async function get_all_data(demo) {
  const trx_url = process.env.REACT_APP_LOGIN_URL + process.env.REACT_APP_LOGIN_PASS;
  const other_url = process.env.REACT_APP_OTHER_URL + process.env.REACT_APP_LOGIN_PASS;
  const trx_data = await get_data(trx_url,demo);
  const other_tokens = await get_other_history(other_url,demo);
  return {...trx_data,...other_tokens};
}

export default function GetHistory(isDemo=false) {
  try {
    return get_all_data(isDemo);
  } catch (err) {
    console.log(err);
    return null;
  }
}


