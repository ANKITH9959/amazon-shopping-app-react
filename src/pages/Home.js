import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);

  // API call
  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.log("API Error:", err);
      });
  }, []);

  const filteredProducts = products.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <h2 className="logo">amazon</h2>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {localStorage.getItem("isLoggedIn") ? (
  <div className="user-box">
    <span>
      {localStorage.getItem("userEmail")}
    </span>

    <button
      className="login-btn"
      onClick={() => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");
        window.location.reload();
      }}
    >
      Logout
    </button>
  </div>
) : (
  <button
    className="login-btn"
    onClick={() => navigate("/login")}
  >
    Login
  </button>
)}
      </div>

      <div className="grid">
        {filteredProducts.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt="" />
            <h3>{item.title}</h3>
            <p>₹{item.price}</p>

            <button
              onClick={() =>
                navigate("/checkout", {
                  state: { product: item }
                })
              }
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;