import { Delete } from "@mui/icons-material";
import { Box, Button, Modal, Typography } from "@mui/material";
import { memo, useCallback } from "react";

const ActionButtons = memo(({ onClear, onClose }) => {
    return (
      <>
        <Button 
          variant="outlined" 
          onClick={onClear}
        >
          <Delete/>
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Cancel
        </Button>
      </>
    );
});

const RemoveModal = memo(({ isOpen, onClose, itemName, onClearItem }) => {
    const boxProps = {
        position: "absolute",
        top: "50%",
        left: "50%",
        width: 400,
        bgcolor: "white",
        border: "2px solid #000",
        boxShadow: 24,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        sx: { transform: "translate(-50%,-50%)" },
    }

    const handleClear = useCallback(() => {
        onClearItem(itemName);
    }, [onClearItem, itemName]);

    return (
        <Modal open={isOpen} onClose={onClose}>
          <Box {...boxProps}>
            <Typography>
                Clear item from inventory
            </Typography>
            <ActionButtons onClear={handleClear} onClose={onClose} />
          </Box>
        </Modal>
    );
});

export default RemoveModal;