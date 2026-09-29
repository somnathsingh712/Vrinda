import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

// Authentication
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard
import Dashboard from "./pages/Dashboard";

// Animals
import Animals from "./pages/Animals";
import AnimalDetails from "./pages/AnimalDetails";
import RegisterAnimal from "./pages/RegisterAnimal";
import AnimalHealth from "./pages/AnimalHealth";
import AddHealthRecord from "./pages/AddHealthRecord";
import AnimalVaccinations from "./pages/AnimalVaccinations";

// Rescue
import RescueRequests from "./pages/RescueRequests";
import RescueDetails from "./pages/RescueDetails";
import NewRescueRequest from "./pages/NewRescueRequest";

// Health
import Health from "./pages/Health";

// Vaccinations
import Vaccinations from "./pages/Vaccinations";
import AddVaccination from "./pages/AddVaccination";

// Volunteers
import Volunteers from "./pages/Volunteers";
import NewVolunteer from "./pages/NewVolunteer";
import VolunteerDetails from "./pages/VolunteerDetails";

// Settings
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ===================================== */}
        {/* PUBLIC ROUTES */}
        {/* ===================================== */}

        <Route
  path="/login"
  element={<Login />}
/>

<Route
  path="/register"
  element={<Register />}
/>


        {/* ===================================== */}
        {/* PROTECTED ROUTES */}
        {/* ===================================== */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            {/* ================================= */}
            {/* DASHBOARD */}
            {/* ================================= */}

            <Route
              path="/"
              element={<Dashboard />}
            />


            {/* ================================= */}
            {/* ANIMALS */}
            {/* ================================= */}

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

            {/* Animal Health */}

            <Route
              path="/animals/:animalId/health"
              element={<AnimalHealth />}
            />

            <Route
              path="/animals/:animalId/health/add"
              element={<AddHealthRecord />}
            />

            {/* Animal Vaccinations */}

            <Route
              path="/animals/:animalId/vaccinations"
              element={<AnimalVaccinations />}
            />


            {/* ================================= */}
            {/* RESCUE */}
            {/* ================================= */}

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


            {/* ================================= */}
            {/* HEALTH */}
            {/* ================================= */}

            <Route
              path="/health"
              element={<Health />}
            />


            {/* ================================= */}
            {/* VACCINATIONS */}
            {/* ================================= */}

            <Route
              path="/vaccinations"
              element={<Vaccinations />}
            />

            <Route
              path="/vaccinations/add"
              element={<AddVaccination />}
            />


            {/* ================================= */}
            {/* VOLUNTEERS */}
            {/* ================================= */}

            <Route
              path="/volunteers"
              element={<Volunteers />}
            />

            <Route
              path="/volunteers/new"
              element={<NewVolunteer />}
            />

            <Route
              path="/volunteers/:volunteerId"
              element={<VolunteerDetails />}
            />


            {/* ================================= */}
            {/* SETTINGS */}
            {/* ================================= */}

            <Route
              path="/settings"
              element={<Settings />}
            />

          </Route>

        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;