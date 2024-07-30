import { Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";

export class TokenEvaluation {
    static tokenHasDescription(token: Sft | SftWithToken | Nft | NftWithToken): boolean {
        return !!(token.json && token.json.description);
    }
}