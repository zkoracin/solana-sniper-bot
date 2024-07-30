import { IState } from "../Interfaces/IState";
import { InitializeState } from "./InitializeState";
import { SearchState } from "./SearchState";
import { BotConstants } from "../Constants/BotConstants";
import { TradeConstants } from "../Constants/TradeConstants";
import { EvaluationConstants } from "../Constants/EvaluationConstants";
import { BuyState } from "./BuyState";
import { SellState } from "./SellState";
import { StateVariables } from "./StateVariables";


export class StateContext {
    private state: IState;

    readonly constants: BotConstants;
    readonly tradeConstants: TradeConstants;
    readonly evaluationConstants: EvaluationConstants;

    variables: StateVariables;
    
    readonly initializeState: InitializeState;
    readonly searchState: SearchState;
    readonly buyState: BuyState;
    readonly sellState: SellState;
    
   
    private constructor(
        constants: BotConstants,
        tradeConstants: TradeConstants,
        evaluationConstants: EvaluationConstants,
        variables: StateVariables,
    ) {
        this.constants = constants;
        this.tradeConstants = tradeConstants;
        this.evaluationConstants = evaluationConstants;
        this.variables = variables;
        this.initializeState = new InitializeState(this);
        this.searchState = new SearchState(this);
        this.buyState = new BuyState(this);
        this.sellState = new SellState(this);
        this.state = this.initializeState;
    }

    static async createInstance(): Promise<StateContext> {
        const constants = await BotConstants.getInstance();
        const tradeConstants = await TradeConstants.getInstance();
        const evaluationConstants = await EvaluationConstants.getInstance();
        return new StateContext(
            constants,
            tradeConstants,
            evaluationConstants,
            StateVariables.getInstance(),
        );
    }

    executeState(): void {
        this.state.execute();
    }

    setState(state: IState): void {
        this.state = state;
        this.executeState();
    }
}