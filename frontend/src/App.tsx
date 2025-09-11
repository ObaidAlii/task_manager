import React, {useState, useMemo} from 'react';
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createAppTheme } from './theme';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from './pages/Login';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import { SnackbarProvider } from './context/SnackbarContext';
import Layout from './components/Layout';

const App: React.FC = () => {
  const [mode, setMode] = useState<"light" | "dark">((localStorage.getItem("theme") as "light" | "dark") || "light");
  
  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider>
        <Router>
          <Routes>
            <Route element={<Layout mode={mode} toggleTheme={toggleTheme} />}>
              <Route path="/register" element={ <Register/> }/>
              <Route path="/login" element={ <Login/> }/>
              <Route path="/tasks" element={ 
                <ProtectedRoute>
                  <TaskList/>
                </ProtectedRoute>
              }/>
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateTask />
                </ProtectedRoute>
              }/>
              <Route path="/tasks/:id/edit" element={
                <ProtectedRoute>
                  <EditTask />
                </ProtectedRoute>
              }/>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <TaskList/>
                  </ProtectedRoute>
                }
                />
            </Route>
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
