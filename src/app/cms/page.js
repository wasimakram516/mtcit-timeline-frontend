"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Input,
  MenuItem,
  IconButton,
  Avatar,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useRouter } from "next/navigation";
import { useMessage } from "@/app/context/MessageContext";
import {
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
} from "@/services/DisplayMediaService";
import ConfirmationDialog from "@/app/components/ConfirmationDialog";

export default function CMSPage() {
  const router = useRouter();
  const { showMessage } = useMessage();
  const [mediaList, setMediaList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    fileEn: null,
    fileAr: null,
    pinpointFile: null,
    pinpointX: "",
    pinpointY: "",
    previewEn: null,
    previewAr: null,
    pinpointPreview: null,
  });
  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState({});

  const fetchMedia = async () => {
    try {
      const res = await getMedia();
      const mediaItems = res.data || [];
      setMediaList(mediaItems);

      // Build dynamic categoryOptions
      const options = {};
      mediaItems.forEach((item) => {
        const cat = item.category;
        const subcat = item.subcategory || "";
        if (!options[cat]) {
          options[cat] = subcat ? [subcat] : [];
        } else if (subcat && !options[cat].includes(subcat)) {
          options[cat].push(subcat);
        }
      });
      setDynamicOptions(options);
    } catch {
      showMessage("Failed to load media.", "error");
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Category is required.";

    if (!editingItem && !formData.fileEn) {
      newErrors.fileEn = "Please upload the English media file.";
    }
    if (!editingItem && !formData.fileAr) {
      newErrors.fileAr = "Please upload the Arabic media file.";
    }

    // ✅ Validate Pinpoint X
    if (formData.pinpointX !== "" && formData.pinpointX !== null) {
      const x = Number(formData.pinpointX);
      if (isNaN(x) || x < 0 || x > 100) {
        newErrors.pinpointX = "X must be a number between 0 and 100.";
      }
    }

    // ✅ Validate Pinpoint Y
    if (formData.pinpointY !== "" && formData.pinpointY !== null) {
      const y = Number(formData.pinpointY);
      if (isNaN(y) || y < 0 || y > 100) {
        newErrors.pinpointY = "Y must be a number between 0 and 100.";
      }
    }

    setErrors(newErrors);

    // ✅ If there are errors, show them using MessageContext
    if (Object.keys(newErrors).length > 0) {
      const { fileEn, fileAr, category, pinpointX, pinpointY } = newErrors;
      let errorMessage = "Please fix the following:\n";
      if (category) errorMessage += `- ${category}\n`;
      if (fileEn) errorMessage += `- ${fileEn}\n`;
      if (fileAr) errorMessage += `- ${fileAr}\n`;
      if (pinpointX) errorMessage += `- ${pinpointX}\n`;
      if (pinpointY) errorMessage += `- ${pinpointY}\n`;

      showMessage(errorMessage.trim(), "error");
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setActionLoading(true);
    try {
      const payload = new FormData();
      payload.append("category", formData.category);
      payload.append("subcategory", formData.subcategory || "");
      if (formData.fileEn) payload.append("mediaEn", formData.fileEn);
      if (formData.fileAr) payload.append("mediaAr", formData.fileAr);
      if (formData.pinpointFile)
        payload.append("pinpoint", formData.pinpointFile);
      if (formData.pinpointX) payload.append("pinpointX", formData.pinpointX);
      if (formData.pinpointY) payload.append("pinpointY", formData.pinpointY);

      const res = editingItem
        ? await updateMedia(editingItem._id, payload)
        : await createMedia(payload);

      showMessage(res.message || "Saved", "success");
      setOpenDialog(false);
      setEditingItem(null);
      setFormData({
        category: "",
        subcategory: "",
        fileEn: null,
    fileAr: null,
        pinpointFile: null,
        pinpointX: "",
        pinpointY: "",
        previewEn: null,
        previewAr: null,
        pinpointPreview: null,
      });

      fetchMedia();
    } catch (err) {
      showMessage(err?.response?.data?.message || "Failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    setActionLoading(true);
    try {
      const res = await deleteMedia(selectedId);
      showMessage(res.message || "Deleted", "success");
      fetchMedia();
    } catch {
      showMessage("Failed to delete", "error");
    } finally {
      setActionLoading(false);
      setConfirmationOpen(false);
      setSelectedId(null);
    }
  };

  const openForm = (item = null) => {
    setEditingItem(item);
    setFormData({
      category: item?.category || "",
      subcategory: item?.subcategory || "",
      fileEn: null,
      fileAr: null,
      pinpointFile: null,
      pinpointX: item?.pinpoint?.position?.x?.toString() || "",
      pinpointY: item?.pinpoint?.position?.y?.toString() || "",
      preview: item?.media?.url || null,
      previewEn: item?.media?.en.url || null,
      previewAr: item?.media?.ar.url || null,
      pinpointPreview: item?.pinpoint?.file?.url || null,
    });
    setOpenDialog(true);
  };

  return (
    <Box sx={{ p: 4, position: "relative" }}>
      <Typography variant="h4" fontWeight="bold">
        Media Manager (CMS)
      </Typography>

      <IconButton
        sx={{ position: "absolute", top: 20, right: 20 }}
        onClick={() => router.push("/")}
      >
        <LogoutIcon />
      </IconButton>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => openForm()}
        sx={{ mt: 2 }}
      >
        Add Media
      </Button>

      <Box sx={{ mt: 3 }}>
        {mediaList.map((item) => (
          <Box
            key={item._id}
            sx={{
              mb: 3,
              p: 2,
              borderRadius: 2,
              border: "1px solid #ddd",
              backgroundColor: "#fafafa",
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
            }}
          >
            {/* Top Section: Category Info */}
            <Typography fontWeight="bold" variant="subtitle1">
              {item.category}
            </Typography>
            <Typography color="text.secondary">
              {item.subcategory || "—"}
            </Typography>

            {/* Media Section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mt: 2,
              }}
            >
              {/* English Media */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  English Media
                </Typography>
                {item.media?.en?.type === "image" ? (
                  <Box
                    component="img"
                    src={item.media.en.url}
                    alt="English Media"
                    sx={{
                      width: "200px",
                      height: "auto",
                      borderRadius: 2,
                      border: "1px solid #ddd",
                      mt: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 130,
                      borderRadius: 2,
                      backgroundColor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                      mt: 1,
                    }}
                  >
                    🎥
                  </Box>
                )}
              </Box>

              {/* Arabic Media */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Arabic Media
                </Typography>
                {item.media?.ar?.type === "image" ? (
                  <Box
                    component="img"
                    src={item.media.ar.url}
                    alt="Arabic Media"
                    sx={{
                      width: "200px",
                      height: "auto",
                      borderRadius: 2,
                      border: "1px solid #ddd",
                      mt: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: "100%",
                      height: 130,
                      borderRadius: 2,
                      backgroundColor: "#eee",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                      mt: 1,
                    }}
                  >
                    🎥
                  </Box>
                )}
              </Box>
            </Box>

            {/* Pinpoint Section */}
            {item.pinpoint?.file?.url && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Box
                  component="img"
                  src={item.pinpoint.file.url}
                  alt="Pinpoint"
                  sx={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    border: "1px solid #ddd",
                  }}
                />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pinpoint Position:
                  </Typography>
                  <Typography variant="body2">
                    X: {item.pinpoint?.position?.x ?? "0"}%, Y:{" "}
                    {item.pinpoint?.position?.y ?? "0"}%
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 2,
              }}
            >
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => openForm(item)}
                startIcon={<Edit />}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setSelectedId(item._id);
                  setConfirmationOpen(true);
                }}
                startIcon={<Delete />}
              >
                Delete
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>
          {editingItem
            ? "Edit Media & Pinpoint Details"
            : "Add New Media & Pinpoint"}
        </DialogTitle>
        <DialogContent>
          {/* Category */}
          <Typography variant="subtitle2" sx={{ mt: 2 }}>
            General Info
          </Typography>
          <Autocomplete
            freeSolo
            options={Object.keys(dynamicOptions)}
            value={formData.category}
            onChange={(e, newValue) => {
              setFormData({
                ...formData,
                category: newValue || "",
                subcategory: "",
              });
            }}
            onInputChange={(e, newInputValue) => {
              setFormData({
                ...formData,
                category: newInputValue || "",
              });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Category"
                fullWidth
                sx={{ mt: 1 }}
                error={!!errors.category}
                helperText={
                  errors.category || "Select or type a new category name."
                }
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={dynamicOptions[formData.category] || []}
            value={formData.subcategory}
            onChange={(e, newValue) =>
              setFormData({ ...formData, subcategory: newValue || "" })
            }
            onInputChange={(e, newInputValue) => {
              setFormData({ ...formData, subcategory: newInputValue || "" });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Subcategory"
                fullWidth
                sx={{ mt: 2 }}
                error={!!errors.subcategory}
                helperText={
                  errors.subcategory ||
                  "Select or type a new subcategory name (optional)."
                }
              />
            )}
          />

          {/* Media Upload English */}
          <Typography variant="subtitle2" sx={{ mt: 3 }}>
            English Media Upload
          </Typography>
          <Input
            type="file"
            sx={{ mt: 1 }}
            onChange={(e) => {
              const file = e.target.files[0];
              setFormData({
                ...formData,
                fileEn: file,
                previewEn: file ? URL.createObjectURL(file) : null,
              });
            }}
            error={!!errors.fileEn}
          />
          {formData.previewEn && (
            <Box
              component="img"
              src={formData.previewEn}
              alt="English Media Preview"
              sx={{
                width: "150px",
                height:"auto",
                mt: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            />
          )}

          {/* Media Upload Arabic */}
          <Typography variant="subtitle2" sx={{ mt: 3 }}>
            Arabic Media Upload
          </Typography>
          <Input
            type="file"
            sx={{ mt: 1 }}
            onChange={(e) => {
              const file = e.target.files[0];
              setFormData({
                ...formData,
                fileAr: file,
                previewAr: file ? URL.createObjectURL(file) : null,
              });
            }}
            error={!!errors.fileAr}
          />
          {formData.previewAr && (
            <Box
              component="img"
              src={formData.previewAr}
              alt="Arabic Media Preview"
              sx={{
                width: "150px",
                height:"auto",
                mt: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            />
          )}

          {/* Pinpoint Upload */}
          <Typography variant="subtitle2" sx={{ mt: 4 }}>
            Pinpoint Icon Upload (Optional)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Upload an image that will act as a pinpoint marker on your roadmap
            (optional).
          </Typography>
          <Input
            type="file"
            sx={{ mt: 1 }}
            onChange={(e) => {
              const file = e.target.files[0];
              setFormData({
                ...formData,
                pinpointFile: file,
                pinpointPreview: file ? URL.createObjectURL(file) : null,
              });
            }}
            error={!!errors.pinpoint}
          />
          {formData.pinpointPreview && (
            <Box
              component="img"
              src={formData.pinpointPreview}
              alt="Pinpoint Preview"
              sx={{
                width: "100px",
                mt: 2,
                borderRadius: 2,
                border: "1px solid #ddd",
              }}
            />
          )}

          {/* Pinpoint Position */}
          <Typography variant="subtitle2" sx={{ mt: 4 }}>
            Pinpoint Position (Optional)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Set the X and Y position of the pinpoint marker as a percentage
            (0–100%).
          </Typography>
          <TextField
            label="Pinpoint X Position (%)"
            type="number"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.pinpointX}
            onChange={(e) =>
              setFormData({ ...formData, pinpointX: e.target.value })
            }
            inputProps={{ min: 0, max: 100 }}
            error={!!errors.pinpointX}
            helperText={errors.pinpointX}
          />

          <TextField
            label="Pinpoint Y Position (%)"
            type="number"
            fullWidth
            sx={{ mt: 2 }}
            value={formData.pinpointY}
            onChange={(e) =>
              setFormData({ ...formData, pinpointY: e.target.value })
            }
            inputProps={{ min: 0, max: 100 }}
            error={!!errors.pinpointY}
            helperText={errors.pinpointY}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} disabled={actionLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={actionLoading}
          >
            {actionLoading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Save"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmationDialog
        open={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleDelete}
        title="Delete Media"
        message="Are you sure you want to delete this media?"
        confirmButtonText={
          actionLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Delete"
          )
        }
        confirmButtonProps={{ disabled: actionLoading }}
      />
    </Box>
  );
}
