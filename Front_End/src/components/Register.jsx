import { useState } from "react";
import "../Register.css";

function Register({ onRegisterSuccess, onLogin }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name,
                        email,
                        password,
                        bio
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                setError(
                    data.message || "Registration failed"
                );

                return;
            }

            setMessage(
                "Registration successful! You can now login."
            );

            setName("");
            setEmail("");
            setPassword("");
            setBio("");

        } catch (error) {

            console.error(error);

            setError("Cannot connect to server.");

        }
    };

    return (

        <div className="register-page">

            <div className="register-box">

                <h1>SkillSwap</h1>

                <h2>Student Registration</h2>


                <form onSubmit={handleRegister}>

                    <label>Name</label>

                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />


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


                    <label>Bio</label>

                    <textarea
                        placeholder="Tell us about yourself"
                        value={bio}
                        onChange={(e) =>
                            setBio(e.target.value)
                        }
                    />


                    <button
                        type="submit"
                        className="register-submit"
                    >
                        Register
                    </button>

                </form>


                {message && (

                    <p className="register-success">
                        {message}
                    </p>

                )}


                {error && (

                    <p className="register-error">
                        {error}
                    </p>

                )}


                <p className="login-text">
                    Already have an account?
                </p>


                <button
                    onClick={onLogin}
                    className="back-login-button"
                >
                    Back to Login
                </button>

            </div>

        </div>

    );
}

export default Register;