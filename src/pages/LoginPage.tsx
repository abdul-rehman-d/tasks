import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider"
import Input from "../components/Input";

type Errors = {
  email?: string;
  password?: string;
}

function LoginPage() {
  const { login, authIsReady } = useContext(AuthContext);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
  }>({} as Errors);
  const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting
    const form = event.currentTarget;

    const email = form.email.value;
    const password = form.password.value;
    const errors = {} as Errors;
    if (!email) {
      errors["email"] = "Email is required";
    }
    if (!password) {
      errors["password"] = "Password is required";
    }

    setErrors(errors);

    if (email && password) {
      await login(email, password);
      form.reset();
    }
    
    setIsSubmitting(false);
  }

  return (
    <div className="relative flex flex-col justify-center h-screen overflow-hidden p-4 bg-primary-content">
    <div className="w-full p-6 m-auto bg-white rounded-md shadow-md md:max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-primary mb-2">
          Task Management System
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
            <Input
              name="email"
              label="Email"
              type="email"
              id="email"
              placeholder="Enter Email"
              error={errors.email ?? ''}
            />
            <Input
              name="password"
              label="Password"
              type="password"
              id="password"
              placeholder="Enter Password"
              error={errors.password ?? ''}
            />
            <div>
                <button className="btn btn-primary" disabled={isSubmitting || !authIsReady}>
                  Login
                </button>
            </div>
        </form>
    </div>
</div>
  )
}

export default LoginPage;
