import React from "react";
import './globals.css';
import NavBar from '../../NavBar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
} 