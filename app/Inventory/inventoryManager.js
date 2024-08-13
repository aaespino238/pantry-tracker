import { useState, useEffect } from "react"
import React, { Component } from 'react'

import {firestore} from "@/firebase"
import { collection, deleteDoc, doc, getDoc, getDocs, query, runTransaction, setDoc, Transaction } from "firebase/firestore";

class InventoryManager{
  constructor() {
    this.inventory = [];
  }

  getInventoryList = async () => {
      // query firebase for entire inventory
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);

      this.inventory = docs.docs.map(doc => ({ name: doc.id, ...doc.data()}));
      return this.inventory;
  }

  updateItem = async (item='', newQuantity=null) => {
      // Will always update this.state
      // Can also update an items quantity
      if (item && newQuantity != null){
          const docRef = doc(collection(firestore, 'inventory'), item);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
              await setDoc(docRef, { quantity: newQuantity }, { merge: true });
          };
      };
      await this.getInventoryList();
  }

  addItem = async (item, incrementBy=1) => {
      // Increases quantity of item by value passed into incrementBy
      // Will add item to inventory with quantity = incrementBy if not present
      const docRef = doc(collection(firestore, 'inventory'), item)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { quantity } = docSnap.data()
        await setDoc(docRef, { quantity: quantity + incrementBy })
      } else {
        await setDoc(docRef, { quantity: incrementBy })
      }
  }

  removeItem = async (item, decrementBy=1) => {
      // Decreases the quantity of item by value passed into decrementBy
      // Will remove item when decrementBy >= quantity
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if ((quantity-decrementBy) <= 0) {
          await deleteDoc(docRef)
        } else {
          await setDoc(docRef, { quantity: quantity - decrementBy })
        };
      };
  }

  clearItem = async (item) => {
      // Clears item from inventory
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
          await deleteDoc(docRef)
      };
  }

  getCurrentInventory = () => {
    return this.inventory;
  }

};

export {InventoryManager};

// //Inventory state variable
// const [inventory, setInventory] = useState([])

// const updateInventory = () => {

// }
// //Modal state variables
// const [modalStates, setModals] = useState({
//     addModalState: false,
//     updateModalState: false,
//     })

// const [itemName, setItemName] = useState('')
// const [itemQuantity, setItemQuantity] = useState(0)

// const getModalHandler = (modalName) => {
//     return {
//         isOpen: modalStates[modalName],
//         open: () => setModals((state) => ({...state, [modalName]: true})),
//         close: () => setModals((state) => ({...state, [modalName]: false})),
//         toggle: () => setModals((state) => ({...state, [modalName]: !state[modalName]})),
//     }
// }

// const addModalState = getModalHandler("addModalState")
// const updateModalState = getModalHandler("updateModalState")

// // Modals
// const addModal = (
//     <Modal open={addModalState.isOpen} onClose={addModalState.close}>
//         <Box
//           position="absolute" 
//           top="50%"
//           left="50%"
//           width={400}
//           bgcolor="white"
//           border = "2px solid #000"
//           boxShadow={24}
//           p={4}
//           display="flex"
//           flexDirection="column"
//           gap={3}
//           sx={{
//             transform: "translate(-50%,-50%)",
//           }}
//         >
//           <Typography variant="h6">Add Item</Typography>
//           <Stack width="100%" direction="column" spacing={2}>
//             <TextField
//               fullWidth
//               value={itemName}
//               label="Item Name"
//               onChange={(e)=>{
//                 setItemName(e.target.value)
//               }}
//             />
//             <TextField
//               fullWidth
//               value={itemQuantity}
//               label="Quantity"
//               onChange={(e)=>{
//                 setItemQuantity(e.target.value)
//               }}
//             />
//             <Button 
//               variant="outlined" 
//               onClick={()=>{
//                 inventory.addItem(itemName, itemQuantity)
//                 updateInventory()
//                 setItemName('')
//                 setItemQuantity(1)
//                 addModalState.close()
//               }}
//             >
//               Add
//             </Button> 
//           </Stack>
//         </Box>
//       </Modal>
// )

// const updateModal = ({name, quantity}) => {
//     <Modal open={updateModalState.isOpen} onClose={updateModalState.close}>
//         <Box
//         position="absolute" 
//         top="50%"
//         left="50%"
//         width={400}
//         bgcolor="white"
//         border = "2px solid #000"
//         boxShadow={24}
//         p={4}
//         display="flex"
//         flexDirection="column"
//         gap={3}
//         sx={{
//             transform: "translate(-50%,-50%)",
//         }}
//         >
//             <Typography variant="h6">Edit Item</Typography>
//             <Stack width="100%" direction="row" spacing={2}>
//                 <TextField
//                 fullWidth
//                 label="New Quantity"
//                 value={quantity}
//                 onChange={(e)=>{
//                     setItemQuantity(e.target.value)
//                 }}
//                 />

//                 <Button 
//                 variant="outlined" 
//                 onClick={()=>{
//                     inventory.updateInventory(itemName, itemQuantity)
//                     setItemName('')
//                     updateModalState.close()
//                 }}
//                 >
//                 Change Quantity
//                 </Button>
//             </Stack>
//         </Box>
//     </Modal>
// }


