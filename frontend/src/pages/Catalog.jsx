import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Search, ShoppingCart, Star, SlidersHorizontal, Tag } from 'lucide-react';
import { API_URL } from '../config';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [toast, setToast] = useState({ show: false, message: '' });

  const categories = ['All', 'Electronics', 'Shoes', 'Fitness & Outdoors', 'Accessories'];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (search) queryParams.append('search', search);
      if (category && category !== 'All') queryParams.append('category', category);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      if (sort) queryParams.append('sort', sort);

      const res = await fetch(`${API_URL}/products?${queryParams.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setProducts(data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, minPrice, maxPrice, sort]);

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    const result = await addToCart(productId, 1);
    if (result && result.success) {
      showToast('Item added to cart!');
    } else {
      showToast(result?.message || 'Failed to add item.');
    }
  };

  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      
      {toast.show && (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--bg-surface)', border: '1px solid var(--border-focus)', padding: '1rem 1.5rem', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-lg)', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{toast.message}</span>
        </div>
      )}

      <div style={{ marginBottom: '2.5rem', background: 'linear-gradient(135deg, hsl(250, 60%, 15%) 0%, var(--bg-surface) 100%)', borderRadius: 'var(--radius-lg)', padding: '3rem 2.5rem', border: '1px solid var(--border-subtle)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.5rem' }}>Elevate Your Vibe.</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px' }}>Discover our curated list of premium essentials, tech gadgets, and designer gear.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        
        <aside className="card" style={{ height: 'fit-content', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '90px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.8rem' }}>
            <SlidersHorizontal size={18} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filters</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Search</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="input-field"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
              />
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</label>
            <select
              className="input-field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Price Range</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="number"
                className="input-field"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span style={{ color: 'var(--text-muted)' }}>-</span>
              <input
                type="number"
                className="input-field"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Sort By</label>
            <select
              className="input-field"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest Arrival</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </aside>

        <main>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', color: 'var(--text-secondary)' }}>
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)', color: 'var(--text-secondary)', gap: '0.5rem' }}>
              <h3>No products found</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {products.map(prod => (
                <Link to={`/products/${prod._id}`} key={prod._id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                  
                  <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                    />
                    {prod.featured && (
                      <span style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        ★ Featured
                      </span>
                    )}
                    {prod.discount > 0 && (
                      <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--accent-danger)', fontSize: '0.75rem', fontWeight: 700, padding: '0.3rem 0.6rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <Tag size={12} /> -{prod.discount}% Off
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1, gap: '0.6rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>{prod.category}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, height: '2.6em', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{prod.name}</h4>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <Star size={14} fill="currentColor" color="var(--accent-warning)" />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{prod.rating}</span>
                      <span>({prod.reviewsCount} reviews)</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>${prod.price.toFixed(2)}</span>
                        {prod.countInStock === 0 && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent-danger)', fontWeight: 600 }}>Out of Stock</span>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCart(prod._id, e)}
                        className="btn btn-primary"
                        style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)' }}
                        disabled={prod.countInStock === 0}
                      >
                        <ShoppingCart size={16} />
                      </button>
                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Catalog;
