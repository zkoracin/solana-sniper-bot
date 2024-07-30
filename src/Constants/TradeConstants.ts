import { ITradingConfig } from "../Interfaces/ITradingConfig";
import { EnvLoader } from "../Utils/EnvLoader";
import { TokenAmount } from "@raydium-io/raydium-sdk";

export class TradeConstants {
    
    readonly buyAmount: TokenAmount;
    readonly buyFees: number;
    readonly sellFees: number;
    readonly timeToSell: number;
    
    private static instance: TradeConstants;
    
    private constructor(config: ITradingConfig) {
        this.buyAmount = config.buyAmount;
        this.buyFees = config.buyFees;
        this.sellFees = config.sellFees;
        this.timeToSell = config.timeToSell;
    }

    static async getInstance(): Promise<TradeConstants> {
        if (!TradeConstants.instance) {
            await this.initialize();            
        }
        return TradeConstants.instance;
    }

    private static async initialize(): Promise<void> {
        const config: ITradingConfig = {
            buyAmount: EnvLoader.getBuyAmount(),
            buyFees: EnvLoader.getBuyFees(),
            sellFees: EnvLoader.getSellFees(),
            timeToSell: EnvLoader.getTimeToSell(),
        }
        TradeConstants.instance = new TradeConstants(config);
    }
}