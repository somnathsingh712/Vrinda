import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        api.get("/")
            .then((response) => {
                setMessage(response.data.message);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div style={{ padding: "40px" }}>
            <h1>Vrinda</h1>
            <h2>{message}</h2>
        </div>
    );
}

export default App;