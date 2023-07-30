import { useContext } from "react"
import { AuthContext } from "../contexts/AuthProvider"
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authIsReady, currentUser, logout } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
      </ul>
      {
        (authIsReady && currentUser) ? (
          <div>
            <p>{currentUser.email}</p>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <></>
        )
      }
    </nav>
  )
}

export default Navbar;
