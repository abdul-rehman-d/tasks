import { useContext } from "react"
import { AuthContext } from "../contexts/AuthProvider"
import { Link } from "react-router-dom";
import LogoutSVG from "./logoutSVG";

const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar bg-primary text-primary-content">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost normal-case text-xl">Task Management</Link>
      </div>
      <div className="navbar-end">
        <span className="hidden lg:block">
          {currentUser?.email}
        </span>
        <div className="tooltip tooltip-bottom" data-tip="Notifications">
          <button className="btn btn-ghost btn-circle">
            <div className="indicator">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="badge badge-xs badge-ghost indicator-item"></span>
            </div>
          </button>
        </div>
        <div className="tooltip tooltip-bottom" data-tip="Logout">
          <button className="btn btn-ghost btn-circle" onClick={logout}>
            <LogoutSVG />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar;