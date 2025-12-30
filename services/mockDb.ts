import { Product, User, UserRole, Order, ApiResponse, ShippingAddress } from '../types';

// Constants for LocalStorage keys
const USERS_KEY = 'shop_users';
const PRODUCTS_KEY = 'shop_products';
const ORDERS_KEY = 'shop_orders';

// Initial Seed Data
const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Minimalist Mechanical Keyboard',
    price: 149.99,
    description: 'A compact 60% mechanical keyboard with Gateron Brown switches and PBT keycaps. Perfect for coding and typing enthusiasts.',
    image: 'https://picsum.photos/400/400?random=1',
    stock: 25,
    category: 'Electronics'
  },
  {
    id: 'p2',
    name: 'Ergonomic Office Chair',
    price: 299.00,
    description: 'Designed for comfort during long working hours. Features lumbar support and breathable mesh.',
    image: 'https://picsum.photos/400/400?random=2',
    stock: 10,
    category: 'Furniture'
  },
  {
    id: 'p3',
    name: 'Noise Cancelling Headphones',
    price: 199.50,
    description: 'Industry-leading noise cancellation. 30-hour battery life and exceptional sound quality.',
    image: 'https://picsum.photos/400/400?random=3',
    stock: 15,
    category: 'Electronics'
  },
  {
    id: 'p4',
    name: 'Ceramic Pour-Over Set',
    price: 45.00,
    description: 'Handcrafted ceramic dripper and carafe for the perfect morning brew. Minimalist design.',
    image: 'https://picsum.photos/400/400?random=4',
    stock: 50,
    category: 'Home'
  },
  {
    id: 'p5',
    name: 'Leather Weekend Bag',
    price: 120.00,
    description: 'Full-grain leather travel bag. Durable, stylish, and spacious enough for a 3-day trip.',
    image: 'https://picsum.photos/400/400?random=5',
    stock: 8,
    category: 'Fashion'
  },
  {
    id: 'p6',
    name: 'Smart Desk Lamp',
    price: 55.00,
    description: 'App-controlled LED desk lamp with adjustable color temperature and brightness.',
    image: 'https://picsum.photos/400/400?random=6',
    stock: 30,
    category: 'Electronics'
  }
];

// Helper to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Initialize DB if empty
const initDb = () => {
  if (!localStorage.getItem(PRODUCTS_KEY)) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    // Default admin user
    const admin: User = {
      id: 'admin_1',
      email: 'admin@shop.com',
      name: 'Admin User',
      role: UserRole.ADMIN
    };
    localStorage.setItem(USERS_KEY, JSON.stringify([admin]));
  }
  if (!localStorage.getItem(ORDERS_KEY)) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
  }
};

initDb();

// --- Product Service ---

export const fetchProducts = async (): Promise<ApiResponse<Product[]>> => {
  await delay(600);
  const products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  return { success: true, data: products };
};

export const fetchProductById = async (id: string): Promise<ApiResponse<Product>> => {
  await delay(300);
  const products: Product[] = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]');
  const product = products.find(p => p.id === id);
  if (!product) return { success: false, message: 'Product not found' };
  return { success: true, data: product };
};

// --- Auth Service ---

export const loginUser = async (email: string, password: string): Promise<ApiResponse<{ user: User, token: string }>> => {
  await delay(800);
  const users: any[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  
  const user = users.find(u => u.email === email);
  
  if (user) {
     if (email === 'admin@shop.com' && password !== 'admin') {
         return { success: false, message: 'Invalid credentials' };
     }
     
     return { 
       success: true, 
       data: { 
         user: { id: user.id, email: user.email, name: user.name, role: user.role }, 
         token: 'mock-jwt-token-' + Date.now() 
       } 
     };
  }

  return { success: false, message: 'User not found' };
};

export const registerUser = async (name: string, email: string, password: string): Promise<ApiResponse<{ user: User, token: string }>> => {
    await delay(800);
    const users: any[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    
    if (users.find(u => u.email === email)) {
        return { success: false, message: 'User already exists' };
    }

    const newUser: User = {
        id: 'user_' + Date.now(),
        email,
        name,
        role: UserRole.USER
    };

    const dbUser = { ...newUser, passwordHash: 'hashed_' + password };
    users.push(dbUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    return {
        success: true,
        data: {
            user: newUser,
            token: 'mock-jwt-token-' + Date.now()
        }
    };
};

// --- Order Service ---

export const createOrder = async (userId: string, items: any[], total: number, shippingAddress: ShippingAddress): Promise<ApiResponse<Order>> => {
    await delay(1000);
    const orders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    
    const newOrder: Order = {
        id: 'ord_' + Date.now(),
        userId,
        items,
        total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        shippingAddress
    };

    orders.push(newOrder);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    return { success: true, data: newOrder };
};

export const fetchOrders = async (userId: string, role: UserRole): Promise<ApiResponse<Order[]>> => {
    await delay(500);
    const orders: Order[] = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    
    if (role === UserRole.ADMIN) {
        return { success: true, data: orders.reverse() };
    }
    
    const userOrders = orders.filter(o => o.userId === userId).reverse();
    return { success: true, data: userOrders };
};