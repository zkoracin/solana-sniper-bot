import { createAssociatedTokenAccountIdempotentInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { IState } from "../Interfaces/IState";
import { PoolKeysHelper } from "../Utils/PoolKeysHelper";
import { StateContext } from "./StateContext";
import { ComputeBudgetProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { Liquidity, LiquidityPoolKeysV4 } from "@raydium-io/raydium-sdk";

export class BuyState implements IState {
    constructor(private context: StateContext) {}
    
    async execute(): Promise<void> {
        console.log(`-----BUY STATE-----`);
        const result = await this.buy();
        if (!result) {
            console.log(`Buy failed.`);
            this.context.setState(this.context.searchState);
        }

        const tokenBalance = (await this.context.constants.sollConn.getTokenAccountBalance(
            this.context.variables.tokenWalletId!,
            'finalized'
        )).value.amount;

        this.context.variables.tokenBoughtAmount = parseInt(tokenBalance);

        console.log(`Successfully bought token.`);
        this.context.setState(this.context.sellState);
    }

    async buy(): Promise<boolean> {
        console.log(`Creating pool keys.`);
        const poolKeys = await PoolKeysHelper.prepareKeys(
            this.context.variables.poolId!,
            this.context.constants.sollConn
        );

        if (!poolKeys) {
            console.log('Something went wrong while setting pool keys');
            return false;
        }

        this.context.variables.poolKeys = poolKeys as LiquidityPoolKeysV4;
        
        const walletTokenAddress = getAssociatedTokenAddressSync(
            this.context.variables.tokenId!,
            this.context.constants.wallet.publicKey,
        );

        this.context.variables.tokenWalletId = walletTokenAddress;
        
        const { innerTransaction } = Liquidity.makeSwapFixedInInstruction({
            poolKeys: poolKeys as LiquidityPoolKeysV4,
            userKeys: {
                tokenAccountIn: this.context.constants.walletWsol.pubkey,
                tokenAccountOut: walletTokenAddress,
                owner: this.context.constants.wallet.publicKey,
            },
            amountIn: this.context.tradeConstants.buyAmount.raw,
            minAmountOut: 0
        }, poolKeys.version);
        
        console.log(`Fetching latest blockhash...`);
        const { 
            blockhash, 
            lastValidBlockHeight 
        } = await this.context.constants.sollConn.getLatestBlockhash(
            {commitment: 'finalized'}
        );

        const msg = new TransactionMessage({
            payerKey: this.context.constants.wallet.publicKey,
            recentBlockhash: blockhash,
            instructions: [
                ComputeBudgetProgram.setComputeUnitPrice({
                    microLamports: this.context.tradeConstants.buyFees 
                }),
                createAssociatedTokenAccountIdempotentInstruction(
                    this.context.constants.wallet.publicKey,
                    walletTokenAddress,
                    this.context.constants.wallet.publicKey,
                    this.context.variables.tokenId!,
                ),
                ...innerTransaction.instructions,
            ] 
        }).compileToV0Message();

        const tx = new VersionedTransaction(msg);
        tx.sign([this.context.constants.wallet]);

        console.log(`Sending transaction...`);
        const signature = await this.context.constants.sollConn.sendRawTransaction(
            tx.serialize(),
            { preflightCommitment: 'finalized' }
        );

        console.log(`Waiting for transaction confirmation...`);
        const confirmation = await this.context.constants.sollConn.confirmTransaction({
            signature,
            lastValidBlockHeight,
            blockhash,
        }, 'finalized');

        if (confirmation && !confirmation.value.err) {
            this.context.variables.tokenWalletId = walletTokenAddress;
            return true;
        }
        return false;
    }
}