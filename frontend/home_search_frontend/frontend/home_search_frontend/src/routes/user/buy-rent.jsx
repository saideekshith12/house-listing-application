import { createFileRoute, redirect } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router';

export const Route = createFileRoute('/user/buy-rent')({
  beforeLoad: () => {
    const hasVerificationAccess = localStorage.getItem('canAccessVerification') === 'user';
    const accesslogin = localStorage.getItem('login');
    
    if (!hasVerificationAccess  || !accesslogin) {
      alert('You are not logged in, please login');
      return redirect({ to: '/user/auth' });
    }
    sessionStorage.setItem('canAccessVerifications', 'users');
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div className='users-page'>
    <div className='user-page'>
      <Link to='/user/buy'><button className='user-page-button'><h1>Buy</h1></button></Link>
      <Link to='/user/rent'><button className='user-page-button'><h1>Rent</h1></button></Link>

    </div>
  </div>
}
