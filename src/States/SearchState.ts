import BN from "bn.js";
import { IState } from "../Interfaces/IState";
import { StateContext } from "./StateContext";
import { MAINNET_PROGRAM_ID,  LiquidityStateV4, LIQUIDITY_STATE_LAYOUT_V4 } from '@raydium-io/raydium-sdk';
import { TimeHelper } from "../Utils/TimeHelper";
import { PoolKeysHelper } from "../Utils/PoolKeysHelper";
import { TokenHelper } from "../Utils/TokenHelper";
import { TokenEvaluation } from "../Utils/TokenEvaluation";
import { Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";

export class SearchState implements IState {
    private listener?: number;
    private candidates: string[] = [];

    constructor(private context: StateContext) {}

    async execute(): Promise<void> {
        console.log(`-----SEARCH STATE-----`);
        this.context.variables.resetData();
        await this.listeningForPools();
    }

    private async listeningForPools(): Promise<void> {
        console.log(`Start to search for new pools.`);
        let candidateFound = false;

        // ANOTHER OPTION HOW TO GET NEW POOLS https://www.quicknode.com/guides/solana-development/3rd-party-integrations/track-raydium-lps
        this.listener = this.context.constants.sollConn.onProgramAccountChange(MAINNET_PROGRAM_ID.AmmV4, async(account) => {

            if (candidateFound) return;
            candidateFound = true;
            let accountId = account.accountId;
            
            // Check if we already found this pool            
            if (this.candidates.includes(accountId.toString())) {
                candidateFound = false;
                return;
            };
            this.candidates.push(accountId.toString());
           

            // Check for pool data status
            const data: LiquidityStateV4 = LIQUIDITY_STATE_LAYOUT_V4.decode(account.accountInfo.data);
            if (!data.status.eq(new BN(6))) {
                candidateFound = false;
                return;
            }

            // Check for pool opening time
            const openTime = data.poolOpenTime.toNumber();
            if (openTime === 0 || !TimeHelper.timeInRange(openTime * 1000, this.context.constants.poolAgeMs)) {
                candidateFound = false;
                return;
            }

            // Check for valid pool keys
            if (!PoolKeysHelper.keysValid(data.baseMint, data.quoteMint)) {
                candidateFound = false;
                return;
            }

            // Set token key
            const reversed = PoolKeysHelper.keysReversed(data.baseMint);
            const tokenKey = reversed ? data.quoteMint : data.baseMint; 

            // Validate token
            const token = await TokenHelper.getTokenInfo(this.context.constants.sollConn, tokenKey);
            if (!token || !TokenHelper.tokenRenounced(token) || !TokenHelper.tokenFreeze(token)) {
                candidateFound = false;
                return;
            }

            // Evaluate token
            if (!this.evaluationRules(token)) {
                candidateFound = false;
                return;
            }

            // Token found
            this.context.constants.sollConn.removeProgramAccountChangeListener(this.listener!);
            this.context.variables.poolId = accountId;
            this.context.variables.tokenId = tokenKey;
            console.log(`Token found: https://dexscreener.com/solana/${tokenKey}`);
            this.context.setState(this.context.buyState);
        });
    }

    private evaluationRules(token: Sft | SftWithToken | Nft | NftWithToken): boolean {
        if (this.context.evaluationConstants.description) {
            return TokenEvaluation.tokenHasDescription(token);
        }
        return true;
    }
}