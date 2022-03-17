import React from "react";

function Itemcard(props) {

  return (
    <div>
      <div class="row">
        <div className="card" style={{ width: "100%" }}>
          <div class="col-md-4">
            <div class="thumbnail">
              <a href="/cart" class="navbar-brand">
                <img
                  src="https://images.rawpixel.com/image_png_1300/czNmcy1wcml2YXRlL3Jhd3BpeGVsX2ltYWdlcy93ZWJzaXRlX2NvbnRlbnQvbHIvcm00NjctaGVhcnQtMDAxXzIucG5n.png?s=PgaWWlYmApHnALAgNrDZANg39WzQY1tpdu_snZXmAgQ"
                  width={40}
                  height={40}
                  class="img-fluid"
                ></img>
              </a>

              <a
                href="/w3images/lights.jpg"
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
                  style={{ width: "100%" }}
                ></img>

                <div >
                    <div style={{ display: "inline-block"}}>{props.item.item_name}</div>
                    <div style={{ display: "inline-block", marginLeft: "200px"}}>Price:  {props.item.price}$</div>
                  <div>
                    <p></p>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Itemcard;
