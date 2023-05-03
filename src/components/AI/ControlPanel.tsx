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
}

function formatTime(time:any) {
  const date = new Date(time);
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function ControlPanel({ setCheckedLayer, startTime, endTime, onChangeTime, allDays, onChangeAllDays, selectedTime }: Props) {
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
      // maxWidth: 300,
      background: '#fff',
      margin: '24px',
      padding: '12px 24px',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.15',
    } } >
      <h2 style={{ marginBottom: '8px'}}>Clickable layers</h2>

      <Checkbox.Group style={{ width: '100%' }} onChange={onChange}>
        <Checkbox value="heatmap">Heatmap</Checkbox>
        <Checkbox value="cluster">Cluster</Checkbox>
        Map showing earthquakes
        <br />
        from <b>{formatTime(startTime)}</b> to <b>{formatTime(endTime)}</b>.
      </Checkbox.Group>
      <input
        type="checkbox"
        name="allday"
        checked={allDays}
        onChange={evt => onChangeAllDays(evt.target.checked)}
      />
      <div className={`input ${allDays ? 'disabled' : ''}`}>
        <label>Each Day: {formatTime(selectedTime)}</label>
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
      <p>
        Data source:{' '}
        <a href="https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson">
          earthquakes.geojson
        </a>
      </p>
    </div>

  );
}

export default React.memo(ControlPanel);
