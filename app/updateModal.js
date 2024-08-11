import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { memo, useCallback } from "react";

const QuantityTextField = memo(({ value, onTextChange }) => {
    return (
        <TextField
          fullWidth
          label="Quantity"
          value={value}
          onChange={(e) => onTextChange(Math.trunc(e.target.value))}
        />
      );
});

const ActionButtons = memo(({ onUpdate, onClose }) => {
    return (
      <>
        <Button 
          variant="outlined" 
          onClick={onUpdate}
        >
          Change Quantity
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

const UpdateModal = memo(({ isOpen, onClose, itemName, itemQuantity, onUpdateItem, onChangeQuantity }) => {
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

    const handleUpdate = useCallback(() => {
        onUpdateItem(itemName, itemQuantity);
    }, [onUpdateItem, itemName, itemQuantity]);

    return (
        <Modal open={isOpen} onClose={onClose}>
        <Box {...boxProps}>
            <Typography variant="h6">{itemName}</Typography>
            <Stack width="100%" direction="row" spacing={2}>
                <QuantityTextField value={itemQuantity} onTextChange={onChangeQuantity} />
                <ActionButtons onUpdate={handleUpdate} onClose={onClose} />
            </Stack>
        </Box>
        </Modal>
    );
});

// const UpdateModal = () => {

//     const boxProps = {
//       position: "absolute",
//       top:"50%",
//       left:"50%",
//       width: 400,
//       bgcolor:"white",
//       border : "2px solid #000",
//       boxShadow: 24,
//       p: 4,
//       display:"flex",
//       flexDirection:"column",
//       gap: 3, 
//       sx:{ transform: "translate(-50%,-50%)", },
//     }

//     return (
//     <Modal open={updateModalState.isOpen} onClose={updateModalState.close}>
//         <Box {...boxProps}>
//           <Typography variant="h6">{itemName}</Typography>
//           <Stack width="100%" direction="row" spacing={2}>
//             <TextField
//               fullWidth
//               label="Quantity"
//               value={itemQuantity}
//               onChange={(e)=>{
//                 setItemQuantity(e.target.value)
//               }}
//             />

//             <Button 
//               variant="outlined" 
//               onClick={()=>{
//                 IM.updateItem(itemName, itemQuantity)
//                 updateInventory()
//                 setItemName('')
//                 setItemQuantity(1)
//                 updateModalState.close()
//               }}
//             >
//               Change Quantity
//             </Button>

//             <Button
//               variant="outlined"
//               onClick={()=>{
//                 setItemName('')
//                 setItemQuantity(1)
//                 updateModalState.close()
//               }}
//             >
//               Close
//             </Button>

//           </Stack>
//         </Box>
//       </Modal>
//     )
//   }

export default UpdateModal;