import { createFileRoute } from '@tanstack/react-router';
import { FaHome } from 'react-icons/fa';
import { FaUpload } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa'
import { FaCheckCircle } from 'react-icons/fa'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <div className="home">
           <img className='index_img' src="/1.jpg" alt="" />
           <div className='index_text'>
            <div className="index_card">
            <h1 className='fahome'><FaHome/></h1>
            <hr className="title-line" />
            <h3 className='title'>BUY / RENT A HOUSE</h3>
            <p className='buy'>Your dream home is just a click away - search by your needs, no brokers.</p>
           </div>
           <div className="index_card">
            <h1 className='fahome'><FaUpload/></h1>
            <hr className="title-line" />
            <h3 className='title'>POST YOUR PROPERTY</h3>
            <p className='post'>Have a home to sell or rent ? Post it for free and reach buyers instantly.</p>
           </div>
           <div className="index_card">
            <h1 className='fahome'><FaBuilding/></h1>
            <hr className="title-line" />
            <h3 className='title'>COMMERCICAL SPACES</h3>
            <p className='commercial'>Looking for office or shop space ? Discover perfect places for your business</p>
           </div>
           <div className="index_card">
            <h1 className='fahome'><FaCheckCircle/></h1>
            <hr className="title-line" />
            <h3 className='title'>VERIFIED LISTING</h3>
            <p>No scams , no stress - explore properties verified for your peace of mind</p>
           </div>
           </div>          
      </div>
      <div>
        <h1 className='index_h2'>" MAKE YOUR DREAM HOUSE <span className='index_span'>A REALITY TODAY</span> "</h1>
      </div>
    </div>
   
  )
}
