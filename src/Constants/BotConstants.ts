import { Connection, Keypair } from "@solana/web3.js";
import { IBotConfig, IWsolWallet } from "../Interfaces/IBotConfig";
import { EnvLoader } from "../Utils/EnvLoader";
import { SPL_ACCOUNT_LAYOUT, Token, TOKEN_PROGRAM_ID } from "@raydium-io/raydium-sdk";

export class BotConstants { 
    
    readonly sollConn: Connection;
    readonly wallet: Keypair;
    readonly poolAgeMs: number;
    readonly walletWsol: IWsolWallet;
    
    private static instance: BotConstants;
    
    private constructor(config: IBotConfig) {
        this.sollConn = config.solConn;
        this.wallet = config.wallet;
        this.poolAgeMs = config.poolAgeMs;
        this.walletWsol = config.walletWsol;
    }

    static async getInstance(): Promise<BotConstants> {
        if (!BotConstants.instance) {
            await this.initialize();
        }
        return BotConstants.instance;
    }

    private static async initialize(): Promise<void> {
        const solConn = EnvLoader.getSolConn();
        const wallet = EnvLoader.getWallet();
        const config: IBotConfig = {
            solConn,
            wallet,
            poolAgeMs: EnvLoader.getPoolAge(),
            walletWsol: await this.walletWsolAccount(solConn, wallet)
        };
        BotConstants.instance = new BotConstants(config);
    }

    private static async walletWsolAccount(sollConn: Connection, wallet: Keypair) {
        const { value: tokenAccounts } = await sollConn.getTokenAccountsByOwner(
            wallet.publicKey,
            { programId:  TOKEN_PROGRAM_ID },
            'finalized'
        );

        if (!tokenAccounts) {
            console.log('No accounts found in bot wallet.');
            process.exit(1);
        }

        const wsolMintAddress = Token.WSOL.mint.toString();

        const wsolAccountInfo = tokenAccounts.find(i =>
            SPL_ACCOUNT_LAYOUT.decode(i.account.data).mint.toString() === wsolMintAddress
        );

        if (!wsolAccountInfo) {
            console.log('No WSOL account found in bot wallet.');
            process.exit(1);
        }

        return wsolAccountInfo;
    }
}