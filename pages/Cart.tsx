import React from 'react';
import { useStore } from '../context/StoreContext';
import { Trash2, Plus, Minus, ArrowRight } from 'lucide-react';

interface CartProps {
    onNavigate: (page: string) => void;
}

const Cart: React.FC<CartProps> = ({ onNavigate }) => {
  const { cart, removeFromCart, updateQuantity, user, isLoading } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleCheckout = () => {
      if (!user) {
          onNavigate('login');
          return;
      }
      onNavigate('checkout');
  };

  if (cart.length === 0) {
      return (
          <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Your cart is empty</h2>
              <p className="mt-4 text-gray-500">Looks like you haven't added anything to your cart yet.</p>
              <button 
                onClick={() => onNavigate('home')}
                className="mt-8 inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
              >
                  Start Shopping
              </button>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
        {/* Cart Items */}
        <div className="lg:col-span-7">
            <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {cart.map((item) => (
                    <li key={item.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                            <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover object-center"
                            />
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                            <div>
                                <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>{item.name}</h3>
                                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                                <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                            </div>
                            <div className="flex flex-1 items-end justify-between text-sm">
                                <div className="flex items-center border border-gray-300 rounded-md">
                                    <button 
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="px-2 font-medium text-gray-900">{item.quantity}</span>
                                    <button 
                                        className="p-1 text-gray-500 hover:text-gray-700"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeFromCart(item.id)}
                                    className="font-medium text-red-600 hover:text-red-500 flex items-center"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Remove
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        {/* Order Summary */}
        <div className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

            <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Shipping estimate</p>
                    <p className="text-sm font-medium text-gray-900">$0.00</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-600">Tax estimate</p>
                    <p className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</p>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                    <p className="text-base font-bold text-gray-900">Order total</p>
                    <p className="text-base font-bold text-gray-900">${total.toFixed(2)}</p>
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    Proceed to Checkout <ArrowRight className="ml-2 w-5 h-5" />
                </button>
                {!user && (
                    <p className="mt-3 text-xs text-center text-gray-500">
                        You will be asked to sign in to complete your purchase.
                    </p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;