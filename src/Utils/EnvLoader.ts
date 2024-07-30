import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import bs58 from "bs58";
import { TokenAmount, Token } from '@raydium-io/raydium-sdk';
import 'dotenv/config';

export class EnvLoader {

    static getSolConn(): Connection {
        return new Connection(
            this.retrieveEnvString('SOLANA_RPC_URL'),
            { wsEndpoint: this.retrieveEnvString('SOLANA_WSS_URL') }
        );
    }

    static getRaydium(): PublicKey {
        return new PublicKey(this.retrieveEnvString('RAY_AMM_ID'));
    }

    static getWallet(): Keypair {
        return Keypair.fromSecretKey(bs58.decode(this.retrieveEnvString('WALLET_PRIVATE_KEY')));
    }

    static getPoolAge(): number {
        return this.retrieveEnvInt('POOL_AGE_MS');
    }

    static getBuyAmount(): TokenAmount {
        return new TokenAmount(
            Token.WSOL,
            this.retrieveEnvFloat('BUY_AMOUNT'),
            false
        );
    }

    static getBuyFees(): number {
        return this.retrieveEnvInt('BUY_FEES_LAMPORTS');
    }

    static getSellFees(): number {
        return this.retrieveEnvInt('SELL_FEES_LAMPORTS');
    }

    static getTimeToSell(): number {
        return this.retrieveEnvInt('SELL_AFTER_MS');
    }

    static getDescription(): boolean {
        return this.retrieveEnvBoolean('TOKEN_DESCRIPTION');
    }

    private static retrieveEnvInt(variableName: string): number {
        return parseInt(this.retrieveEnvString(variableName), 10);
    }

    private static retrieveEnvFloat(variableName: string): number {
        return parseFloat(this.retrieveEnvString(variableName));
    }

    private static retrieveEnvBoolean(variableName: string): boolean {
        return this.retrieveEnvString(variableName) === 'true';
    }

    private static retrieveEnvString(variableName: string): string {
        const variable = process.env[variableName];
        if (!variable) {
            console.error(`${variableName} is not set`);
            process.exit(1);
        }
        return variable;
    }
}
