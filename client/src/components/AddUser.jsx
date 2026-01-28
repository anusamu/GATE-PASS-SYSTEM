import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Button,
  Stack,
} from "@mui/material";

const AddUserDialog = ({
  open,
  onClose,
  formData,
  handleChange,
  handleAddUser,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle fontWeight={900}>Add New User</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            select
            label="Role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="hod">HOD</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
            <MenuItem value="security">Security</MenuItem>
          </TextField>

          {formData.role === "hod" && (
            <TextField
              select
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
            >
                  <MenuItem value="IT">IT</MenuItem>
                                  <MenuItem value="Admin">ADMIN</MenuItem>
                                  <MenuItem value="Finance">FINANCE</MenuItem>
                                  <MenuItem value="crm">CRM</MenuItem>
                                   <MenuItem value="legal">LEGAL</MenuItem>
                                   <MenuItem value="electrical">ELECTRICAL</MenuItem>
                                   <MenuItem value="mep">MEP</MenuItem>
                                   <MenuItem value="civil">CIVIL</MenuItem>
            </TextField>
          )}

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleAddUser}
          disabled={
            !formData.name ||
            !formData.email ||
            !formData.role ||
            !formData.password ||
            (formData.role === "hod" && !formData.department)
          }
        >
          Create User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
