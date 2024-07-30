import { IEvaluationConfig } from '../Interfaces/IEvaluationConfig';
import { EnvLoader } from '../Utils/EnvLoader';

export class EvaluationConstants {
    readonly description: boolean;

    private static instance: EvaluationConstants;

    private constructor(config: IEvaluationConfig) {
        this.description = config.description;
    }

    static async getInstance(): Promise<EvaluationConstants> {
        if (!EvaluationConstants.instance) {
            await this.initialize();            
        }
        return EvaluationConstants.instance;
    }

    private static async initialize(): Promise<void> {
        const config: IEvaluationConfig = {
            description: EnvLoader.getDescription()
        }
        EvaluationConstants.instance = new EvaluationConstants(config);
    }
}