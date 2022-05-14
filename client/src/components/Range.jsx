import React, { useState } from "react";

const Range = (props) => {
  const {
    name,
    min,
    max,
    step,
    tickStep = step,
    value,
    handler,
    displayStyle,
  } = props;
  const [display, setDisplay] = useState(name);

  const labelToInput = () => {
    const handleInput = (e) => {
      const { valueAsNumber } = e.target;
      let value =
        displayStyle === "percent" ? valueAsNumber / 100 : valueAsNumber;
      // ensure value is never greater than max or less than min
      value > max ? (value = max) : value < min && (value = min);
      if (e.key === "Enter") {
        setDisplay(name);
        if (!isNaN(value)) {
          handler(value);
        }
      } else if (e.key === "Escape") setDisplay(name);
    };

    const input = (
      <div className="input-group">
        <input
          type="number"
          className="form-control border-0 p-0 m-0"
          autoFocus
          onKeyDown={handleInput}
        />
      </div>
    );

    setDisplay(input);
  };

  const handleChange = (e) => {
    const { valueAsNumber } = e.target;
    handler(valueAsNumber);
    if (displayStyle === "percent") {
      setDisplay(Math.round(valueAsNumber * 100) + "%");
    } else {
      setDisplay(valueAsNumber + "x");
    }
  };

  const showTicks = (min, max, tickStep) => {
    const arr = [];
    for (let i = min; i <= max; i += tickStep) {
      arr.push(i);
    }
    return arr.map((x) => <option key={x} value={x}></option>);
  };

  return (
    <div className="col-auto controls">
      {/* label / input */}
      <label
        htmlFor={name}
        className="mb-0 mt-1 mx-1 font-1"
        onClick={labelToInput}
      >
        {display}
      </label>

      {/* the slider */}
      <input
        name={name}
        title={name}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        onMouseDown={handleChange}
        onMouseUp={() => setDisplay(name)}
        type="range"
        className="form-control-range mt-1 ml-1"
        orient="vertical"
        list={name + "-tick"}
      />

      <datalist id={name + "-tick"}>{showTicks(min, max, tickStep)}</datalist>
    </div>
  );
};

export default Range;
