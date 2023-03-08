import category from "./category";
import name from "./name";
import price from "./price";
import rate from "./rate";
import calories from "./calories";
import type from "./type";
import discount from "./discount";
import resturant from "./resturant";

export default async function queriesCollection(req) {
  let queriesArr = [];
  let queriesObj = {};

  if (type(req)) {
    queriesArr.push(type(req));
    queriesObj[Object.keys(type(req))[0]] =
      type(req)[Object.keys(type(req))[0]];
  }

  if (discount(req)) {
    queriesArr.push(discount(req));
    queriesObj[Object.keys(discount(req))[0]] =
      discount(req)[Object.keys(discount(req))[0]];
  }
  if (category(req) && (await category(req))) {
    let q = await category(req);
    queriesArr.push(q);
    queriesObj[Object.keys(q)[0]] = q[Object.keys(q)[0]];
  }
  if (name(req)) {
    queriesArr.push(name(req));
    queriesObj[Object.keys(name(req))[0]] =
      name(req)[Object.keys(name(req))[0]];
  }
  if (price(req)) {
    queriesArr.push(price(req));
    queriesObj[Object.keys(price(req))[0]] =
      price(req)[Object.keys(price(req))[0]];
  }
  if (calories(req)) {
    queriesArr.push(calories(req));
    queriesObj[Object.keys(calories(req))[0]] =
      calories(req)[Object.keys(calories(req))[0]];
  }
  if (rate(req)) {
    queriesArr.push(rate(req));
    queriesObj[Object.keys(rate(req))[0]] =
      rate(req)[Object.keys(rate(req))[0]];
  }
  if (resturant(req)) {
    queriesArr.push(resturant(req));
    queriesObj[Object.keys(resturant(req))[0]] =
      resturant(req)[Object.keys(resturant(req))[0]];
  }

  return { queriesArr, queriesObj };
}
