import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";

export interface DecodedSPL {
    mint: PublicKey;
    delegate: PublicKey;
    owner: PublicKey;
    state: number;
    amount: BN;
    delegateOption: number;
    isNativeOption: number;
    isNative: BN;
    delegatedAmount: BN;
    closeAuthorityOption: number;
    closeAuthority: PublicKey;
}