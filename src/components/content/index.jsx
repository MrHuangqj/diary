import React, { useState } from 'react';
import { Input, Button, Radio } from 'antd';

function Hook () {
  const [options, setCount] = useState([]);
  const [name, setName] = useState('');
  const [select, setSelect] = useState(-1);


  const radios = options.map((e, i) => {
    return <Radio value={i} key={i}>{e}</Radio>
  })
  const tip1 = options.length > 0 ? null : <h2 >No options yet</h2>
  const tip2 = select >= 0 ? <h2>Selected option is {options[select]}</h2> : null


  function inputChange (e) {
    setName(e.target.value)
  }
  function buttonClick () {
    setCount([...options, name])
    setName('')
  }
  function radioChange (e) {
    setSelect(e.target.value)
  }


  return (
    <div style={{ width: '300px', margin: '0 auto' }}>
      <div style={{ height: "60px", display: "flex", alignItems: "center" }}>
        <Radio.Group onChange={radioChange}>
          {radios}
        </Radio.Group>
        {tip1}
      </div>
      {tip2}
      <Input value={name} style={{ margin: "0 0 20px 0" }} onChange={inputChange} />
      <Button onClick={buttonClick}>
        + Add
      </Button>
    </div >
  );
}

export default Hook;