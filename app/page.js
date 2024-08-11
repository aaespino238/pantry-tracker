'use client'
import {useState, useEffect, useCallback, useMemo} from "react"
import { Box, Button, ButtonGroup, createTheme, darken, Modal, Stack, TextField, Typography } from "@mui/material";
import { Add, Remove, Edit, Delete } from "@mui/icons-material";
import {InventoryManager} from "./inventoryManager";
import UpdateModal from "./updateModal";

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

  const addModal = (
    <Modal open={addModalState.isOpen} onClose={addModalState.close}>
        <Box
          position="absolute" 
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border = "2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="column" spacing={2}>
            <TextField
              fullWidth
              value={itemName}
              label="Item Name"
              onChange={(e)=>{
                setItemName(e.target.value)
              }}
            />
            <TextField
              fullWidth
              value={itemQuantity}
              label="Quantity"
              onChange={(e)=>{
                setItemQuantity(e.target.value)
              }}
            />
            <Button 
              variant="outlined" 
              onClick={()=>{
                IM.addItem(itemName, itemQuantity)
                updateInventory()
                setItemName('')
                setItemQuantity(1)
                addModalState.close()
              }}
            >
              Add
            </Button> 
          </Stack>
        </Box>
    </Modal>
    )

  const removeModal = (
    <Modal open = {removeModalState.isOpen} onClose={removeModalState.close}>
      <Box
        position="absolute" 
        top="50%"
        left="50%"
        width={400}
        bgcolor="white"
        border = "2px solid #000"
        boxShadow={24}
        p={4}
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{
          transform: "translate(-50%,-50%)",
        }}
      >
        <Stack width="100%" direction="column" spacing={2}> 
          <Typography>
            Are you sure 
          </Typography>
          <Button 
            onClick={() => {
            IM.clearItem(itemName)
            setItemName('')
            updateInventory()
            removeModalState.close()
            }}
          >
            <Delete></Delete>
          </Button>
        </Stack>    
      </Box>
    </Modal>
  )
  
  const addRemoveButtonGroup = (
    <ButtonGroup
      orientation="horizontal"
      color="primary"
      aria-label="vertical outlined primary button group"
    >
      <Button
        variant="contained"
        color="secondary"
        type="button"
        endIcon={<Add />}
        onClick = {()=>{ addItem(name) }}
      >
        Add
      </Button>
      <Button 
        color="primary" 
        type="button" 
        endIcon={<Remove />}
        onClick = {()=>{ removeItem(name) }}
      >
        Remove
      </Button>
    </ButtonGroup>
  )

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
    updateModalState.close();
  }, [IM, updateInventory, updateModalState.close]);

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
      {addModal}
      <UpdateModal 
        isOpen={updateModalState.isOpen}
        onClose={updateModalState.close}
        itemName={itemName}
        itemQuantity={itemQuantity}
        onUpdateItem={handleUpdateItem}
        onChangeQuantity={setItemQuantity}
      />
      {removeModal}

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

