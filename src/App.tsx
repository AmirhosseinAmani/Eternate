import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from './components/ProductList';
import ProductDetail from './components/ProductDetail';
import CartPage from './components/CartPage';
import { Menu, ShoppingBag, Search, User, Heart } from 'lucide-react';
import { useCart } from './contexts/CartContext';
import { useProducts } from './hooks/useProducts';
import { useGoldPrice } from './hooks/useGoldPrice';

function AppContent() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { state: cartState } = useCart();
  const { products } = useProducts();
  const { goldPrice } = useGoldPrice();

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = cartState.items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fcfcfc] relative">
      {/* Background elements */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-70 pointer-events-none" />
        <div className="absolute inset-0 opacity-10 pointer-events-none"
             style={{
               backgroundImage: `repeating-linear-gradient(45deg, #f3f4f6 0px, #f3f4f6 1px, transparent 1px, transparent 20px)`,
               backgroundSize: '30px 30px'
             }} />
        <div className="absolute inset-0">
          <div className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-rose-200/40 via-rose-100/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -top-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-bl from-amber-200/40 via-amber-100/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]">
            <div className="absolute inset-0 bg-gradient-radial from-white/60 via-white/30 to-transparent rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-50/40 via-white/20 to-gray-50/40 rounded-full blur-3xl" />
          </div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[800px] h-[800px] bg-gradient-to-tr from-amber-200/40 via-amber-100/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] bg-gradient-to-tl from-rose-200/40 via-rose-100/20 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%3Ccircle%20cx%3D%222%22%20cy%3D%222%22%20r%3D%220.5%22%20fill%3D%22%23f1f5f9%22%2F%3E%3C%2Fsvg%3E')] opacity-30 pointer-events-none" />
      </div>

      {/* Header and content */}
      <div className="relative z-10">
        <div className="bg-gray-900 text-white text-sm py-2 text-center">
          <p>Free shipping on orders over $1000 | Easy returns</p>
        </div>
        
        <header className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-transparent backdrop-blur-sm'
        }`}>
          {/* Header content */}
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <button 
                className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <h1 className="text-2xl md:text-3xl font-serif">Luxe Jewelry</h1>
              
              <div className="flex items-center space-x-4">
                <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Search className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <User className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => navigate('/cart')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                </button>
              </div>
            </div>

            <nav className="hidden md:block border-t border-gray-200">
              <ul className="flex justify-center space-x-8 py-4">
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors font-medium">New Arrivals</a></li>
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors font-medium">Engagement Rings</a></li>
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors font-medium">Wedding Bands</a></li>
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors font-medium">Fine Jewelry</a></li>
                <li><a href="#" className="text-gray-800 hover:text-gray-600 transition-colors font-medium">About Us</a></li>
              </ul>
            </nav>

            {/* Mobile menu */}
            <div className={`md:hidden fixed inset-0 bg-white z-50 transition-transform duration-300 ${
              isMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
              {/* Mobile menu content */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-serif">Menu</h2>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mb-6">
                  <div className="relative">
                    <input
                      type="search"
                      placeholder="Search products..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                    <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <nav>
                  <ul className="space-y-4">
                    <li><a href="#" className="block py-2 text-lg text-gray-800 hover:text-gray-600 transition-colors">New Arrivals</a></li>
                    <li><a href="#" className="block py-2 text-lg text-gray-800 hover:text-gray-600 transition-colors">Engagement Rings</a></li>
                    <li><a href="#" className="block py-2 text-lg text-gray-800 hover:text-gray-600 transition-colors">Wedding Bands</a></li>
                    <li><a href="#" className="block py-2 text-lg text-gray-800 hover:text-gray-600 transition-colors">Fine Jewelry</a></li>
                    <li><a href="#" className="block py-2 text-lg text-gray-800 hover:text-gray-600 transition-colors">About Us</a></li>
                  </ul>
                </nav>

                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-col space-y-4">
                    <a href="#" className="flex items-center text-gray-800 hover:text-gray-600">
                      <User className="w-5 h-5 mr-3" />
                      My Account
                    </a>
                    <a href="#" className="flex items-center text-gray-800 hover:text-gray-600">
                      <Heart className="w-5 h-5 mr-3" />
                      Wishlist
                    </a>
                    <a href="/cart" className="flex items-center text-gray-800 hover:text-gray-600">
                      <ShoppingBag className="w-5 h-5 mr-3" />
                      Shopping Bag ({cartItemCount})
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="relative">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route 
              path="/product/:productId" 
              element={<ProductDetail products={products} goldPrice={goldPrice} />} 
            />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </main>
        
        <footer className="bg-gray-900 text-white py-8 mt-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="mb-6 md:mb-0">
                <h2 className="text-xl font-serif mb-4">Luxe Jewelry</h2>
                <p className="text-gray-400 max-w-md">
                  Exquisite handcrafted jewelry for life's most precious moments.
                  Our engagement rings are designed with timeless elegance and unparalleled craftsmanship.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Collection</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Contact</h3>
                <ul className="space-y-2 text-gray-400">
                  <li>Bağdat Caddesi No: 312</li>
                  <li>Kadıköy, Istanbul 34728</li>
                  <li>info@luxejewelry.com</li>
                  <li>(0216) 355-8790</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; {new Date().getFullYear()} Luxe Jewelry. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;