import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token, user } = useAuth();

  const baseUrl = `${API_URL}/cart`;

  const fetchCart = async () => {
    if (!token) {
      setCart(null);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(baseUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
      }
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [token, user]);

  const updateCart = async (items) => {
    if (!token) return;
    try {
      const res = await fetch(baseUrl, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
      const data = await res.json();
      if (res.ok) {
        setCart(data);
        return { success: true };
      }
      return { success: false, message: data.message };
    } catch (err) {
      console.error('Error updating cart:', err);
      return { success: false, message: 'Cart update failed' };
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      return { success: false, message: 'Please login to add items to cart.' };
    }
    if (!cart) return { success: false, message: 'Cart is initializing...' };
    
    const existingItem = cart.items.find(item => item.productId === productId);
    let newItems = [];
    if (existingItem) {
      newItems = cart.items.map(item => 
        item.productId === productId 
          ? { productId, quantity: item.quantity + quantity } 
          : { productId: item.productId, quantity: item.quantity }
      );
    } else {
      newItems = [...cart.items.map(item => ({ productId: item.productId, quantity: item.quantity })), { productId, quantity }];
    }
    return await updateCart(newItems);
  };

  const removeFromCart = async (productId) => {
    if (!cart) return;
    const newItems = cart.items
      .filter(item => item.productId !== productId)
      .map(item => ({ productId: item.productId, quantity: item.quantity }));
    return await updateCart(newItems);
  };

  const clearCart = () => {
    setCart({ ...cart, items: [] });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateCart, removeFromCart, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
