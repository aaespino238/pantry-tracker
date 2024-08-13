import {useState, useEffect, useCallback, useMemo, memo} from "react"
import { Box, Button, darken, Stack, Typography } from "@mui/material";

import {InventoryManager} from "./inventoryManager";

import UpdateModal from "./Modals/updateModal";
import AddModal from "./Modals/addModal";
import RemoveModal from "./Modals/removeModal";
import { Delete, Edit } from "@mui/icons-material";

const InventoryStackItem = ({ name, quantity, onEdit, onDelete }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <Box
        key={name}
        width="100%"
        minHeight="150px"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding={5}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          bgcolor: "#ffffff",
          "&:hover": {
            bgcolor: darken("#ffffff", 0.3),
          },
        }}
      >
        <Typography variant="h3" color="#333" textAlign="center">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </Typography>
        {isHovered && (
          <Stack width="100%" direction="row" spacing={2}>
            <Button onClick={() => onEdit(name, quantity)}>
              <Edit />
            </Button>
            <Button onClick={() => onDelete(name)}>
              <Delete />
            </Button>
          </Stack>
        )}
        <Typography variant="h3" color="#333" textAlign="center">
          {quantity}
        </Typography>
      </Box>
    );
};
  
const InventoryStack = ({ inventory, onEdit, onDelete }) => {
    return (
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
        {inventory.map(({ name, quantity }) => (
            <InventoryStackItem
            key={name}
            name={name}
            quantity={quantity}
            onEdit={onEdit}
            onDelete={onDelete}
            />
        ))}
        </Stack>
    );
};

const useInventory = () => {
    const [inventory, setInventory] = useState([])
    const [itemName, setItemName] = useState('')
    const [itemQuantity, setItemQuantity] = useState(1)
    const IM = useMemo (() => new InventoryManager(), []);

    const [modalStates, setModals] = useState({
        addModalState: false,
        updateModalState: false,
        removeModalState: false,
    })

    const getModalHandler = (modalName) => {
        return {
        isOpen: modalStates[modalName],
        open: () => setModals((state) => ({...state, [modalName]: true})),
        close: () => setModals((state) => ({...state, [modalName]: false})),
        toggle: () => setModals((state) => ({...state, [modalName]: !state[modalName]})),
        }
    }

    const addModalState = getModalHandler("addModalState")
    const updateModalState = getModalHandler("updateModalState")
    const removeModalState = getModalHandler("removeModalState")

    const updateInventory = async () => {
        const inventoryList = await IM.getInventoryList()
        setInventory(inventoryList)
    }

    const handleUpdateItem = useCallback((name, quantity) => {
        IM.updateItem(name, quantity);
        updateInventory();
        setItemName('');
        setItemQuantity(1);
        updateModalState.close();
    }, [IM, updateInventory, updateModalState.close]);
    
    const handleAddItem = useCallback((name, quantity) => {
        IM.addItem(name, quantity);
        updateInventory();
        setItemName('');
        setItemQuantity(1);
        addModalState.close();
    }, [IM, updateInventory, updateModalState.close]);
    
    const handleClearItem = useCallback((name, quantity) => {
        IM.clearItem(name);
        updateInventory();
        setItemName('');
        removeModalState.close();
    }, [IM, updateInventory, removeModalState.close]);
    
    useEffect(() => {
        updateInventory()
    }, [])

    return {
        inventory,
        itemName,
        itemQuantity,
        setItemName,
        setItemQuantity,
        updateInventory,
        IM,
        addModalState,
        updateModalState,
        removeModalState,
        handleUpdateItem,
        handleAddItem,
        handleClearItem
    }
};

export const InventoryDisplay = () => {
    const {
      inventory,
      itemName,
      itemQuantity,
      setItemName,
      setItemQuantity,
      addModalState,
      updateModalState,
      removeModalState,
      handleUpdateItem,
      handleAddItem,
      handleClearItem
    } = useInventory();
  
    return (
      <Box 
        width="100vw" 
        height="100vh"
        display="flex" 
        flexDirection="column"
        justifyContent="center" 
        alignItems="center"
        gap={2}
      >
        <AddModal 
          isOpen={addModalState.isOpen}
          onClose={addModalState.close}
          itemName={itemName}
          itemQuantity={itemQuantity}
          onAddItem={handleAddItem}
          onChangeQuantity={setItemQuantity}
          onChangeName={setItemName}
        />
        <UpdateModal 
          isOpen={updateModalState.isOpen}
          onClose={updateModalState.close}
          itemName={itemName}
          itemQuantity={itemQuantity}
          onUpdateItem={handleUpdateItem}
          onChangeQuantity={setItemQuantity}
        />
        <RemoveModal
          isOpen={removeModalState.isOpen}
          onClose={removeModalState.close}
          itemName={itemName}
          onClearItem={handleClearItem}
        />
  
        <Button variant="contained" onClick={addModalState.open}>
          Add New Item
        </Button>
  
        <Box border="1px solid #333">
          <Box 
            width="800px" 
            height="100px" 
            bgcolor="#ADD8E6"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" color="#333">
              Inventory Items
            </Typography>
          </Box>
          <InventoryStack 
            inventory={inventory} 
            onEdit={(name, quantity) => {
              setItemName(name);
              setItemQuantity(quantity);
              updateModalState.open();
            }}
            onDelete={(name) => {
              setItemName(name);
              removeModalState.open();
            }}
          />
        </Box>
      </Box>
    );
};