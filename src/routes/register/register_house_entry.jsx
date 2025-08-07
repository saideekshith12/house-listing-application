import { createFileRoute, redirect } from '@tanstack/react-router';
import Api from '../../../utility/login_class.jsx';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';


export const Route = createFileRoute('/register/register_house_entry')({
  beforeLoad: () => {
    const hasVerificationAccess = localStorage.getItem('canAccessVerification') === 'true';
    const accesslogin = localStorage.getItem('login');
    
    if (!hasVerificationAccess || !accesslogin) {
      alert('You are not logged in, please login');
      return redirect({ to: '/register/register_home' });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  const [type, settype] = useState('');
  const [room, setroom] = useState('');
  const [price, setprice] = useState('');
  const [square_feet, setsquare_feet] = useState('');
  const [loan, setloan] = useState('');
  const [near_by_places, setnear_by_places] = useState('');
  const [bedrooms, setbedrooms] = useState('');
  const [bathrooms, setbathrooms] = useState('');
  const [balcony, setbalcony] = useState('');
  const [house_type, sethouse_type] = useState('');
  const [furnishing_status, setfurnishing_status] = useState('');
  const [facing, setfacing] = useState('');
  const [floor, setfloor] = useState('');
  const [description, setDescription] = useState('');
  const [amenities, setamenities] = useState('');
  const [image, setimage] = useState();
  const [state, setstate] = useState('');
  const [district, setdistrict] = useState('');
  const [area, setarea] = useState('');
  const [colony, setcolony] = useState('');
  const [street, setstreet] = useState('');
  const [city, setcity] = useState('');
  const [pincode, setpincode] = useState('');

  const [error, seterror] = useState('');
  const [loading, setloading] = useState(false);
  const [properties, setproperties] = useState([]);
  const [interestby, setinterestby] = useState([]);
  const [viewMode, setViewMode] = useState('form');
  const [profile , setprofile] = useState('')

  const hanldelogout = async (e) => {
    e.preventDefault();
    const api = new Api('http://localhost:8000/owner/logout', 'POST');
    const data = await api.Apihandle();
    if (data.success) {
      alert(data.message || 'Logged out successfully');
      navigate({ to: '/register/register_login' });
    } else {
      alert(data.message || 'Logout failed');
    }
    localStorage.removeItem('canAccessVerification');
    localStorage.removeItem('login');
  };

  const hanldeproperty = async (e) => {
    e.preventDefault();
    setloading(true);
    seterror('');
    try {
      const api = new Api('http://localhost:8000/owner/all-houses', 'GET');
      const data = await api.Apihandle();
      if (data.success) {
        setproperties(data.data || []);
        setViewMode('properties');
      } else {
        seterror(data.message || 'No properties to show');
      }
    } catch (err) {
      console.error(err);
      seterror('Failed to fetch properties');
    } finally {
      setloading(false);
    }
  };

  const handleinterest = async(e)=>{
    e.preventDefault();
    setloading(true);
    seterror('');
    try {
      const api = new Api('http://localhost:8000/owner/interests', 'GET');
      const data = await api.Apihandle();
      if (data.success) {
        setinterestby(data.data || []);
        setViewMode('interests');
      } else {
        seterror(data.message || 'Sorry no one showed interested');
      }
    } catch (err) {
      console.error(err);
      seterror('Failed to fetch Users');
    } finally {
      setloading(false);
    }
  }

    const ownerprofile = async(e)=>{
    e.preventDefault();
    setloading(true);
    seterror('');
    try {
      const api = new Api('http://localhost:8000/owner/profile', 'GET');
      const data = await api.Apihandle();
      if (data.success) {
        setprofile(data.data || []);
        setViewMode('profile');
      } else {
        seterror(data.message || 'Sorry could not fetched your data');
      }
    } catch (err) {
      console.error(err);
      seterror('Failed to fetch Users');
    } finally {
      setloading(false);
    }
  }

const handleform = async (e) => {
  e.preventDefault();
  seterror('');
  setloading(true);

  if (
    !type || !room || !price || !square_feet || !loan || !near_by_places ||
    !bedrooms || !bathrooms || !balcony || !house_type || !furnishing_status ||
    !facing || !floor || !description || !amenities || !image ||
    !state || !district || !area || !colony || !street || !city || !pincode
  ) {
    seterror('All fields are required');
    setloading(false);
    return;
  }

  try {
    const formData = new FormData();

    formData.append("type", type);
    formData.append("room", room);
    formData.append("price", price);
    formData.append("square_feet", square_feet);
    formData.append("loan", loan);
    formData.append("near_by_places", near_by_places);
    formData.append("bedrooms", bedrooms);
    formData.append("bathrooms", bathrooms);
    formData.append("balcony", balcony);
    formData.append("house_type", house_type);
    formData.append("furnishing_status", furnishing_status);
    formData.append("facing", facing);
    formData.append("floor", floor);
    formData.append("description", description);
    formData.append("amenities", amenities);
    formData.append("state", state);
    formData.append("district", district);
    formData.append("area", area);
    formData.append("colony", colony);
    formData.append("street", street);
    formData.append("city", city);
    formData.append("pincode", pincode);
    formData.append("image", image); // Ensure this is a File object

    const token = localStorage.getItem('login'); 

    const response = new Api("http://localhost:8000/owner/house-entry","POST" , formData,token, true)

    const data = await response.Apihandle()

    if (data.success) {
      alert(data.message || 'House entry successful');
      // Optionally clear fields
    } else {
      seterror(data.message || 'House entry failed');
    }
  } catch (error) {
    console.error("Upload error:", error);
    seterror(error.message || 'An error occurred');
  } finally {
    setloading(false);
  }
  settype('');
  setroom('');
  setprice('');
  setsquare_feet('');
  setloan('');
  setnear_by_places('');
  setbedrooms('');
  setbathrooms('');
  setbalcony('');
  sethouse_type('');
  setfurnishing_status('');
  setfacing('');
  setfloor('');
  setDescription('');
  setamenities('');
  setimage(null);
  setstate('');
  setdistrict('');
  setarea('');
  setcolony('');
  setstreet('');
  setcity('');
  setpincode('');
};



  return (
    <div>
      <div className="owner_list">
        <button onClick={hanldeproperty}>Your Properties</button>
        <button onClick={hanldelogout}>Logout</button>
        <button onClick={handleinterest}>Interests Shown</button>
        <button onClick={ownerprofile}>Profile</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p style={{ color: 'green' }}>Loading...</p>}

      {viewMode === 'form' &&  (
        <form className="signup" onSubmit={handleform} encType="multipart/form-data" >
          <h2>Enter Your House Details</h2>
          <div className="owner_signup"><label>Type</label><input value={type} onChange={e => settype(e.target.value)} /></div>
          <div className="owner_signup"><label>Room</label><input value={room} onChange={e => setroom(e.target.value)} /></div>
          <div className="owner_signup"><label>Price</label><input value={price} onChange={e => setprice(e.target.value)} /></div>
          <div className="owner_signup"><label>Square Feet</label><input value={square_feet} onChange={e => setsquare_feet(e.target.value)} /></div>
          <div className="owner_signup"><label>Loan</label><input value={loan} onChange={e => setloan(e.target.value)} /></div>
          <div className="owner_signup"><label>Near By Places</label><input value={near_by_places} onChange={e => setnear_by_places(e.target.value)} /></div>
          <div className="owner_signup"><label>Bedrooms</label><input value={bedrooms} onChange={e => setbedrooms(e.target.value)} /></div>
          <div className="owner_signup"><label>Bathrooms</label><input value={bathrooms} onChange={e => setbathrooms(e.target.value)} /></div>
          <div className="owner_signup"><label>Balcony</label><input value={balcony} onChange={e => setbalcony(e.target.value)} /></div>
          <div className="owner_signup"><label>House Type</label><input value={house_type} onChange={e => sethouse_type(e.target.value)} /></div>
          <div className="owner_signup"><label>Furnishing Status</label><input value={furnishing_status} onChange={e => setfurnishing_status(e.target.value)} /></div>
          <div className="owner_signup"><label>Facing</label><input value={facing} onChange={e => setfacing(e.target.value)} /></div>
          <div className="owner_signup"><label>Floor</label><input value={floor} onChange={e => setfloor(e.target.value)} /></div>
          <div className="owner_signup"><label>Description</label><input value={description} onChange={e => setDescription(e.target.value)} /></div>
          <div className="owner_signup"><label>Amenities</label><input value={amenities} onChange={e => setamenities(e.target.value)} /></div>
          <div className="owner_signup"><label>Image</label>
          <input type="file" name='image'  accept="image/*" onChange={e => setimage(e.target.files[0])} /></div>
          <div className="owner_signup"><label>State</label><input value={state} onChange={e => setstate(e.target.value)} /></div>
          <div className="owner_signup"><label>District</label><input value={district} onChange={e => setdistrict(e.target.value)} /></div>
          <div className="owner_signup"><label>Area</label><input value={area} onChange={e => setarea(e.target.value)} /></div>
          <div className="owner_signup"><label>Colony</label><input value={colony} onChange={e => setcolony(e.target.value)} /></div>
          <div className="owner_signup"><label>Street</label><input value={street} onChange={e => setstreet(e.target.value)} /></div>
          <div className="owner_signup"><label>City</label><input value={city} onChange={e => setcity(e.target.value)} /></div>
          <div className="owner_signup"><label>Pincode</label><input value={pincode} onChange={e => setpincode(e.target.value)} /></div>

          <button type="submit" className="signup_button">Submit</button>
        </form>
      ) 
  
   }<div className="dashboard-container">
  {viewMode === 'properties' && (
    properties.length === 0 ? (
      <h1 className="message">Sorry, no records found</h1>
    ) : (
      <div className="properties-section">
        <h1 className="section-heading">Here are your properties</h1>
        <h2 className="subheading">Total: {properties.length}</h2>
        <div className="card-list">
          {properties.map((property) => (
            <li className="card" key={property._id}>
              <h1 className="property-price">Price - ₹{property.price}</h1>
              <ul>Type - {property.type}</ul>
              <ul>Room - {property.room}</ul>
              <ul>Square Feet - {property.square_feet}</ul>
              <ul>Loan - {property.loan}</ul>
              <ul>Bedrooms - {property.bedrooms}</ul>
              <ul>Bathrooms - {property.bathrooms}</ul>
              <ul>Balcony - {property.balcony}</ul>
              <ul>House Type - {property.house_type}</ul>
              <ul>Furnishing Status - {property.furnishing_status}</ul>
              <ul>Facing - {property.facing}</ul>
              <ul>Floor - {property.floor}</ul>
              <ul>Description - {property.description}</ul>
              <ul>Amenities - {property.amenities}</ul>
              <ul>Image - {property.image}</ul>
              <ul>State - {property.state}</ul>
              <ul>District - {property.district}</ul>
              <ul>Area - {property.area}</ul>
              <ul>Colony - {property.colony}</ul>
              <ul>Street - {property.street}</ul>
              <ul>City - {property.city}</ul>
              <ul>Pincode - {property.pincode}</ul>
            </li>
          ))}
        </div>
        <button className="back-button" onClick={() => setViewMode('form')}>Back to form</button>
      </div>
    )
  )}

  {viewMode === 'interests' && (
    interestby.length === 0 ? (
      <h1 className="message">Sorry, no one has shown interest.</h1>
    ) : (
      <div className="interests-section">
        <h1 className="section-heading">Interested Users</h1>
        <div className="card-list">
          {interestby.map((interest) => (
            <li className="card" key={interest._id}>
              <ul>Name - {interest.user.name}</ul>
              <ul>
                Email - <a href={`mailto:${interest.user.email}`} className="email-link">{interest.user.email}</a>
              </ul>
              <ul>Phone - {interest.user.mobile_number}</ul>
            </li>
          ))}
        </div>
        <h2 className="subheading">Interested Houses</h2>
        <div className="card-list">
          {interestby.map((interest) => (
            <li className="card" key={interest._id}>
              <ul>Type - {interest.house.type}</ul>
              <ul>Room - {interest.house.room}</ul>
              <ul>Price - ₹{interest.house.price}</ul>
              <ul>Square Feet - {interest.house.square_feet}</ul>
              <ul>State - {interest.house.state}</ul>
              <ul>City - {interest.house.city}</ul>
              <ul>Pincode - {interest.house.pincode}</ul>
              <ul>Area - {interest.house.area}</ul>
            </li>
          ))}
        </div>
        <button className="back-button" onClick={() => setViewMode('form')}>Back to form</button>
      </div>
    )
  )}
{viewMode === 'profile' && 
  <div className='owner-profile'>
    <h1 className='owner-name'>Name - {profile.owner.name}</h1>
    <h2 className='email'>E-mail - {profile.owner.email}</h2>
     <button className="back-button" onClick={() => setViewMode('form')}>Back to form</button>
  </div> 
}


</div>
   
    </div>
    
  );
}

