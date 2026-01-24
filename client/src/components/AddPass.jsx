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

const DEFAULT_API = "https://gate-pass-system-drti.onrender.com" ;

const AddPass = ({ open, onClose, setPasses, API = DEFAULT_API }) => {
  // ✅ READ TOKEN SAFELY HERE
  const token = localStorage.getItem("token");

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

  /* ---------------- HELPERS ---------------- */

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

  /* ---------------- SUBMIT ---------------- */

  const handleSubmitPass = async () => {
    if (!token) {
      alert("Session expired. Please login again.");
      return;
    }

    try {
      setLoading(true);
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (typeof value === "string" && value.trim()) {
          payload.append(key, value.trim());
        }
      });

      if (imageFile) {
        payload.append("photo", imageFile);
      }

      const res = await axios.post(`${API}/staff/create`, payload, {
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
      <DialogTitle
        sx={{
          p: 3,
          pb: 1,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Apply Gate Pass
        </Typography>
        <IconButton onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
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
            label="Purpose of Request"
            value={formData.purpose}
            onChange={handleChange}
            required
            multiline
            rows={2}
            size="small"
            inputProps={{ maxLength: 200 }}
            helperText={`${formData.purpose.length}/200 characters`}
          />

          <Divider />

          <Typography variant="overline" fontWeight={700}>
            Visitor / Receiver Details
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
              label="Phone (Optional)"
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
                required
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
              bgcolor: "#fafafa",
            }}
          >
            {!imageFile ? (
              <Button component="label" startIcon={<UploadIcon />}>
                Upload Asset Photo (Optional)
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
              </Button>
            ) : (
              <Chip
                label={imageFile.name}
                onDelete={() => setImageFile(null)}
                deleteIcon={<DeleteIcon />}
                variant="outlined"
                color="primary"
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
          disabled={
            loading ||
            !formData.assetName ||
            !formData.assetSerialNo ||
            !formData.purpose ||
            !formData.passType
          }
        >
          {loading ? "Processing..." : "Create Pass"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPass;
