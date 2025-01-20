export function FooterPage() {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="container mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">About Us</h3>
          <p className="text-sm">
            We are committed to providing the best products and customer
            experience. Join us on our journey!
          </p>
        </div>
        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="/shop" className="hover:text-blue-400">
                Shop
              </a>
            </li>
            <li>
              <a href="/about" className="hover:text-blue-400">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:text-blue-400">
                Contact
              </a>
            </li>
            <li>
              <a href="/faq" className="hover:text-blue-400">
                FAQ
              </a>
            </li>
          </ul>
        </div>
        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Follow Us</h3>
          <ul className="text-sm space-y-2">
            <li>
              <a href="https://facebook.com" className="hover:text-blue-400">
                Facebook
              </a>
            </li>
            <li>
              <a href="https://instagram.com" className="hover:text-blue-400">
                Instagram
              </a>
            </li>
            <li>
              <a href="https://twitter.com" className="hover:text-blue-400">
                Twitter
              </a>
            </li>
            <li>
              <a href="https://linkedin.com" className="hover:text-blue-400">
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Subscribe</h3>
          <form className="flex flex-col space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-2 rounded bg-gray-700 text-gray-200 border-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="px-4 py-2 bg-customBlue hover:bg-customPink rounded text-white">
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <div className="bg-gray-900 text-center py-4 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} YODA Sports Nutrition All rights
        reserved
      </div>
    </footer>
  );
}
