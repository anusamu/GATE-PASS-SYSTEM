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

const API = "http://localhost:5000/api/auth";

const AddPass = ({ open, onClose, token, setPasses }) => {
  const initialFormState = {
    assetName: "",
    assetSerialNo: "",
    purpose: "", // Added purpose to state
    externalPersonName: "",
    externalPersonEmail: "",
    externalPersonPhone: "",
    passType: "",
    returnDateTime: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ---------------- HANDLERS ---------------- */

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
    try {
      setLoading(true);
      const payload = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) payload.append(key, formData[key].trim());
      });

      if (imageFile) {
        payload.append("photo", imageFile);
      }

      const res = await axios.post(`${API}/staff/create`, payload, {
        headers: { Authorization: `Bearer ${token}` },
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
      <DialogTitle sx={{ p: 3, pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="h6" fontWeight={700}>Apply Gate Pass</Typography>
        <IconButton onClick={handleClose} edge="end">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          
          {/* Asset Section */}
          <Typography variant="overline" color="text.secondary" fontWeight={700}>Asset Information</Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField name="assetName" label="Asset Name" value={formData.assetName} onChange={handleChange} required fullWidth size="small" />
            <TextField name="assetSerialNo" label="Serial Number" value={formData.assetSerialNo} onChange={handleChange} required fullWidth size="small" />
          </Box>

          {/* Purpose Field - Added here below Serial Number */}
          <TextField
            name="purpose"
            label="Purpose of Request"
            placeholder="Why is this asset being moved?"
            value={formData.purpose}
            onChange={handleChange}
            required
            fullWidth
            multiline
            rows={2}
            size="small"
            helperText={`${formData.purpose.length}/200 characters`}
            inputProps={{ maxLength: 200 }}
          />

          <Divider />

          {/* Person Section */}
          <Typography variant="overline" color="text.secondary" fontWeight={700}>Visitor/Receiver Details</Typography>
          <TextField name="externalPersonName" label="Full Name" value={formData.externalPersonName} onChange={handleChange} required fullWidth size="small" />
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField name="externalPersonEmail" label="Email" type="email" value={formData.externalPersonEmail} onChange={handleChange} required size="small" />
            <TextField name="externalPersonPhone" label="Phone (Optional)" value={formData.externalPersonPhone} onChange={handleChange} size="small" />
          </Box>

          <Divider />

          {/* Pass Type Section */}
          <Box sx={{ display: 'grid', gridTemplateColumns: formData.passType === "RETURNABLE" ? '1fr 1fr' : '1fr', gap: 2 }}>
            <TextField select name="passType" label="Pass Type" value={formData.passType} onChange={handleChange} required size="small">
              <MenuItem value="RETURNABLE">Returnable</MenuItem>
              <MenuItem value="NON_RETURNABLE">Non-Returnable</MenuItem>
            </TextField>

            {formData.passType === "RETURNABLE" && (
              <TextField
                type="datetime-local"
                name="returnDateTime"
                label="Return Date"
                value={formData.returnDateTime}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
                required
                size="small"
              />
            )}
          </Box>

          {/* Image Upload Area */}
          <Box sx={{ border: '1px dashed #ccc', borderRadius: 1, p: 2, textAlign: 'center', bgcolor: '#fafafa' }}>
            {!imageFile ? (
              <Button component="label" startIcon={<UploadIcon />} sx={{ textTransform: 'none' }}>
                Upload Asset Photo (Optional)
                <input hidden type="file" accept="image/*" onChange={handleImageUpload} />
              </Button>
            ) : (
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                <Chip 
                  label={imageFile.name} 
                  onDelete={() => setImageFile(null)} 
                  color="primary" 
                  variant="outlined" 
                  deleteIcon={<DeleteIcon />} 
                />
              </Stack>
            )}
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} color="inherit">Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmitPass}
          elevation={0}
          disabled={loading || !formData.assetName || !formData.assetSerialNo || !formData.purpose || !formData.passType}
          sx={{ px: 4, borderRadius: 2, fontWeight: 600 }}
        >
          {loading ? "Processing..." : "Create Pass"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPass;