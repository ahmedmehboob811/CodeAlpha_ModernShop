import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, CartItem, Order, UserRole, ShippingAddress } from '../types';
import * as api from '../services/mockDb';

interface StoreContextType {
  user: User | null;
  products: Product[];
  cart: CartItem[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (shippingAddress: ShippingAddress) => Promise<boolean>;
  orders: Order[];
  fetchUserOrders: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      
      // Check session
      const storedUser = localStorage.getItem('shop_session_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      // Load products
      const prodRes = await api.fetchProducts();
      if (prodRes.success && prodRes.data) {
        setProducts(prodRes.data);
      }
      
      // Load cart
      const storedCart = localStorage.getItem('shop_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }

      setIsLoading(false);
    };
    loadInitialData();
  }, []);

  // Persist Cart
  useEffect(() => {
    localStorage.setItem('shop_cart', JSON.stringify(cart));
  }, [cart]);

  // Auth Methods
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const res = await api.loginUser(email, password);
    setIsLoading(false);
    if (res.success && res.data) {
      setUser(res.data.user);
      localStorage.setItem('shop_session_user', JSON.stringify(res.data.user));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    const res = await api.registerUser(name, email, password);
    setIsLoading(false);
    if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('shop_session_user', JSON.stringify(res.data.user));
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
    setOrders([]);
    localStorage.removeItem('shop_session_user');
    localStorage.removeItem('shop_cart');
  };

  // Cart Methods
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  // Order Methods
  const placeOrder = async (shippingAddress: ShippingAddress) => {
      if (!user) return false;
      const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setIsLoading(true);
      const res = await api.createOrder(user.id, cart, total, shippingAddress);
      setIsLoading(false);
      if (res.success) {
          clearCart();
          await fetchUserOrders();
          return true;
      }
      return false;
  };

  const fetchUserOrders = async () => {
      if (!user) return;
      setIsLoading(true);
      const res = await api.fetchOrders(user.id, user.role);
      setIsLoading(false);
      if (res.success && res.data) {
          setOrders(res.data);
      }
  };

  return (
    <StoreContext.Provider value={{
      user, products, cart, isLoading,
      login, register, logout,
      addToCart, removeFromCart, updateQuantity, clearCart,
      placeOrder, orders, fetchUserOrders
    }}>
      {children}
    </StoreContext.Provider>
  );
};