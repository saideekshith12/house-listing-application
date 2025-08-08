import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Api from '../../../utility/login_class.jsx'

export const Route = createFileRoute('/user/user_reset_password')({
  beforeLoad:()=>{
    const token = localStorage.getItem('password')
    if(token !== 'password'){
      alert('Not Authorized to enter')
      return redirect({to:'/user/user-login'})
    }

  },
  component: RouteComponent,
})

function RouteComponent() {
  const [email, setemail] = useState('')
  const [password, setpassword] = useState('')
  const [error, seterror] = useState('')
  const [loading , setlaoding] = useState('')
  const navigate = useNavigate()

  const resetpassword = async (e)=>{
    e.preventDefault()
    seterror('')
    setlaoding(true)

    const response = new Api(`${import.meta.env.VITE_API_URL}/user/reset-password` , "POST" , {email,password})
    const data = await response.Apihandle()
    if(!data.success){
      seterror(data.message || "Invalid email")
      return
    }
    alert('Password has changed Successfully')
    navigate({to:'/user/user-login'})
  }
return (
    <div>
        <div className="signup">
      <h2>Password Change</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p style={{ color: 'green' }}>Loading...</p>}

      <form onSubmit={resetpassword}>
        <div className="owner_signup">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder='Enter your email'
            disabled={loading}
          />
        </div>

        <div className="owner_signup">
          <label htmlFor="password"> New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder='Enter your new password'
            disabled={loading}
          />
        </div>

        <button className="signup_button" type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </div>
    </div>
    
  )
}
