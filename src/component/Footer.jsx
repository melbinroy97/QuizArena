export default function Footer() {
  return (
    <footer className="bg-white py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

        {/* Column 1 */}
        <div>
          <img src="logo1.png" alt="Logo" className="h-8 mb-4" />

          <div className="text-gray-600 text-sm leading-relaxed space-y-3">
            <p>
              Razorpay is the only payments solution in India that allows
              businesses to accept, process and disburse payments with its
              product suite. It gives you access to all payment modes including
              card payments, UPI, wallets and more.
            </p>
            <p>
              RazorpayX supercharges your business banking experience, bringing
              effectiveness, efficiency, and excellence to all financial
              processes.
            </p>
            <p>
              Manage your marketplace, automate bank transfers, collect
              recurring payments, share invoices and access working capital
              loans — all from one platform.
            </p>
            <p>
              Disclaimer: RazorpayX powered Current Accounts & Credit Cards are
              provided by RBI licensed banks under regulations.
            </p>
          </div>
        </div>

        {/* Column 2 */}
        <div>
          <p className="text-gray-800 font-semibold mb-3">ACCEPT PAYMENTS</p>

          <div className="flex flex-col space-y-2 text-gray-600 text-sm">
            <button className="text-left hover:text-blue-600">Payment Aggregator</button>
            <button className="text-left hover:text-blue-600">Payment Gateway</button>
            <button className="text-left hover:text-blue-600">Payment Pages</button>
            <button className="text-left hover:text-blue-600">Payment Links</button>
            <button className="text-left hover:text-blue-600">RazorPay POS</button>
            <button className="text-left hover:text-blue-600">QR Codes</button>
            <button className="text-left hover:text-blue-600">Subscriptions</button>
            <button className="text-left hover:text-blue-600">Smart Collect</button>
            <button className="text-left hover:text-blue-600">Optimizer</button>
            <button className="text-left hover:text-blue-600">Instant Settlements</button>

            <p className="text-gray-800 font-semibold mt-4">PAYROLL</p>
            <button className="text-left hover:text-blue-600">RazorpayX Payroll</button>

            <p className="text-gray-800 font-semibold mt-4">BECOME A PARTNER</p>
            <button className="text-left hover:text-blue-600">Refer and Earn</button>
            <button className="text-left hover:text-blue-600">Onboarding APIs</button>

            <p className="text-gray-800 font-semibold mt-4">MORE</p>
            <button className="text-left hover:text-blue-600">Route</button>
            <button className="text-left hover:text-blue-600">Invoices</button>
            <button className="text-left hover:text-blue-600">Freelancer Payments</button>
            <button className="text-left hover:text-blue-600">Flash Checkout</button>
            <button className="text-left hover:text-blue-600">UPI</button>
            <button className="text-left hover:text-blue-600">ePOS</button>
            <button className="text-left hover:text-blue-600">Checkout Demo</button>
          </div>
        </div>

        {/* Column 3 */}
        <div>
          <p className="text-gray-800 font-semibold mb-3">BANKING PLUS</p>

          <div className="flex flex-col space-y-2 text-gray-600 text-sm">
            <button className="text-left hover:text-blue-600">RazorpayX</button>
            <button className="text-left hover:text-blue-600">Source to Pay</button>
            <button className="text-left hover:text-blue-600">Current Accounts</button>
            <button className="text-left hover:text-blue-600">Payouts</button>
            <button className="text-left hover:text-blue-600">Payout Links</button>
            <button className="text-left hover:text-blue-600">Corporate Credit Cards</button>

            <p className="text-gray-800 font-semibold mt-4">DEVELOPERS</p>
            <button className="text-left hover:text-blue-600">Docs</button>
            <button className="text-left hover:text-blue-600">Integrations</button>
            <button className="text-left hover:text-blue-600">API Reference</button>

            <p className="text-gray-800 font-semibold mt-4">RESOURCES</p>
            <button className="text-left hover:text-blue-600">Blog</button>
            <button className="text-left hover:text-blue-600">Learn</button>
            <button className="text-left hover:text-blue-600">Customer Services</button>
            <button className="text-left hover:text-blue-600">Events</button>
            <button className="text-left hover:text-blue-600">Chargeback Guide</button>
            <button className="text-left hover:text-blue-600">Settlement Guide</button>

            <p className="text-gray-800 font-semibold mt-4">SOLUTIONS</p>
            <button className="text-left hover:text-blue-600">Education</button>
            <button className="text-left hover:text-blue-600">E-commerce</button>
            <button className="text-left hover:text-blue-600">SaaS</button>
            <button className="text-left hover:text-blue-600">BFSI</button>
          </div>
        </div>

        {/* Column 4 */}
        <div>
          <p className="text-gray-800 font-semibold mb-3">COMPANY</p>

          <div className="flex flex-col space-y-2 text-gray-600 text-sm">
            <button className="text-left hover:text-blue-600">About Us</button>
            <button className="text-left hover:text-blue-600">Careers</button>
            <button className="text-left hover:text-blue-600">Terms of Use</button>
            <button className="text-left hover:text-blue-600">Privacy Policy</button>
            <button className="text-left hover:text-blue-600">Grievance Redressal</button>
            <button className="text-left hover:text-blue-600">Responsible Disclosure</button>
            <button className="text-left hover:text-blue-600">Partners</button>
            <button className="text-left hover:text-blue-600">Corporate Information</button>

            <p className="text-gray-800 font-semibold mt-4">HELP & SUPPORT</p>
            <button className="text-left hover:text-blue-600">Support</button>
            <button className="text-left hover:text-blue-600">Knowledge Base</button>

            <p className="text-gray-800 font-semibold mt-4">FIND US ONLINE</p>
            <div className="flex gap-4">
              <i className="fa-brands fa-facebook fa-xl text-blue-500"></i>
              <i className="fa-brands fa-twitter fa-xl text-sky-400"></i>
              <i className="fa-brands fa-linkedin fa-xl text-blue-700"></i>
              <i className="fa-brands fa-instagram fa-xl text-pink-500"></i>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}