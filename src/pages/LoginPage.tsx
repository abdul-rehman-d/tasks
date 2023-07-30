import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider"

function LoginPage() {
  const { login } = useContext(AuthContext);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const email = event.currentTarget.email;
    const password = event.currentTarget.password;
    login(email.value, password.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input type="email" id="email" />
      <label htmlFor="password">Password</label>
      <input type="password" id="password" />
      <button type="submit">Login</button>
    </form>
  )
}

export default LoginPage;
