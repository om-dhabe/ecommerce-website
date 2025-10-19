"use client";

import { useState } from "react";
import { Mail, Gift } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="container">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="bg-white/20 p-4 rounded-full">
              <Mail className="w-12 h-12" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Stay Updated with Our Latest Offers
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Subscribe to our newsletter and get exclusive deals, new product updates, and special discounts delivered to your inbox.
          </p>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">Get 10% off your first order!</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-6 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                disabled={isSubscribed}
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50"
              >
                {isSubscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
          </form>

          <p className="text-sm text-blue-100 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
            <div>
              <div className="text-3xl font-bold mb-2">10M+</div>
              <div className="text-blue-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">50K+</div>
              <div className="text-blue-100">Products</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1K+</div>
              <div className="text-blue-100">Trusted Vendors</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}