import { PublicKey } from "@solana/web3.js";
import { LiquidityPoolKeysV4 } from "@raydium-io/raydium-sdk";

export class StateVariables {
    
    private static instance: StateVariables;

    private _poolId?: PublicKey;
    private _tokenId?: PublicKey;
    private _poolKeys?: LiquidityPoolKeysV4;
    private _tokenWalletId?: PublicKey;
    private _tokenBoughtAmount?: number;
    
    private constructor() {}

    static getInstance(): StateVariables {
        if (!StateVariables.instance) {
            StateVariables.instance = new StateVariables();
        }
        return StateVariables.instance;
    }

    resetData(): void {
        this._poolId = undefined;
        this._tokenId = undefined;
        this._poolKeys = undefined;
        this._tokenWalletId = undefined;
        this._tokenBoughtAmount = undefined;
    }

    set poolId(key: PublicKey) {
        this._poolId = key
    };

    get poolId(): PublicKey | undefined {
        return this._poolId
    }

    set tokenId(key: PublicKey) {
        this._tokenId = key;
    }

    get tokenId(): PublicKey | undefined {
        return this._tokenId;
    }

    set poolKeys(keys: LiquidityPoolKeysV4) {
        this._poolKeys = keys;
    }

    get poolKeys(): LiquidityPoolKeysV4 | undefined {
        return this._poolKeys;
    }

    set tokenWalletId(key: PublicKey) {
        this._tokenWalletId = key;
    }

    get tokenWalletId(): PublicKey | undefined {
        return this._tokenWalletId;
    }

    set tokenBoughtAmount(amount: number) {
        this._tokenBoughtAmount = amount;
    }

    get tokenBoughtAmount(): number | undefined {
        return this._tokenBoughtAmount;
    }
}