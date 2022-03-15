import React from "react";

export const Additemform = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <h4>Enter the Item details</h4>

      <div className="form-group">
        <p>Add item image</p>
        <input className="form-control" type="file" id="imageFile" required />
      </div>

      <div className="form-group">
        <label htmlFor="name"> Name</label>
        <input className="form-control" id="name" />
      </div>

      <div className="form-group">
        <label htmlFor="category"> Category</label>
        <input className="form-control" id="category" />
      </div>

      <div className="form-group">
        <label htmlFor="description"> Description</label>
        <input className="form-control" id="description" />
      </div>

      <div className="form-group">
        <label htmlFor="price"> Price</label>
        <input className="form-control" id="price" />
      </div>

      <div className="form-group">
        <label htmlFor="quantity"> Quantity</label>
        <input className="form-control" id="quantity" />
      </div>

      <div className="form-group">
        <button
          className="form-control btn btn-primary"
          style={{ backgroundColor: "orangered" }}
          type="submit"
        >
          Add
        </button>
      </div>
    </form>
  );
};
export default Additemform;
