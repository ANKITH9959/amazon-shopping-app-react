import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />

      <h3>{product.name}</h3>

      <p className="rating">⭐ {product.rating}</p>

      <p>
        <b>₹{product.price}</b>{" "}
        <span className="old-price">₹{product.originalPrice}</span>
      </p>

      <p className="discount">{product.discount}</p>

      <Link to={`/product/${product.id}`}>
        <button>View Product</button>
      </Link>
    </div>
  );
}

export default ProductCard;