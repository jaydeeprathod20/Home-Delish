function cartController() {
  return {
    index(req, res) {
      res.render("customers/cart");
    },
    update(req, res) {
      // let cart={
      //   items:{pizzaId:{item:pizzaObject,qty:0},
      // },
      // totalQty:0,
      // totalPrice:0
      // }

      //for first time vreating cart and adding basic object structure
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }
      let cart = req.session.cart;
      // console.log(req.body);
      //Check if item does not exist in cart
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }
      return res.json({ totalQty: req.session.cart.totalQty });
    },
    // remove(req, res) {
    //   let cart = req.session.cart;
    //   let itemId = req.params.id;

    //   if (cart.items[itemId]) {
    //     // reduce the totalQty and totalPrice
    //     cart.totalQty -= cart.items[itemId].qty;
    //     cart.totalPrice -=
    //       cart.items[itemId].item.price * cart.items[itemId].qty;

    //     // delete the item from the items object
    //     delete cart.items[itemId];

    //     // return the updated cart
    //     return res.json({ cart });
    //   } else {
    //     return res.status(400).json({ message: "Item not found in cart" });
    //   }
    // },
  };
}
module.exports = cartController;
