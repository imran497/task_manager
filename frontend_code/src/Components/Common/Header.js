import React, { useState } from "react";
import { useHistory } from "react-router-dom";

function Header(){
  const [showLogout, setShowLogout] = useState(false);
  const hist = useHistory();

  const logout = () => {
    localStorage.removeItem("u");
    hist.push("/");
  };

  return(
    <header className="header-container">
      <div className="header-main">
        <div className="header-user">
          <a className="header-email" onClick={() => setShowLogout(!showLogout)}>im1@gmail.com</a>
          {
            showLogout &&
            <button className="header-logout btn btn-primary" onClick={logout}>Logout</button>
          }
        </div>
      </div>
    </header>
  );
}

export default Header;
