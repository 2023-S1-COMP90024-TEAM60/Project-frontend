import * as React from 'react';

function ControlPanel(props:any) {
  const {time} = props;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      right: 0,
      background: '#fff',
      margin: '24px',
      boxShadow: '0 0 4px rgba(0, 0, 0, 0.15',
      width: '250px'
    }}>
      <div style={{padding: '12px'}}>
        <h3>Interactive GeoJSON</h3>
        <p>
        Map showing median household income by state in year <b>{time}</b>. Hover over a state to
        see details.
        </p>
        <p>
        Data source: <a href="www.census.gov">US Census Bureau</a>
        </p>
      </div>
      <hr />

      <div
        key={'year'}
        style={{
          padding: '12px',
          display: 'flex',
        }}>
        <label style={{ width: 'auto' }}>Time</label>
        <input
          type="range"
          value={time}
          min={0}
          max={23}
          step={1}
          onChange={evt => props.onChange(evt.target.value)}
        />
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
