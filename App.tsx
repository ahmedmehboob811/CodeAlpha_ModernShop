import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Orders from './pages/Orders';
import Checkout from './pages/Checkout';
import { CheckCircle } from 'lucide-react';

// Simple Route Wrapper since we cannot easily use BrowserRouter in all envs without config
const AppRoutes = () => {
    const [page, setPage] = useState('home');
    const [params, setParams] = useState<any>({});

    const navigate = (newPage: string, newParams?: any) => {
        setPage(newPage);
        if (newParams) setParams(newParams);
        window.scrollTo(0, 0);
    };

    const renderPage = () => {
        switch (page) {
            case 'home':
                return <ProductList onNavigate={navigate} />;
            case 'product':
                return <ProductDetail productId={params.id} onNavigate={navigate} />;
            case 'cart':
                return <Cart onNavigate={navigate} />;
            case 'checkout':
                return <Checkout onNavigate={navigate} />;
            case 'login':
                return <Login onNavigate={navigate} />;
            case 'register':
                return <Register onNavigate={navigate} />;
            case 'orders':
                return <Orders />;
            case 'success':
                return (
                    <div className="max-w-md mx-auto mt-20 p-6 text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your purchase. You can track your order status in your dashboard.</p>
                        <button 
                            onClick={() => navigate('orders')}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-md font-medium hover:bg-indigo-700 transition-colors"
                        >
                            View Order
                        </button>
                        <button 
                            onClick={() => navigate('home')}
                            className="block w-full mt-4 text-indigo-600 text-sm hover:underline"
                        >
                            Continue Shopping
                        </button>
                    </div>
                );
            default:
                return <ProductList onNavigate={navigate} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar currentPage={page} onNavigate={navigate} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-400 text-sm">
                        &copy; 2024 ModernShop Simulation. Built with React & Tailwind.
                    </p>
                </div>
            </footer>
        </div>
    );
};

const App = () => {
  return (
    <StoreProvider>
        <AppRoutes />
    </StoreProvider>
  );
};

export default App;