import React, { useEffect, useState } from "react";
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

function Userprofile() {

  var [profileData, setProfileData] = useState([]);
    let redirectVar = null;
        if(!cookie.load('cookie')){
            redirectVar = <Redirect to= "/login"/>
        }

    useEffect(() => {
        axios.get('http://localhost:3001/profile')
        .then((response) => {
       //todo: write logic for fetching profile data from db
       setProfileData(response.data[0]);
       console.log(profileData);
    });
    }, []);

    const submitData = (e) => {
    e.preventDefault();
      
      axios.post('http://localhost:3001/profile', profileData)
      .then((response) => {
     //todo: write logic for fetching profile data from db
     console.log(profileData);
    });
    }

  return (
    <div class="container p-3" style={{border: "8px solid #666666"}}>
    {redirectVar}
      <form onSubmit={submitData}>
        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="profilePic" class="col-form-label fw-bold">
              Profile Picture
            </label>
          </div>
          <div class="col-auto">
            <input
              type="file"
              id="profilePic"
              class="form-control"
              aria-describedby="pictureHelpline"
            />
          </div>
        </div>

        <img
          src="https://freesvg.org/img/abstract-user-flat-4.png"
          width={130}
          height={130}
          class="img-fluid"
        ></img>

        <hr />

        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="name" class="col-form-label fw-bold">
              Your name
            </label>
          </div>
          <div class="col-auto">
            <input
              type="text"
              id="name"
              class="form-control"
              value={profileData.name}
              onChange={(e) => {setProfileData({...profileData, 'name': e.target.value})}}
            />
          </div>
        </div>

        <hr/>
        <div class="row g-3 align-items-center">
          <div class="radio-group" id="gender">
            <span class="fw-bold">Gender &emsp;    </span>
                <input type="radio" value="female" name="gender" id="female" />
                <label for="female">Female &emsp;  &emsp; </label>
                <input type="radio" value="male" name="gender" id="male" />
                <label for="male">Male &emsp;  &emsp; </label>
                <input type="radio" value="private" name="gender" id="private" checked/>
                <label for="private">Other</label>
            </div>
        </div>
        <hr/>

        <div class="row g-3 align-items-center">
        <span id="birthday-group">
        
        <span class="fw-bold">Birthday &emsp;    </span>
             <select id="birth-month" name="birth-month" aria-label='Month'>
             
                 <option value="">- month -</option>
                              <option value="1"
                                  >January</option>
                              <option value="2"
                                  >February</option>
                              <option value="3"
                                  >March</option>
                              <option value="4"
                                  >April</option>
                              <option value="5"
                                  >May</option>
                              <option value="6"
                                  >June</option>
                              <option value="7"
                                  >July</option>
                              <option value="8"
                                  >August</option>
                              <option value="9"
                                  >September</option>
                              <option value="10"
                                  >October</option>
                              <option value="11"
                                  >November</option>
                              <option value="12"
                                  >December</option>
                </select>

             <select id="birth-day" name="birth-day" aria-label='Day'>
                 <option value="">- day -</option>
                              <option value="1"
                                  >1</option>
                              <option value="2"
                                  >2</option>
                              <option value="3"
                                  >3</option>
                              <option value="4"
                                  >4</option>
                              <option value="5"
                                  >5</option>
                              <option value="6"
                                  >6</option>
                              <option value="7"
                                  >7</option>
                              <option value="8"
                                  >8</option>
                              <option value="9"
                                  >9</option>
                              <option value="10"
                                  >10</option>
                              <option value="11"
                                  >11</option>
                              <option value="12"
                                  >12</option>
                              <option value="13"
                                  >13</option>
                              <option value="14"
                                  >14</option>
                              <option value="15"
                                  >15</option>
                              <option value="16"
                                  >16</option>
                              <option value="17"
                                  >17</option>
                              <option value="18"
                                  >18</option>
                              <option value="19"
                                  >19</option>
                              <option value="20"
                                  >20</option>
                              <option value="21"
                                  >21</option>
                              <option value="22"
                                  >22</option>
                              <option value="23"
                                  >23</option>
                              <option value="24"
                                  >24</option>
                              <option value="25"
                                  >25</option>
                              <option value="26"
                                  >26</option>
                              <option value="27"
                                  >27</option>
                              <option value="28"
                                  >28</option>
                              <option value="29"
                                  >29</option>
                              <option value="30"
                                  >30</option>
                              <option value="31"
                                  >31</option>
                </select>
             </span>
         </div>
         <hr/>

         <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="about" class="col-form-label fw-bold">
              About
            </label>
          </div>
          <div class="col-auto">
            <textarea
              type="text"
              id="about"
              class="form-control"
              value={profileData.about}
              onChange={(e) => {setProfileData({...profileData, 'about': e.target.value})}}
            />
          </div>
        </div>
        <hr/>

        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="name" class="col-form-label fw-bold">
              City
            </label>
          </div>
          <div class="col-auto">
            <input
              type="text"
              id="name"
              class="form-control"
              value={profileData.city}
              onChange={(e) => {setProfileData({...profileData, 'city': e.target.value})}}
            />
          </div>
        </div>

        <hr/>

        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="email" class="col-form-label fw-bold">
              Email
            </label>
          </div>
          <div class="col-auto">
            <input
              type="email"
              id="email"
              class="form-control"
              value={profileData.email}
              onChange={(e) => {setProfileData({...profileData, 'email': e.target.value})}}
            />
          </div>
        </div>

        <hr/>


        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="phone" class="col-form-label fw-bold">
              Phone
            </label>
          </div>
          <div class="col-auto">
            <input
              type="text"
              id="name"
              class="form-control"
              value={profileData.phone}
              onChange={(e) => {setProfileData({...profileData, 'phone': e.target.value})}}
            />
          </div>
        </div>

        <hr/>


        <div class="row g-3 align-items-center">
          <div class="col-auto">
            <label for="address" class="col-form-label fw-bold">
              Address
            </label>
          </div>
          <div class="col-auto">
            <textarea
              type="text"
              id="about"
              class="form-control"
              required
              value={profileData.address}
              onChange={(e) => {setProfileData({...profileData, 'address': e.target.value})}}
            />
          </div>
        </div>
        <hr/>

        <div class="row g-3 align-items-center">
        <span class="fw-bold">Country &emsp;    
             <select id="country" name="country" aria-label='country'>
             
                <option value="">- country -</option>
                <option value="US" selected="selected">United States</option>
                <option value="AU" >Australia</option>
                <option value="CA" >Canada</option>
                <option value="FR" >France</option>
                <option value="DE" >Germany</option>
                <option value="GR" >Greece</option>
                <option value="IE" >Ireland</option>
                <option value="IT" >Italy</option>
                <option value="JP" >Japan</option>
                <option value="NZ" >New Zealand</option>
                <option value="PL" >Poland</option>
                <option value="PT" >Portugal</option>
                <option value="RU" >Russia</option>
                <option value="ES" >Spain</option>
                <option value="NL" >The Netherlands</option>
                <option value="GB" >United Kingdom</option>
               
                <option value="AF" >Afghanistan</option>
                <option value="AL" >Albania</option>
                <option value="DZ" >Algeria</option>
                <option value="AS" >American Samoa</option>
                <option value="AD" >Andorra</option>
                <option value="AO" >Angola</option>
                <option value="AI" >Anguilla</option>
                <option value="AG" >Antigua and Barbuda</option>
                <option value="AR" >Argentina</option>
                <option value="AM" >Armenia</option>
                <option value="AW" >Aruba</option>
                <option value="AU" >Australia</option>
                <option value="AT" >Austria</option>
                <option value="AZ" >Azerbaijan</option>
                <option value="BS" >Bahamas</option>
                <option value="BH" >Bahrain</option>
                <option value="BD" >Bangladesh</option>
                <option value="BB" >Barbados</option>
                <option value="BY" >Belarus</option>
                <option value="BE" >Belgium</option>
                <option value="BZ" >Belize</option>
                <option value="BJ" >Benin</option>
                <option value="BM" >Bermuda</option>
                <option value="BT" >Bhutan</option>
                <option value="BO" >Bolivia</option>
                <option value="BA" >Bosnia and Herzegovina</option>
                <option value="BW" >Botswana</option>
                <option value="BV" >Bouvet Island</option>
                <option value="BR" >Brazil</option>
                <option value="IO" >British Indian Ocean Territory</option>
                <option value="VG" >British Virgin Islands</option>
                <option value="BN" >Brunei</option>
                <option value="BG" >Bulgaria</option>
                <option value="BF" >Burkina Faso</option>
                <option value="BI" >Burundi</option>
                <option value="KH" >Cambodia</option>
                <option value="CM" >Cameroon</option>
                <option value="CA" >Canada</option>
                <option value="CV" >Cape Verde</option>
                <option value="KY" >Cayman Islands</option>
                <option value="CF" >Central African Republic</option>
                <option value="TD" >Chad</option>
                <option value="CL" >Chile</option>
                <option value="CN" >China</option>
                <option value="CX" >Christmas Island</option>
                <option value="CC" >Cocos (Keeling) Islands</option>
                <option value="CO" >Colombia</option>
                <option value="KM" >Comoros</option>
                <option value="CG" >Congo, Republic of</option>
                <option value="CK" >Cook Islands</option>
                <option value="CR" >Costa Rica</option>
                <option value="HR" >Croatia</option>
                <option value="CW" >Curaçao</option>
                <option value="CY" >Cyprus</option>
                <option value="CZ" >Czech Republic</option>
                <option value="DK" >Denmark</option>
                <option value="DJ" >Djibouti</option>
                <option value="DM" >Dominica</option>
                <option value="DO" >Dominican Republic</option>
                <option value="EC" >Ecuador</option>
                <option value="EG" >Egypt</option>
                <option value="SV" >El Salvador</option>
                <option value="GQ" >Equatorial Guinea</option>
                <option value="ER" >Eritrea</option>
                <option value="EE" >Estonia</option>
                <option value="ET" >Ethiopia</option>
                <option value="FK" >Falkland Islands (Malvinas)</option>
                <option value="FO" >Faroe Islands</option>
                <option value="FJ" >Fiji</option>
                <option value="FI" >Finland</option>
                <option value="FR" >France</option>
                <option value="GF" >French Guiana</option>
                <option value="PF" >French Polynesia</option>
                <option value="TF" >French Southern Territories</option>
                <option value="GA" >Gabon</option>
                <option value="GM" >Gambia</option>
                <option value="GE" >Georgia</option>
                <option value="DE" >Germany</option>
                <option value="GH" >Ghana</option>
                <option value="GI" >Gibraltar</option>
                <option value="GR" >Greece</option>
                <option value="GL" >Greenland</option>
                <option value="GD" >Grenada</option>
                <option value="GP" >Guadeloupe</option>
                <option value="GU" >Guam</option>
                <option value="GT" >Guatemala</option>
                <option value="GN" >Guinea</option>
                <option value="GW" >Guinea-Bissau</option>
                <option value="GY" >Guyana</option>
                <option value="HT" >Haiti</option>
                <option value="HM" >Heard Island and McDonald Islands</option>
                <option value="VA" >Holy See (Vatican City State)</option>
                <option value="HN" >Honduras</option>
                <option value="HK" >Hong Kong</option>
                <option value="HU" >Hungary</option>
                <option value="IS" >Iceland</option>
                <option value="IN" >India</option>
                <option value="ID" >Indonesia</option>
                <option value="IQ" >Iraq</option>
                <option value="IE" >Ireland</option>
                <option value="IM" >Isle of Man</option>
                <option value="IL" >Israel</option>
                <option value="IT" >Italy</option>
                <option value="IC" >Ivory Coast</option>
                <option value="JM" >Jamaica</option>
                <option value="JP" >Japan</option>
                <option value="JO" >Jordan</option>
                <option value="KZ" >Kazakhstan</option>
                <option value="KE" >Kenya</option>
                <option value="KI" >Kiribati</option>
                <option value="KV" >Kosovo</option>
                <option value="KW" >Kuwait</option>
                <option value="KG" >Kyrgyzstan</option>
                <option value="LA" >Laos</option>
                <option value="LV" >Latvia</option>
                <option value="LB" >Lebanon</option>
                <option value="LS" >Lesotho</option>
                <option value="LR" >Liberia</option>
                <option value="LY" >Libya</option>
                <option value="LI" >Liechtenstein</option>
                <option value="LT" >Lithuania</option>
                <option value="LU" >Luxembourg</option>
                <option value="MO" >Macao</option>
                <option value="MK" >Macedonia</option>
                <option value="MG" >Madagascar</option>
                <option value="MW" >Malawi</option>
                <option value="MY" >Malaysia</option>
                <option value="MV" >Maldives</option>
                <option value="ML" >Mali</option>
                <option value="MT" >Malta</option>
                <option value="MH" >Marshall Islands</option>
                <option value="MQ" >Martinique</option>
                <option value="MR" >Mauritania</option>
                <option value="MU" >Mauritius</option>
                <option value="YT" >Mayotte</option>
                <option value="MX" >Mexico</option>
                <option value="FM" >Micronesia, Federated States of</option>
                <option value="MD" >Moldova</option>
                <option value="MC" >Monaco</option>
                <option value="MN" >Mongolia</option>
                <option value="ME" >Montenegro</option>
                <option value="MS" >Montserrat</option>
                <option value="MA" >Morocco</option>
                <option value="MZ" >Mozambique</option>
                <option value="MM" >Myanmar (Burma)</option>
                <option value="NA" >Namibia</option>
                <option value="NR" >Nauru</option>
                <option value="NP" >Nepal</option>
                <option value="AN" >Netherlands Antilles</option>
                <option value="NC" >New Caledonia</option>
                <option value="NZ" >New Zealand</option>
                <option value="NI" >Nicaragua</option>
                <option value="NE" >Niger</option>
                <option value="NG" >Nigeria</option>
                <option value="NU" >Niue</option>
                <option value="NF" >Norfolk Island</option>
                <option value="MP" >Northern Mariana Islands</option>
                <option value="NO" >Norway</option>
                <option value="OM" >Oman</option>
                <option value="PK" >Pakistan</option>
                <option value="PW" >Palau</option>
                <option value="PS" >Palestinian Territory, Occupied</option>
                <option value="PA" >Panama</option>
                <option value="PG" >Papua New Guinea</option>
                <option value="PY" >Paraguay</option>
                <option value="PE" >Peru</option>
                <option value="PH" >Philippines</option>
                <option value="PL" >Poland</option>
                <option value="PT" >Portugal</option>
                <option value="PR" >Puerto Rico</option>
                <option value="QA" >Qatar</option>
                <option value="RE" >Reunion</option>
                <option value="RO" >Romania</option>
                <option value="RU" >Russia</option>
                <option value="RW" >Rwanda</option>
                <option value="SH" >Saint Helena</option>
                <option value="KN" >Saint Kitts and Nevis</option>
                <option value="LC" >Saint Lucia</option>
                <option value="MF" >Saint Martin (French part)</option>
                <option value="PM" >Saint Pierre and Miquelon</option>
                <option value="VC" >Saint Vincent and the Grenadines</option>
                <option value="WS" >Samoa</option>
                <option value="SM" >San Marino</option>
                <option value="ST" >Sao Tome and Principe</option>
                <option value="SA" >Saudi Arabia</option>
                <option value="SN" >Senegal</option>
                <option value="RS" >Serbia</option>
                <option value="SC" >Seychelles</option>
                <option value="SL" >Sierra Leone</option>
                <option value="SG" >Singapore</option>
                <option value="SX" >Sint Maarten (Dutch part)</option>
                <option value="SK" >Slovakia</option>
                <option value="SI" >Slovenia</option>
                <option value="SB" >Solomon Islands</option>
                <option value="SO" >Somalia</option>
                <option value="ZA" >South Africa</option>
                <option value="GS" >South Georgia and the South Sandwich Islands</option>
                <option value="KR" >South Korea</option>
                <option value="SS" >South Sudan</option>
                <option value="ES" >Spain</option>
                <option value="LK" >Sri Lanka</option>
                <option value="SD" >Sudan</option>
                <option value="SR" >Suriname</option>
                <option value="SJ" >Svalbard and Jan Mayen</option>
                <option value="SZ" >Swaziland</option>
                <option value="SE" >Sweden</option>
                <option value="CH" >Switzerland</option>
                <option value="TW" >Taiwan</option>
                <option value="TJ" >Tajikistan</option>
                <option value="TZ" >Tanzania</option>
                <option value="TH" >Thailand</option>
                <option value="NL" >The Netherlands</option>
                <option value="TL" >Timor-Leste</option>
                <option value="TG" >Togo</option>
                <option value="TK" >Tokelau</option>
                <option value="TO" >Tonga</option>
                <option value="TT" >Trinidad</option>
                <option value="TN" >Tunisia</option>
                <option value="TR" >Turkey</option>
                <option value="TM" >Turkmenistan</option>
                <option value="TC" >Turks and Caicos Islands</option>
                <option value="TV" >Tuvalu</option>
                <option value="UG" >Uganda</option>
                <option value="UA" >Ukraine</option>
                <option value="AE" >United Arab Emirates</option>
                <option value="GB" >United Kingdom</option>
                <option value="US" >United States</option>
                <option value="UM" >United States Minor Outlying Islands</option>
                <option value="UY" >Uruguay</option>
                <option value="VI" >U.S. Virgin Islands</option>
                <option value="UZ" >Uzbekistan</option>
                <option value="VU" >Vanuatu</option>
                <option value="VE" >Venezuela</option>
                <option value="VN" >Vietnam</option>
                <option value="WF" >Wallis and Futuna</option>
                <option value="EH" >Western Sahara</option>
                <option value="YE" >Yemen</option>
                <option value="CD" >Zaire (Democratic Republic of Congo)</option>
                <option value="ZM" >Zambia</option>
                <option value="ZW" >Zimbabwe</option>
                </select>
            </span>
        </div>
        <hr/>

        <button type="submit" class="btn btn-dark">
          Save Changes
        </button>
      </form>
    </div>
  );
}

export default Userprofile;
