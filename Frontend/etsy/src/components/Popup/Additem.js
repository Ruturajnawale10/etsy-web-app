import React from 'react';
import { Container } from './Container';
import "./index.css";

const Additem = () => {
  const triggerText = 'Add Item';
  const onSubmit = (event) => {
    event.preventDefault(event);
    console.log(event.target.name.value);
    console.log(event.target.email.value);
  };
  return (
    <div className='Additem' style={{marginLeft:130}}>
      <p style={{fontSize: 20}}>Add a new item in the store</p>
      <Container triggerText={triggerText} onSubmit={onSubmit} />
      
    </div>
  );
};

export default Additem;
