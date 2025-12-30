import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Package, Clock, CheckCircle, MapPin } from 'lucide-react';
import { UserRole } from '../types';

const Orders: React.FC = () => {
  const { user, orders, fetchUserOrders, isLoading } = useStore();

  useEffect(() => {
    fetchUserOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (isLoading && orders.length === 0) {
      return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
            {user?.role === UserRole.ADMIN ? 'Admin Dashboard: All Orders' : 'My Orders'}
        </h1>
        <p className="mt-2 text-gray-600">
            {user?.role === UserRole.ADMIN 
                ? 'Manage and view all customer orders.' 
                : 'Track your recent purchases and status.'}
        </p>
      </div>

      <div className="space-y-6">
          {orders.length === 0 ? (
              <div className="bg-white p-8 text-center rounded-lg shadow-sm border border-gray-200">
                  <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500">No orders found.</p>
              </div>
          ) : (
              orders.map((order) => (
                  <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                          <div>
                              <p className="text-sm font-medium text-gray-500">Order ID</p>
                              <p className="font-mono text-sm text-gray-900">{order.id}</p>
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-500">Date Placed</p>
                              <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                              <p className="text-sm font-medium text-gray-500">Total Amount</p>
                              <p className="text-sm font-bold text-gray-900">${order.total.toFixed(2)}</p>
                          </div>
                          <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                  'bg-yellow-100 text-yellow-800'
                              }`}>
                                  {order.status === 'completed' ? <CheckCircle className="w-3 h-3 mr-1"/> : <Clock className="w-3 h-3 mr-1"/>}
                                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                          </div>
                      </div>
                      
                      <div className="px-6 py-4 bg-white border-b border-gray-100">
                          <div className="flex items-start text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-400" />
                              <div>
                                  <p className="font-medium text-gray-900">Shipping To:</p>
                                  {order.shippingAddress ? (
                                      <>
                                        <p>{order.shippingAddress.fullName}</p>
                                        <p>{order.shippingAddress.address}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.zipCode}</p>
                                        <p>{order.shippingAddress.country}</p>
                                      </>
                                  ) : <p className="text-gray-400 italic">No shipping info</p>}
                              </div>
                          </div>
                      </div>

                      <div className="px-6 py-6">
                          <ul className="divide-y divide-gray-100">
                              {order.items.map((item, idx) => (
                                  <li key={`${order.id}-item-${idx}`} className="flex py-4">
                                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                          <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center"/>
                                      </div>
                                      <div className="ml-4 flex-1">
                                          <div className="flex justify-between text-base font-medium text-gray-900">
                                              <h3>{item.name}</h3>
                                              <p className="text-sm text-gray-500">x{item.quantity}</p>
                                          </div>
                                          <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                      </div>
                                  </li>
                              ))}
                          </ul>
                      </div>
                      
                      {/* Admin Controls Mock */}
                      {user?.role === UserRole.ADMIN && (
                         <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
                             <button className="text-xs font-medium text-indigo-600 hover:text-indigo-500">Mark Shipped</button>
                             <button className="text-xs font-medium text-red-600 hover:text-red-500">Cancel Order</button>
                         </div>
                      )}
                  </div>
              ))
          )}
      </div>
    </div>
  );
};

export default Orders;