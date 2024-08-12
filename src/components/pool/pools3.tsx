"use client"
import React, {
  FC,
  useEffect,
  useState,
} from 'react';

import {
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
// import { AiOutlineSearch } from 'react-icons/ai';
// import { BRAND } from "@/types/brand";
// import Image from 'next/image';
import { FaCopy } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDebouncedCallback } from 'use-debounce';

import useClipboardCopy from '@/hooks/useClipboardCopy';

import poolsL from './poolsList.json';
import poolsL3 from './poolsList3.json';
import {
  Pool,
  PoolLogoURI,
} from './type';

const poolsList1: Pool[] = poolsL.data;
// let poolsList2: PoolLogoURI[] =[];
const logo = "/images/brand/brand-01.svg"

const PoolsC:FC = () => {
    const copyToClipboard = useClipboardCopy();
    // const [pool, setPool] = useState<PoolLogoURI | undefined>()
    // const [pool, setPool] = useState<PoolLogoURI>({
    //   "poolId": "3KoaZu9J2XXRTvzsP3Z9kJfJQyM1rg1b17oVaLRk5d2v",
    //   "programId": "97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo",
    //   "poolCreator": "hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus",
    //   "configId": "Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK",
    //   "mintA": "AZDzcSuVg69kjoSCM97BoL8wUkMKTzu3XwVgxzW8RTr8",
    //   "mintProgramA": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    //   "vaultA": "B6asWZHdNxbA2T7CkwoZMPKwcrLLT41ozYhRJ3ohAJXk",
    //   "mintB": "Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb",
    //   "mintProgramB": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
    //   "vaultB": "5qNNTWaU3b8HeX9gdjVGVyobWbf2ABeXKHAYPefwiPhE",
    //   "bump": 254,
    //   "status": 0,
    //   "lpAmount": 100,
    //   "openTime": 1720292630,
    //   "poolPrice": "0.0001",
    //   "tokenAMetadata": {
    //       "name": "String",
    //       "symbol": "String",
    //       "logoURI": "/images/brand/brand-01.svg"
    //   },
    //   "tokenBMetadata": {
    //       "name": "String",
    //       "symbol": "String",
    //       "logoURI": "/images/brand/brand-01.svg"
    //   }
    // })
    const [pool, setPool] = useState<PoolLogoURI | undefined>()
    // const [poolL, setPoolL] = useState<PoolLogoURI[]>(poolsL3.data)
    const [poolL, setPoolL] = useState<any>(poolsL3.data)
    // let [poolLToShow, setPoolLToShow] = useState<any>(poolsL3.data)
    let [poolLToShow, setPoolLToShow] = useState<any | undefined>()
    let [poolLShearch, setPoolLSearch] = useState<any>(poolsL3.data)

    // const [poolL, setPoolL] = useState<PoolLogoURI[]>([])
    // const [poolL, setPoolL] = useState<PoolLogoURI[]>()
    const [foundPools, setFoundPools] = useState(false)
    // const [poolsList, setPoolsList] = useState<Pool[]>(poolsList1)
    const [poolsList, setPoolsList] = useState<Pool[]>([{
      "poolId":"3umBnXCwPFQiWBjD4Y1RmsbB4yH92tDCzx7zDzHAXXfy",
      "programId":"97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo",
      "poolCreator":"hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus",
      "configId":"Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK",
      "mintA":"DYd2TX2skjBzSKdcciMZpPKXh1nV75vm9jSyEtws3Vwb",
      "mintProgramA":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "vaultA":"16jEk1t5YUYtq1vQTYTjZ8wvGbfB994vt6QnUsceK4N",
      "mintB":"Duqm5K5U1H8KfsSqwyWwWNWY5TLB9WseqNEAQMhS78hb",
      "mintProgramB":"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      "vaultB":"FKR37QAyT95fHJQ6o3sUYs6RVNQ3bGnkgYxy4rJTNuND",
      "bump":254,"status":0,"lpAmount":100,"openTime":1720292456,"poolPrice":"0.0001"}])
    // let [page, setPage] = useState<number>(1)
    let [page, setPage] = useState<number>(1)
    const [hasMore, setHasMore] = useState(true)
    let [triger, setTriger] = useState<number>(0) //time dlay
    let [triger2, setTriger2] = useState<number>(0) //time dlay

    const searchParam = {
      // page: page,
      perPage: 4,
      finalPage:3 //maximum number of pages = 3
    }

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const query = searchParams.get('query');

    //get all pools
    useEffect(() => {
      // const pools = 
      // let poolsList2: any[] =[];
      let pools: any;
      let poolsData: any[] =[];
      console.log('page: ', page)
      getPools();
      async function getPools () {
        const url = `/api/pools/all`;

        try {
            // const pools: Pool[] = await ( await fetch(
            pools = await ( await fetch(
                `/api/pools/all`
                )
            ).json();
            console.log('pools', pools)
            poolsData = pools.data

            setPoolL(poolsData)
            setPoolLToShow(poolsData)
          } catch (err) {
            console.log('err', err)
          }
        }
    }, [])

    //Get metadata
  
    //Get another page data
    const fetchMoreData = () => {
      console.log('fetching more data')
      // if (poolL.length < searchParam.perPage) {
      // if (poolL.length < 14) { //maxData = 14
      //   console.log('poolL.length < 14')
      if (page < searchParam.finalPage) { 
        console.log('page < searchParam.finalPage')
        // setTimeout(() => {
        //setPage(page++)
          setPage(page +1)
        // setTriger2(triger2 ++) //time delay
        // }, 1000);
        // setPage(page +1)
        // console.log('page +1', page)
      } else {
        console.log('setHasMore(false)')
        setHasMore(false);
      }
      
    }

    //handle search param
    // useEffect(() => {
    //   console.log('query: ', query)
    //   if(query == null) {
    //     setPoolLSearch(null)
    //     return setPoolLToShow(poolL)
    //   }
    //   try{
    //   poolL.filter((pool: any) => {
    //   const symbolAResult: any[] = pool.tokenAMetadata.symbol.toLowerCase().includes(query.toLowerCase())
    //   if(symbolAResult.length != 0) {
    //     setPoolLSearch(symbolAResult)
    //     return setPoolLToShow(symbolAResult)}
    //   const symbolBResult: any[] = pool.tokenBMetadata.symbol.toLowerCase().includes(query.toLowerCase())
    //   setPoolLSearch(symbolBResult)
    //   return setPoolLToShow(symbolBResult)
    //   })
    //   } catch (err) {console.log('err', err)}
    // }, [query, poolL])

    const handleSearch = useDebouncedCallback((term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set('query', term)
      } else {
        params.delete('query')
      }
      replace(`${pathname}?${params.toString()}`)
    }, 300); //run this code after 300 ms

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      {/* <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Pools List
      </h4> */}
      {/* //Searchbar */}
      <div className="relative">
      {/* focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary */}
          <input 
          // type="search" 
          placeholder='search' 
          className='w-full p-2 mb-2 rounded-full bg-slate-800 xl:w-1/2' 
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get('query')?.toString()}
          />
          {/* <button className='absolute right-1 top-1/2 -translate-y-1/2 p-4 mb-2 bg-slate-600 rounded-full'>
              <AiOutlineSearch />
          </button> */}
      </div>

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
        {poolLToShow && <InfiniteScroll 
          dataLength={poolLToShow.length} 
          // dataLength={10} 
          next={fetchMoreData}
          // hasMore={hasMore}
          hasMore={false}
          loader={<p className='text-center'>Loading...</p>}
          // endMessage={<p className='text-center'>You are all set!</p>}
          height={500}
        >
        {/* <div style={{height: 500}}> */}
        {/* {poolLToShow && poolLToShow.map((pool:any, key:any) => (    //poolL */}
        {poolLToShow.filter((p: any) => {
          if (!query) {return p}
          // return p.tokenAMetadata.symbol.toLowerCase().includes(query.toLowerCase())
          const tAMeta = p.tokenAMetadata.symbol.toLowerCase().includes(query.toLowerCase())
          const tBMeta = p.tokenBMetadata.symbol.toLowerCase().includes(query.toLowerCase())
          const pId = p.poolId.toLowerCase().includes(query.toLowerCase())
          return tAMeta || tBMeta || pId
        }
        ).map((pool:any, key:any) => {
          return (    //poolL
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
                {pool.tokenAMetadata.symbol.substring(0, 10)} 
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
                {pool.tokenBMetadata.symbol.substring(0, 10)}
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
        )})}
        {/* </div> */}
        </InfiniteScroll>}
      </div>
    </div>
  );
};

export default PoolsC;
