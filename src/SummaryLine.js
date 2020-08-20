import React from 'react';
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

// const data = [
//   createData('00:00', 0),
//   createData('03:00', 300),
//   createData('06:00', 600),
//   createData('09:00', 800),
//   createData('12:00', 1500),
//   createData('15:00', 2000),
//   createData('18:00', 2400),
//   createData('21:00', 2400),
//   createData('24:00', undefined),
// ];

const trx_rows = [
  [20882.1, "Jan '19"],
  [220744.44999999998, "Mar '19"],
  [830743.2300000001, "May '19"],
  [941764.3599999999, "Jun '19"],
  [1469597.0300000003, "Aug '19"],
  [1966199.8799999997, "Oct '19"],
  [2049444.2900000003, "Dec '19"],
  [2251771.7199999997, "Feb '20"],
  [2359851.0500000003, "Apr '20"],
  [2496848.4699999997, "Jun '20"],
  [3021268.4899999998, "Aug '20"]
];

const usd_rows = [
  [480.28829999999994, "Jan '19"],
  [5077.12235, "Mar '19"],
  [19937.83752, "May '19"],
  [33903.51695999999, "Jun '19"],
  [23513.552480000006, "Aug '19"],
  [27526.798319999994, "Oct '19"],
  [30741.664350000003, "Dec '19"],
  [38280.11924, "Feb '20"],
  [35397.765750000006, "Apr '20"],
  [39949.57552, "Jun '20"],
  [84595.51771999999, "Aug '20"]
]

const trx_data = createData(trx_rows,true);
const usd_data = createData(usd_rows,false);

export default function Summary(props) {
  const theme = useTheme();
  var data = trx_data;
  if (!props.isTRX) {
    data = usd_data;
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
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{
                textAnchor: 'middle',
                fill: theme.palette.text.primary,
              }}
            >
              {props.isTRX ? 'TRX Total (M)':'USD Total (k)'}
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