import { Link, NavLink } from 'react-router-dom'

function Navbar() {
  return (
    <div className='w-screen h-16 shadow-lg bg-[#FDE1EF] flex items-center px-4 justify-between z-10'>
      <Link to='/home' className='flex items-center gap-2'>
        <img src="/Logo.png" alt="Desiary" className='h-12' />
      </Link>
      <div className='flex items-center gap-6 text-lg h-full' >
        <NavLink to='/home/user/wishlist' className={({isActive}) => isActive ? "border-b-4 border-[#FEAD8C] h-full flex items-center" : ""}>Wishlist</NavLink>
        <NavLink to='/home/user/travel' className={({isActive}) => isActive ? "border-b-4 border-[#FEAD8C] h-full flex items-center" : ""}>Travel</NavLink>
        <NavLink to='/home/user/memories' className={({isActive}) => isActive ? "border-b-4 border-[#FEAD8C] h-full flex items-center" : ""}>Memories</NavLink>
        {/* <NavLink to='/home/user/itineray' className={({isActive}) => isActive ? "border-b-4 border-[#FEAD8C] h-full flex items-center" : ""}>Itineray</NavLink> */}
        <NavLink to='/home/user/journal' className={({isActive}) => isActive ? "border-b-4 border-[#FEAD8C] h-full flex items-center" : ""}>Journal</NavLink>
        <Link to='/home/user' className="size-10 rounded-full bg-[#E5F9F0] border">
            <img src="/user.png" alt="" className='size-full'/>
        </Link>
      </div>
    </div>
  )
}

export default Navbar
