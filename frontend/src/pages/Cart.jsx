import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, loading, updateCart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const handleQtyChange = async (productId, currentQty, amount) => {
    const newQty = currentQty + amount;
    if (newQty <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    const newItems = cart.items.map(item => 
      item.productId === productId 
        ? { productId, quantity: newQty } 
        : { productId: item.productId, quantity: item.quantity }
    );
    await updateCart(newItems);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-secondary)' }}>
        Loading your cart...
      </div>
    );
  }

  const items = cart?.items || [];
  const totalPrice = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
          <ShoppingBag size={48} />
        </div>
        <div>
          <h2>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Looks like you haven't added anything to your cart yet.</p>
        </div>
        <Link to="/" className="btn btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Shopping Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {items.map(item => (
            <div key={item.productId} className="card" style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', padding: '1rem' }}>
              
              <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <Link to={`/products/${item.productId}`}>
                    {item.product.name}
                  </Link>
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {item.quantity} × ${item.product.price.toFixed(2)}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-base)', flexShrink: 0 }}>
                <button onClick={() => handleQtyChange(item.productId, item.quantity, -1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}>-</button>
                <span style={{ width: '32px', textAlign: 'center', fontWeight: 'bold', fontSize: '0.9rem' }}>{item.quantity}</span>
                <button onClick={() => handleQtyChange(item.productId, item.quantity, 1)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }} disabled={item.quantity >= item.product.countInStock}>+</button>
              </div>

              <div style={{ fontSize: '1.1rem', fontWeight: 800, width: '90px', textAlign: 'right', flexShrink: 0 }}>
                ${(item.product.price * item.quantity).toFixed(2)}
              </div>

              <button onClick={() => removeFromCart(item.productId)} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', padding: '0.5rem', flexShrink: 0 }}>
                <Trash2 size={18} />
              </button>

            </div>
          ))}
        </div>

        <aside className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>${totalPrice.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
              <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', padding: '0.9rem' }}>
            Proceed to Checkout <ArrowRight size={18} />
          </button>
        </aside>

      </div>
    </div>
  );
};

export default Cart;
