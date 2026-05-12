import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;

  const [address, setAddress] = useState("");
  const [paymentType, setPaymentType] = useState("card");
  const [cardType, setCardType] = useState("Visa");
  const [cardNumber, setCardNumber] = useState("");

  if (!product) {
    return <h2>No product selected</h2>;
  }

  let total = product.price;
  let discount = 0;
  let deliveryCharge = 0;

  if (paymentType === "card") {
    discount = 200;
  }

  if (paymentType === "cash") {
    deliveryCharge = 50;
  }

  const finalTotal = total - discount + deliveryCharge;

  const placeOrder = () => {
    if (!address) {
      alert("Enter delivery address");
      return;
    }

    if (paymentType === "card" && !cardNumber) {
      alert("Enter card number");
      return;
    }

    navigate("/track");
  };

  return (
    <div className="box">
      <h2>Product </h2>

      {/* Product */}
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "150px" }}
      />
      <h3>{product.name}</h3>
      <p>Price: ₹{product.price}</p>

      <hr />

      {/* Address */}
      <input
        placeholder="Delivery Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <h3>Payment Method</h3>

      <label>
        <input
          type="radio"
          value="card"
          checked={paymentType === "card"}
          onChange={(e) => setPaymentType(e.target.value)}
        />
        Card Payment
      </label>

      <label>
        <input
          type="radio"
          value="cash"
          checked={paymentType === "cash"}
          onChange={(e) => setPaymentType(e.target.value)}
        />
        Cash on Delivery
      </label>

      {/* Card options */}
      {paymentType === "card" && (
        <>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value)}
          >
            <option>SBI</option>
            <option>ICIC</option>
            <option>RuPay</option>
            <option>Axies</option>
          </select>

          <input
            placeholder="Card Number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />

          <p style={{ color: "green" }}>
            Card Discount: -₹{discount}
          </p>
        </>
      )}

      {paymentType === "cash" && (
        <p style={{ color: "red" }}>
          Delivery Charges: +₹{deliveryCharge}
        </p>
      )}

      <h2>Total: ₹{finalTotal}</h2>

      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Checkout;