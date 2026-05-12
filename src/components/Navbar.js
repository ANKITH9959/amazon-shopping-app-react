import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="nav">
      <h2>Amazon Clone</h2>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>
    </div>
  );
}

export default Navbar;