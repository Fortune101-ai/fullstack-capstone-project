import { useState, useEffect } from "react";
import "./LoginPage.css";
import { urlConfig } from "../../config";
import { useAppContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  //insert code here to create useState hook variables for email, password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const bearerToken = sessionStorage.getItem("bearer-token");
  const { setIsLoggedIn } = useAppContext();
  const [, setIncorrect] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("auth-token")) {
      navigate("/app");
    }
  }, [navigate]);
  // insert code here to create handleLogin function and include console.log
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log(`Logging in with email: ${email}`);

    const res = await fetch(`${urlConfig.backendUrl}/api/auth/login`, {
      //Step 1 - Task 7
      method: "POST",
      //Step 1 - Task 8
      headers: {
        "content-type": "application/json",
        ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }), // Only include Authorization if bearerToken exists
      },
      //Step 1 - Task 9
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const json = await res.json();
    console.log("json data", json);
    if (json.authtoken) {
      sessionStorage.setItem("auth-token", json.authtoken);
      setIsLoggedIn(true);
      navigate("/app");
    }
    if (json.error) {
      setIncorrect(json.error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="login-card p-4 border rounded">
            <h2 className="text-center mb-4 font-weight-bold">Login</h2>

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button className="btn btn-primary w-100 mb-3" type="submit">
                Login
              </button>
            </form>
            <p className="mt-4 text-center">
              New here?{" "}
              <a href="/app/register" className="text-primary">
                Register Here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
