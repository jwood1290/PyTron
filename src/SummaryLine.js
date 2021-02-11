import React, { PureComponent } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function createData(input,trx) {
  var output = [];
  const data = trx ? input.trx:input.usd;
  data.forEach(i => {
    var amt = i[0];
    if (trx) {
      amt = Math.round(amt/100000)/10;
    } else {
      amt = Math.round(amt/100)/10;
    }
    output.push({
      time: i[1],
      amount: amt,
    })
  })
  return output;
}

function parseSplitData(data,k_list,trx) {
  var output = [];
  var tokens = ['TRX'];
  data.forEach(i => {
    const date = i.date.substr(0,4) + i.date.substr(7);
    const trx_amt = trx ? Math.round(i.amt/100000)/10:Math.round(parseFloat(i.value.substr(1))/100)/10;
    var tmp_data = {
      time:date,
      TRX: trx_amt
    }
    for (const [k,v] of Object.entries(i)) {
      if (k_list.includes(k)) {
        if (!tokens.includes(k)) { tokens.push(k) };
        var amt = trx ? v.amt:v.value;
        if (amt === "") {amt = 0};
        if (v.amt > 0) {
          if (trx) {
            amt = Math.round(amt/100000)/10;
          } else {
            amt = parseFloat(amt.substr(1));
            amt = Math.round(amt/100)/10;
          }
        }
        tmp_data[k] = amt;
      }
    }
    output.push(tmp_data);
  })
  return {output,tokens};
}

class CustomizedAxisTick extends PureComponent {
  render () {
    const {x, y, stroke, payload} = this.props;
    const dt = payload.value.split(' ');
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} fill={stroke}>
          <tspan textAnchor="middle" x="0">{dt[0]}</tspan>
          <tspan textAnchor="middle" x="0" dy="20">{dt[1]}</tspan>
        </text>
      </g>
    );
  }
};

export default function Summary(props) {
  const theme = useTheme();
  var data = [];
  var lines = [];
  var y_axis_label;
  if (props.is_split) {
    y_axis_label = props.is_trx ? 'Token Total (M)':'USD Total ($K)';
    const data_keys = Object.keys(props.data);
    const split_data = parseSplitData(props.data.split_data,data_keys,props.is_trx);
    const color_palette = ['#E8782B','#B34C00','#761700','#BBA79C','#DFE0DF']
    data = split_data.output;
    for (var i=0; i < split_data.tokens.length; i++) {
      var k = split_data.tokens[i];
      lines.push(<Line
        name={k}
        key={k}
        type="monotone"
        stroke={color_palette[i]}
        dataKey={k}
        dot={false}
      />);
    }
  } else {
    y_axis_label = props.is_trx ? 'TRX Total (M)':'USD Total ($K)';
    data = createData(props.data,props.is_trx);
    lines.push(<Line
      key='1'
      type="monotone"
      dataKey="amount"
      stroke={theme.palette.primary.main}
      dot={false}
    />);
  }

  return (
    <React.Fragment>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 0,
          }}
        >
          <XAxis 
            dataKey="time" 
            stroke={theme.palette.text.secondary} 
            height={50}
            interval={props.winwidth < 500 ? 'preserveStartEnd':0}
            tick={<CustomizedAxisTick {...{stroke:theme.palette.text.secondary}} />}
          />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              offset={10}
              position='insideLeft'
              angle={-90}
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
              }}
            >
              {y_axis_label}
            </Label>
          </YAxis>
          {(props.is_split) ? <Tooltip />:null}
          {(props.is_split) ? <Legend />:null}
          {lines}
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}