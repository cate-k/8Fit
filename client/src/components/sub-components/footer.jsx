import React from "react";

const Footer = () => {
  return (
    <div className="footer">
      <p className="text-center">
        &copy; {new Date().getFullYear()} 8Fit
      </p>
    </div>
  );
}

export default Footer;