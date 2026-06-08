import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ClipboardList, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-secondary)' }}>
        Loading order history...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem', textAlign: 'center' }}>
        <div style={{ background: 'var(--bg-surface)', padding: '2rem', borderRadius: '50%', color: 'var(--text-muted)' }}>
          <ClipboardList size={48} />
        </div>
        <div>
          <h2>No Orders Found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>You haven't placed any orders yet.</p>
        </div>
        <Link to="/" className="btn btn-primary">
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Order History</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {orders.map(order => (
          <div key={order._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORDER ID:</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, fontFamily: 'monospace' }}>{order._id}</div>
              </div>
              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  <Calendar size={16} />
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span style={{ background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)', fontSize: '0.8rem', fontWeight: 700, padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'start' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', background: '#000', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h5 style={{ fontSize: '0.95rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h5>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Quantity: {item.quantity}</span>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="card" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    <MapPin size={16} color="var(--accent-primary)" />
                    <span>Delivery Address</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    <div>{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.street}</div>
                    <div>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                    <CreditCard size={16} color="var(--accent-primary)" />
                    <span>Payment Method</span>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>{order.paymentMethod}</div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 800 }}>
                  <span>Total Paid</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>

              </div>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
