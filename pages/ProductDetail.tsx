import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ArrowLeft, ShoppingCart, Truck, Shield } from 'lucide-react';
import { fetchProductById } from '../services/mockDb';

interface ProductDetailProps {
    productId: string;
    onNavigate: (page: string) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ productId, onNavigate }) => {
  const { addToCart } = useStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        setLoading(true);
        const res = await fetchProductById(productId);
        if (res.success && res.data) {
            setProduct(res.data);
        }
        setLoading(false);
    };
    load();
  }, [productId]);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );
  }

  if (!product) {
      return (
          <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-900">Product not found</h2>
              <button onClick={() => onNavigate('home')} className="mt-4 text-indigo-600 hover:underline">Return Home</button>
          </div>
      );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button 
        onClick={() => onNavigate('home')} 
        className="flex items-center text-gray-500 hover:text-gray-900 mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Products
      </button>

      <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-start">
        {/* Image */}
        <div className="aspect-square w-full rounded-lg bg-gray-100 overflow-hidden">
            <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover object-center"
            />
        </div>

        {/* Info */}
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
          
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl tracking-tight text-indigo-600">${product.price.toFixed(2)}</p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <p className="text-base text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-8">
            <div className="flex items-center text-sm text-gray-500 mb-6">
                <span className={`inline-block w-3 h-3 rounded-full mr-2 ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {product.stock > 0 ? `${product.stock} items in stock` : 'Out of Stock'}
            </div>

            <button
              onClick={() => { addToCart(product); }}
              disabled={product.stock === 0}
              className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </button>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex items-center text-sm text-gray-500">
                  <Truck className="w-5 h-5 mr-2 text-gray-400" />
                  Free shipping over $100
              </div>
              <div className="flex items-center text-sm text-gray-500">
                  <Shield className="w-5 h-5 mr-2 text-gray-400" />
                  2-year warranty included
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;