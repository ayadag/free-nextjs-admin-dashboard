import bs58 from 'bs58';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { Raydium } from '@raydium-io/raydium-sdk-v2';
import {
  Connection,
  Keypair,
  PublicKey,
} from '@solana/web3.js';

import { getMetadataLogoURI } from '../search/tokenMeta';

// const SENDER_SECRET_KEY = process.env.SOLANA_SECRET_KEY //
//     ? new Uint8Array(process.env.SOLANA_SECRET_KEY.split(',').map(Number)) 
//     : new Uint8Array([]);

export async function GET(req: NextRequest, res: NextResponse) {
  if (req.method === 'GET') {

    try {
      // const searchParams = await req.nextUrl.searchParams;
      const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>
      
      // try{ 
      //   const perPage = searchParams.get('perPage');
      //   console.log('perPage: ', perPage)
      // } catch (error) {
      //   return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message as string }), {
      //         status: 500,
      //         headers: {
      //           'Content-Type': 'application/json',
      //         },
      //   });
      // }

      // const page: number = Number(searchParams.get('page'));
      // const perPage: number = Number(searchParams.get('perPage'));
      // const query = searchParams.get('query')?.toLowerCase();
      // const query = searchParams.get('query');

      // if(!query){
      //   return new NextResponse(JSON.stringify({ success: false, error: '!query)'}), {
      //             status: 500,
      //             headers: {
      //               'Content-Type': 'application/json',
      //               // 'Access-Control-Allow-Origin': '*',
      //             },
      //   });
      // }
      const poolsM: any[] = [];
      // const pools = await getProgramAccounts6(connection, 1, 2);
      const pools = await getProgramAccounts6(connection);
      for (let index = 0; index < pools.length; index++) {
        await fetchRpcPoolInfo(String(pools[index])).then(res => poolsM.push(res))
      }
      console.log('poolsM: ', poolsM)

      const poolsM1 = await getPools(poolsM);
      // let poolsM2: any[];
      // poolsM?.filter((pool: any) => {
      //   pool.poolId.toLowerCase().includes(query.toLowerCase())
      // }).map((e:any, i:any) => {
      //   poolsM2.push(e)
      //   console.log('e: ', e)
      // })
      // poolsM2 = poolsM?.filter((pool: any) => {
      if(!poolsM1) {return console.log('!poolsM1')}
      // poolsM2 = poolsM1?.filter((pool: any) => {
      //     // return pool.poolId.toLowerCase().includes(query.toLowerCase())
      //     // return pool.tokenAMetadata.symbol.toLowerCase().includes(query.toLowerCase()) || pool.tokenAMetadata.name.toLowerCase().includes(query.toLowerCase()) || pool.poolId.toLowerCase().includes(query.toLowerCase())
      //     // return pool.tokenAMetadata.symbol.toLowerCase().includes(query.toLowerCase())
      //     const symbolAResult: any[] = pool.tokenAMetadata.symbol.toLowerCase().includes(query.toLowerCase())
      //     if(symbolAResult.length != 0) {return symbolAResult}
      //     const symbolBResult: any[] = pool.tokenBMetadata.symbol.toLowerCase().includes(query.toLowerCase())
      //     return symbolBResult
      //     // const nameResult: any[] = pool.tokenAMetadata.name.toLowerCase().includes(query.toLowerCase())
      //     // if(nameResult.length != 0) {return nameResult}
      //     // return nameResult
      //     // const poolIdResult: any[] = pool.poolId.toLowerCase().includes(query.toLowerCase())
      //     // return poolIdResult
      //     // return [...symbolResult, ...nameResult]
      // })

      const data = poolsM1;
      // const data = {
      //   state: 'ok'
      // }
      return new NextResponse(JSON.stringify({ success: true, data }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            // 'Access-Control-Allow-Origin': '*',
          },
      });

    
    } catch (error) {
      console.log("Error: ", error)
      return new NextResponse(JSON.stringify({ success: false, error: (error as Error).message as string }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          // 'Access-Control-Allow-Origin': '*',
        },
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
      status: 405,
      headers: {
        'Allow': 'GET',
      },
    });
  }
}

async function getProgramAccounts6(connection: Connection) {
  // const raydium = await initSdk();
  const programId = new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');

  const accountsWithoutData = await connection.getProgramAccounts(
    programId,
    {
      dataSlice: { offset: 0, length: 0 },
      filters: [
        {
          dataSize: 637  //637 byte(s)
        }
      ]
    }
  )
  
  const accountKeys = accountsWithoutData.map(account => account.pubkey)
  // console.log('accountKeys: ', accountKeys)

  // const paginatedKeys = accountKeys.slice((page-1)*perPage, page*perPage)  //slect only first 5 accounts
  const paginatedKeys = accountKeys  //slect all accounts
 
  return paginatedKeys
}

