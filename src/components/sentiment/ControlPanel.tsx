import * as React from 'react';

function ControlPanel(props:any) {
  const {year} = props;

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
        Map showing median household income by state in year <b>{year}</b>. Hover over a state to
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
        <label style={{ width: 'auto' }}>Year</label>
        <input
          type="range"
          value={year}
          min={1995}
          max={2015}
          step={1}
          onChange={evt => props.onChange(evt.target.value)}
        />
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
