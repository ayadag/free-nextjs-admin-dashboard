"use client"
import React, {
  useEffect,
  useState,
} from 'react';

// import { BRAND } from "@/types/brand";
import Image from 'next/image';
import { FaCopy } from 'react-icons/fa';

import useClipboardCopy from '@/hooks/useClipboardCopy';

import poolsL from './poolsList.json';
import { getMetadataLogoURI } from './tokenMeta';

type Pool = {
    poolId: string, //"BjWinURsx9WnAW2XrCYXx7ZiWfX3GsS9z8ZvFwsDsUo4"
    programId?: string, //"97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo"
    poolCreator?: string, //"hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus"
    configId?: string, //"Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK"
    mintA: string, //"uBAsEVJJh8GKj6m5jXqLzWkB4PuysMpxmwFxDDk5Qdz"
    mintProgramA: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultA?: string, //"3fBVQc6JYf59gyU5m798q2qDpTdZjgt4qLpPfuzAcRBk"
    mintB: string, //"DYd2TX2skjBzSKdcciMZpPKXh1nV75vm9jSyEtws3Vwb"
    mintProgramB: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultB?: string, //"BobvpVczCcqiTuwkuSjvr2D6WYovcjXHKMUN3qJnPnpz"
    bump?: number, //254
    status?: number, //0
    lpAmount?: number, //10488
    openTime?: number, //1721191830
    poolPrice: string //"0.90909090909090909091"
}

type PoolLogoURI = {
    poolId: string, //"BjWinURsx9WnAW2XrCYXx7ZiWfX3GsS9z8ZvFwsDsUo4"
    programId?: string, //"97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo"
    poolCreator?: string, //"hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus"
    configId?: string, //"Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK"
    mintA: string, //"uBAsEVJJh8GKj6m5jXqLzWkB4PuysMpxmwFxDDk5Qdz"
    mintProgramA: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultA?: string, //"3fBVQc6JYf59gyU5m798q2qDpTdZjgt4qLpPfuzAcRBk"
    mintB: string, //"DYd2TX2skjBzSKdcciMZpPKXh1nV75vm9jSyEtws3Vwb"
    mintProgramB: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultB?: string, //"BobvpVczCcqiTuwkuSjvr2D6WYovcjXHKMUN3qJnPnpz"
    bump?: number, //254
    status?: number, //0
    lpAmount?: number, //10488
    openTime?: number, //1721191830
    poolPrice: string, //"0.90909090909090909091"
    tokenAMetadata?: {
        name: String,
        symbol: String,
        logoURI: string,
    }
    tokenBMetadata?: {
        name: String,
        symbol: String,
        logoURI: string,
    }
}

const poolsList: Pool[] = poolsL.data;
let poolsList2: PoolLogoURI[];
const logo = "/images/brand/brand-01.svg"

// const brandData: BRAND[] = [
const brandData = [
        {
    logo: "/images/brand/brand-01.svg",
    name: "Google",
    visitors: 3.5,
    revenues: "5,768",
    sales: 590,
    conversion: 4.8,
  },
  {
    logo: "/images/brand/brand-02.svg",
    name: "Twitter",
    visitors: 2.2,
    revenues: "4,635",
    sales: 467,
    conversion: 4.3,
  },
  {
    logo: "/images/brand/brand-03.svg",
    name: "Github",
    visitors: 2.1,
    revenues: "4,290",
    sales: 420,
    conversion: 3.7,
  },
  {
    logo: "/images/brand/brand-04.svg",
    name: "Vimeo",
    visitors: 1.5,
    revenues: "3,580",
    sales: 389,
    conversion: 2.5,
  },
  {
    logo: "/images/brand/brand-05.svg",
    name: "Facebook",
    visitors: 3.5,
    revenues: "6,768",
    sales: 390,
    conversion: 4.2,
  },
];

