import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./layouts/AppLayout";

import Dashboard from "./pages/Dashboard";
import Animals from "./pages/Animals";
import AnimalDetails from "./pages/AnimalDetails";
import AnimalHealth from "./pages/AnimalHealth";
import AddHealthRecord from "./pages/AddHealthRecord";
import RegisterAnimal from "./pages/RegisterAnimal";

import RescueRequests from "./pages/RescueRequests";
import RescueDetails from "./pages/RescueDetails";
import NewRescueRequest from "./pages/NewRescueRequest";

import Health from "./pages/Health";
import Vaccinations from "./pages/Vaccinations";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AppLayout />}>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Animals */}
          <Route
            path="/animals"
            element={<Animals />}
          />

          <Route
            path="/animals/register"
            element={<RegisterAnimal />}
          />

          <Route
            path="/animals/:animalId"
            element={<AnimalDetails />}
          />

          <Route
            path="/animals/:animalId/health"
            element={<AnimalHealth />}
          />

          <Route
            path="/animals/:animalId/health/add"
            element={<AddHealthRecord />}
          />

          {/* Rescue */}
          <Route
            path="/rescue"
            element={<RescueRequests />}
          />

          <Route
            path="/rescue/new"
            element={<NewRescueRequest />}
          />

          <Route
            path="/rescue/:requestId"
            element={<RescueDetails />}
          />

          {/* Other Pages */}
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