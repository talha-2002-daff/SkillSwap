import { useState } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

function App() {

    const savedUser = localStorage.getItem("user"); // prevent logout when I ferfeshn the page

    const [user, setUser] = useState(
        savedUser ? JSON.parse(savedUser) : null
    );

    const [page, setPage] = useState(
        savedUser ? "dashboard" : "login"
    );


    const handleLogin = (userData) => {

        setUser(userData);

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setPage("dashboard");
    };


    const handleLogout = () => {

        setUser(null);

        localStorage.removeItem("user");

        setPage("login");
    };


    if (page === "dashboard") {

        return (
            <Dashboard
                user={user}
                onLogout={handleLogout}
            />
        );

    }


    if (page === "register") {

        return (
            <Register
                onRegisterSuccess={() => setPage("login")}
                onLogin={() => setPage("login")}
            />
        );

    }


    return (
        <Login
            onLoginSuccess={handleLogin}
            onRegister={() => setPage("register")}
        />
    );
}

export default App;