import { createFileRoute , Link } from '@tanstack/react-router'

export const Route = createFileRoute('/register/register_home')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className='register_home'>
      <img className='register_img' src="/img5.jpg" alt="" />
      <div className='register_text'>
        <Link to="/register/register_login" className="register_logining"><h1 className='register_login'>Login</h1></Link>
       <Link to='/register/register_signup' className="register_logining"><h1 className='register_signup'>Signup</h1></Link>

      </div>
    </div>

  )
}
