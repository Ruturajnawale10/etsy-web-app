import { equal } from "assert";
import chai from "chai";
import { expect } from "chai";
import { should } from "chai";
import pkg from "chai-http";
import { assert } from "console";
import { Cookie } from "express-session";
const chaiHttp = pkg;
import service from "../index.js";

chai.use(chaiHttp);

describe("/Profile details authenticity", () => {
  it("to get the correct profile details", async () => {
    const res = await chai
      .request(service)
      .get("/profile")
      .set("Cookie", "username=admin");
    equal(res.status, 200);
    equal(res.body[0].name, "Ruturaj Nawale");
    equal(res.body[0].city, "San Jose");
    equal(res.body[0].country, "India");
  });
});

describe("/Check if user has created the shop", () => {
  it("to check if user created shop", (done) => {
    chai
      .request(service)
      .get("/shopexists")
      .set("Cookie", "username=xyzpqr")
      .end((err, res) => {
        equal(res.status, 200);
        equal(res.text, "shopname not registered");
        done();
      });
  });
});

describe("/Check shop name availibility API", () => {
  it("to get correct result of shop availibility", async () => {
    const res = await chai
      .request(service)
      .get("/checkavailibility")
      .query({ shopName: "Sony" });
    equal(res.text, "not available");
  });
});

describe("/Check if favourite item", () => {
  it("to check if an item is correctly categorized in favourites", async () => {
    const res = await chai
      .request(service)
      .get("/checkfavourite")
      .query({ item_name: "ps4" })
      .set("Cookie", "username=admin");
    equal(res.text, "IS FAVOURITE");
  });
  it("to check if an item is correctly not included in favourites", async () => {
    const res = await chai
      .request(service)
      .get("/checkfavourite")
      .query({ item_name: "Bicycle" })
      .set("Cookie", "username=admin");
    equal(res.text, "NOT FAVOURITE");
  });
});

describe("/Check item details", () => {
  it("to check item details", async () => {
    const res = await chai
      .request(service)
      .get("/itemdetails")
      .query({ item_name: "Bicycle" });
    equal(res.body[0].price, 300);
    equal(res.body[0].shop_name, "Sony_tusa");
  });
});
