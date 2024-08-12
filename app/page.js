'use client'
import {useState, useEffect, useCallback, useMemo} from "react"
import { Box, Button, ButtonGroup, createTheme, darken, Modal, Stack, TextField, Typography } from "@mui/material";
import { Add, Remove, Edit, Delete } from "@mui/icons-material";
import {InventoryManager} from "./inventoryManager";

import UpdateModal from "./Modals/updateModal";
import AddModal from "./Modals/addModal";
import RemoveModal from "./Modals/removeModal";

/*
Things to consider:
- for individual operations like addItem, removeItem, and updateItem
  is it more efficient to have them handle both local state and firestore updates
  or have a single updateInventory function that handles updates 
*/

export default function Home() {
  
  const [inventory, setInventory] = useState([])
  const [itemName, setItemName] = useState('')
  const [itemQuantity, setItemQuantity] = useState(1)

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

  const IM = useMemo (() => new InventoryManager(), []);

  const updateInventory = async () => {
    const inventoryList = await IM.getInventoryList()
    setInventory(inventoryList)
  }

  const InventoryStackItem =  ({name, quantity}) => {
    const [isHovered, setIsHovered] = useState(false)

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
        sx = {{
          bgcolor: "#ffffff",
          "&:hover": {
            bgcolor: darken("#ffffff", 0.3),
          },
        }}
      >
        <Typography variant = "h3" color = "#333" textAlign="center">
          {name.charAt(0).toUpperCase()+name.slice(1)}
        </Typography>
        {isHovered && (
        <Stack width="100%" direction="row" spacing={2}> 
          <Button 
            onClick={()=>{
              setItemName(name)
              setItemQuantity(quantity)
              updateModalState.open()
            }}
          >
            <Edit/>
          </Button>

          <Button
            onClick={()=>{
              setItemName(name)
              removeModalState.open()
            }}
          >
            <Delete/>
          </Button>

          </Stack>
        )}
        <Typography variant = "h3" color = "#333" textAlign="center">
          {quantity}
        </Typography>
        
      </Box>
    );
  };

  const InventoryStack = () => {
    return (
      <Stack width = "800px" height = "300px" spacing={2} overflow="auto">
        {   
          inventory.map( ({name, quantity})=>(
            <InventoryStackItem key={name} name={name} quantity={quantity}/>
          ))    
        }
      </Stack>
    )
  }

  const handleUpdateItem = useCallback((name, quantity) => {
    IM.updateItem(name, quantity);
    updateInventory();
    setItemName('');
    setItemQuantity(1);
    //not sure if close is necessary here
    updateModalState.close();
  }, [IM, updateInventory, updateModalState.close]);

  const handleAddItem = useCallback((name, quantity) => {
    IM.addItem(name, quantity);
    updateInventory();
    setItemName('');
    setItemQuantity(1);
    //not sure if close is necessary here
    addModalState.close();
  }, [IM, updateInventory, updateModalState.close]);

  const handleClearItem = useCallback((name, quantity) => {
    IM.clearItem(name);
    updateInventory();
    setItemName('');
    //not sure if close is necessary here
    removeModalState.close();
  }, [IM, updateInventory, removeModalState.close]);

  useEffect(() => {
    updateInventory()
  }, [])

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
          <Typography variant="h2" color = "#333">
            Inventory Items
          </Typography>

        </Box>
        <InventoryStack></InventoryStack>
      </Box>
    </Box>
  )
}

