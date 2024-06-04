import React from 'react'; 
import {Sidebar} from '../component/sidebar/Sidebar';
import { Outlet } from 'react-router-dom';
import sidebarData from '../data/sidebarData.json'
export const MainLayout = () => {
  return (
    <div className="flex">
    <Sidebar data={sidebarData} />
    <div className="flex-1 p-4">
      <Outlet />
    </div>
  </div>
  );
};


