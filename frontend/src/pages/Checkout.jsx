import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ClipboardCheck } from 'lucide-react';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const items = cart?.items || [];
  const totalAmount = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    setLoading(true);

    const formattedItems = items.map(item => ({
      productId: item.productId,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: formattedItems,
          shippingAddress: { fullName, street, city, postalCode },
          paymentMethod,
          totalAmount
        })
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        navigate('/orders');
      } else {
        setError(data.message || 'Order failed.');
      }
    } catch (err) {
      setError('Connection to backend failed.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>No items in checkout</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Go to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Checkout</h1>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid var(--accent-danger)', color: '#f87171', padding: '0.8rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', alignItems: 'start' }}>
        
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem' }}>Shipping Details</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Full Name</label>
            <input
              type="text"
              className="input-field"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Street Address</label>
            <input
              type="text"
              className="input-field"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              placeholder="e.g. 123 Main St"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>City</label>
              <input
                type="text"
                className="input-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. New York"
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Postal Code</label>
              <input
                type="text"
                className="input-field"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="e.g. 10001"
                required
              />
            </div>
          </div>

          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.5rem', marginTop: '1rem' }}>Payment Method</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {['Credit Card', 'Cash on Delivery', 'GPay'].map(method => (
              <label key={method} className="card" style={{ flex: 1, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', border: paymentMethod === method ? '2px solid var(--border-focus)' : '1px solid var(--border-subtle)', background: paymentMethod === method ? 'var(--bg-surface-hover)' : 'var(--bg-surface)' }}>
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={paymentMethod === method}
                  onChange={() => setPaymentMethod(method)}
                  style={{ cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{method}</span>
              </label>
            ))}
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>Items</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '240px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {items.map(item => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '200px' }}>
                    {item.product.name} <strong style={{ color: 'var(--text-primary)' }}>×{item.quantity}</strong>
                  </span>
                  <span style={{ fontWeight: 600 }}>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.15rem', fontWeight: 800 }}>
              <span>Total</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }} disabled={loading}>
              <ClipboardCheck size={18} /> {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Checkout;