const fetchRpcPoolInfo = async (pool1: string) => {
  const raydium = await initSdk()
  // SOL-RAY
  // const pool1 = '4y81XN75NGct6iUYkBp2ixQKtXdrQxxMVgFbFF9w5n4u'
  // const pool1 = 'HMa1rFjBY35jW6KvpLJf79XFsThSj1ZJBp8KoVe8nHkB'

  const res = await raydium.cpmm.getRpcPoolInfos([pool1])
  const programId = new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo');

  const pool1Info = res[pool1]

  // console.log('pool id: ', pool1)
  // console.log('SOL-RAY pool price:', pool1Info.poolPrice)
  // // console.log('cpmm pool infos:', res)
  // console.log('SOL-SALD pool poolCreator:', `${pool1Info.poolCreator}`) //poolCreator:
  // console.log('pool1Info.mintA, pool1Info.mintB, pool1Info.mintLp :', 
  //   `${pool1Info.mintA}`, 
  //   `${pool1Info.mintB}`, 
  //   `${pool1Info.mintLp}`
  // )

  const poolInfo = {
    poolId: pool1,
    // programId: `${programId}`,
    programId: String(programId),  //Or
    poolCreator: `${pool1Info.poolCreator}`,
    configId: `${pool1Info.configId}`,
    mintA: `${pool1Info.mintA}`,
    mintProgramA: `${pool1Info.mintProgramA}`,
    vaultA: `${pool1Info.vaultA}`,
    mintB: `${pool1Info.mintB}`,
    mintProgramB: `${pool1Info.mintProgramB}`,
    vaultB: `${pool1Info.vaultB}`,
    bump: pool1Info.bump,
    status: pool1Info.status,
    lpAmount: Number(pool1Info.lpAmount),
    openTime: Number(pool1Info.openTime),
    poolPrice: pool1Info.poolPrice,
  }

  // console.log('poolInfo: ', poolInfo)
  return poolInfo
}

const initSdk = async (params?: { loadToken?: boolean }) => {
  const connection = new Connection('https://api.devnet.solana.com') //<YOUR_RPC_URL>
  const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")));
  let raydium: Raydium | undefined
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

async function getPools (poolsData: any[]) {
  let poolsList2: any[] =[];

  // const url = `/api/pools?page=${page}&perPage=${searchParam.perPage}`;

  try {
      // const pools: Pool[] = await ( await fetch(
      // pools = await ( await fetch(
      //     // `${url}`
      //     url
      //     )
      // ).json();
      // console.log('pools', pools)
      // poolsData = pools.data

      for (let index = 0; index < poolsData.length; index++) {
        // const pool2 = poolsList[index]
        const pool2 = poolsData[index]  //Noooooooooooooooooooooooooooooo
        const metaA = await getMetadataLogoURI(pool2.mintA, pool2.mintProgramA)
        const metaB = await getMetadataLogoURI(pool2.mintB, pool2.mintProgramB)
        const mintALogo = metaA.logoURI? metaA.logoURI :''
        const mintBLogo = metaB.logoURI? metaB.logoURI :''

        const poolD = {
          poolId: pool2.poolId,
          mintA: pool2.mintA,
          mintProgramA: pool2.mintProgramA,
          mintB: pool2.mintB,
          mintProgramB: pool2.mintProgramB,
          poolPrice: pool2.poolPrice,
          tokenAMetadata: {
              name: metaA.name,
              symbol: metaA.symbol,
              logoURI: mintALogo,
          },
          tokenBMetadata: {
              name: metaB.name,
              symbol: metaB.symbol,
              logoURI: mintBLogo,
          }
        }
        // setPoolL((prev) => [...prev, {
        //   poolId: pool2.poolId,
        //   mintA: pool2.mintA,
        //   mintProgramA: pool2.mintProgramA,
        //   mintB: pool2.mintB,
        //   mintProgramB: pool2.mintProgramB,
        //   poolPrice: pool2.poolPrice,
        //   tokenAMetadata: {
        //       name: metaA.name,
        //       symbol: metaA.symbol,
        //       logoURI: mintALogo,
        //   },
        //   tokenBMetadata: {
        //       name: metaB.name,
        //       symbol: metaB.symbol,
        //       logoURI: mintBLogo,
        //   }
        // }])
        // poolsList2.push({
        //       poolId: pool2.poolId,
        //       mintA: pool2.mintA,
        //       mintProgramA: pool2.mintProgramA,
        //       mintB: pool2.mintB,
        //       mintProgramB: pool2.mintProgramB,
        //       poolPrice: pool2.poolPrice,
        //       tokenAMetadata: {
        //           name: metaA.name,
        //           symbol: metaA.symbol,
        //           logoURI: mintALogo,
        //       },
        //       tokenBMetadata: {
        //           name: metaB.name,
        //           symbol: metaB.symbol,
        //           logoURI: mintBLogo,
        //       }
        // })

        // setPool({
        //   poolId: pool2.poolId,
        //   mintA: pool2.mintA,
        //   mintProgramA: pool2.mintProgramA,
        //   mintB: pool2.mintB,
        //   mintProgramB: pool2.mintProgramB,
        //   poolPrice: pool2.poolPrice,
        //   tokenAMetadata: {
        //       name: metaA.name,
        //       symbol: metaA.symbol,
        //       logoURI: mintALogo,
        //   },
        //   tokenBMetadata: {
        //       name: metaB.name,
        //       symbol: metaB.symbol,
        //       logoURI: mintBLogo,
        //   }
        // })

        // setPool(poolD)
        // setPoolL((prev) => [...prev, pool])
        console.log('poolD: ', poolD)
        poolsList2.push(poolD)
      }
      console.log('poolsList2:' ,poolsList2)
      // setPoolL(poolsList2)
      // setPoolL((prev:any) => [...prev, ...poolsList2])
      // console.log('poolL: ', poolL)
      return poolsList2
  } catch (error) {
      console.log('error', error)
  }
}