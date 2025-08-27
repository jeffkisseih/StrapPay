// components/Layout.tsx
import { Outlet, useNavigate } from 'react-router-dom'


export default function WelcomePage() {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col justify-between items-center min-h-screen bg-gray-100 p-4 w-full">
        {/* Centered Welcome Text */}
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-gray-800 text-center">
            Welcome to StrapPay
          </h1>
        </div>

        {/* Bottom Buttons */}
        <div className="w-full max-w-sm pb-10 space-y-4">
          <button
            className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            onClick={() => navigate('/login')}
          >
            Login
          </button>

          <button
            className="w-full bg-white border border-blue-600 text-blue-600 py-3 rounded-xl hover:bg-blue-50 transition"
            onClick={() => navigate('/signup')}
          >
              Sign Up
            </button>
    
        </div>
      </div>

      <Outlet />
    </>
  );
}



