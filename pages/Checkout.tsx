import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';

interface CheckoutProps {
    onNavigate: (page: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onNavigate }) => {
    const { cart, placeOrder, isLoading, user } = useStore();
    const [shipping, setShipping] = useState({
        fullName: user?.name || '',
        address: '',
        city: '',
        zipCode: '',
        country: ''
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await placeOrder(shipping);
        if (success) {
            onNavigate('success');
        }
    };

    if (cart.length === 0) {
        onNavigate('home');
        return null;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <button 
                onClick={() => onNavigate('cart')} 
                className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Cart
            </button>

            <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
                <div className="lg:col-span-7">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Shipping Details */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                            <h2 className="text-xl font-medium text-gray-900 mb-6">Shipping Address</h2>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            required
                                            value={shipping.fullName}
                                            onChange={e => setShipping({...shipping, fullName: e.target.value})}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Address</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            required
                                            value={shipping.address}
                                            onChange={e => setShipping({...shipping, address: e.target.value})}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            required
                                            value={shipping.city}
                                            onChange={e => setShipping({...shipping, city: e.target.value})}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">ZIP / Postal Code</label>
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            required
                                            value={shipping.zipCode}
                                            onChange={e => setShipping({...shipping, zipCode: e.target.value})}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Country</label>
                                    <div className="mt-1">
                                        <select
                                            required
                                            value={shipping.country}
                                            onChange={e => setShipping({...shipping, country: e.target.value})}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                        >
                                            <option value="">Select a country</option>
                                            <option value="US">United States</option>
                                            <option value="CA">Canada</option>
                                            <option value="UK">United Kingdom</option>
                                            <option value="AU">Australia</option>
                                            <option value="DE">Germany</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Mockup */}
                        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm opacity-75 grayscale-[0.5]">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-medium text-gray-900">Payment Details</h2>
                                <div className="flex space-x-2 text-gray-400">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-4">
                                <div className="sm:col-span-4">
                                    <label className="block text-sm font-medium text-gray-700">Card Number (Mock)</label>
                                    <input type="text" disabled defaultValue="•••• •••• •••• 4242" className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm sm:text-sm border p-2" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Expiration</label>
                                    <input type="text" disabled defaultValue="12/25" className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm sm:text-sm border p-2" />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">CVC</label>
                                    <input type="text" disabled defaultValue="123" className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-md shadow-sm sm:text-sm border p-2" />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md border border-transparent bg-indigo-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                            ) : (
                                <><Lock className="w-4 h-4 mr-2"/> Pay ${total.toFixed(2)}</>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-10 lg:mt-0 lg:col-span-5">
                    <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <ul className="divide-y divide-gray-200">
                            {cart.map((item) => (
                                <li key={item.id} className="flex py-4">
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center"/>
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3 className="text-sm">{item.name}</h3>
                                                <p className="ml-4 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                            <p className="mt-1 text-xs text-gray-500">Qty {item.quantity}</p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <dl className="space-y-4 border-t border-gray-200 pt-6 mt-6">
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Subtotal</dt>
                                <dd className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between">
                                <dt className="text-sm text-gray-600">Taxes (8%)</dt>
                                <dd className="text-sm font-medium text-gray-900">${tax.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                                <dt className="text-base font-bold text-gray-900">Total</dt>
                                <dd className="text-base font-bold text-gray-900">${total.toFixed(2)}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;