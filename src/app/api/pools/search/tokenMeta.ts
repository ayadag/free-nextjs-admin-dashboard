import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { getTokenMetadata } from '@solana/spl-token';
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

type Token = {
  address: string,
  mint: string,
  owner: string,
  balance: number,
  decimals: number,
}

type TokenMetadata = {
    mint: string,
    owner: string,
    name: string,
    symbol: string,
    uri: string,
    logoURI?: string,
}

const rpcEndpoint = 'https://api.devnet.solana.com/';
const solanaConnection = new Connection(rpcEndpoint);
// const walletKey = 'FR6qGWrrGAhtVNgUpiKyiwFEc62eoTJp3tjd67eBt2h6'; //hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
const dataSize0 = 165;
const dataSize1 = 182;

let TOKEN_PROGRAM_ID = new PublicKey(
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'
);
let TOKEN_2022_PROGRAM_ID = new PublicKey(
    'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb'
);

export async function getMetadataLogoURI(mint: string, owner: string) {
    const meta0: any = await metadata1(mint, owner);
    const meta1: any = await metadata0(mint);
    const meta3 = {
        name: '',
        symbol: '',
        uri: '',
    }

    let meta: any = meta0 != null? meta0: meta1 != null? meta1: meta3;

    const logoURI = await getLogoURI(String(meta.uri));

    const tokenData: TokenMetadata ={
        mint,
        owner,
        name: String(meta.name),
        symbol: String(meta.symbol),
        uri: String(meta.uri),
        logoURI,
    }
    console.log(tokenData);
    return tokenData
}

async function getMetadataUri(mint: string, owner: string) {
    const meta0: any = await metadata1(mint, owner);
    const meta1: any = await metadata0(mint);
    const meta3 = {
        name: '',
        symbol: '',
        uri: '',
    }

    let meta: any = meta0 != null? meta0: meta1 != null? meta1: meta3;

    const tokenData: TokenMetadata ={
        mint,
        owner,
        name: String(meta.name),
        symbol: String(meta.symbol),
        uri: String(meta.uri),
    }
    console.log(tokenData);
    return tokenData
}

async function metadata0(tokenId: string) {
    // const token = new web3.PublicKey('So11111111111111111111111111111111111111112'); //SOL
    // const token = new web3.PublicKey('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb'); //SALD
    const token = new PublicKey(tokenId); //SALD
    // const umi = createUmi('https://api.devnet.solana.com', 'processed')
    // Use the RPC endpoint of your choice.
    // const umi = createUmi('https://api.devnet.solana.com').use(mplTokenMetadata())
    const umi = createUmi('https://api.devnet.solana.com')
    // umi.programs.bind('splToken', 'splToken2022');
  
    const mint = fromWeb3JsPublicKey(token);
    try{
    const asset = await fetchDigitalAsset(umi, mint) 
    // console.log('asset: ', asset);
    const tokenData = {
      publicKey: asset.publicKey,
      owner: asset.mint.header.owner,
      mintAuthority: asset.mint.mintAuthority,
      updateAuthority: asset.metadata.updateAuthority,
      name: asset.metadata.name,
      symbol: asset.metadata.symbol,
      uri: asset.metadata.uri,
      decimals: asset.mint.decimals,
      supply: asset.mint.supply,
      executable: asset.mint.header.executable,
    }
    // console.log('tokenData: ', tokenData)
    return tokenData;
    } catch { return null }
}

async function  metadata1(tokenId:string, programId:string) {
    // Retrieve and log the metadata state
    const metadata = await getTokenMetadata(
      solanaConnection, // Connection instance
      new PublicKey(tokenId), // PubKey of the Mint Account
      'confirmed', // Commitment, can use undefined to use default
      // TOKEN_2022_PROGRAM_ID, //spl-2022 token
      // TOKEN_PROGRAM_ID, //spl toke
      new PublicKey(programId),
    )
    // console.log('metadata: ', metadata)
    return metadata;
}

async function getLogoURI(uri:string) {
    if(uri == ''){return '';}
    try{
        // console.log("`${uri}`: ", `${uri}`)
        const meta = await ( await fetch (
            `${uri}`
            )
        ).json();
        const logU:string = meta.image;
        // console.log('logU: ', logU)
        return logU
    } catch (error) {
        console.error('Error in getLogoURI: ', error)
        const logU:string = '';
        return logU
    }      
}

// getMetadataUri('jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX', TOKEN_2022_PROGRAM_ID.toString())  //aleyana jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX
// getMetadataUri('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb', TOKEN_PROGRAM_ID.toString())  //SALD Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb
// getMetadataLogoURI('jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX', TOKEN_2022_PROGRAM_ID.toString())  //aleyana jqoKcrxD2nPNUDboA7JojvRXBfQNedD6Yhnse2kTwfX
// getMetadataLogoURI('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb', TOKEN_PROGRAM_ID.toString())  //SALD Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb
