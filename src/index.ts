
import { handleMessage } from "./handler";

import express, { Request, Response } from 'express';
const TelegramBot = require('telegram-bot-api');
 


const PORT = process.env.PORT || 4040;

const app = express();
app.use(express.json());

app.get('/', async (req: Request, res: Response) => {
    res.send('GET request received');
});

app.post('/', async (req: Request, res: Response) => {
    res.send('POST request received');
    const { message } = req.body;
    console.log("req = ", message);

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

