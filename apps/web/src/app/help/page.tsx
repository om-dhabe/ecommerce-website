import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Mail, 
  HelpCircle,
  ShoppingCart,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Help Center - Bharat-Sanchaya',
  description: 'Find answers to frequently asked questions and get support.',
};

const faqCategories = [
  {
    title: 'Orders & Shopping',
    icon: ShoppingCart,
    faqs: [
      {
        question: 'How do I place an order?',
        answer: 'Browse products, add items to your cart, and proceed to checkout. You\'ll need to create an account and provide shipping information.'
      },
      {
        question: 'Can I modify or cancel my order?',
        answer: 'You can modify or cancel your order within 1 hour of placing it, provided it hasn\'t been shipped yet.'
      },
      {
        question: 'How do I track my order?',
        answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also track orders in your account dashboard.'
      }
    ]
  },
  {
    title: 'Payments',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.'
      },
      {
        question: 'When will I be charged?',
        answer: 'Your payment method is charged when your order is confirmed and processed.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and never store your payment details on our servers.'
      }
    ]
  },
  {
    title: 'Shipping & Delivery',
    icon: Truck,
    faqs: [
      {
        question: 'What are your shipping options?',
        answer: 'We offer standard (5-7 days) and express (2-3 days) shipping. Free shipping is available on orders over $50.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Yes, we ship to most countries worldwide. International shipping rates and times vary by destination.'
      },
      {
        question: 'What if my package is lost or damaged?',
        answer: 'Contact us immediately if your package is lost or damaged. We\'ll work with the carrier to resolve the issue.'
      }
    ]
  },
  {
    title: 'Returns & Refunds',
    icon: RefreshCw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'You can return most items within 30 days of delivery for a full refund, provided they\'re in original condition.'
      },
      {
        question: 'How do I return an item?',
        answer: 'Go to your order history, select the item to return, and follow the instructions. We\'ll provide a prepaid return label.'
      },
      {
        question: 'When will I receive my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive your returned item.'
      }
    ]
  }
];

const contactOptions = [
  {
    title: 'Live Chat',
    description: 'Chat with our support team',
    icon: MessageCircle,
    action: 'Start Chat',
    available: '24/7'
  },
  {
    title: 'Phone Support',
    description: 'Call us for immediate help',
    icon: Phone,
    action: '+1 (555) 123-4567',
    available: 'Mon-Fri 9AM-6PM'
  },
  {
    title: 'Email Support',
    description: 'Send us a detailed message',
    icon: Mail,
    action: 'support@bharat-sanchaya.com',
    available: 'Response within 24h'
  }
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-xl mb-8">Find answers to your questions or get in touch with our support team</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-lg leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:border-white"
                placeholder="Search for help articles..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Contact Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Get Support</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactOptions.map((option) => (
              <div key={option.title} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <option.icon className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <div className="text-blue-600 font-medium mb-2">{option.action}</div>
                <div className="text-sm text-gray-500">{option.available}</div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {faqCategories.map((category) => (
              <div key={category.title} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <category.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{category.title}</h3>
                </div>
                <div className="space-y-4">
                  {category.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Quick Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/account" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Shield className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-gray-900">My Account</span>
            </Link>
            <Link href="/orders" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-gray-900">Order History</span>
            </Link>
            <Link href="/returns" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-gray-900">Returns</span>
            </Link>
            <Link href="/seller/register" className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <HelpCircle className="h-5 w-5 text-blue-600 mr-3" />
              <span className="text-gray-900">Become a Seller</span>
            </Link>
          </div>
        </div>

        {/* Still Need Help */}
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Still need help?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}