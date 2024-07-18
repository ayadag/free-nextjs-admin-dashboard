"use client"
import React, {
  FC,
  useEffect,
  useState,
} from 'react';

// import { BRAND } from "@/types/brand";
// import Image from 'next/image';
import { FaCopy } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';

import useClipboardCopy from '@/hooks/useClipboardCopy';

import poolsL from './poolsList.json';
import poolsL2 from './poolsList2.json';
import { getMetadataLogoURI } from './tokenMeta';
import {
  Pool,
  PoolLogoURI,
} from './type';

const poolsList1: Pool[] = poolsL.data;
let poolsList2: PoolLogoURI[] =[];
const logo = "/images/brand/brand-01.svg"

const PoolsC:FC = () => {
    const copyToClipboard = useClipboardCopy();
    const [pool, setPool] = useState<PoolLogoURI | undefined>()
    const [poolL, setPoolL] = useState<PoolLogoURI[]>(poolsL2.data)
    const [foundPools, setFoundPools] = useState(false)
    const [poolsList, setPoolsList] = useState<Pool[]>(poolsList1)
    let [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState(true)

    //Get pools
    useEffect(() => {
        getPools();
        async function getPools () {
          // const url = 'https://serverless-fy6j77er0-ayads-projects.vercel.app';       
          const searchParam = {
              page: page,
              perPage: 3,
          }
          const url = `/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`;
  
          try {
              const pools = await ( await fetch(
                  `${url}`
                  )
              ).json();
  
              // console.log(pools)
              setPoolsList(pools)
          } catch (error) {
              console.log('error', error)
          }
        }
    },[page])

    useEffect(() => {
        getMeta();
        setPoolL(poolsList2)
        async function getMeta() {
            try{
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
            setFoundPools(true)
        } catch (err) {console.log('error in get pools', err)}
        }
    }, [poolsList])

    //Get another page data
    const fetchMoreData = () => {
      if (poolL.length < 7) {
        setTimeout(() => {
          setPage(page++)
        }, 500);
      } else {
        setHasMore(false);
      }
      
    }

    // const getPools = async () => {
    //     // const url = 'https://serverless-fy6j77er0-ayads-projects.vercel.app';       
    //     const searchParam = {
    //         page: 1,
    //         perPage: 10,
    //     }
    //     const url = `/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`;

    //     try {
    //         const pools = await ( await fetch(
    //             `${url}`
    //             )
    //         ).json();

    //         console.log(pools)
            
    //     } catch (error) {
    //         console.log('error', error)
    //     }
    // }

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

        {/* {foundPools && poolsList2.map((pool, key) => ( */}
        <InfiniteScroll 
          dataLength={poolL.length} 
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<p>Loading...</p>}
          endMessage={<p>You are all set!</p>}
          height={400}
        >
        {poolL.map((pool, key) => (    //poolL
          <div
            // className={`grid grid-cols-3 sm:grid-cols-5 ${
            // className={`grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 ${
                // className={`grid grid-cols-3 xl:grid-cols-5 ${
                    className={`grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 ${
                        key === poolL.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              {/* <div className="hidden flex-shrink-0 bg-meta-4 rounded-full sm:block"> */}

              {/* <div className="flex-shrink-0 bg-meta-4 rounded-full">
                <Image src={pool.tokenAMetadata.logoURI} alt="Brand" width={30} height={30} />
              </div> */}
              <div className="flex-shrink-0 bg-meta-4 rounded-full max-w-8 max-h-8">
                {/* <Image src={pool.tokenAMetadata.logoURI} alt="Brand" width={30} height={30} /> */}
                <img src={pool.tokenAMetadata.logoURI} alt="imageA" width={30} height={30}/>
              </div>

              <p className="text-meta-5 text-sm">
                {/* {brand.name} */}
                {/* tokenA */}
                {pool.tokenAMetadata.name}
              </p>
              <p>-</p>
              {/* <div className="hidden flex-shrink-0 bg-meta-4 rounded-full sm:block"> */}

              {/* <div className="flex-shrink-0 bg-meta-4 rounded-full">
                <Image src={pool.tokenBMetadata.logoURI} alt="Brand" width={30} height={30} />
              </div> */}
              <div className="flex-shrink-0 bg-meta-4 rounded-full max-w-8 max-h-8">
                {/* <Image src={pool.tokenAMetadata.logoURI} alt="Brand" width={30} height={30} /> */}
                <img src={pool.tokenBMetadata.logoURI} alt="imageB" width={30} height={30}/>
              </div>

              <p className="text-meta-3 text-sm">
                {/* {brand.name} */}
                {/* tokenB */}
                {pool.tokenBMetadata.name}
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
              <p className="text-meta-5 text-sm">{pool.mintA.substring(0, 4)} ...</p>
              <div className='hover:cursor-pointer' onClick={() => copyToClipboard(pool.mintA)}>
                <FaCopy />
              </div>
            </div>

            {/* <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              <p className="text-black dark:text-white">{pool.mintB.substring(0, 4)} ...</p>
            </div> */}
            <div className="hidden items-center justify-center p-2.5 xl:flex xl:p-5">
              <p className="text-meta-3 text-sm">{pool.mintB.substring(0, 4)} ...</p>
              <div className='hover:cursor-pointer' onClick={() => copyToClipboard(pool.mintB)}>
                <FaCopy />
              </div>
            </div>

            <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
              {/* <p className="text-meta-5">{Number(Math.floor(Number(pool.poolPrice) * 100000).toFixed(5))/100000}</p> */}
              <p className="text-black text-sm dark:text-white">{Number(Math.floor(Number(pool.poolPrice) * 100000).toFixed(5))/100000}</p>
            </div>
            {/* <div className="items-center justify-center flex p-2.5 xl:p-5">
              <p className="text-meta-5 text-sm">{Number(Math.floor(pool.poolPrice * 10000).toFixed(5))/10000}</p>
            </div> */}
          </div>
        ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default PoolsC;
