import React, { PureComponent } from 'react';
import { useTheme } from '@material-ui/core/styles';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
} from 'recharts';

function createData(data,trx) {
  var output = [];
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
  const data = createData(props.lineData,props.is_trx);
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
              {props.is_trx ? 'TRX Total (M)':'USD Total ($K)'}
            </Label>
          </YAxis>
          <Line
            type="monotone"
            dataKey="amount"
            stroke={theme.palette.primary.main}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}