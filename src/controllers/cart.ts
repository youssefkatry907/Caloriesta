import { resTypes } from "../helpers/responseTypes";
import { create, get } from "../modules/Cart/repo";
import Cart, { ICart } from "../modules/Cart/model";
import Product from "../modules/Meal/model";
import Coupon from "../modules/Coupon/model";
import { Request, Response } from "express";

export async function getUserCart(req: Request, res: Response) {
  const cart = await Cart.findOne({
    user: req["user"],
    isLocked: false,
  }).populate({
    path: "items.product resturant",
    select:
      "name image type avatar fullName calories quantity price finalPrice discount",
  });

  if (cart) {
    res.status(200).json(
      resTypes(200, {
        cart: {
          _id: cart._id,
          user: cart.user,
          resturant: cart.resturant,
          items: cart.items,
          total: cart.total,
          isLocked: cart.isLocked,
          financial: cart.financial,
        },
      })
    );
  } else {
    const result = await create({
      user: req["user"],
    });
    if (result.success) {
      res.status(201).json(
        resTypes(201, {
          cart: {
            _id: result.record._id,
            user: result.record.user,
            isLocked: result.record.isLocked,
            items: result.record.items,
            financial: cart.financial,
          },
        })
      );
    } else {
      console.log(result.errors);
      res.status(400).json(resTypes(400, { errors: result.errors }));
    }
  }
}

export async function addItem(req: Request, res: Response) {
  /**
   * {
   * product: ObjectId
   * quantity: number
   * option: objectId if exist
   * addon: objectId if exist
   * }
   */
  const cart = await get(req.params.id);

  if (cart.success) {
    // check if products exist

    const product = await Product.findOne({
      _id: req.body.product,
    });

    if (product) {
      //console.log("Product exist");

      /**
       * check if item exist
       * if exist check if same option
       * if same option update item
       * if not same add as new item
       */
     // console.log("lol20000",cart.record)
      if (
        (cart.record.items.length &&
          product.resturant.toString() ==
          cart.record.resturant.toString()) ||
        !cart.record.items.length
      ) {
        let targetProducts = cart.record.items.filter(
          (item: any) =>
            item.product._id?.toString() == req.body.product.toString()
        );
        if (targetProducts.length) {
          await handleExistItem(req, res, cart, targetProducts, product);
        } else {
          await saveNewItem(req, res, cart, product);
        }
      } else {
        res.status(409).json(
          resTypes(409, {
            message: `Can't add item from another resturant`,
          })
        );
      }
    } else {
      res.status(404).json(
        resTypes(404, {
          message: `prodcut not found`,
        })
      );
    }
  } else {
    res.status(404).json(
      resTypes(404, {
        message: `cart not found`,
      })
    );
  }
}

export async function removeItem(req: Request, res: Response) {
  const cart = await get(req.params.id);

  if (cart.success) {
    // check if product exist

    let target = cart.record.items.find(
      (record: any) => record._id?.toString() == req.body.itemId
    );

    if (target) {
      cart.record.items = cart.record.items.filter(
        (item: any) => item._id.toString() != req.body.itemId
      );
      cart.record.total = cart.record.items.reduce(
        (total = 0, item: any) => (total += item.total),
        0
      );

      await cart.record.save();

      res.status(200).json(
        resTypes(200, {
          cart: cart.record,
          message: `item has been removed from cart`,
        })
      );
    } else {
      res.status(404).json(
        resTypes(404, {
          message: `item not found in cart`,
        })
      );
    }
  } else {
    res.status(404).json(
      resTypes(404, {
        message: `cart not found`,
      })
    );
  }
}

export async function flushUserCart(req: Request, res: Response) {
  const cart = await get(req.params.id);

  if (cart.success) {
    cart.record.items = [];
    cart.record.coupon = null;
    cart.record.resturant = null;
    cart.record.total = 0;
    cart.record.financial = {
      paymentFees: 0,
      deliveryFees: 0,
      couponDiscount: 0,
      totalItemsCost: 0,
    };

    await cart.record.save();

    res.json(
      resTypes(200, {
        cart: cart.record,
        message: "Cart has been flushed",
      })
    );
  } else {
    res.status(404).json(
      resTypes(404, {
        message: `cart not found`,
      })
    );
  }
}

async function saveNewItem(req, res, cart, product) {
  let finalQuanttiy = req.body.quantity ?? 1;
  let finalPrice =
    req.body.option &&
      product.options?.find(
        (option: any) => option._id.toString() == req.body.option
      )
      ? Number(
        product.options.find(
          (option: any) => option._id.toString() == req.body.option
        ).price
      )
      : Number(product.finalPrice);

  let finalAddons = [];

  if (req.body.addons && req.body.addons.length) {
    const addons = product.addons?.filter((addon: any) =>
      req.body.addons.includes(addon._id.toString())
    );

    finalPrice += addons.reduce(
      (total = 0, addon: any) => (total += addon.price),
      0
    );

    finalAddons = addons;
  }

  let newCartItem = {
    product: product._id,
    quantity: finalQuanttiy,
    price: finalPrice,
    total: Number(finalQuanttiy) * finalPrice,
    resturant: product.resturant,
  };

  if (req.body.option) {
    const option = product.options.find(
      (option: any) => option._id.toString() == req.body.option
    );
    newCartItem["option"] = {
      optionId: option._id,
      name: option.name,
      price: option.price,
    };
  }

  if (finalAddons && finalAddons.length) newCartItem["addons"] = finalAddons;

  cart.record.resturant = product.resturant;
  cart.record.items.push(newCartItem);
  cart.record.items.find(
    (item: any) => item.product.toString() == product._id?.toString()
  ).product = {
    _id: product._id,
    name: product.name,
    image: product.image,
  };

  const cartAfterCalcs = await cartCalcs(cart.record);
  await cartAfterCalcs.save();

  const updatedCard = await get(cartAfterCalcs._id);

  res.status(201).json(
    resTypes(201, {
      cart: updatedCard,
      message: `item has been added to cart`,
    })
  );
}

