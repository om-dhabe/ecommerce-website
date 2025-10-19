import Link from "next/link";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Mail, 
  Phone, 
  MapPin,
  CreditCard,
  Shield,
  Truck
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Features Section */}
      <div className="border-b border-gray-800">
        <div className="container py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-center space-x-3 sm:space-x-4 stagger-item">
              <div className="bg-blue-600 p-2 sm:p-3 rounded-full scale-on-hover">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Free Shipping</h3>
                <p className="text-gray-400 text-xs sm:text-sm">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 stagger-item">
              <div className="bg-green-600 p-2 sm:p-3 rounded-full scale-on-hover">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Secure Payment</h3>
                <p className="text-gray-400 text-xs sm:text-sm">100% secure transactions</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4 stagger-item sm:col-span-2 lg:col-span-1">
              <div className="bg-purple-600 p-2 sm:p-3 rounded-full scale-on-hover">
                <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Easy Returns</h3>
                <p className="text-gray-400 text-xs sm:text-sm">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 scale-on-hover">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">E</span>
              </div>
              <span className="text-lg sm:text-xl font-bold">Bharat-Sanchaya</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm sm:text-base leading-relaxed">
              Your trusted marketplace for quality products from verified vendors worldwide.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-all duration-200 scale-on-hover" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-all duration-200 scale-on-hover" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-all duration-200 scale-on-hover" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-all duration-200 scale-on-hover" aria-label="YouTube">
                <Youtube className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Contact</Link></li>
              <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Careers</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Blog</Link></li>
              <li><Link href="/press" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Press</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Help Center</Link></li>
              <li><Link href="/returns" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Returns</Link></li>
              <li><Link href="/shipping" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Shipping Info</Link></li>
              <li><Link href="/track-order" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Track Order</Link></li>
              <li><Link href="/size-guide" className="text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base">Size Guide</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 text-sm sm:text-base">123 Commerce St, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm sm:text-base">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm sm:text-base">support@Bharat-Sanchaya.com</span>
              </div>
            </div>
            
            {/* Newsletter */}
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-sm sm:text-base">Newsletter</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg sm:rounded-l-lg sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm transition-all duration-200"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg sm:rounded-l-none sm:rounded-r-lg transition-all duration-200 bounce-on-click text-sm font-medium">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2024 Bharat-Sanchaya. All rights reserved.
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6 text-center">
              <Link href="/privacy" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors duration-200">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}