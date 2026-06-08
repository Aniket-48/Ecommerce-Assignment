import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingCart, Star, ArrowLeft, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { API_URL } from '../config';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const [toast, setToast] = useState({ show: false, message: '' });

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setProduct(data.product);
          setRelated(data.relatedProducts || []);
        } else {
          console.error('Failed to load product details');
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    setQty(1);
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    const result = await addToCart(product._id, qty);
    if (result && result.success) {
      showToast(`${qty} item(s) added to cart!`);
    } else {
      showToast(result?.message || 'Failed to add item.');
    }
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh', color: 'var(--text-secondary)' }}>
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 0' }}>
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-secondary" style={{ marginTop: '1.5rem' }}>
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      
      {toast.show && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-focus)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)', zIndex: 1000 }}>
          <span>{toast.message}</span>
        </div>
      )}

      <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ marginBottom: '2rem', padding: '0.6rem 1rem' }}>
        <ArrowLeft size={16} /> Back
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
        
        <div>
          <div style={{ width: '100%', height: '450px', background: '#000', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '1px' }}>{product.category}</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.2rem', lineHeight: 1.2 }}>{product.name}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
            <Star size={16} fill="currentColor" color="var(--accent-warning)" />
            <span style={{ fontWeight: 600 }}>{product.rating}</span>
            <span style={{ color: 'var(--text-muted)' }}>({product.reviewsCount} verified reviews)</span>
          </div>

          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${product.price.toFixed(2)}
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{product.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Availability: {product.countInStock > 0 ? (
                <span style={{ color: 'var(--accent-success)', fontWeight: 600 }}>{product.countInStock} items in stock</span>
              ) : (
                <span style={{ color: 'var(--accent-danger)', fontWeight: 600 }}>Out of Stock</span>
              )}
            </span>
          </div>

          {product.countInStock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>-</button>
                <span style={{ width: '40px', textAlign: 'center', fontWeight: 'bold' }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.countInStock, q + 1))} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', width: '40px', height: '40px', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 'bold' }}>+</button>
              </div>

              <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, padding: '0.9rem' }}>
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', textAlign: 'center' }}>
              <Truck size={20} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Free Delivery</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', textAlign: 'center' }}>
              <RefreshCw size={20} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>30 Days Return</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', textAlign: 'center' }}>
              <ShieldCheck size={20} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Secure Checkout</span>
            </div>
          </div>

        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>Related Products</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {related.map(prod => (
              <Link to={`/products/${prod._id}`} key={prod._id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                <div style={{ height: '180px', width: '100%', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.4rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, height: '2.6em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{prod.name}</h4>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 'auto' }}>${prod.price.toFixed(2)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetails;
