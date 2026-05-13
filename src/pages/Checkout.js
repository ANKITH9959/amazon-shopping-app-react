import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();

  const product = location.state?.product;

  const [address, setAddress] = useState("");
  const [paymentType, setPaymentType] = useState("card");
  const [cardNumber, setCardNumber] = useState("");

  if (!product) {
    return <h2>No product selected</h2>;
  }

  const total = product.price;
  const discount = paymentType === "card" ? 200 : 0;
  const deliveryCharge = paymentType === "cash" ? 50 : 0;

  const finalTotal = total - discount + deliveryCharge;

  const normalizePhone = (rawPhone) => {
    if (!rawPhone) return "";
    const digits = rawPhone.replace(/\D/g, "");
    if (digits.length === 10) return `+91${digits}`;
    if (digits.length === 11 && digits.startsWith("0")) return `+91${digits.slice(1)}`;
    if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
    if (digits.startsWith("+") && digits.length >= 11) return rawPhone;
    return "";
  };

  const placeOrder = async () => {
    try {
      if (!address) {
        alert("Enter address");
        return;
      }

      const raw = localStorage.getItem("userPhone") || "";
      const phone = normalizePhone(raw);

      if (!phone) {
        alert("Enter a valid phone number in the login screen before placing order");
        return;
      }

      const res = await axios.post("http://localhost:5000/send-sms", {
        phone,
        product: product.title || product.name,
        price: finalTotal,
      });

      console.log("BACKEND RESPONSE:", res.data);

      if (res.data.success) {
        const message = res.data.mock
          ? "✅ Order placed & SMS sent (MOCK - check backend logs) 📱"
          : "✅ Order placed & SMS sent 📱";
        alert(message);
        navigate("/track");
      } else {
        alert(`❌ SMS failed: ${res.data.error || res.data.message || "unknown error"}`);
      }

    } catch (error) {
      const backendError = error.response?.data?.error || error.response?.data?.message;
      console.log("ERROR:", error.response?.data || error.message);
      alert(`❌ Server error / SMS failed${backendError ? `: ${backendError}` : ""}`);
    }
  };

  return (
    <div className="box">
      <h2>Product</h2>

      <img src={product.image} alt="product" style={{ width: "150px" }} />

      <h3>{product.title || product.name}</h3>
      <p>Price: ₹{product.price}</p>

      <hr />

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
        Card
      </label>

      <label>
        <input
          type="radio"
          value="cash"
          checked={paymentType === "cash"}
          onChange={(e) => setPaymentType(e.target.value)}
        />
        Cash
      </label>

      {paymentType === "card" && (
        <input
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      )}

      <h2>Total: ₹{finalTotal}</h2>

      <button onClick={placeOrder}>
        Place Order
      </button>
    </div>
  );
}

export default Checkout;