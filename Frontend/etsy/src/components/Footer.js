import React, { useEffect, useState } from "react";
import axios from "axios";

function Footer() {
  const curr = localStorage.getItem("currency");
  const country = localStorage.getItem("country");
  
  const changeCurrency = async (e) => {
      let curr = e.target.options[e.target.selectedIndex].text;
      let arr = curr.split(" ");
      curr = arr[0] + " " + arr[arr.length - 1];
      localStorage.setItem("currency", curr);

      axios.defaults.headers.common["authorization"] =
        localStorage.getItem("token");
      const response = await axios.post(
        process.env.REACT_APP_LOCALHOST + "/your/change/currency",
        {
          currency: curr
        }
      );
      window.location.reload(false);
  };

  return (
    <div>
      <footer
        class="text-center text-white"
        style={{ backgroundColor: "#1c0c4a" }}
      >
        <div class="container p-4">
          <div class="row">
            <div class="col-md-auto"> {country} &emsp; &emsp;|</div>
            <div class="col-md-auto" style={{ marginLeft: "10px" }}>
              {curr} &emsp;
              <select id="e" style={{ backgroundColor: "#4422a3", width:"20px" }} onChange={changeCurrency}>
                <option selected="selected">{curr}</option>
                <option value="USD">$ United States (USD)</option>
                <option value="CAD">$ Canadian Dollar (CAD)</option>
                <option value="EUR">€ Euro (EUR)</option>
                <option value="GBP">£ British Pound (GBP)</option>
                <option value="AUD">$ Australian Dollar (AUD)</option>
                <option value="JPY">¥ Japanese Yen (JPY)</option>
                <option value="CNY">¥ Chinese Yuan (CNY)</option>
                <option value="CZK">Kč Czech Koruna (CZK)</option>
                <option value="DKK">kr Danish Krone (DKK)</option>
                <option value="HKD">$ Hong Kong Dollar (HKD)</option>
                <option value="HUF">Ft Hungarian Forint (HUF)</option>
                <option value="INR">₹ Indian Rupee (INR)</option>
                <option value="IDR">Rp Indonesian Rupiah (IDR)</option>
                <option value="ILS">₪ Israeli Shekel (ILS)</option>
                <option value="MYR">RM Malaysian Ringgit (MYR)</option>
                <option value="MXN">$ Mexican Peso (MXN)</option>
                <option value="MAD">DH Moroccan Dirham (MAD)</option>
                <option value="NZD">$ New Zealand Dollar (NZD)</option>
                <option value="NOK">kr Norwegian Krone (NOK)</option>
                <option value="PHP">₱ Philippine Peso (PHP)</option>
                <option value="SGD">$ Singapore Dollar (SGD)</option>
                <option value="VND">₫ Vietnamese Dong (VND)</option>
                <option value="ZAR">R South African Rand (ZAR)</option>
                <option value="SEK">kr Swedish Krona (SEK)</option>
                <option value="CHF">Swiss Franc (CHF)</option>
                <option value="THB">฿ Thai Baht (THB)</option>
                <option value="TWD">NT$ Taiwan New Dollar (TWD)</option>
                <option value="TRY">₺ Turkish Lira (TRY)</option>
                <option value="PLN">zł Polish Zloty (PLN)</option>
                <option value="BRL">R$ Brazilian Real (BRL)</option>
              </select>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
