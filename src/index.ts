import axios from "axios";
import input from "input";
import { Api, TelegramClient } from "telegram";
import { NewMessage } from "telegram/events";
import type { NewMessageEvent } from "telegram/events/NewMessage";
import { StringSession } from "telegram/sessions";

axios.defaults.headers.common["Accept-Encoding"] = "gzip";
const apiId = 123456789; // Telegram API ID     U CAN USE THIS GUIDE TO GET IT https://core.telegram.org/api/obtaining_api_id
const apiHash = ""; // Telegram API hash      U CAN USE THIS GUIDE TO GET IT https://core.telegram.org/api/obtaining_api_id
const peerId = "6511860356"; // Id of the solana trojan bot, i already entered it
let client: TelegramClient;
const stringSession = new StringSession(""); // Telegram string session so u dont have to login everytime

const channelMessageHandler = new NewMessage({
  chats: ["moneymakers"], // Channels to listen to
});
function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

async function handleChannelMessage(event: NewMessageEvent) {
  const message = event.message;
  const messageId = message.id;
  console.log(message.message);
  if (message.message.includes("solana")) {
    await client.sendMessage(peerId, message.message);
    console.log("Sent message to trojan");
  }
}

(async () => {
  client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  //Log into Telegram
  await client.start({
    phoneNumber: async () => await input.text("Please enter your number: "),
    password: async () => await input.text("Please enter your password: "),
    phoneCode: async () =>
      await input.text("Please enter the code you received: "),
    onError: (err) => console.log(err),
  });

  console.log("You should now be connected.");
  console.log(client.session.save()); // Log Telegram session

  // Listen to messaged to identify potential pumps
  client.addEventHandler(handleChannelMessage, channelMessageHandler);
})();
