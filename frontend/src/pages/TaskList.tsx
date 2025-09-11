import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Paper,
  Divider,
  Tooltip,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import AddIcon from "@mui/icons-material/Add";
import axiosClient from "../api/axiosClient";
import { Task } from "../types/Task";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get("/tasks")
      .then((res) => {
        setTasks(res.data.tasks);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (e: React.FormEvent, id: number) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.delete(`/tasks/${id}`, {});
      setTasks((prev) => prev.filter((item) => item.id !== id));
      setSnackbarMsg("Task deleted successfully ✅");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch(err) {
      console.error(err);
      setSnackbarMsg("Failed to delete task ❌");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  if (loading)
    return (
      <CircularProgress sx={{ display: "block", m: "50px auto" }} />
    );

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography 
          variant="h4"
          sx={(theme) => ({
            fontWeight: "bold",
            mb: 2,
            [theme.breakpoints.down("sm")]: {
              fontSize: "1.5rem",
            },
          })}  
        >
          My Tasks
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filter}
              label="Status"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="in-progress">In Progress</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
            </Select>
          </FormControl>

          <Tooltip title="Add New Task">
            <Fab
              color="info"
              size="small"
              onClick={() => {
                navigate("/create")
              }}
            >
              <AddIcon />
            </Fab>
          </Tooltip>
        </Box>
      </Box>

      {(tasks.length===0) && (
        <Paper
          elevation={3}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: (theme) => `2px solid ${theme.palette.info.light}`,
          }}
        >
            <Box>
              {/* <List disablePadding>
                <ListItem 
                  sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
                secondaryAction={
                  <Box>
                    <Tooltip title="Add New Task">
                      <Fab
                        color="info"
                        size="small"
                        onClick={() => {
                          navigate("/create")
                        }}
                      >
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </Box>
                }
                >
                  <ListItemText
                    disableTypography
                    primary={
                      <Typography
                        variant="h4"
                        component="span"
                        sx={{
                          color:"text.secondary",
                          fontWeight: 500,
                          display: "flex",
                          justifyContent: "center",
                          textAlign: "center"
                          
                        }}
                      >
                        Get started by creating your first task
                      </Typography>
                    }
                  >
                  </ListItemText>
                </ListItem>
              </List> */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "row",
                  textAlign: "center",
                  py: 1.5,
                  px: 2,
                }}
              >
                <Typography
                  variant="h4"
                  component="span"
                  sx={{
                    color:"text.secondary",
                    fontWeight: 500,
                    px: 1.5                  
                  }}
                >
                  Create a task to get started
                </Typography>
                <Tooltip title="Add New Task">
                  <Fab
                    color="info"
                    size="small"
                    onClick={() => {
                      navigate("/create")
                    }}
                  >
                    <AddIcon/>
                  </Fab>
                </Tooltip>
              </Box>
            </Box>
        </Paper>
      )}
      {/* Task List */}
      {tasks.length > 0 && 
      
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          border: (theme) => `2px solid ${theme.palette.info.light}`,
        }}
      >
        <List disablePadding>
          {filteredTasks.map((task, index) => (
            <React.Fragment key={task.id}>
              <ListItem
                sx={{
                  py: 1.5,
                  px: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
                secondaryAction={
                  <Box>
                    <Tooltip title="Edit">
                      <IconButton 
                        edge="end" 
                        sx={{ mr: 1 }}
                        onClick={() => navigate(`/tasks/${task.id}/edit`)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={(e) => handleDelete(e, task.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={task.status === "completed"}
                    disableRipple
                    icon={<TaskAltRoundedIcon />}
                    checkedIcon={<TaskAltRoundedIcon color="info" />}
                  />
                </ListItemIcon>
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{
                        textDecoration:
                          task.status === "completed" ? "line-through" : "none",
                        color:
                          task.status === "completed"
                            ? "text.disabled"
                            : task.status === "in-progress"
                            ? "text.main"
                            : "text.primary",
                        fontWeight: 500,
                        
                      }}
                    >
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <Box
                      component="div"
                      sx={(theme) => ({
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        fontSize: "0.85rem", 
                        opacity: 0.8,
                        gap: 1,
                        [theme.breakpoints.down("sm")]: {
                          flexDirection: "column", // stack status + deadline on small screens
                          alignItems: "flex-start",
                        },
                      })}
                    >
                      <Typography variant="body2" component="span">Status: {task.status}</Typography>
                      <Typography variant="body2" component="span">
                        Deadline: {dayjs(task.deadline).format("MM/DD/YYYY")}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < filteredTasks.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>}

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TaskList;
