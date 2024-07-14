import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters';
import { getTokenMetadata } from '@solana/spl-token';
import {
  Connection,
  GetProgramAccountsFilter,
  PublicKey,
} from '@solana/web3.js';

type token = {
  address: string,
  mint: string,
  owner: string,
  balance: number,
  decimals: number,
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

export class getTokensList {
    tokens: token[]= [];
    accounts: any[] = [];
    tList: any[] = [];
    meta: any;
  
    // constructor(accounts: any[]){
    //   // const tokens:any[];
    //   this.accounts = accounts;
    // }
  
    async getTokenAccounts() {
    //   this.tokens = []; //ayad
      for (let index = 0; index < this.accounts.length; index++) {
      // this.accounts.forEach((account, i) => {
      const account = this.accounts[index] //for
      const parsedAccountInfo:any = account.account.data;
      const mintAddress:string = parsedAccountInfo["parsed"]["info"]["mint"];
      const tokenBalance: number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];
      const decimals:number = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"];

      this.tokens.push(
      {
        address: String(account.pubkey.toString()),
        mint: String(mintAddress),
        owner: String(account.account.owner),
        balance: Number(tokenBalance),
        decimals: Number(decimals),
      }
      )
      // tokens[index] = (accounts[index]);
      // console.log('${account.pubkey.toString()}: ', `${account.pubkey.toString()}`)
      }
      //   )
      // console.log(this.tokens);
      return this.tokens;
    }
  
    
  
    async metadata0(tokenId: string) {
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
  
    async  metadata1(tokenId:string, programId:string) {
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
  
    async get(wallet: string, solanaConnection: Connection, dataSize0: number, dataSize1: number) {
      const filters0:GetProgramAccountsFilter[] = [
          {
            dataSize: dataSize0,    //size of account (bytes) spl-token=165 spl-2022-token=182
          },
          {
            memcmp: {
              offset: 32,     //location of our query in the account (bytes)
              bytes: wallet,  //our search criteria, a base58 encoded string
            },            
      }];
  
      const filters1:GetProgramAccountsFilter[] = [
          {
            dataSize: dataSize1,    //size of account (bytes) spl-token=165 spl-2022-token=182
          },
          {
            memcmp: {
              offset: 32,     //location of our query in the account (bytes)
              bytes: wallet,  //our search criteria, a base58 encoded string
            },            
      }];
  
      const accounts0 = await solanaConnection.getParsedProgramAccounts(
          TOKEN_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
          {filters: filters0}
      );
      // console.log('accounts0: ', accounts0)
      const accounts1 = await solanaConnection.getParsedProgramAccounts(
          TOKEN_2022_PROGRAM_ID, //new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
          {filters: filters1}
      );
  
      // const getTL0 = new getTokenList(accounts0);
      // const list = await getTL.getTokenAccounts('Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb', solanaConnection, 165);
  
      this.accounts = accounts0;
      let list0 = await this.getTokenAccounts();
      this.tokens = []; //ayad
    //   this.accounts = [];
    // console.log('this.accounts', this.accounts)
      this.accounts = accounts1;
      let list1 = await this.getTokenAccounts();
      this.tokens = []; //ayad
    //   this.accounts = [];
      const totalList = [...list0,...list1];
    //   const totalList = [...list1];
    //   list0 = list1 =[];
      
    //   this.accounts = accounts0;
    //   await this.getTokenAccounts();  //get TOKEN_PROGRAM_ID TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA
    //   this.accounts = accounts1;
    //   const list = await this.getTokenAccounts(); //get TOKEN_2022_PROGRAM_ID TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb
    //   const totalList = [...list];
  
    //   this.tokens = []; //ayad
      // console.log(totalList)
      return totalList
    }
  
    async getU0(walletKey: string) {
      // const totalList = await this.get(walletKey, solanaConnection, 165, 182); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
      const totalList = await this.get(walletKey, solanaConnection, dataSize0, dataSize1); // wallet= hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus
  
      for (let index = 0; index < totalList.length; index++) {
        const meta0: any = await this.metadata1(totalList[index].mint, totalList[index].owner);
        const meta1: any = await this.metadata0(totalList[index].mint);
        const meta3 = {
          name: '',
          symbol: '',
          uri: '',
        }
        let meta: any = meta0 != null? meta0: meta1 != null? meta1: meta3
          // this.tList.push(totalList[index], await Token(totalList[index].mint));     
          // this.tList.push(totalList[index], await metadata(totalList[index].mint, totalList[index].owner));
          this.tList.push({
            address: totalList[index].address, 
            mint: totalList[index].mint, 
            owner: totalList[index].owner, 
            balance: totalList[index].balance, 
            name: String(meta.name) || '',
            symbol: String(meta.symbol) || '',
            uri: String(meta.uri) || '',
            decimals: totalList[index].decimals,
          });
      }
      return this.tList;
    }
  
    async getUri(walletKey: string) {
      // const gU = new geturi();
    //   this.tokens = []; //ayad
      const tLU = await this.getU0(walletKey);
    //   console.log(tLU)
      return tLU;
    }
  }