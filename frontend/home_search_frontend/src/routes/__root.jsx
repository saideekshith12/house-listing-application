import * as React from 'react'
import { Outlet, createRootRoute , Link } from '@tanstack/react-router'
import './__root.css'
export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <div className="header"><h1 className='myhome'>My<span>Home</span></h1>
        <div className="element">
            <Link to="/" className='nav' activeProps={{ className: 'active' }} preload="intent"><h4 className='elements'>HOME</h4></Link>
           <Link to="/about" className='nav' activeProps={{ className: 'active' }}><h4 className='elements'  preload="intent">ABOUT US</h4></Link>
          <Link to="/services" className='nav' activeProps={{ className: 'active' }}><h4 className='elements'  preload="intent">SERVICES</h4></Link>
        </div>
        <div className='buttons'>
            <Link to="/register/register_home" className='registers' ><h2 className='register'>Register your property</h2></Link>
            <Link to="/user/auth" className='registers'><h2 className='search'>Search property</h2></Link>
        </div>
        
      </div>
      <Outlet />
    </React.Fragment>
  )
}
