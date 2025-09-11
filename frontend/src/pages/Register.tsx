import React, {useState} from "react";
import { Container, Paper, Typography, TextField, Button, Box, Divider, Alert } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleRegister = async () => {
    setErr(null);
    if(!name || !email || !password){
      setErr("All fields are required.");
      return;
    }
    if(password !== confirmPassword){
      setErr("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await axiosClient.post("/register", {name, email, password});
      navigate("/login");
    } catch (e: any){
      setErr(e?.response?.data?.message || "Registration Failed.");
    } finally{
      setLoading(false);
    }
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      const idToken = credentialResponse?.credential;
      if(!idToken) throw new Error("Missing Google Credentials.");
      const res = await axiosClient.post("/google", {idToken});
      localStorage.setItem("token", res.data.token);
      navigate("/tasks");
    } catch(e: any) {
      setErr(e?.response?.data?.message || "Google Signup Failed.");
    } finally{
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={4} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4 }}>
        <Typography variant="h4" mb={2} textAlign="center">Create your account</Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
          Sign up with email or continue with Google
        </Typography>
        
        {err && (
          <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>
        )}
        
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
          />
          <Button 
            variant="contained" 
            size="large" 
            onClick={handleRegister} 
            disabled={loading} 
            sx={{ mt: 1 }}
          >
            {loading ? "Please wait..." : "Create Account"}
          </Button>
        </Box>
        <Divider sx={{my: 3}}>OR</Divider>
        <Box display="flex" justifyContent="center">
          <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setErr("Google sign-in failed")} />
        </Box>

        <Typography>
          Already have an account?{" "}
          <Button
            variant="text"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Typography>
      </Paper>
    </Container>
  )
}

export default Register;