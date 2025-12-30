import React from 'react';
import { useStore } from '../context/StoreContext';
import { Plus } from 'lucide-react';

interface ProductListProps {
    onNavigate: (page: string, params?: any) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onNavigate }) => {
  const { products, isLoading, addToCart } = useStore();

  if (isLoading && products.length === 0) {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Latest Products</h1>
        <p className="mt-2 text-gray-600">Premium collection for your lifestyle.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 overflow-hidden flex flex-col h-full">
            <div 
                className="relative aspect-square cursor-pointer bg-gray-100 overflow-hidden group"
                onClick={() => onNavigate('product', { id: product.id })}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.stock < 5 && product.stock > 0 && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Low Stock
                  </div>
              )}
            </div>
            
            <div className="p-4 flex flex-col flex-grow">
              <div className="mb-2">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                    {product.category}
                </span>
                <h3 
                    className="text-lg font-medium text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors mt-1"
                    onClick={() => onNavigate('product', { id: product.id })}
                >
                    {product.name}
                </h3>
              </div>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <button
                  onClick={() => addToCart(product)}
                  className="p-2 rounded-full bg-gray-100 text-gray-900 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                  title="Add to Cart"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;