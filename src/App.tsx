import * as _ from 'lodash';
import { useMemo } from 'react';
import './App.css';
import { ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import data1 from './data1';
import data2 from './data2';

const getDataKey = (d) => `${d.guid}${d.valueType}`;
const xDomain = [new Date(2022, 5, 4).valueOf(), new Date(2022, 5, 5).valueOf()]

const colors = ['red', 'green', 'blue', 'yellow'];

const Chart = (props: { series: string[], data: any[] }) => {
  const { data, series, } = props;
  return (<ResponsiveContainer>
    <ComposedChart data={data} syncId={'timeStampId'}>
      <XAxis dataKey={'timeStampId'} domain={xDomain} tickFormatter={d => new Date(d).toLocaleDateString()} type='number' />
      <YAxis domain={[0, 15]} />
      {series.map((d, i) => (<Line key={d} dataKey={d} dot={false} stroke={colors[i]}></Line>))}
      <Tooltip />
    </ComposedChart>
  </ResponsiveContainer>);
}

const Chart2 = (props: { data: any[], allowDuplicatedCategory?: boolean }) => {
  const { allowDuplicatedCategory, data } = props;
  const series = _.uniq(data.map(d => getDataKey(d)))
  return (<ResponsiveContainer>
    <ComposedChart syncId={'timeStampId'}>
      <XAxis dataKey={'timeStampId'} domain={xDomain} tickFormatter={d => new Date(d).toLocaleDateString()} allowDuplicatedCategory={allowDuplicatedCategory} type='number' />
      <YAxis domain={[0, 15]} />
      {series.map((d, i) => {
        const currentData = data.filter(v => getDataKey(v) === d).map(v => ({ ...v, timeStampId: new Date(v.timeStamp).valueOf() }));
        return (<Line key={d} data={currentData} dataKey={'value'} dot={false} stroke={colors[i]}></Line>);
      })}
      <Tooltip />
    </ComposedChart>
  </ResponsiveContainer>);
}


function App() {

  const { mapped1, s1 } = useMemo(() => {
    return { mapped1: mapToRechartsFormat(data1), s1: _.uniq(data1.map(d => getDataKey(d))) }
  }, [])

  const { mapped2, s2 } = useMemo(() => {
    return { mapped2: mapToRechartsFormat(data2), s2: _.uniq(data2.map(d => getDataKey(d))) }
  }, [])

  return (
    <>
      <h3>Global data, use dataKey</h3>
      <div style={{ display: 'flex', flexDirection: 'row', height: '400px' }} className='p4'>
        <div style={{ flexBasis: '50%' }} className='m4 bg-gray'>
          <Chart data={mapped1} series={s1} />
        </div>
        <div style={{ flexBasis: '50%' }} className='m4 bg-gray'>
          <Chart data={mapped2} series={s2} />
        </div>
      </div>
      <h3>Individual data, do not set allowDuplicateCategory</h3>
      <div style={{ display: 'flex', flexDirection: 'row', height: '400px' }} className='p4'>
        <div style={{ flexBasis: '50%' }} className='m4 bg-gray'>
          <Chart2 data={data1} />
        </div>
        <div style={{ flexBasis: '50%' }} className='m4 bg-gray'>
          <Chart2 data={data2} />
        </div>
      </div>
      <h3>Individual data, set allowDuplicateCategory to false</h3>
      <div style={{ display: 'flex', flexDirection: 'row', height: '400px' }} className='p4'>
        <div style={{ flexBasis: '50%' }} className='m4 bg-gray'>
          <Chart2 data={data1} allowDuplicatedCategory={false} />
        </div>
        <div style={{ flexBasis: '50%' }} className='m4 bg-gray'>
          <Chart2 data={data2} allowDuplicatedCategory={false} />
        </div>
      </div>
    </>
  )
}

export default App;

const mapToRechartsFormat = (data1) => {
  return _.uniq(data1.map(d => d.timeStamp))
    .map(d => {
      const toAdd: any = {};
      toAdd['timeStamp'] = new Date(d);
      toAdd['timeStampId'] = new Date(d).valueOf();
      const v = data1.filter(s => s.timeStamp === d);
      v.forEach(s => {
        toAdd[getDataKey(s)] = s.value;
      });
      return toAdd;
    });
}
