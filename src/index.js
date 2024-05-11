"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const handler_1 = require("./handler");
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
const express_1 = __importDefault(require("express"));
const TelegramBot = require('telegram-bot-api');
const PORT = process.env.PORT || 4040;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('GET');
    res.send('Hello GET');
}));
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('POST');
    res.send('Hello POST');
    const { message } = req.body;
    console.log("req = ", message);
    const bot = new TelegramBot({
        token: '7036832058:AAFUe80ogYH4QqatEJwJQrSSNyNXnraVIDY',
    });
    let response = "";
    try {
        response = yield (0, handler_1.handleMessage)(message.text);
    }
    catch (ex) {
        response = "caught exception";
    }
    console.log("response = ", response);
    console.log("sending msg");
    yield bot.sendMessage({
        chat_id: message.chat.id,
        text: response,
    });
}));
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
