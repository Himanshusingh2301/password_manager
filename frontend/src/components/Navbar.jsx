import React from 'react'

const Navbar = () => {
  return (
    <>
    <nav className='flex justify-between items-center p-4 bg-gray-800 text-white'>
        <div className="logo text-2xl font-bold">
            <h1>Pass Manager</h1>
        </div>
        <ul className="nav-links flex space-x-4 ">
            <li><a className='hover:font-bold transition-all duration-300 ' href="/">Home</a></li>
            <li><a className='hover:font-bold transition-all duration-300' href="/about">About</a></li>
            <li><a className='hover:font-bold transition-all duration-300' href="/contact">Contact</a></li>
        </ul>
    </nav>
    </>
  )
}

export default Navbar