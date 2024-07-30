import { SPL_ACCOUNT_LAYOUT } from "@raydium-io/raydium-sdk";
import { IState } from "../Interfaces/IState";
import { StateContext } from "./StateContext";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import BN from "bn.js";
import { DecodedSPL } from "../Interfaces/DecodedSPL";

export class InitializeState implements IState {

    constructor(private context: StateContext) {}

    async execute(): Promise<void> {
        console.log(`-----INITIALIZE STATE-----`);
        const wsolAcc = SPL_ACCOUNT_LAYOUT.decode(this.context.constants.walletWsol.account.data);
        this.validateWSOLBalance(wsolAcc);
        await this.validateSOLBalance();
        console.log(`Wsol and sol balance sufficient.`);
        this.context.setState(this.context.searchState);
    }


    private validateWSOLBalance(wsolAccount: DecodedSPL): void {
        const requiredAmount = this.context.tradeConstants.buyAmount.raw;
        if (wsolAccount.amount.lt(requiredAmount)) {
            const balance = wsolAccount.amount.toNumber() / LAMPORTS_PER_SOL;
            const required = requiredAmount.toNumber() / LAMPORTS_PER_SOL;
            console.log(`Not enough WSOL. Balance: ${balance}, required: ${required}`);
            process.exit(1);
        }
    }

    private async validateSOLBalance(): Promise<void> {
        const balance = await this.context.constants.sollConn.getBalance(
            this.context.constants.wallet.publicKey,
            'finalized'
        );

        if (new BN(balance).lt(this.context.tradeConstants.buyAmount.raw)) {
            console.log(`Not enough SOL in your wallet.`);
            process.exit(1);
        }
    }
}