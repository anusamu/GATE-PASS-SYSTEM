import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useState } from "react";

const API = "https://gate-pass-system-drti.onrender.com" ;

const HodPassCreate = ({ open, onClose, setPasses }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const initialFormState = {
    assetName: "",
    assetSerialNo: "",
    purpose: "",
    externalPersonName: "",
    externalPersonEmail: "",
    externalPersonPhone: "",
    passType: "",
    returnDateTime: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFormData(initialFormState);
    setImageFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setImageFile(file);
    e.target.value = null;
  };

  /* ================= SUBMIT ================= */
  const handleSubmitPass = async () => {
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) payload.append(key, value);
      });

      if (imageFile) payload.append("photo", imageFile);

      // ✅ HOD ONLY ENDPOINT
      const res = await axios.post(`${API}/hod/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPasses((prev) => [res.data, ...prev]);
      handleClose();
    } catch (err) {
      console.error("ADD PASS ERROR:", err);
      alert(err.response?.data?.message || "Failed to create pass");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      {/* ✅ FIXED DialogTitle */}
      <DialogTitle
        sx={{
          p: 3,
          pb: 1,
          display: "flex",
          justifyContent: "space-between",
          fontWeight: 700,
        }}
      >
        Apply Gate Pass
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* HOD INFO */}
          {role === "hod" && (
            <Box
              sx={{
                bgcolor: "#dcfce7",
                border: "1px solid #22c55e",
                p: 1.5,
                borderRadius: 1,
              }}
            >
              <Typography fontSize={13} fontWeight={600} color="success.main">
                ℹ️ As HOD, this pass will be automatically approved and emailed.
              </Typography>
            </Box>
          )}

          <Typography variant="overline" fontWeight={700}>
            Asset Information
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              name="assetName"
              label="Asset Name"
              value={formData.assetName}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              name="assetSerialNo"
              label="Serial Number"
              value={formData.assetSerialNo}
              onChange={handleChange}
              required
              size="small"
            />
          </Box>

          <TextField
            name="purpose"
            label="Purpose"
            value={formData.purpose}
            onChange={handleChange}
            multiline
            rows={2}
            size="small"
          />

          <Divider />

          <Typography variant="overline" fontWeight={700}>
            External Person
          </Typography>

          <TextField
            name="externalPersonName"
            label="Full Name"
            value={formData.externalPersonName}
            onChange={handleChange}
            required
            size="small"
          />

          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
            <TextField
              name="externalPersonEmail"
              label="Email"
              type="email"
              value={formData.externalPersonEmail}
              onChange={handleChange}
              required
              size="small"
            />
            <TextField
              name="externalPersonPhone"
              label="Phone"
              value={formData.externalPersonPhone}
              onChange={handleChange}
              size="small"
            />
          </Box>

          <Divider />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                formData.passType === "RETURNABLE" ? "1fr 1fr" : "1fr",
              gap: 2,
            }}
          >
            <TextField
              select
              name="passType"
              label="Pass Type"
              value={formData.passType}
              onChange={handleChange}
              required
              size="small"
            >
              <MenuItem value="RETURNABLE">Returnable</MenuItem>
              <MenuItem value="NON_RETURNABLE">Non-Returnable</MenuItem>
            </TextField>

            {formData.passType === "RETURNABLE" && (
              <TextField
                type="datetime-local"
                name="returnDateTime"
                label="Return Date"
                value={formData.returnDateTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                size="small"
              />
            )}
          </Box>

          <Box
            sx={{
              border: "1px dashed #ccc",
              borderRadius: 1,
              p: 2,
              textAlign: "center",
            }}
          >
            {!imageFile ? (
              <Button component="label" startIcon={<UploadIcon />}>
                Upload Asset Photo
                <input hidden type="file" onChange={handleImageUpload} />
              </Button>
            ) : (
              <Chip
                label={imageFile.name}
                onDelete={() => setImageFile(null)}
                deleteIcon={<DeleteIcon />}
              />
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmitPass}
          disabled={loading}
        >
          {loading ? "Processing..." : "Create Pass"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HodPassCreate;
