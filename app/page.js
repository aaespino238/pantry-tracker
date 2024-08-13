'use client'
import { Stack } from "@mui/material";
import { ChatbotDisplay } from "./Chatbot/chatbot";
import { InventoryDisplay } from "./Inventory/inventory";

export default function Home() {
  return (
  <Stack
    direction={'row'}
    spacing={0}
  >
    <InventoryDisplay/>
    <ChatbotDisplay/>
  </Stack>
  )
}

