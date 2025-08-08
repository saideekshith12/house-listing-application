import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import Api from '../../../utility/login_class';
import { useRouter } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';


export const Route = createFileRoute('/user/user-login')({
 beforeLoad: () => {
    const hasVerificationAccess = localStorage.getItem('canAccessVerification') === 'user';
    const accesslogin = localStorage.getItem('login');
    
    if(hasVerificationAccess && accesslogin){
        return redirect({to:"/user/buy-rent"})
    }
},
  component: RouteComponent,
})

function RouteComponent() {
    const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [error, seterror] = useState('');
  const [loading, setloading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    seterror('');
    setloading(true);

    // ✅ Client-side validation
    if (!email) {
      seterror('Email is required');
      setloading(false);
      return;
    }
    if (!email.endsWith('@gmail.com')) {
      seterror('Email must be a gmail.com address');
      setloading(false);
      return;
    }
    if (!password) {
      seterror('Password is required');
      setloading(false);
      return;
    }
    if (password.length < 8) {
      seterror('Password must be at least 8 characters');
      setloading(false);
      return;
    }

    try {
      const api = new Api(`${import.meta.env.VITE_API_URL}/user/login`, 'POST', {
        email,
        password,
      });

      const data = await api.Apihandle();
      console.log('Login response:', data);

      if (!data || !data.success) {
        seterror(data?.message || 'Invalid credentials. Please try again.');
        return;
      }
      
      localStorage.setItem('canAccessVerification', 'user');
      localStorage.setItem('login', data.token);
      alert('Thanks for login');
      router.navigate({ to: '/user/buy-rent' });
    } catch (err) {
      console.error('Login failed:', err);
      seterror(err.message || 'Something went wrong. Try again.');
    } finally {
      setloading(false);
    }
  };

  return (
    <div>
        <div className="signup">
      <h2>User Login</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p style={{ color: 'green' }}>Loading...</p>}

      <form onSubmit={handleLogin}>
        <div className="owner_signup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="owner_signup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <button className="signup_button" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
    <Link className='link' to='/user/user_forget_password'><button className="signup_button  signup_button1" >forget password</button></Link>
    </div>
  )
}
