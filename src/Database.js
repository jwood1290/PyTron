const { EJSON } = require('bson');


function get_even_data(data,n) {
	const skip = Math.floor(data.length/(n-1));
	var output = [];
	for (var i=0; i < n-1; i++) {
		output.push(data[i*skip]);
	}
	output.push(data[data.length-1]);
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

async function get_data(url) {
  var all_data = [];
  var reduced_data = [];
  try {
  	all_data = await get_24h_history(url);
  	reduced_data = get_even_data(all_data,10);
  } catch (err) {
  	console.log(err);
  }

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
  return {all_data,trx,usd,last};
}

export default function GetHistory() {
  const url = process.env.REACT_APP_LOGIN_URL + process.env.REACT_APP_LOGIN_PASS;
  try {
  	return get_data(url);
  } catch (err) {
  	console.log(err);
  	return {trx:[],usd:[]};
  }
}


