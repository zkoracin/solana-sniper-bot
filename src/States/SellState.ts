import { Liquidity } from "@raydium-io/raydium-sdk";
import { IState } from "../Interfaces/IState";
import { StateContext } from "./StateContext";
import { ComputeBudgetProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { TimeHelper } from "../Utils/TimeHelper";

export class SellState implements IState {
    constructor(private context: StateContext) {}

    async execute(): Promise<void> {
        console.log(`-----SELL STATE-----`);
        console.log(`Waiting ${this.context.tradeConstants.timeToSell} miliseconds before selling...`)
        await TimeHelper.timeout(this.context.tradeConstants.timeToSell);

        const result = await this.sell();
        result ? console.log(`Succesfully sold tokens`) : console.log(`Sell failed`);
        process.exit(1);
        // this.context.setState(this.context.searchState);
    }

    async sell(): Promise<boolean> {
        const { innerTransaction } = Liquidity.makeSwapFixedInInstruction({
                poolKeys: this.context.variables.poolKeys!,
                userKeys: {
                    tokenAccountIn:  this.context.variables.tokenWalletId!,
                    tokenAccountOut: this.context.constants.walletWsol.pubkey,
                    owner: this.context.constants.wallet.publicKey,
                },
                amountIn: this.context.variables.tokenBoughtAmount!,
                minAmountOut: 0
            },
            this.context.variables.poolKeys!.version
        );
        
        console.log(`Fetching latest blockhash...`);
        const { 
            blockhash,
            lastValidBlockHeight 
        } = await this.context.constants.sollConn.getLatestBlockhash({
            commitment: 'finalized'
        });

        const msg = new TransactionMessage({
            payerKey: this.context.constants.wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: [
                ComputeBudgetProgram.setComputeUnitPrice({ 
                    microLamports: this.context.tradeConstants.sellFees 
                }),
                ...innerTransaction.instructions,
                ] 
        }).compileToV0Message();

        const tx = new VersionedTransaction(msg);
        
        tx.sign([this.context.constants.wallet]);

        console.log(`Sending transaction...`);
        const signature = await this.context.constants.sollConn.sendRawTransaction(
            tx.serialize(),
            {preflightCommitment: 'finalized'}
        );

        console.log(`Waiting for transaction confirmation...`);
        const confirmation = await this.context.constants.sollConn.confirmTransaction({
            signature,
            lastValidBlockHeight,
            blockhash
        }, 'finalized');

        if (confirmation && !confirmation.value.err) {
            return true;
        }
        return false;
    }
}