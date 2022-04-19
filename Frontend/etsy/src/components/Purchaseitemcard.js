import React, {useState} from "react";

function Purchaseitemcard(props) {
  let d = Date.parse(props.item.date);
  let date = new Intl.DateTimeFormat('en-GB', {dateStyle:'medium'}).format(d);
  let isGift = props.item.isGift;
  let gift = null;

  if (isGift) {
    gift = (
      <p style={{fontSize:"25px", color:"darkorange"}}>
        This order is a gift
      </p>
    )
  }

  return (
    <div>
      <div >
        <div class="row">
          <div class="col-md-4">
            <div class="thumbnail">
              <a
                href={`/items/${props.item.itemName}`}
                target="_blank"
                style={{
                  textDecoration: "none",
                  color: "black",
                  fontSize: "25px",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${props.item.image}`}
                  alt="Unavailable"
                  style={{ maxWidth:"100%", maxHeight:"100%" }}
                ></img>
              </a>
            </div>
          </div>
          <div class="col-md-8">
          <div class="row" style={{ marginTop: "50px" }}>
          <div class="col" style={{fontSize:"20px"}}>Order ID: {props.item.orderID}</div>
            </div>
            <div class="row" style={{ marginTop: "50px" }}>
              <div class="col" style={{fontSize:"20px"}}>Name: {props.item.itemName}</div>
              <div class="col" style={{fontSize:"20px"}}>Price: $ {props.item.price}</div>
              <div class="col" style={{fontSize:"20px"}}>Quantity: {props.item.quantity}</div>
            </div>
            <div class="row" style={{ marginTop: "50px" }}>
              <div class="col-4" style={{fontSize:"20px"}}>Shop: {props.item.shopName}</div>
              <div class="col" style={{fontSize:"20px"}}>Date of Purchase: {date}</div>
              {gift}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Purchaseitemcard;
