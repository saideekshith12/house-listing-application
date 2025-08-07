import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef } from 'react';

export const Route = createFileRoute('/register/register_signup')({
  component: RouteComponent,
});

function RouteComponent() {
  const [name, setname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [mobile_number, setmobile_number] = useState('');
  const [isloading, setisLoading] = useState(false);
  const [error, seterror] = useState(null);

  const inputref = useRef(null);
  const navigate = useNavigate();

  function focusinput() {
    inputref.current?.focus();
  }

  const handlesignup = async (e) => {
    e.preventDefault();

    setisLoading(true);
    seterror(null);

    // Input validations
    if (!name || !email || !password || !mobile_number) {
      seterror('All fields are required');
      setisLoading(false);
      focusinput();
      return;
    }

    if (name.length < 3) {
      seterror('Name must be at least 3 characters');
      setisLoading(false);
      focusinput();
      return;
    }

    if (!email.endsWith('@gmail.com')) {
      seterror('Email must be a gmail.com address');
      setisLoading(false);
      focusinput();
      return;
    }

    if (password.length < 8) {
      seterror('Password must be at least 8 characters');
      setisLoading(false);
      focusinput();
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/owner/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name,
          email,
          password,
          mobile_number,
        }),
      });

      const text = await response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error('Invalid JSON response from server: ', err);
      }

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }

      alert('Verification code sent to email');
      const timestamp = new Date().getTime();
      sessionStorage.setItem("canAccessVerification", email);
      sessionStorage.setItem("verificationStartTime", timestamp.toString());
      navigate({to :'/register/register_verification'});

    } catch (err) {
      seterror(err.message || 'Something went wrong');
    } finally {
      setisLoading(false);
    }
  };

  return (
    <div className="signup">
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isloading && <p>Loading...</p>}

      <form onSubmit={handlesignup}>
        <div className="owner_signup">
          <label className="label" htmlFor="name">Username</label>
          <input
            ref={inputref}
            type="text"
            value={name}
            onChange={(e) => setname(e.target.value)}
            placeholder="Enter your name"
          />
        </div>

        <div className="owner_signup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>

        <div className="owner_signup">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Enter your password"
          />
        </div>

        <div className="owner_signup">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            type="tel"
            value={mobile_number}
            onChange={(e) => setmobile_number(e.target.value)}
            placeholder="Enter your mobile number"
          />
        </div>

        <button className="signup_button" type="submit" disabled={isloading}>
          {isloading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}



// name, email, password, mobile_number