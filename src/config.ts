import bs58 from 'bs58';

import {
  parseTokenAccountResp,
  Raydium,
  TxVersion,
} from '@raydium-io/raydium-sdk-v2';
import {
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Connection,
  Keypair,
} from '@solana/web3.js';

// export const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from([179,3,16,89,75,94,147,146,107,142,137,163,66,234,236,82,65,183,254,245,47,110,215,216,72,127,119,46,215,249,199,241,11,212,37,99,137,5,243,10,5,224,219,17,144,108,64,250,90,25,98,185,74,111,2,81,54,174,65,121,23,185,59,201])) //adin3
export const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
export const owner2: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("5GusLaZdARYXq6Jcqb59oqhKv4aveZZWN4UwFEqB7e4PV95zGsc2VywHH3BHnn14bA9vzkXNgueL5Hw9Shh6tZ9w")))
export const keyPair: Keypair = Keypair.fromSecretKey(Uint8Array.from([
  193,  85,  99, 128,   2, 178, 170,   4, 181, 167,  74,
   27, 134,  35, 132,  80, 216, 100,  15,  36, 105, 244,
   35, 144,  98, 179,  31,   7, 178, 208, 107, 197,  20,
  201, 205,  63, 104, 234, 159,  93,  35, 249,  61,  52,
  143, 182, 109, 205, 180, 201, 165, 137, 100,  41, 175,
  206,  54, 162, 204, 138, 248, 107,  10, 122
])) //new Keypair()
export const fee4: Keypair = Keypair.fromSecretKey(Uint8Array.from([136,165,199,41,90,246,101,80,135,94,242,76,185,64,180,136,211,244,120,34,128,73,180,138,71,240,141,136,161,61,166,6,251,231,23,134,175,174,24,42,221,41,108,109,159,85,181,138,68,53,138,25,181,162,139,167,215,247,161,11,75,184,150,196])) //fee4.json

// export const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from([
//   193,  85,  99, 128,   2, 178, 170,   4, 181, 167,  74,
//    27, 134,  35, 132,  80, 216, 100,  15,  36, 105, 244,
//    35, 144,  98, 179,  31,   7, 178, 208, 107, 197,  20,
//   201, 205,  63, 104, 234, 159,  93,  35, 249,  61,  52,
//   143, 182, 109, 205, 180, 201, 165, 137, 100,  41, 175,
//   206,  54, 162, 204, 138, 248, 107,  10, 122
// ])) //new Keypair()
export const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>
export const connection2 = new Connection('https://distinguished-red-fog.solana-mainnet.quiknode.pro/5f4638f45d0863814b3b5abbbfa268c4900aad88/') //<YOUR_RPC_URL>
// export const connection = new Connection(clusterApiUrl('devnet')) //<YOUR_RPC_URL>
// export const connection = new Connection('https://boldest-necessary-telescope.solana-devnet.quiknode.pro/d84334700a69839dc8ef8f3f17f82dc0541ed9df/')//https://boldest-necessary-telescope.solana-devnet.quiknode.pro/d84334700a69839dc8ef8f3f17f82dc0541ed9df/
export const txVersion = TxVersion.V0 // or TxVersion.LEGACY

let raydium: Raydium | undefined
export const initSdk = async (params?: { loadToken?: boolean }) => {
  if (raydium) return raydium
  raydium = await Raydium.load({
    owner,
    connection,
    cluster: 'devnet', // 'mainnet' | 'devnet'
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: 'finalized',
    // urlConfigs: {
    //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
    // },
  })

  /**
   * By default: sdk will automatically fetch token account data when need it or any sol balace changed.
   * if you want to handle token account by yourself, set token account data after init sdk
   * code below shows how to do it.
   * note: after call raydium.account.updateTokenAccount, raydium will not automatically fetch token account
   */

  /*  
  raydium.account.updateTokenAccount(await fetchTokenAccountData())
  connection.onAccountChange(owner.publicKey, async () => {
    raydium!.account.updateTokenAccount(await fetchTokenAccountData())
  })
  */

  return raydium
}

export const fetchTokenAccountData = async () => {
  const solAccountResp = await connection.getAccountInfo(owner.publicKey)
  const tokenAccountResp = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_PROGRAM_ID })
  const token2022Req = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_2022_PROGRAM_ID })
  const tokenAccountData = parseTokenAccountResp({
    owner: owner.publicKey,
    solAccountResp,
    tokenAccountResp: {
      context: tokenAccountResp.context,
      value: [...tokenAccountResp.value, ...token2022Req.value],
    },
  })
  return tokenAccountData
}
