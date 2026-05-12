import { useContext } from "react";
import { useParams } from "react-router-dom";
import products from "../data";
import { CartContext } from "../context/CartContext";

function ProductDetails() {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));

  const { addToCart } = useContext(CartContext);

  return (
    <div className="details">
      <h2>{product.name}</h2>
      <img src={product.image} alt="" />
      <p>₹{product.price}</p>

      <button onClick={() => addToCart(product)}>
        Add To Cart
      </button>
    </div>
  );
}

export default ProductDetails;