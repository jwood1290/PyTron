import { history } from './data/history.js';
import { other_data } from './data/other_token_data.js';
import { demo_breakdown_data } from './data/demo_breakdown.js';

const { EJSON } = require('bson');

function shortNum(n,p) {
  const power = Math.pow(10,p);
  return Math.round(n*power)/power;
}

function get_even_data(data,n) {
  var output = [data[0]];
  var totalItems = data.length - 2;
  var interval = Math.floor(totalItems/(n - 2));
  for (var i = 1; i < (n-1); i++) {
      output.push(data[i * interval]);
  }
  output.push(data[data.length - 1]);
  return output;
}

function epoch_to_str(e,add_day=true) {
  const dt = new Date(e);
  const day = dt.getDate();
  const year = String(dt.getFullYear()).substring(2,4);
  const month = String(dt.toLocaleString('default', {month:'short'}));
  if (add_day) {
    return month + " " + String(day) + " '" + year;
  } else {
    return month + " '" + year;
  }
}

function parseData(data) {
  var curr_trx, curr_usd, total_trx, ex_rate;
  var output = [];
  var count = 0;
  var last_trx = 0;
  var last_usd = 0;
  data.forEach(i => {
    curr_trx = 0;
    total_trx = 0;
    i.data.forEach(j => {
      if (j.address.length > 10) {
        curr_trx += j.trx;
      }
      total_trx += j.trx;
    })
    if (last_trx === 0) {last_trx = curr_trx};
    if (last_usd === 0) {last_usd = i.usd_total};
    ex_rate = shortNum(i.usd_total/total_trx,4);
    curr_usd = shortNum(curr_trx*ex_rate,2);

    output.push({
      month: count,
      date: epoch_to_str(i.epoch*1000),
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
  })
  return output;
}

function parse_url(url) {
  return fetch(url)
  .then(res => res.json())
  .then(res => EJSON.parse(JSON.stringify(res)))
  .catch(err => console.log('Error parsing URL: ' + err))
}

async function get_data(url,demo) {
  var all_data = [];
  var reduced_data = [];
  if (demo) {
    all_data = history.filter(i => {
      const dt = epoch_to_str(i.epoch*1000);
      return dt.includes('15')
    });
    all_data.push(history[history.length-1]);
  } else {
    try {
      all_data = await parse_url(url);
    } catch (err) {
      console.log(err);
      all_data = history;
    }
  }
  var TRX15 = parseData(all_data);
  reduced_data = get_even_data(all_data,10);

  var trx = [];
  var usd = [];
  var last = [];
  reduced_data.forEach(i => {
    var amt = 0;
    const date_abbr = epoch_to_str(i.epoch*1000,false);
    i.data.forEach(j => { 
      amt = amt + j.trx;
    })
    amt = Math.round(amt*100)/100;
    trx.push([amt,date_abbr]);
    usd.push([i.usd_total,date_abbr]);
    last = i;
  })
  return {trx,usd,last,TRX15};
}

async function get_other_history(url,trx_data,demo) {
  var data = {};
  if (demo) {
    data = other_data;
  } else {
    try {
      const unfiltered_data = await parse_url(url);
      for (const [k,v] of Object.entries(unfiltered_data)) {
        if (k === '_id' || k === 'last_updated') { continue; };
        data[k] = v.filter(entry => {return entry.date.includes('12:00')});
      }
    } catch (err) {
      console.log(err);
      data = other_data;
    }
  }

  var output = {};
  for (const [k,v] of Object.entries(data)) {
    if (k !== '_id' && k !== 'last_updated') {
      output[k] = [];
      var count = 0;
      const month_diff = trx_data.length - v.length;
      if (month_diff > 0) {
        for (const m of Array(month_diff).keys()) {
          output[k].push({
            month:count,
            date:trx_data[m].date,
            amt:0,
            gain:0,
            p_gain:'',
            price:'',
            value:'',
            v_gain:'',
            avg_p:'',
          });
          count = count + 1;
        }
      }
      v.forEach(i => {
        var last_amt = 0;
        if (output[k].length > 0) {
          last_amt = output[k][output[k].length - 1].amt;
        }
        const m = output[k].length;
        var curr_amt = i.amount;
        if (m === trx_data.length - 1) {
          if (epoch_to_str(i.epoch*1000) !== trx_data[m].date) {
            curr_amt = 0;
          }
        }
        const gain = curr_amt - last_amt;
        const p_gain = (last_amt > 0) ? (shortNum(100*(curr_amt - last_amt)/last_amt,2) + '%'):'';
        const v_gain = (last_amt > 0 && curr_amt > 0) ? (shortNum(i.p_gain,2) + '%'):'';
        const val = curr_amt*i.usd;
        output[k].push({
          month:m,
          date:epoch_to_str(i.epoch*1000),
          amt:shortNum(curr_amt,2),
          gain:(gain !== 0) ? shortNum(gain,2):0,
          p_gain:p_gain,
          price:(i.usd > 0) ? '$' + shortNum(i.usd,4):'',
          value:(val !== 0) ? '$' + shortNum(val,2):'',
          v_gain:v_gain,
          avg_p:(i.b_price) ? '$' + shortNum(i.b_price,4):'',
        })
        last_amt = curr_amt;
      })
    }
  }
  return output;  
}

async function get_breakdown(url,demo) {
  var data = {};
  if (demo) {
    data = demo_breakdown_data;
  } else {
    try {
      data = await parse_url(url);
    } catch (err) {
      console.log(err);
      data = demo_breakdown_data;
    }
  }

  return data;
}

async function get_all_data(demo) {
  const trx_url = process.env.REACT_APP_FILTERED_URL + process.env.REACT_APP_LOGIN_PASS;
  const other_url = process.env.REACT_APP_OTHER_URL + process.env.REACT_APP_LOGIN_PASS;
  const breakdown_url = process.env.REACT_APP_BREAKDOWN_URL + process.env.REACT_APP_LOGIN_PASS;
  const trx_data = await get_data(trx_url,demo);
  const other_tokens = await get_other_history(other_url,trx_data.TRX15,demo);
  var output = {...trx_data,...other_tokens};

  var split_data = output.TRX15.sort((a, b) => (a.month > b.month) ? 1:-1);
  var o_keys = Object.keys(output);

  o_keys.forEach(o => {
    if (!(['trx','usd','last','TRX15'].includes(o))) {
      var tmp_data = output[o].sort((a, b) => (a.month > b.month) ? 1:-1);
      for (const count of Array(split_data.length).keys()) {
        split_data[count][o] = {amt:tmp_data[count].amt,value:tmp_data[count].value};
      }
    }
  })
  output.breakdown = await get_breakdown(breakdown_url,demo);
  output.split_data = get_even_data(split_data,10);
  return output;
}

export default function GetHistory(isDemo=false) {
  try {
    return get_all_data(isDemo);
  } catch (err) {
    console.log(err);
    return null;
  }
}