const PoolsC = () => {
    const copyToClipboard = useClipboardCopy();
    const [pool, setPool] = useState<PoolLogoURI | undefined>()
    const [poolL, setPoolL] = useState<PoolLogoURI[]>(poolsList)

    //Get pools
    useEffect(() => {
        getPools();
    })

    useEffect(() => {
        getMeta();
        setPoolL(poolsList2)
        async function getMeta() {
            for (let index = 0; index < poolsList.length; index++) {
                const pool2 = poolsList[index]
                const metaA = await getMetadataLogoURI(pool2.mintA, pool2.mintProgramA)
                const metaB = await getMetadataLogoURI(pool2.mintB, pool2.mintProgramB)
                const mintALogo = metaA.logoURI? metaA.logoURI :''
                const mintBLogo = metaB.logoURI? metaB.logoURI :''
                
                setPool({
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
                })

                poolsList2.push({
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
                })
            }
        }
    }, [poolsList])

    const getPools = async () => {
        // const url = 'https://serverless-fy6j77er0-ayads-projects.vercel.app';       
        const searchParam = {
            page: 1,
            perPage: 10,
        }
        const url = `/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`;

        try {
            const pools = await ( await fetch(
                `${url}`
                )
            ).json();

            console.log(pools)
        } catch (error) {
            console.log('error', error)
        }
    }

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Pools List
      </h4>

      <div className="flex flex-col">
        {/* <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5"> */}
        {/* <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4 xl:grid-cols-5"> */}
        {/* <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 xl:grid-cols-5"> */}
        <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3 xl:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Pair
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Pool
            </h5>
          </div>
          {/* <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mint A
            </h5>
          </div> */}
          {/* <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mint A
            </h5>
          </div> */}
          <div className="hidden p-2.5 text-center xl:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mint A
            </h5>
          </div>
          {/* <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mint B
            </h5>
          </div> */}
          <div className="hidden p-2.5 text-center xl:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mint B
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Pool Price
            </h5>
          </div>
          {/* <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Pool Price
            </h5>
          </div> */}
        </div>

        {poolsList2.map((pool, key) => (
          <div
            // className={`grid grid-cols-3 sm:grid-cols-5 ${
            // className={`grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 ${
                // className={`grid grid-cols-3 xl:grid-cols-5 ${
                    className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 ${
                        key === brandData.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              {/* <div className="hidden flex-shrink-0 bg-meta-4 rounded-full sm:block"> */}
              <div className="flex-shrink-0 bg-meta-4 rounded-full">
                <Image src={logo} alt="Brand" width={30} height={30} />
              </div>
              <p className="text-black text-sm dark:text-white">
                {/* {brand.name} */}
                tokenA
              </p>
              <p>-</p>
              {/* <div className="hidden flex-shrink-0 bg-meta-4 rounded-full sm:block"> */}
              <div className="flex-shrink-0 bg-meta-4 rounded-full">
                <Image src={logo} alt="Brand" width={30} height={30} />
              </div>
              <p className="text-black text-sm dark:text-white">
                {/* {brand.name} */}
                tokenB
              </p>
            </div>

            <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-black text-sm dark:text-white">{pool.poolId.substring(0, 4)} ...</p>
              <div className='hover:cursor-pointer' onClick={() => copyToClipboard(pool.poolId)}>
                <FaCopy />
              </div>
            </div>

            {/* <div className="flex items-center justify-center p-2.5 xl:p-5">
              <p className="text-meta-3">{pool.mintA.substring(0, 4)} ...</p>
            </div> */}

            {/* <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{pool.mintA.substring(0, 4)} ...</p>
            </div> */}
            <div className="hidden items-center justify-center p-2.5 xl:flex xl:p-5">
              <p className="text-black text-sm dark:text-white">{pool.mintA.substring(0, 4)} ...</p>
              <div className='hover:cursor-pointer' onClick={() => copyToClipboard(pool.mintA)}>
                <FaCopy />
              </div>
            </div>

            {/* <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{pool.mintB.substring(0, 4)} ...</p>
            </div> */}
            <div className="hidden items-center justify-center p-2.5 xl:flex xl:p-5">
              <p className="text-black text-sm dark:text-white">{pool.mintB.substring(0, 4)} ...</p>
              <div className='hover:cursor-pointer' onClick={() => copyToClipboard(pool.mintB)}>
                <FaCopy />
              </div>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-meta-5">{Number(Math.floor(Number(pool.poolPrice) * 100000).toFixed(5))/100000}</p>
            </div>
            {/* <div className="items-center justify-center flex p-2.5 xl:p-5">
              <p className="text-meta-5 text-sm">{Number(Math.floor(pool.poolPrice * 10000).toFixed(5))/10000}</p>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PoolsC;
