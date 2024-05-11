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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMessage = void 0;
const web3_js_1 = require("@solana/web3.js");
const accountHandler = new Map();
const connection = new web3_js_1.Connection("http://localhost:8899", "confirmed");
const handleMessage = (cmd) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("handlemsg");
    if (!connection) {
        return "We won't be able to process your request ";
    }
    if (cmd[0] != '/') {
        return "please start your command with a '/' ";
    }
    const message = cmd.substr(1);
    const cmdArgs = cmd.split(" ");
    let response = "", accName = "", amt = "";
    let account;
    let balance = 0;
    console.log("cmdArgs[0] = ", cmdArgs[0]);
    switch (cmdArgs[0]) {
        case "/createaccount":
            accName = cmdArgs[1];
            console.log("accname = ", accName);
            const newAccount = yield web3_js_1.Keypair.generate();
            console.log("crt1");
            accountHandler.set(accName, newAccount);
            console.log("crt2");
            response = "New Account Created";
            break;
        case "/getbalance":
            accName = cmdArgs[1];
            account = accountHandler.get(accName);
            balance = 0;
            if (account != undefined) {
                balance = yield connection.getBalance(account.publicKey);
                response = "Your balance is = " + balance / web3_js_1.LAMPORTS_PER_SOL;
            }
            else {
                response = "Operation unsuccessful";
            }
            break;
        case "/airdrop":
            accName = cmdArgs[1];
            amt = cmdArgs[2];
            account = accountHandler.get(accName);
            balance = 0;
            if (account != undefined) {
                yield connection.requestAirdrop(account.publicKey, Number(amt) * web3_js_1.LAMPORTS_PER_SOL);
                response = "Successfully Airdropped " + amt + "sol";
            }
            else {
                response = "Operation unsuccessful";
            }
            break;
        case "/sendsol":
            console.log("cmdArgs 1  = ", cmdArgs[1]);
            console.log("cmdArgs 2  = ", cmdArgs[2]);
            console.log("cmdArgs 3  = ", cmdArgs[3]);
            const payer = accountHandler.get(cmdArgs[1]); //  accountHandler[cmdArgs[1]];
            const receiver = accountHandler.get(cmdArgs[2]);
            amt = cmdArgs[3];
            if (receiver != undefined && payer != undefined) {
                const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                    fromPubkey: payer.publicKey,
                    toPubkey: receiver.publicKey,
                    lamports: Number(amt) * web3_js_1.LAMPORTS_PER_SOL,
                }));
                // Sign and send the transaction
                const signature = (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [payer]);
                response = "Transaction succefful !!!";
            }
            else {
                response = "Operation unsuccessful";
            }
            break;
        default:
            response = "Unknown command";
            break;
    }
    return response;
});
exports.handleMessage = handleMessage;
