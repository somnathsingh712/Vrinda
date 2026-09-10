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
import Health from "./pages/Health";
import Vaccinations from "./pages/Vaccinations";
import Settings from "./pages/Settings";
import NewRescueRequest from "./pages/NewRescueRequest";
import RescueDetails from "./pages/RescueDetails";

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
  path="/rescue/new"
  element={<NewRescueRequest />}
/>
<Route
  path="/rescue/:requestId"
  element={<RescueDetails />}
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