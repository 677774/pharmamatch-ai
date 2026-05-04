import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    const password = e.target.querySelector('input[type="password"]').value;
    
    try {
      const response = await fetch('https://dzamar-pharmamatch-backend.hf.space/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`Welcome, ${data.user.name}! Login berhasil dengan JWT Token.`);
        navigate('/dashboard');
      } else {
        alert('Login Gagal: Email atau Password salah.');
      }
    } catch (error) {
      alert(`Error: Backend FastAPI belum berjalan atau tidak merespons.\nDetail: ${error.message}`);
      console.error(error);
      // Fallback for development if backend is not running
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-surface font-body">
      {/* Left Column - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-primary-container relative overflow-hidden items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-fixed/20 blur-[120px]"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-[#005b6f]/40 blur-[100px]"></div>
        
        {/* Content */}
        <div className="relative z-10 p-12 max-w-lg text-white">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-8 shadow-2xl">
            <span className="material-symbols-outlined text-4xl text-primary-fixed">science</span>
          </div>
          <h1 className="font-headline text-5xl font-black mb-6 leading-tight tracking-tight">
            Accelerate <br/> Clinical Discovery.
          </h1>
          <p className="text-primary-fixed text-lg font-medium leading-relaxed mb-8">
            PharmaMatch AI leverages Random Forest algorithms and deep learning to predict formulation compatibility with 98.4% accuracy.
          </p>
          <div className="flex items-center gap-4 text-sm font-label font-semibold text-white/80 bg-white/5 backdrop-blur-sm border border-white/10 w-fit px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse"></span>
            Phase II Clinical Trial Active
          </div>
        </div>
      </div>

      {/* Right Column - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-surface-container-lowest relative">
        {/* Mobile Header / Branding */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">science</span>
          </div>
          <span className="font-headline font-bold text-primary tracking-tight">PharmaMatch AI</span>
        </div>

        <div className="w-full max-w-sm animate-fade-in">
          <div className="mb-10">
            <h2 className="font-headline text-3xl font-extrabold text-primary mb-2 tracking-tight">Welcome back</h2>
            <p className="text-on-surface-variant text-sm">Please enter your credentials to access the laboratory workspace.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-on-surface mb-1.5 font-label">Work Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">mail</span>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-on-surface font-label">Password</label>
                  <a href="#" className="text-xs font-semibold text-primary-container hover:text-[#005b6f] transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-[20px]">lock</span>
                  <input 
                    type="password" 
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant/50 rounded-lg text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                className="h-4 w-4 text-primary-container focus:ring-primary-container border-outline-variant/50 rounded cursor-pointer"
                defaultChecked
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-on-surface-variant cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            <button 
              type="submit" 
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-primary-container hover:bg-[#005b6f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-container transition-all active:scale-[0.98]"
            >
              Sign in to Workspace
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-surface-container-lowest text-outline text-xs uppercase tracking-widest font-semibold">New to PharmaMatch AI?</span>
            </div>
          </div>

          <div className="mt-6">
            <Link 
              to="/register"
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-outline-variant/50 rounded-lg shadow-sm bg-white text-sm font-semibold text-on-surface hover:bg-surface transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Create an Account
            </Link>
          </div>
        </div>
        
        {/* Footer info */}
        <div className="absolute bottom-8 text-center w-full max-w-sm">
          <p className="text-xs text-outline font-medium">
            Authorized personnel only. <br/> By logging in, you agree to the <a href="#" className="underline hover:text-primary-container">Clinical Data Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
