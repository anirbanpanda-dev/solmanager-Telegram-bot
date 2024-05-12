

import {
    Connection,
    Keypair, 
    LAMPORTS_PER_SOL, 
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction
} from "@solana/web3.js"

const accountHandler: Map<string, Keypair> = new Map();
const connection = new Connection("http://localhost:8899", "confirmed");

export const handleMessage =  async (cmd: string) : Promise<string> => {

    console.log("handlemsg")
    if(!connection) {
        return "We won't be able to process your request ";
    }

    if(cmd[0] != '/'){
        return "please start your command with a '/' ";
    }

    const message = cmd.substr(1);
    const cmdArgs  = cmd.split(" ");
    let response = "", accName = "", amt = "";
    let account : Keypair | undefined;
    let balance : number = 0;

    console.log("cmdArgs[0] = ", cmdArgs[0])


    switch (cmdArgs[0]) {
        case "/createaccount":
            accName = cmdArgs[1];
            console.log("accname = ", accName);
            const newAccount = await Keypair.generate();
            console.log("crt1");
            accountHandler.set(accName, newAccount);
            console.log("crt2");

            response = "New Account Created";
            break;
        case "/getbalance":
            accName = cmdArgs[1];
            account = accountHandler.get(accName);
            balance = 0;
            if(account != undefined){
                balance = await connection.getBalance(account.publicKey)
                response = "Your balance is = " + balance/LAMPORTS_PER_SOL;
            }
            else{
                response = "Operation unsuccessful"
            }
            
            break;
        case "/airdrop":
            accName = cmdArgs[1];
            amt = cmdArgs[2];
            account = accountHandler.get(accName);
            balance = 0;
            if(account != undefined){
                await connection.requestAirdrop(account.publicKey , Number(amt) * LAMPORTS_PER_SOL)
                response = "Successfully Airdropped " + amt + "sol";
            }
            else{
                response = "Operation unsuccessful"
            }
            
            
            break;
        case "/sendsol":
            console.log("cmdArgs 1  = ", cmdArgs[1])
            console.log("cmdArgs 2  = ", cmdArgs[2])
            console.log("cmdArgs 3  = ", cmdArgs[3])
            const payer = accountHandler.get(cmdArgs[1]);
            const receiver = accountHandler.get(cmdArgs[2]);
            amt = cmdArgs[3];
            if (receiver != undefined && payer != undefined){
                const transaction = new Transaction().add(
                    SystemProgram.transfer({
                        fromPubkey: payer.publicKey,
                        toPubkey: receiver.publicKey,
                        lamports: Number(amt) * LAMPORTS_PER_SOL,
                    }),
                );
                
                const signature = sendAndConfirmTransaction(
                    connection,
                    transaction,
                    [payer],
                );
                response = "Transaction succefful !!!"
            }
            else{
                response = "Operation unsuccessful"
            }
            break;

        default:
            response = "Unknown command"
            break;
        
            
            
    }
    return response ;
}