import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import ProtectedRoute from "../components/layout/ProtectedRoute";

import Landing from "../pages/Landing";
import Login from "../pages/Login";
import Register from "../pages/Register";
import WazMap from "../pages/WazMap";
import TripDetail from "../pages/TripDetail";

import MyWorld from "../pages/MyWorld";
import Profile from "../pages/Profile";
import AddFlag from "../pages/AddFlag";
import EditTrip from "../pages/EditTrip";
import Ideas from "../pages/Ideas";
import Layout from "../components/layout/Layout";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/waz-map" element={<WazMap />} />
            <Route path="/trip/:id" element={<TripDetail />} />

            <Route
              path="/my-world"
              element={
                <ProtectedRoute>
                  <MyWorld />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile/:id"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-flag"
              element={
                <ProtectedRoute>
                  <AddFlag />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-trip/:id"
              element={
                <ProtectedRoute>
                  <EditTrip />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ideas"
              element={
                <ProtectedRoute>
                  <Ideas />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
