import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import Api from '../../../utility/login_class.jsx'

export const Route = createFileRoute('/user/user_forget_verify')({
    beforeLoad:()=>{
        const token = localStorage.getItem('forgetpassword')    ;
        if(token !== 'forgetpassword'){
            alert("Dont try to enter this page")
            return redirect ({to :'/user/user-login'})
        }
    },
  component: RouteComponent,
})

function RouteComponent() {
    const [token , settoken] = useState('')
    const [error, seterror] = useState('')
    const [loading , setloading] = useState(false)
    const navigate = useNavigate()

   const verifytoken = async(e)=>{
    e.preventDefault()
    setloading(true)
    seterror('')

    const response = new Api(`${import.meta.env.VITE_API_URL}/user/verify-forget-password` , "POST" , {token})
    const data = await response.Apihandle()
    if(!data.success){
        seterror(data.message || "Invalid token")
        return
    }
    alert("Successfully verified")
    localStorage.setItem('password', 'password')
    navigate({to :'/user/user_reset_password'})
   }

  return <div className='forget-card'>
    {error && <p className="error" style={{ color: "red" }}>{error}</p>}
     {loading && <p style={{ color: 'green' }}>loading...</p>}
    <form onSubmit={ verifytoken }>
        <div className="owner_signup  card-forget ">
          <label htmlFor="token">OTP</label>
          <input className='forget-email'
            type="number"
            id="token"
            value={token}
            onChange={(e) => settoken(e.target.value)}
            placeholder='Enter OTP'
          />
          
        </div>
        <button className="signup_button" type="submit" >
            Submit
        </button>
    </form>

  </div>
}


