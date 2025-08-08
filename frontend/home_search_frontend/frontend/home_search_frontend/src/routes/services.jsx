import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/services')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <div className="services">
  <h2 className='about'>Our Services</h2>
  <hr className="about_line"/>
  <ul className='services_list'>
    <li>🏠 Property Search (Buy/Rent)</li>
    <li>📤 Post Your Property</li>
    <li>✅ Verified Listings</li>
    <li>🏢 Commercial Space Listings</li>
    <li>📞 Direct Contact with Owners</li>
  </ul>
</div>
<h1 className="responsibility">"Your Home, Our Responsibility"</h1>

  </div>
}
