import React, { useState } from 'react';
import axios from 'axios';

const LoginView = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false); 
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🤖');
  const [error, setError] = useState(''); // Added to show errors to kids

  const avatars = ['🤖', '🦄', '🦁', '🦖', '🚀', '🐱'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (name.trim() && pin.length === 4) {
      try {
        const endpoint = isSignUp ? '/signup' : '/login';
        const payload = {
          name: name,
          pin: pin,
          avatar: selectedAvatar
        };

        const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
        
        // If successful, pass the real user data from DB to App.jsx
        onLogin(response.data.user);
        
      } catch (err) {
        // Show the error message from FastAPI (like "Wrong PIN")
        setError(err.response?.data?.detail || "Oops! Something went wrong.");
      }
    }
  };

  const handlePinChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    if (val.length <= 4) setPin(val);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
      <div className="bg-white p-8 rounded-[40px] border-8 border-purple-200 shadow-xl max-w-md w-full text-center animate-in zoom-in duration-300">
        
        <h2 className="text-3xl font-black text-purple-600 mb-2 uppercase tracking-tighter italic">
          {isSignUp ? "New Explorer!" : "Welcome Back!"}
        </h2>

        {/* Error Message Display */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4 font-bold animate-bounce">
            {error}
          </div>
        )}
        
        {isSignUp && (
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {avatars.map(a => (
              <button 
                key={a}
                type="button"
                onClick={() => setSelectedAvatar(a)}
                className={`text-3xl p-3 rounded-2xl border-4 transition-all ${selectedAvatar === a ? 'border-yellow-400 bg-yellow-100 scale-110' : 'border-transparent bg-gray-50'}`}
              >
                {a}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="text-left">
            <label className="block text-xs font-black text-purple-400 ml-2 mb-1 uppercase">Explorer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              className="w-full p-4 rounded-2xl border-4 border-purple-100 focus:border-purple-400 outline-none text-lg font-bold"
              required
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-black text-purple-400 ml-2 mb-1 uppercase">4-Digit Pin</label>
            <input
              type="password" /* Changed to password so people can't see the PIN */
              inputMode="numeric"
              value={pin}
              onChange={handlePinChange}
              placeholder="* * * *"
              className="w-full p-4 rounded-2xl border-4 border-purple-100 focus:border-purple-400 outline-none text-2xl font-black text-center tracking-[1rem]"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-black py-4 rounded-2xl text-2xl shadow-[0_6px_0_0_#ca8a04] active:shadow-none active:translate-y-1 transition-all mt-4"
          >
            {isSignUp ? "CREATE ACCOUNT! 🚀" : "SIGN IN! ✨"}
          </button>
        </form>

        <button 
          onClick={() => {
            setIsSignUp(!isSignUp);
            setError(''); // Clear errors when switching
          }}
          className="mt-8 text-purple-500 font-black text-sm uppercase hover:text-purple-700 transition-colors"
        >
          {isSignUp ? (
            <span>Already an explorer? <span className="underline decoration-2 underline-offset-4">Sign In</span></span>
          ) : (
            <span>Don't have an account? <span className="underline decoration-2 underline-offset-4">Sign Up</span></span>
          )}
        </button>
      </div>
    </div>
  );
};

export default LoginView;