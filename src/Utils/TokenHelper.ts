import { Metaplex, Nft, NftWithToken, Sft, SftWithToken } from "@metaplex-foundation/js";
import { Connection, PublicKey } from "@solana/web3.js";

export class TokenHelper {
    static async getTokenInfo(conn: Connection, tokenKey: PublicKey): Promise<Sft | Nft | null> {
        const metaplex = Metaplex.make(conn);
        return await metaplex.nfts().findByMint({mintAddress: tokenKey});
    }

    
    static tokenRenounced(token: Sft | SftWithToken | Nft | NftWithToken): boolean {
        return !token.mint.mintAuthorityAddress;
    }
    
    static tokenFreeze(token: Sft | SftWithToken | Nft | NftWithToken): boolean {
        return !token.mint.freezeAuthorityAddress;
    }

}