import { Connection, PublicKey } from "@solana/web3.js";
import { LIQUIDITY_STATE_LAYOUT_V4, Liquidity, Market } from "@raydium-io/raydium-sdk";
import { MARKET_DATA } from "../Interfaces/MarketData";

export class PoolKeysHelper {
    private static readonly WSOL_KEY = 'So11111111111111111111111111111111111111112';

    static keyEqualsWsol(key: PublicKey): boolean {
        return key.toString() === this.WSOL_KEY;
    }

    static keysValid(baseMint: PublicKey, quoteMint: PublicKey): boolean {
        return this.keyEqualsWsol(baseMint) || this.keyEqualsWsol(quoteMint);
    }

    static keysReversed(baseMint: PublicKey): boolean {
        return this.keyEqualsWsol(baseMint);
    }

    static async prepareKeys(poolId: PublicKey, conn: Connection) {
        const poolAccount  = await conn.getAccountInfo(poolId, 'finalized');
        if (!poolAccount) {
            console.log(`Couldn't fetch pool account`);
            return null;
        }

        const poolData = LIQUIDITY_STATE_LAYOUT_V4.decode(poolAccount.data);

        const marketAccount = await conn.getAccountInfo(poolData.marketId, 'finalized');
        if (!marketAccount) {
            console.log(`Couldn't fetch market info`);
            return null;
        }

        const marketData = MARKET_DATA.decode(marketAccount.data);

        return {
            id: poolId,
            baseMint: poolData.baseMint,
            quoteMint: poolData.quoteMint,
            lpMint: poolData.lpMint,
            baseDecimals: poolData.baseDecimal.toNumber(),
            quoteDecimals: poolData.quoteDecimal.toNumber(),
            lpDecimals: 5,
            version: 4,
            programId: poolAccount.owner,
                authority: Liquidity.getAssociatedAuthority({
                programId: poolAccount.owner,
            }).publicKey,
            openOrders: poolData.openOrders,
            targetOrders: poolData.targetOrders,
            baseVault: poolData.baseVault,
            quoteVault: poolData.quoteVault,
            withdrawQueue: poolData.withdrawQueue,
            lpVault: poolData.lpVault,
            marketVersion: 3,
            marketProgramId: poolData.marketProgramId,
            marketId: poolData.marketId,
            marketAuthority: Market.getAssociatedAuthority({
                programId: poolData.marketProgramId,
                marketId: poolData.marketId,
            }).publicKey,
            marketBaseVault: poolData.baseVault,
            marketQuoteVault: poolData.quoteVault,
            marketBids: marketData.bids,
            marketAsks: marketData.asks,
            marketEventQueue: marketData.eventQueue,
            lookupTableAccount: PublicKey.default,
        }
    }
}