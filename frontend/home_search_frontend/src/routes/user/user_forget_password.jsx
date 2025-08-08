import { createFileRoute } from '@tanstack/react-router'
import Api from '../../../utility/login_class.jsx'
import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/user/user_forget_password')({
  component: RouteComponent,
})

function RouteComponent() {
    const [email , setemail] = useState('')
    const [error, seterror] = useState('')
    const [loading , setloading] = useState(false)
    const navigate = useNavigate()

    const forgetpassword = async(e)=>{
        e.preventDefault()
        seterror('')
        setloading(true)

        const response = new Api(`${import.meta.env.VITE_API_URL}/user/forget-password`, "POST" ,{email})
        const data = await response.Apihandle()
        if(!data.success){
            seterror(data.message || "Sorry email cannot found")
        }
        alert("Link is send to email , once check the email Please")
        localStorage.setItem('forgetpassword' , 'forgetpassword')
        navigate({to :'/user/user_forget_verify'})
    }

  return <div className='forget-card'>
    {error && <p className="error" style={{ color: "red" }}>{error}</p>}
    {loading && <p style={{ color: 'green' }}>loading...</p>}
    <form onSubmit={forgetpassword}>
        <div className="owner_signup  card-forget ">
          <label htmlFor="email">Email</label>
          <input className='forget-email'
            type="email"
            id="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder='Enter your email'
          />
          
        </div>
        <button className="signup_button" type="submit" >
           Submit
        </button>
    </form>

  </div>
}
