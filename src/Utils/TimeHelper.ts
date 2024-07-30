export class TimeHelper {
    static timeInRange(timeMs: number, maxDiffMs: number): boolean {
        const current = Date.now();
        const diff = Math.abs(current - timeMs);
        return diff <= maxDiffMs;
    }

    static timeout(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}