import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  addToCart,
  removeFromCart,
  updateQuantity,
  applyDiscount,
  undo,
  redo,
} from "./cartSlice";

function ShoppingCart() {
  const dispatch = useDispatch();
  const { products, items, discount, status, error, history, future } =
    useSelector((state) => state.cart);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const calculateTotal = () => {
    const subtotal = items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const discountAmount = subtotal * (discount / 100);
    return subtotal - discountAmount;
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Shopping Cart</h1>
      <div>
        <h2>Products</h2>
        {products.map((product) => (
          <div key={product.id}>
            {product.name} - ${product.price}
            <button onClick={() => dispatch(addToCart(product))}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <div>
        <h2>Cart</h2>
        {items.map((item) => (
          <div key={item.id}>
            {item.name} - ${item.price} x
            <input
              type="number"
              value={item.quantity}
              onChange={(e) =>
                dispatch(
                  updateQuantity({
                    id: item.id,
                    quantity: parseInt(e.target.value),
                  })
                )
              }
              min="1"
            />
            <button onClick={() => dispatch(removeFromCart(item.id))}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <div>
        <h3>Total: ${calculateTotal().toFixed(2)}</h3>
        <input
          type="number"
          placeholder="Discount %"
          onChange={(e) => dispatch(applyDiscount(parseFloat(e.target.value)))}
        />
      </div>
      <div>
        <button
          onClick={() => dispatch(undo())}
          disabled={history.length === 0}
        >
          Undo
        </button>
        <button onClick={() => dispatch(redo())} disabled={future.length === 0}>
          Redo
        </button>
      </div>
    </div>
  );
}

export default ShoppingCart;
