import { publicKey, struct } from "@raydium-io/raydium-sdk";

export const MARKET_DATA = struct([
    publicKey('eventQueue'),
    publicKey('bids'),
    publicKey('asks'),
]);