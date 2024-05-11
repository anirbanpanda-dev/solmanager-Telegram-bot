import { myFunction } from "./function";
import { handleMessage } from "./handler";

// import {
//     Connection,
//     Keypair, 
//     LAMPORTS_PER_SOL, 
//     PublicKey,
//     Transaction,
//     TransactionInstruction,
//     sendAndConfirmTransaction
// } from "@solana/web3.js"
// import {handleMessage} from "./handler"


// import { express, Request, Response } from 
// import {} from 'express'
// import TelegramBot from 'telegram-bot-api';
import express, { Request, Response } from 'express';
const TelegramBot = require('telegram-bot-api');


const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    // console.log('GET');
    res.send('Hello GET');
    
});

app.post('/', async (req: Request, res: Response) => {
    // console.log('POST');
    res.send('Hello POST');
    const { message } = req.body;
    console.log("req = ", message)

    const bot = new TelegramBot({
      token: '7036832058:AAFUe80ogYH4QqatEJwJQrSSNyNXnraVIDY',
    });

    let response = "";

    try{
        response = await handleMessage(message.text);
    }
    catch(ex: any ){
        response = "caught exception"
    }

    

    console.log("response = ", response)


    console.log("sending msg")
    await bot.sendMessage({
        chat_id: message.chat.id,
        text: response,
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

