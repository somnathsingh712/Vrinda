import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import AnimalHealth from "./pages/AnimalHealth";

import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import RegisterAnimal from "./pages/RegisterAnimal";
import RescueRequests from "./pages/RescueRequests";
import Health from "./pages/Health";
import Vaccinations from "./pages/Vaccinations";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route
            path="/"
            element={<Dashboard />}
          />
    <Route
    path="/animals/:animalId/health"
    element={<AnimalHealth />}
/>
          <Route
            path="/animals"
            element={<Animals />}
          />

          <Route
            path="/animals/register"
            element={<RegisterAnimal />}
          />

          <Route
            path="/rescue"
            element={<RescueRequests />}
          />

          <Route
            path="/health"
            element={<Health />}
          />

          <Route
            path="/vaccinations"
            element={<Vaccinations />}
          />

          <Route
            path="/settings"
            element={<Settings />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;