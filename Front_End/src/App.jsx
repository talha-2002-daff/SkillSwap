import { useState } from "react";

import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";


function App() {

    const [page, setPage] = useState("login");

    const [user, setUser] = useState(null);



    const handleLogin = (userData) => {

        setUser(userData);

        setPage("dashboard");

    };



    const handleLogout = () => {

        setUser(null);

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