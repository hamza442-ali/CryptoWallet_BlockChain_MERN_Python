import React from 'react';
// import person from "../../assets/images/myPic.jpeg"
// import logo from "../../assets/images/logo_DepEase.png"
import { Link } from 'react-router-dom';
// import { ProfilePage } from '../profile/userProfile';
export const  Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md ">

        <Link href='' className='' >
              
       
        <div className="flex ml-24">
               
              <h1 class="text-3xl">BlockChain</h1>

              
              </div>
              </Link>

              

              

      <div className="flex items-center px-7">
        <ul className="block lg:flex lg:space-x-12">
          
          <li>
            <button className="hover:text-custom-blue focus:outline-none" onClick={() => window.location.href = "/dashboard"}>
              Dashboard
            </button>
          </li>
          <li>
            <button className="hover:text-custom-blue focus:outline-none" onClick={() => window.location.href = "/projects"}>
              Projects
            </button>
          </li>
          <li>
            <button className="hover:text-custom-blue focus:outline-none">Documentation</button>
          </li>
          <li>
            <Link to="/" className="hover:text-custom-blue">
              Tasks
            </Link>
          </li>
          <li>
            <Link to="#" className="mr-10  hover:text-custom-blue">Team</Link>
          </li>
        </ul>
        <div className='flex flex-col'>
         <Link to="/userProfile">
         <span className="ml-2 font-semibold text-gray-600">Ali Hamza</span>
         </Link>
         
         
        
        </div>
        
      </div>
    </nav>
  );
};


