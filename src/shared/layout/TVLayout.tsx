import React from 'react';
import { Outlet } from 'react-router-dom';

export function TVLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white overflow-hidden">
      <Outlet />
    </div>
  );
}
