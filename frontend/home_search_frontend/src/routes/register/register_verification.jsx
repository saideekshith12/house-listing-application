import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import Api from '../../../utility/login_class.jsx';

export const Route = createFileRoute('/register/register_verification')({
  component: RouteComponent,
  beforeLoad:()=>{
    const token = sessionStorage.getItem('canAccessVerification');
    const time = sessionStorage.getItem('verificationStartTime');
    if(!token || !time){
      return redirect('/register/register_home');
    }
    const currentTime = new Date().getTime();
    const timeDiff = currentTime - parseInt(time);
    if(timeDiff > 300000){
      return redirect('/register/register_home');
    }
  }
});

function RouteComponent() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

 const handleVerification = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!otp || otp.length !== 6) {
    setError('Please enter a valid 6-digit verification code');
    setLoading(false);
    return;
  }

  try {
    const api = new Api(`${import.meta.env.VITE_API_URL}/owner/verify`, 'POST', {
      verificationToken: otp,
    });

    const data = await api.Apihandle();
    console.log('Verification response:', data);

      if (!data || !data.success) {
      setError(data?.message || 'Invalid OTP. Please try again.');
      return;
    }
    alert('Verification successful');
    sessionStorage.removeItem('canAccessVerification');
    sessionStorage.removeItem('verificationStartTime');

    navigate({to:'/register/register_house_entry'});
  } catch (error) {
    console.error(error);
    setError(error.message || 'Something went wrong. Try again.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register_verification">
      <h1>Enter Verification Code</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p style={{ color: 'green' }}>Verifying...</p>}

      <form onSubmit={handleVerification}>
        <input
          type="text"
          maxLength={6}
          value={otp}
          placeholder="Enter 6-digit code"
          onChange={(e) => setOtp(e.target.value)}
        />
        <button className="verify_button" type="submit" disabled={loading}>
          Verify
        </button>
      </form>
    </div>
  );
}
