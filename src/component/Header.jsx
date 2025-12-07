export default function Header() {
  return (
    <div
      className="relative w-full min-h-screen bg-cover bg-center text-white"
      style={{ backgroundImage: "url('/bg.svg')" }}
    >
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full bg-white shadow-sm p-4 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          
          {/* Logo */}
          <a href="/" aria-label="logo" className="flex items-center">
            <img src="logo1.png" alt="Logo" className="h-16 w-auto object-contain" />
          </a>

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-6">
            <ul className="flex gap-6 text-gray-700">
              <li><a className="hover:text-blue-600" href="#">Payments</a></li>
              <li><a className="hover:text-blue-600" href="#">Banking+</a></li>
              <li><a className="hover:text-blue-600" href="#">Payroll</a></li>
              <li><a className="hover:text-blue-600" href="#">Engage</a></li>
              <li><a className="hover:text-blue-600" href="#">Partners</a></li>
              <li><a className="hover:text-blue-600" href="#">Resources</a></li>
              <li><a className="hover:text-blue-600" href="#">Pricing</a></li>
            </ul>

            {/* Right Buttons */}
            <div className="flex items-center gap-4">
              
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 text-lg">
                  <i className="fa-solid fa-flag"></i>
                </button>
                <ul className="absolute hidden group-hover:block bg-white shadow-md rounded mt-2 min-w-[150px] z-50">
                  <li><a className="block px-4 py-2 hover:bg-gray-100" href="#">Action</a></li>
                  <li><a className="block px-4 py-2 hover:bg-gray-100" href="#">Another action</a></li>
                  <li><hr className="my-1" /></li>
                  <li><a className="block px-4 py-2 hover:bg-gray-100" href="#">Something else here</a></li>
                </ul>
              </div>

              <button className="border border-blue-500 text-blue-600 px-4 py-2 rounded hover:bg-pink-50 transition">
                Login
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-700 transition">
                Sign Up <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="pt-40 pb-20 flex flex-col items-center text-center max-w-3xl mx-auto">
        
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#f5e9e0] leading-relaxed">
            Welcome to Quizz Arena

        </h2>
        <p className="mt-6 text-lg md:text-xl text-[#f5e9e0]">
            Bridge classroom realities and curriculum expectations with the platform that’s AI-supported, but teacher-first.
        </p>

        {/* BUTTONS */}
        <div className="flex flex-col md:flex-row gap-6 mt-12">

          {/* SIGN UP */}
          <button className="bg-blue-900 text-white px-10 py-5 rounded-xl shadow-lg text-left hover:bg-pink-700 transition">
            <p className="text-xs font-semibold tracking-wide">NEW USERS</p>
            <p className="text-xl font-semibold">Sign up now</p>
          </button>

          {/* LOGIN */}
          <button className="bg-[#f9f3df] text-[#3a0c24] px-10 py-5 rounded-xl shadow-lg text-left hover:bg-[#f2e9d2] transition">
            <p className="text-xs font-semibold tracking-wide">EXISTING USERS</p>
            <p className="text-xl font-semibold">Log in to continue</p>
          </button>

        </div>
      </div>

    </div>
  );
}