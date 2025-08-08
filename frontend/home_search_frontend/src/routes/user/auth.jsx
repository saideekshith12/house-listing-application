import { createFileRoute , Link } from '@tanstack/react-router'

export const Route = createFileRoute('/user/auth')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div  className="page-dark-bg">
    <div className='auth-login'>
      <Link to='/user/user-login'><button className='auth-button'><h1>Login</h1></button></Link>
      <Link to='/user/user-signup'><button className='auth-button'><h1>Sign Up</h1></button></Link>
    </div>
  </div>
}
