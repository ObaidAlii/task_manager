import React from "react";
import { Card, CardContent, Typography, Chip, CardActions, Button, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import {Task} from "../types/Task";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useSnackbar } from "../context/SnackbarContext";

interface Props{
  task: Task;
  onDelete : (id: number, success: boolean) => void
}

const TaskCard: React.FC<Props> = ({task, onDelete}) => {
  const navigate = useNavigate();
  const {showSnackbar} = useSnackbar();

  const handleDelete = async () => {
    if(!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await axiosClient.delete(`/tasks/${task.id}`)
      onDelete(task.id, true);
      showSnackbar("Task deleted successfully ✅", "success");
    } catch(err) {
      console.error("Failed to delete task: ", err);
      onDelete(task.id, false);
      showSnackbar("Failed to delete task ❌", "error");
    }
  }
  
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">{task.title}</Typography>
          <IconButton aria-label="delete task" onClick={handleDelete} color="error">
            <DeleteIcon />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">{task.description}</Typography>
        {task.deadline && (
          <Typography variant="caption" display="block" mt={1}>
            Deadline: {new Date(task.deadline).toLocaleDateString()}
          </Typography>
        )}
        <Chip
          label={task.status}
          color={task.status === "completed" ? "success" : "warning"}
          size="small"
          sx={{mt: 1}}
        />
      </CardContent>
      <CardActions>
        <Button
          size="small"
          onClick={() => navigate(`/tasks/${task.id}/edit`)}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard;