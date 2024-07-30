import { StateContext } from "./States/StateContext";

(async () => {
    const context = await StateContext.createInstance();
    context.executeState();
})();