import { TokenAmount } from "@raydium-io/raydium-sdk";

export interface ITradingConfig {
    buyAmount: TokenAmount;
    buyFees: number;
    sellFees: number;
    timeToSell: number;
}