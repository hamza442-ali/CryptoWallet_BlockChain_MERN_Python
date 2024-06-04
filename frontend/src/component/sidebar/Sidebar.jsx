import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
// import logo from "../../assets/images/logo.jpeg"




library.add(fas);

export const Sidebar = ({ data}) => {
  const [isExtended, setIsExtended] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  // const toggleSidebar = () => {
  //   setIsExtended(!isExtended);
  // };

  const handleMouseEnter = () => {
    setIsExtended(true);
  };

  const handleMouseLeave = () => {
    setIsExtended(false);
  };

  const handleMenuClick = (index) => {
    setActiveMenu(activeMenu === index ? null : index);
  };


  return (
    <nav
      className={`${
        isExtended
          ? 'w-64 transition-width duration-300 ease-in-out'
          : 'w-16 transition-width duration-300 ease-in-out'
      } h-screen bg-gray-800 text-white fixed top-0 left-0`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center justify-between p-4 ">
        {isExtended ? (
          <div className="flex items-center">
            <div className="mr-2">
              {/* <FontAwesomeIcon icon={logo} size="lg" /> */}
              {/* <img src={logo} alt="DepEase" className="w-10 h-8 mr-2 rounded-full" /> */}
            </div>
            <div className="font-semibold">My Wallet</div>
          </div>
        ) : (
          <div className="mr-2">
            <FontAwesomeIcon icon="random" size="lg" />
            {/* <img src={logo} alt="DepEase" className="w-10 h-8 mr-2 rounded-full" /> */}
          </div>
        )}
      </div>
      <ul>
        {data.map((item, index) => (
          <li key={index}>
            <div
              className={`${
                isExtended
                  ? 'flex items-center justify-between pl-6 pr-4 py-3 hover:bg-blue-600 hover:text-white cursor-pointer'
                  : 'flex items-center p-4 hover:bg-blue-600 hover:text-white cursor-pointer'
              }`}
              onClick={() => handleMenuClick(index)}
            >
              <div className="flex items-center">
                <span className="mr-2">
                  <FontAwesomeIcon icon={item.icon} size="lg" />
                </span>
                <span>{isExtended && item.label}</span>
              </div>
              {isExtended && item.submenus.length > 0 && (
                <span>
                  <FontAwesomeIcon
                    icon={activeMenu === index ? 'angle-up' : 'angle-down'}
                    size="xs"
                  />
                </span>
              )}
            </div>
            {isExtended &&
              item.submenus.length > 0 &&
              activeMenu === index && (
                <ul>
                  {item.submenus.map((submenu, subIndex) => (
                    <li key={subIndex}>
                      <Link
                        to={submenu.path}
                        className="flex items-center py-3 pl-12 pr-4 hover:bg-blue-600 hover:text-white"
                      >
                        <span className="mr-2">
                          <FontAwesomeIcon icon={submenu.icon} size="lg" />
                        </span>
                        <span>{submenu.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
          </li>
        ))}
      </ul>


    </nav>
  );
};

// export default Sidebar;
