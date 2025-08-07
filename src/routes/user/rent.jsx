import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { FaSearch, FaDirections, FaSearchLocation, FaHome, FaSquare } from 'react-icons/fa';
import { MdBalcony } from 'react-icons/md';
import Api from '../../../utility/login_class.jsx';
import { useNavigate } from '@tanstack/react-router';
import { MdArrowBack } from 'react-icons/md';

export const Route = createFileRoute('/user/rent')({
  beforeLoad: () => {
    const token = sessionStorage.getItem('canAccessVerifications');
    if (!token) {
      return redirect({ to: '/user/user-login' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const [city, setcity] = useState('');
  const [area, setarea] = useState('');
  const [houses, sethouses] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState('');
  const [profile, setprofile] = useState({});
  const [viewmode, setviewMode] = useState('houses');
  const [interest, setinterest] = useState([]);
  const [extractedhouses, setextractedhouses] = useState([])
  const [interestedHouses, setInterestedHouses] = useState([]);
  const [singlehouse, setsinglehouse] = useState('')
  const [previousViewMode, setPreviousViewMode] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const token = localStorage.getItem('login');
        const api = new Api('http://localhost:8000/houses/rent-all-houses', 'GET', token);
        const data = await api.Apihandle();

        if (!data || !data.success) {
          seterror(data.message || 'Failed to fetch houses');
        } else {
          sethouses(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        console.error('Error fetching houses:', err);
        seterror('Something went wrong while fetching houses.');
      }
    };

    fetchHouses();
  }, []);

  useEffect(() => {
  const saved = localStorage.getItem('interestedHouses');
  if (saved) {
    setInterestedHouses(JSON.parse(saved));
  }
}, []);

  const buysearch = async(e)=>{
    e.preventDefault()
    setloading(true)
    seterror('')

    const token = localStorage.getItem('login');

    const response = new Api("http://localhost:8000/houses/rent-house-search", "POST" , {
      city,
      area
    },token)
    const data = await response.Apihandle()
    if(!data || !data.success){
      seterror(data.message || "Something went Wrong")
    }
    else{
       setextractedhouses(Array.isArray(data.data.houses) ? data.data.houses : []);
      setviewMode('buy-search')
    }
    setloading(false)

  }

  const userprofile = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror('');

    try {
      const response = new Api('http://localhost:8000/user/profile', 'GET');
      const data = await response.Apihandle();

      if (!data.success) {
        seterror(data.message || 'User not Found , Please log in');
      } else {
        setprofile(data.data || {});
        setviewMode('user-profile');
      }
    } catch (error) {
      seterror(error || 'Something Went Wrong');
    }

    setloading(false);
  };

  const userinterest = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror('');

    try {
      const response = new Api('http://localhost:8000/user/interests', 'GET');
      const data = await response.Apihandle();

      if (!data.success) {
        seterror(data.message || 'Unable to Find user, please login');
      } else {
        setinterest(data.data || []);
        setviewMode('user-interest');
      }
    } catch (error) {
      seterror(error || 'Something Went Wrong');
    }

    setloading(false);
  };

  const hanldelogout = async (e) => {
    e.preventDefault();

    const api = new Api('http://localhost:8000/user/logout', 'POST');
    const data = await api.Apihandle();

    if (data.success) {
      alert(data.message || 'Logged out successfully');
      localStorage.removeItem('canAccessVerification');
      localStorage.removeItem('login');
      navigate({ to: '/user/auth' });
    } else {
      alert(data.message || 'Logout failed');
    }
  };
  const interesthandle = async (houseId) => {
    seterror('');
    setloading(true);
  
      if (interestedHouses.includes(houseId)) {
      alert("Already Interested");
      setloading(false);
      return;
    }
  
    const token = localStorage.getItem('login');
  
    try {
      const response = new Api(`http://localhost:8000/houses/create-interest/${houseId}`, "POST", { data: true }, token);
      const data = await response.Apihandle();
  
      if (!data.success) {
        seterror(data.message);
      } else {
        const updated = [...interestedHouses, houseId];
      setInterestedHouses(updated);
      localStorage.setItem('interestedHouses', JSON.stringify(updated));  
      }
    } catch (err) {
      seterror("Something went wrong." , err);
    }
  
    setloading(false);
  };
  
      const singlehousehandle = async(houseId)=>{ 
      seterror('')
      setloading(true)
  
      const token = localStorage.getItem('login');
  
      const response = new Api(`http://localhost:8000/houses/single-house/${houseId}`,"GET",token)
      const data = await response.Apihandle()
      if(!data.success){
        seterror(data.message)
      }else{
        setsinglehouse(data.data)
      setviewMode('single-house')
      setPreviousViewMode(viewmode);
      }
  
    }

  return (
    <div className='buy-page'>
      {error && <div className="error-user">{error}</div>}
      {/* SEARCH BOX */}
       {(viewmode === 'buy-search' || viewmode === 'user-profile' || viewmode === 'user-interest') ? <button className='back-to-list' onClick={()=>setviewMode('houses')}><MdArrowBack/></button> : null}
      <div className='search-box'>
        <form onSubmit={buysearch}>
        <input
          className='search-city'
          type='text'
          value={city}
          onChange={(e) => setcity(e.target.value)}
          placeholder='Enter city'
        />
        <input
          className='search-area'
          type='text'
          value={area}
          onChange={(e) => setarea(e.target.value)}
          placeholder='Enter area'
        />
        <button className='search-button'>
          <FaSearch />
        </button>
        </form>
        <button className='user-profile' onClick={userprofile}>Profile</button>
      </div>


{viewmode === 'buy-search' && (
  Array.isArray(extractedhouses) && extractedhouses.length === 0 ? (
    <h1>Sorry, no houses found for your search.</h1>
  ) : (
    extractedhouses.map((house, index) => (
              <div className='buy-card' key={house._id || index}>
                <div>
                  <div className='title-9'>
                    <h2>{house.room} House for Rent In {house.area}</h2>
                    <h4 className='price-tag'>₹{house.price}</h4>
                  </div>
                  <p className='subtitle'>
                    <span className='icon'><FaDirections /></span> {house.house_type}, {house.colony}, {house.street}
                  </p>
                  <div className='near'>
                    <h4 className='location'><FaSearchLocation /></h4>
                    <h4 className='near_by'>Nearby</h4>
                    <h4 className='near_by_places'>{house.near_by_places}</h4>
                  </div>
                  <div className='features'>
                    <div className='furnishing'>
                      <h3><FaHome /></h3>
                      <h3>{house.furnishing_status}</h3>
                    </div>
                    <div className='sqft'>
                      <h3><FaSquare /></h3>
                      <h3>{house.square_feet} sqft</h3>
                    </div>
                    <div className='md'>
                      <h3><MdBalcony /></h3>
                      <h3>Balcony - {house.balcony ? 'Yes' : 'No'}</h3>
                    </div>
                  </div>
                  <div className='interested'>
                    <h2 onClick={() => singlehousehandle(house._id)} className='know'>Know More</h2>
                    <h2 onClick={() => interesthandle(house._id)} className='know'>{interestedHouses.includes(house._id) ? "Interested" : "Interest"}</h2>
                  </div>
                </div>
              </div>
    ))
  )
)}


      {/* VIEW: HOUSES */}
      {viewmode === 'houses' && (
        <div>
          {houses.length === 0 ? (
            <p>No houses found.</p>
          ) : (
            houses.map((house, index) => (
              <div className='buy-card' key={house._id || index}>
                <div>
                  <div className='title-9'>
                    <h2>{house.room} House for Rent In {house.area}</h2>
                    <h4 className='price-tag'>₹{house.price}</h4>
                  </div>
                  <p className='subtitle'>
                    <span className='icon'><FaDirections /></span> {house.house_type}, {house.colony}, {house.street}
                  </p>
                  <div className='near'>
                    <h4 className='location'><FaSearchLocation /></h4>
                    <h4 className='near_by'>Nearby</h4>
                    <h4 className='near_by_places'>{house.near_by_places}</h4>
                  </div>
                  <div className='features'>
                    <div className='furnishing'>
                      <h3><FaHome /></h3>
                      <h3>{house.furnishing_status}</h3>
                    </div>
                    <div className='sqft'>
                      <h3><FaSquare /></h3>
                      <h3>{house.square_feet} sqft</h3>
                    </div>
                    <div className='md'>
                      <h3><MdBalcony /></h3>
                      <h3>Balcony - {house.balcony ? 'Yes' : 'No'}</h3>
                    </div>
                  </div>
                  <div className='interested'>
                    <h2 onClick={() => singlehousehandle(house._id)} className='know'>Know More</h2>
                    <h2 onClick={() => interesthandle(house._id)} className='know'>{interestedHouses.includes(house._id) ? "Interested" : "Interest"}</h2>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW: PROFILE */}
      {viewmode === 'user-profile' && (
        <div className='user-profiles'>
          <button className='back-search' onClick={() => setviewMode('houses')}>Back to Search</button>
          <h1>Name - {profile.user?.name}</h1>
          <h2>Email - {profile.user?.email}</h2>
          <h3>Mobile Number - {profile.user?.mobile_number}</h3>
          <button className='back-search' onClick={userinterest}>User Interested</button>
          <button className='back-search back-logout' onClick={hanldelogout}>Logout</button>
        </div>
      )}

      {/* VIEW: INTERESTED PROPERTIES */}
      {viewmode === 'user-interest' && (
        <div>
          <h2>User's Interested Properties</h2>
          <button className='back-button' onClick={() => setviewMode('user-profile')}>
            Back to Profile
          </button>
          {Array.isArray(interest) && interest.length === 0 ? (
            <h3>Nothing is there</h3>
          ) : (
            interest.map((item) => (
              <div key={item.interest_id} className='interest-card'>
                <h3>Owner: {item.owner.name}</h3>
                <p>Email: {item.owner.email}</p>
                <p>Mobile: {item.owner.mobile_number}</p>
                <h4>House Info:</h4>
                <ul>
                  <li>Type: {item.house.type}</li>
                  <li>Room: {item.house.room}</li>
                  <li>Price: ₹{item.house.price}</li>
                  <li>Size: {item.house.square_feet} sqft</li>
                  <li>City: {item.house.city}, {item.house.state}</li>
                  <li>Area: {item.house.area}</li>
                  <li>Pincode: {item.house.pincode}</li>
                </ul>
              </div>
            ))
          )}
        </div>
      )}

      {viewmode === 'single-house' && singlehouse && (
  <div className="single-house-card">
          <div className="button-row">
        <button onClick={() => setviewMode(previousViewMode || 'houses')}>⬅️ Back</button>
        <button onClick={() => interesthandle(singlehouse._id)}>
          {interestedHouses.includes(singlehouse._id) ? '✅ Interested' : '🤍 Interest'}
        </button>
      </div>
    <div className="card-image-section">
      <img src={singlehouse.image} alt="House" className="house-main-image" />
    </div>

    <div className="card-details-section">
      <h2 className="house-title">{singlehouse.room} House in {singlehouse.area}</h2>
      
      <div className="details-grid">
        <p><strong>Price:</strong> ₹{singlehouse.price}</p>
        <p><strong>Type:</strong> {singlehouse.house_type}</p>
        <p><strong>Room:</strong> {singlehouse.room}</p>
        <p><strong>Square Feet:</strong> {singlehouse.square_feet}</p>
        <p><strong>Loan Eligible:</strong> {singlehouse.loan_eligible ? 'Yes' : 'No'}</p>
        <p><strong>Near By Places:</strong> {singlehouse.near_by_places}</p>
        <p><strong>Bedrooms:</strong> {singlehouse.bedrooms}</p>
        <p><strong>Bathrooms:</strong> {singlehouse.bathrooms}</p>
        <p><strong>Balcony:</strong> {singlehouse.balcony ? 'Yes' : 'No'}</p>
        <p><strong>Furnishing Status:</strong> {singlehouse.furnishing_status}</p>
        <p><strong>Facing Direction:</strong> {singlehouse.facing_direction}</p>
        <p><strong>Floor Number:</strong> {singlehouse.floor_number}</p>
        <p><strong>State:</strong> {singlehouse.state}</p>
        <p><strong>City:</strong> {singlehouse.city}</p>
        <p><strong>District:</strong> {singlehouse.district}</p>
        <p><strong>Area:</strong> {singlehouse.area}</p>
        <p><strong>Colony:</strong> {singlehouse.colony}</p>
        <p><strong>Street:</strong> {singlehouse.street}</p>
        <p><strong>Pincode:</strong> {singlehouse.pincode}</p>
      </div>

      <p className="house-description"><strong>Description:</strong> {singlehouse.description}</p>
      <p className="house-amenities"><strong>Amenities:</strong> {singlehouse.amenities}</p>


    </div>
  </div>
)}

      

    </div>
  );
}

