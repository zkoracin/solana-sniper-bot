import { AccountInfo, Connection, Keypair, PublicKey } from "@solana/web3.js";

export interface IBotConfig {
    solConn: Connection;
    wallet: Keypair;
    poolAgeMs: number;
    walletWsol: IWsolWallet;
}

export interface IWsolWallet {
    account: AccountInfo<Buffer>;
    pubkey: PublicKey;
}