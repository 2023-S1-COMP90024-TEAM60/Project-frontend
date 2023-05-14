import { Checkbox } from 'antd';
import React from 'react';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

interface Props {
  setCheckedLayer: Function;
  startTime: any;
  endTime: any;
  onChangeTime: any;
  allDays: any;
  onChangeAllDays: any;
  selectedTime: any;
  checkedLayer: string[];
}

function formatTime(time:any) {
  const date = new Date(time);
  return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}

function ControlPanel({ setCheckedLayer, startTime, endTime, onChangeTime, allDays, onChangeAllDays, selectedTime, checkedLayer }: Props) {
  const onChange = (checkedValues: CheckboxValueType[]) => {
    setCheckedLayer(checkedValues)
    console.log(checkedValues)
  };
  const day = 24 * 60 * 60 * 1000;
  const days = Math.round((endTime - startTime) / day);
  const selectedDay = Math.round((selectedTime - startTime) / day);

  const onSelectDay = (evt:any) => {
    const daysToAdd = evt.target.value;
    // add selected days to start time to calculate new time
    const newTime = startTime + daysToAdd * day;
    onChangeTime(newTime);
  };
  
  return (
    <div style={ {
      position: 'absolute',
      top: 0,
      right: 0,
      background: '#fff',
      margin: '24px',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.15',
    } } >
      <div style={{padding: '12px'}}> <p> Map showing number of tweets posted which contains<br />
        AI and related keywords from <b>{formatTime(startTime)}</b> to <b>{formatTime(endTime)}</b>.
      </p>
      <p style={{ marginTop: '8px'}}>Clickable layers</p>
      <Checkbox.Group style={{ width: '100%' }} onChange={onChange} defaultValue={checkedLayer}>
        <Checkbox value="heatmap">Heatmap</Checkbox>
        <Checkbox value="cluster">Cluster</Checkbox>
      </Checkbox.Group></div>
      <hr />
      <div style={{padding: '12px'}}>
        <p>Time filter</p>
        <Checkbox
          type="checkbox"
          name="allday"
          checked={allDays}
          onChange={evt => onChangeAllDays(evt.target.checked)}
        >All Days</Checkbox>
        <div className={`input ${allDays ? 'disabled' : ''}`}>
          <label style={{minWidth:"120px", display: 'inline-block'}}>Each Day: {formatTime(selectedTime)}</label>
          <input
            type="range"
            disabled={allDays}
            min={1}
            max={days}
            value={selectedDay}
            step={1}
            onChange={onSelectDay}
          />
        </div>
      </div>
      <hr />
      <div style={{padding: '12px'}}>  <p>
        Data source:{' '}
        <a href="http://localhost:8000/AI/mapData">
          mapData.geojson
        </a>
      </p></div>
    </div>

  );
}

export default React.memo(ControlPanel);
