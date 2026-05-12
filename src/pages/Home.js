import { useState } from "react";
import { useNavigate } from "react-router-dom";
import products from "../data";

function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
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

        <button className="login-btn">Login</button>
      </div>

      <div className="grid">
        {filteredProducts.map((item) => (
          <div className="card" key={item.id}>
            <img src={item.image} alt="" />
            <h3>{item.name}</h3>
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