import {
  Palette,
  Heart,
  Circle,
} from "lucide-react";

import "./Header.css";

const Header = () => {
  return (
    <header className="header">

      {/* Working Status */}
      <div className="working-status">
        <span className="status-dot">
          <Circle size={7} fill="currentColor" />
        </span>

        <strong>1136</strong>

        <span className="status-text">
          working
        </span>
      </div>


      {/* Theme Button */}
      {/* <button className="theme-button">
        <Palette size={17} />

        <span>Change Theme</span>
      </button> */}


      {/* Navigation */}
      <nav className="navigation">

        <button className="nav-button">
          About
        </button>

        <button className="nav-button">
          FAQ
        </button>

        <button className="nav-button support-button">
          <Heart
            size={15}
            fill="currentColor"
          />

          <span>Support</span>
        </button>

      </nav>

    </header>
  );
};

export default Header;