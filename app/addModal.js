import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { memo, useCallback } from "react";

const QuantityTextField = memo(({ onTextChange }) => {
    return (
        <TextField
          fullWidth
          label="Quantity"
          onChange={(e) => onTextChange(Math.trunc(e.target.value))}
        />
      );
});

const ItemTextField = memo(({ onTextChange }) => {
    return (
        <TextField
          fullWidth
          label="Item Name"
          onChange={(e) => onTextChange(e.target.value)}
        />
      );
});

const ActionButtons = memo(({ onAdd, onClose }) => {
    return (
      <>
        <Button 
          variant="outlined" 
          onClick={onAdd}
        >
          Add Item
        </Button>
        <Button
          variant="outlined"
          onClick={onClose}
        >
          Close
        </Button>
      </>
    );
});

const AddModal = memo(({ isOpen, onClose, itemName, itemQuantity, onAddItem, onChangeQuantity, onChangeName }) => {
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

    const handleAdd = useCallback(() => {
        onAddItem(itemName, itemQuantity);
    }, [onAddItem, itemName, itemQuantity]);

    return (
        <Modal open={isOpen} onClose={onClose}>
        <Box {...boxProps}>
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="column" spacing={2}>
                <ItemTextField onTextChange={onChangeName} />
                <QuantityTextField onTextChange={onChangeQuantity} />
                <ActionButtons onAdd={handleAdd} onClose={onClose} />
            </Stack>
        </Box>
        </Modal>
    );
});

export default AddModal;