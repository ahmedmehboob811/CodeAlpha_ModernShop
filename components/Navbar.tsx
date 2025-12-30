import React from 'react';
import { ShoppingCart, LogOut, Package, User as UserIcon, Menu } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

interface NavbarProps {
    currentPage: string;
    onNavigate: (page: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { user, cart, logout } = useStore();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-2xl font-bold text-indigo-600">ModernShop</span>
          </div>

          <div className="flex items-center space-x-6">
            <button 
                onClick={() => onNavigate('home')} 
                className={`${currentPage === 'home' ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
            >
                Products
            </button>
            
            {user && (
                <button 
                    onClick={() => onNavigate('orders')} 
                    className={`${currentPage === 'orders' ? 'text-indigo-600 font-medium' : 'text-gray-500 hover:text-gray-900'} transition-colors flex items-center gap-1`}
                >
                    {user.role === UserRole.ADMIN ? 'Admin Dashboard' : 'My Orders'}
                </button>
            )}

            <button 
                onClick={() => onNavigate('cart')}
                className="relative p-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                        {cartItemCount}
                    </span>
                )}
            </button>

            {user ? (
                <div className="flex items-center gap-4 border-l pl-4 border-gray-200">
                    <div className="text-sm text-right hidden md:block">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-gray-500 text-xs">{user.role}</div>
                    </div>
                    <button 
                        onClick={() => { logout(); onNavigate('login'); }}
                        className="p-2 text-gray-400 hover:text-gray-600"
                        title="Sign Out"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
                    <button 
                        onClick={() => onNavigate('login')}
                        className="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => onNavigate('register')}
                        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm"
                    >
                        Register
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;