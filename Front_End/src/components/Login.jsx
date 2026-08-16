import { useState } from "react";
import "../Login.css";

function Login({ onLoginSuccess, onRegister }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();
        setMessage("");

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            onLoginSuccess(data.user);

        } catch (error) {

            console.error(error);
            setMessage("Cannot connect to server.");

        }
    };

    return (
        <div className="login-page">

            <div className="login-box">

                <h1>SkillSwap</h1>

                <h2>Student Login</h2>

                <form onSubmit={handleLogin}>

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Login
                    </button>

                </form>


                {message && (
                    <p className="login-message">
                        {message}
                    </p>
                )}


                <p className="register-text">
                    Don't have an account?
                </p>

                <button
                    onClick={onRegister}
                    className="register-button"
                >
                    Register
                </button>

            </div>

        </div>
    );
}

export default Login;