import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, LogIn, User, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCartQuantity = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <header className="glass" style={{ position: 'sticky', top: 0, zIndex: 100, borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '70px' }}>
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.5px', background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-primary) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          VIBE STORE
        </Link>

        <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-secondary)', fontWeight: 500, transition: 'color 0.2s' }}>
            Catalog
          </Link>

          {user ? (
            <>
              <Link to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <ClipboardList size={18} />
                <span>Orders</span>
              </Link>
              
              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', position: 'relative' }}>
                <ShoppingCart size={18} />
                <span>Cart</span>
                {totalCartQuantity > 0 && (
                  <span style={{ position: 'absolute', top: '-8px', right: '-12px', background: 'var(--accent-primary)', color: 'white', fontSize: '0.7rem', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                    {totalCartQuantity}
                  </span>
                )}
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.9rem' }}>
                  <User size={16} />
                  {user.name}
                </span>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--accent-danger)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                <LogIn size={18} />
                <span>Login</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