async function handleExistItem(req, res, cart, targetProducts, product) {
  //  same item

  const targetProduct = getTargetItem(req, targetProducts);

  if (targetProduct) {
    let finalQuantity = Number(targetProduct.quantity) + 1;

    targetProduct.quantity = finalQuantity;
    targetProduct.total = Number(targetProduct.price) * finalQuantity;

    const cartAfterCalcs = await cartCalcs(cart.record);
    await cartAfterCalcs.save();

    res.status(200).json(
      resTypes(200, {
        cart: cartAfterCalcs,
        message: `item quantity has been updated`,
      })
    );
  } else {
    await saveNewItem(req, res, cart, product);
  }
}

function getTargetItem(req, targetProducts) {
  return req.body.option
    ? targetProducts.find(
      (pro: any) => pro.option?.optionId?.toString() == req.body.option
    )
    : targetProducts.find(
      (pro: any) =>
        pro.product?._id.toString() == req.body.product &&
        pro.option == undefined
    );
}

export async function updatItemQuantity(req: Request, res: Response) {
  const cart = await get(req.params.id);

  if (cart.success) {
    const item = cart.record.items.find(
      (item: any) => item._id == req.body.itemId
    );
    if (item) {
      let finalQuantity =
        req.body.quantity && req.body.quantity > 0
          ? Number(req.body.quantity)
          : Number(item.quantity) + 1;

      item.quantity = finalQuantity;
      item.total = Number(item.price) * finalQuantity;

      const cartAfterCalcs = await cartCalcs(cart.record);

      await cartAfterCalcs.save();
      res.json(
        resTypes(200, {
          message: "item has been updated",
          cart: cartAfterCalcs,
        })
      );
    } else res.status(404).json(resTypes(404));
  } else res.status(404).json(resTypes(404));
}

export async function validateCoupon(req: Request, res: Response) {
  const coupon = await Coupon.findOne({
    code: req.body.coupon,
  });


  const currentCart = await Cart.findOne({
    user: req["user"],
    isLocked: false,
  }).populate({
    path: "items.product",
    select: "name gallaries slug",
  });


  if (
    coupon &&
    coupon.isActive &&
    (new Date(coupon.endDate) > new Date()) &&
    (new Date(coupon.startDate) <= new Date()) &&
    (currentCart.total >= coupon["minOrder"])
  ) {
    if (!currentCart.coupon) {
      currentCart["coupon"] = coupon._id;
      coupon["count"] += 1;

      const cartAfterCalcs = await cartCalcs(currentCart);

      await coupon.save();
      await cartAfterCalcs.save();

      res.json(
        resTypes(200, {
          cart: cartAfterCalcs,
          message: "code is ok",
        })
      );
    } else {
      res.status(400).json(
        resTypes(400, {
          message: "this cart already have a coupon",
        })
      );
    }
  } else {
    res.status(400).json(
      resTypes(400, {
        message: "Coupon not valid",
      })
    );
  }
}

export async function updateItemQuantity(req: Request, res: Response) {
  /**
   * {
   * product: ObjectId
   * quantity: number
   * option: objectId if exist
   * addon: objectId if exist
   * }
   */
  const cart = await get(req.params.id);

  if (cart.success) {
    let targetProduct: any = cart.record.items.find(
      (item: any) => item._id.toString() == req.body.itemId.toString()
    );

    let finalQuantity = 1;

    if (
      req.body.type == "plus" &&
      targetProduct.product.quantity < targetProduct.quantity + 1
    ) {
      res.status(400).json(
        resTypes(400, {
          message: "Item has reached to maximum quantity",
        })
      );
    } else if (req.body.type == "plus" && 0 == targetProduct.quantity - 1) {
      res.status(400).json(
        resTypes(400, {
          message: "Item cann't be less than zero",
        })
      );
    } else {
      finalQuantity =
        req.body.type == "plus"
          ? targetProduct.quantity + 1
          : targetProduct.quantity - 1;

      targetProduct.quantity = finalQuantity;
      targetProduct.total = Number(targetProduct.price) * finalQuantity;

      const cartAfterCalcs = await cartCalcs(cart.record);
      await cartAfterCalcs.save();

      res.status(200).json(
        resTypes(200, {
          cart: cartAfterCalcs,
          message: `item has been updated`,
        })
      );
    }
  } else {
    res.status(404).json(
      resTypes(404, {
        message: `cart not found`,
      })
    );
  }
}

async function cartCalcs(cart: ICart) {
  cart.financial["taxFees"] = 0;
  cart.financial["paymentFees"] = 0;
  cart.financial["deliveryFees"] = 0;
  cart.financial["couponDiscount"] = 0;
  cart.financial["totalItemsCost"] = cart.items.reduce(
    (total: number = 0, item: any) => (total += Number(item.total)),
    0
  );

  if (cart.coupon) {
    const coupon = await Coupon.findOne({ _id: cart.coupon });

    const discountValue =
      coupon.discountType == "fixed"
        ? coupon.discount
        : (coupon.discount / cart.financial["totalItemsCost"]) * 100;

    cart.financial["couponDiscount"] = discountValue;
  }

  cart.total =
    Number(cart.financial["totalItemsCost"]) -
    Number(cart.financial["couponDiscount"]) +
    Number(cart.financial["deliveryFees"]) +
    Number(cart.financial["taxFees"]) +
    Number(cart.financial["paymentFees"]);

  return cart;
}
