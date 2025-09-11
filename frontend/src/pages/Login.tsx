import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Box, Divider, Alert, IconButton } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axiosClient from "../api/axiosClient";
import { GoogleLogin } from "@react-oauth/google";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as {state?: {from?: string}};

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const redirectTo = location.state?.from || "/tasks";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if(!email || !password){
      setErr("Please enter email and password.");
      return;
    }
    try {
      setLoading(true);
      const res = await axiosClient.post("/login", {email, password});
      localStorage.setItem("token", res.data.token);
      navigate(redirectTo, {replace: true});
    } catch (e: any){
      setErr(e.response?.data?.message || "Invalid Credentials.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const idToken = credentialResponse?.credential;
      if(!idToken) throw new Error("Missing Google Credentials.");
      const res = await axiosClient.post("/google", {idToken});
      localStorage.setItem("token", res.data.token);
      navigate(redirectTo, {replace: true});
    } catch (e: any) {
      setErr(e.response?.data?.message || "Google Login Failed.")
    } finally {
      setLoading(false);
    }
  }
  return (
    <Container maxWidth="sm" sx={{py: {xs: 4, md: 6}}}>
      <Paper elevation={4} sx={{p: {xs: 3, md: 5}, borderRadius: 4}}>
        <Typography variant="h4" textAlign="center" mb={2}>
          Welcome back!
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Login with your email or continue with google.
        </Typography>
        {err && (
          <Alert severity="error" sx={{mb: 2}}>
            {err}
          </Alert>
        )}

        <Box component="form" onSubmit={handleLogin} display="flex" flexDirection="column" gap={2}>
          <TextField 
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField 
            label="Password"
            type={showPw ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPw((s) => !s)}
                    edge="end"
                  >
                    {showPw ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )
              }
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading} sx={{mt: 1}}>
            {loading ? "Please wait..." : "Login"}
          </Button>
        </Box>
        
        <Divider sx={{my: 3}}>OR</Divider>

        <Box display="flex" justifyContent="center">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess} 
              onError={() => setErr("Google Login Failed.")}
            />
        </Box>
        <Typography textAlign="center" mt={3}>
          New here?{" "}
          <Button variant="text" onClick={() => navigate("/register")}>
            Create an account
          </Button>
        </Typography>
      </Paper>
    </Container>
  )
}

export default Login;