import React, { useEffect, useState } from "react";
import { Container, TextField, Button, MenuItem, Typography, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { Task } from "../types/Task";
import { useSnackbar } from "../context/SnackbarContext";

const EditTask: React.FC = () => {
  const { id } = useParams<{id: string}>();
  const navigate = useNavigate();
  const {showSnackbar} = useSnackbar();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [deadline, setDeadline] = useState<Dayjs | null>(null);
  const [initialTask, setInitialTask] = useState<any>(null);

  useEffect(() => {
    axiosClient.get(`/tasks/${id}`).then((res) => {
      const task: Task = res.data;
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setDeadline(task.deadline ? dayjs(task.deadline) : null);
      setInitialTask({
        title: task.title,
        description: task.description,
        status: task.status,
        deadline: task.deadline ? dayjs(task.deadline) : null,
      });
    });
  }, [id]);

  const hasChanged = initialTask && (title !== initialTask.title || description !== initialTask.description || status !== initialTask.status || (deadline && !deadline.isSame(initialTask.deadline)));


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.put(`/tasks/${id}`, {
        title,
        description,
        status,
        deadline: deadline ? deadline.toISOString() : null,
      });
      showSnackbar("Task updated successfully ✅", "success");
      navigate("/tasks");
    } catch (err){
      console.error(err);
      showSnackbar("Failed to update task ❌", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>Edit Task</Typography>
      {!hasChanged && (
        <Button
          variant="outlined"
          color="secondary"
          sx={{mb: 2}}
          onClick={() => navigate("/tasks")}
        >
          Back
        </Button>
      )}
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
          required
          multiline
          rows={3}
        />
        <TextField
          select
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          margin="normal"
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
        {hasChanged && (
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            {loading ? "Updating..." : "Update Task"}
          </Button>
        )}
      </Box>
    </Container>
  )
}

export default EditTask;