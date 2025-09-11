import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, MenuItem } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../context/SnackbarContext';

const CreateTask: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {showSnackbar} = useSnackbar();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosClient.post("/tasks", {
        title, 
        description, 
        status, 
        deadline: deadline ? deadline.toISOString() : null,
      });
      showSnackbar("Task created successfully ✅", "success");
      navigate("/tasks");
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to create task ❌", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{mt: 5}}>
      <Typography variant='h4' gutterBottom>
        Create New Task
      </Typography>
      <Button
        variant="outlined"
        color="secondary"
        sx={{mb: 2}}
        onClick={() => navigate("/tasks")}
      >
        Back
      </Button>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField 
          label="Title"
          fullWidth
          required
          margin='normal'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField 
          label="Description"
          fullWidth
          required
          multiline
          margin='normal'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField 
          select
          label="Status"
          fullWidth
          margin='normal'
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="in-progress">In Progress</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
        </TextField>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker 
            label="Deadline"
            value={deadline}
            onChange={(newValue: Dayjs | null) => {
              if (newValue && newValue.isBefore(dayjs(), "day")) {
                return;
              }
              setDeadline(newValue);
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                margin: "normal",
                inputProps: { min: dayjs().format("YYYY-MM-DD") },
              },
            }}
            minDate={dayjs()}
          />
        </LocalizationProvider>
        <Button
          type='submit'
          variant='contained'
          color='primary'
          sx={{mt: 2}}
        >
          {loading ? "Creating..." : "Create Task"}
        </Button>
      </Box>
    </Container>
  )
}

export default CreateTask;