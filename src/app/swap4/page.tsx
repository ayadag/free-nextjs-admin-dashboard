"use client";
import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  Input,
  message,
  Modal,
  Popover,
  Radio,
} from 'antd';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

// import { useRouter } from 'next/router';
import DefaultLayout from '@/components/Layouts/DefaultLayout';
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  VersionedTransaction,
} from '@solana/web3.js';

import styles from './swap.module.css';
// import tokenList from './tokenList.json';
// import tokenList from './tokenList2.json';
import tList from './tokenList2.json';

// let tokenListSearch: any[] | undefined;

// const Swap = ({tokenList}:{tokenList:[]}) => {
  const Swap = () => {
      const wallet = useWallet();
      // const connection = useConnection();
      // const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE');
      const connection = new Connection('https://raydium-raydium-5ad5.mainnet.rpcpool.com/');
      const [messageApi, contextHolder] = message.useMessage();
  
      const [slippage, setSlippage] = useState(2.5);
      // const [tokenOneAmount, setTokenOneAmount] = useState(null);
      // const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
      const [tokenOneAmount, setTokenOneAmount] = useState(0);
      const [tokenTwoAmount, setTokenTwoAmount] = useState(0);

      // let [tokenList, setTokenList] = useState<any>();
      // const [tokenOne, setTokenOne] = useState(tokenList[0]);
      // const [tokenTwo, setTokenTwo] = useState(tokenList[1]);
      const [isOpen, setIsOpen] = useState(false);
      const [changeToken, setChangeToken] = useState(1);
      const [quoteResponse, setQuoteResponse] = useState(null);
      // const [prices, setPrices] = useState(null);
      ///////////ayad//////////
      const [tokenOneN, setTokenOneN] = useState(0);
      const [tokenTwoN, setTokenTwoN] = useState(1);
      const [tokenOnePrice, setTokenOnePrice] = useState(0);
      const [tokenTwoPrice, setTokenTwoPrice] = useState(0);
      let [query, setQuery] = useState<string>(''); //search query
      // let [tokenList, setTokenList] = useState<any>(); //10 token list
      let [tokenList, setTokenList] = useState<any>(tList); //token list
      // let [tTokenList, setTTokenList] = useState<any>(); //Total token list

      useEffect(() => {
        async function getTokenList() {
          try{
            const tList: [] = await ( await fetch (
                `https://token.jup.ag/strict` //strict
                // `https://token.jup.ag/all` //all
              )
            ).json();
            // setTTokenList(tList);
            setTokenList(tList); 
            // setTokenList(tList.splice(0,10));  //splice(0,10) to take gest the first ten idems.
            console.log('tokenList: ',tokenList);
          } catch(e) {console.log('can not get price', e)}
        }
        getTokenList(); //get token list
      },[wallet.publicKey]);

      const [tokenOne, setTokenOne] = useState(
        {
          "symbol": "SOL",
          "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
          "name": "Wrapped SOL",
          "address": "So11111111111111111111111111111111111111112",
          "decimals": 9
      }
      );
      const [tokenTwo, setTokenTwo] = useState(
        {
          "symbol": "USDC",
          "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
          "name": "USD Coin /sol",
          "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
          "decimals": 6
      }
      );

      // const router = useRouter();
      // if(router.query.from){
      //   tokenList?.filter((token: any) =>
      //     token.address.toLowerCase().includes(router.query.from)  //cheack token address
      //     ).map((e: any, i: any) => {
      //     return (
      //     setTokenOne(i)
      //     );
      // })
      // }

      // if(router.query.to){
      //   tokenList?.filter((token: any) =>
      //     token.address.toLowerCase().includes(router.query.to)  //cheack token address
      //     ).map((e: any, i: any) => {
      //     return (
      //     setTokenTwo(e)
      //     );
      // })
      // }

      const searchParm = useSearchParams();
      const router = useRouter();

      // if(searchParm.get('from')){
      //   console.log( `searchParm.get('from'): `,searchParm.get('from'))
      //   tokenList?.filter((token: any) =>
      //     token.address.toLowerCase().includes(searchParm.get('from'))  //cheack token address
      //     ).map((e: any, i: any) => {
      //     return (
      //     setTokenOne(i)
      //     );
      // })
      // }

      //Change swap asset
      // useEffect(() => {
      //   if(searchParm.get('from')){
      //     console.log(`searchParm.get('from'): `,searchParm.get('from'))
      //     for (let index = 0; index < tokenList.length; index++) {
      //       if(tokenList[index].address == searchParm.get('from')){
      //         setTokenOne(tokenList[index]);
      //         console.log('tokenOne: ',tokenOne)
      //       }
      //     }
      //   }
      //   if(searchParm.get('to')){
      //     console.log(`searchParm.get('to'): `,searchParm.get('to'))
      //     for (let index = 0; index < tokenList.length; index++) {
      //       if(tokenList[index].address == searchParm.get('to')){
      //         setTokenTwo(tokenList[index]);
      //         console.log('tokenTwo: ',tokenTwo)
      //       }
      //     }
      //   }
      // },[])

      // const path = usePathname();

      //Token list that contain the search resalut
      // let tokenListSearch = [undefined];

      // const [tokenOnePriceR, setTokenOnePriceR] = useState<Price | null>(null);
      // const [tokenTwoPriceR, setTokenTwoPriceR] = useState<Price | null>(null);

      // type Price = {
      //   [tokenOne.address]:{
      //     id: string;
      //     mintSymbol: string;
      //     vsToken: string;
      //     vsTokenSymbol: string;
      //     price: string;
      //   }
      // }
      // const [tokenOnePriceR, setTokenOnePriceR] = useState<Price | null>(null);
      // const [tokenTwoPriceR, setTokenTwoPriceR] = useState<Price | null>(null);

      //The function that handle token search input value

      function handleTokenListSearch(e: any) {
        if(e.target.value != ''){
        setQuery(e.target.value.toLowerCase());
        } else {
          setQuery(e.target.value);
        }
        // tokenList?.map((t: any) => {
        //   if (e.target.value == t.ticker){
        //     tokenListSearch = [];
        //     tokenListSearch.push(t)
        //     // setIsOpen(false)
        //     // setIsOpen(true)
        //     let querySelector = document.querySelector('#swap_tokenChoice__eJ9R9')
        //     console.log('querySelector: ',querySelector)
        //   }
        //   else if (e.target.value == t.address){
        //     tokenListSearch = [];
        //     tokenListSearch.push(t)
        //     // setIsOpen(false)
        //     // setIsOpen(true)
        //   }
        //   else if (e.target.value == '') {
        //     tokenListSearch = undefined
        //     // setIsOpen(false)
        //     // setIsOpen(true)
        //     console.log('nothing to search')
        //   }
        //   // else {
        //   //   tokenListSearch = []
        //   // }
        //   console.log('tokenListSearch: ',tokenListSearch)

        //   console.log('tokenList: ',tokenList)
        // })
      }
  
      function handleSlippageChange(e: any) {
          setSlippage(e.target.value);
      }
  
      function changeAmount(e: any) {
          setTokenOneAmount(e.target.value);
          // if(e.target.value && prices){
          //   setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
          // }else{
          // //   setTokenTwoAmount(null);
          // setTokenTwoAmount(0);
          // }
      }
  
      ////////////ayad///////////
      // const handleFromValueChange = (
      //     event: React.ChangeEvent<HTMLInputElement>
      //     ) => {
      //     setTokenOneAmount(Number(event.target.value));
      // };
  
      const debounce = <T extends unknown[]>(
          func: (...args: T) => void,
          wait: number
        ) => {
          let timeout: NodeJS.Timeout | undefined;
        
          return (...args: T) => {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
        
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
      };
  
      const debounceQuoteCall = useCallback(debounce(getQuote, 500), [tokenOne, tokenTwo]);
  
      useEffect(() => {
          debounceQuoteCall(tokenOneAmount);
      }, [tokenOneAmount, debounceQuoteCall]);
  
      async function getQuote(currentAmount: number) {
          if (isNaN(currentAmount) || currentAmount <= 0) {
            console.error('Invalid fromAmount value:', currentAmount);
            return;
          }
      
          // const quote = await (
          //   await fetch(
          //     `https://quote-api.jup.ag/v6/quote?inputMint=${tokenOne.address}&outputMint=${tokenTwo.address}&amount=${currentAmount * Math.pow(10, tokenOne.decimals)}&slippage=${slippage}`
          //   )
          // ).json();
  
          let quote;
          try{
            quote = await (
              await fetch(
                `https://quote-api.jup.ag/v6/quote?inputMint=${tokenOne.address}&outputMint=${tokenTwo.address}&amount=${currentAmount * Math.pow(10, tokenOne.decimals)}&slippage=${slippage}`
              )
            ).json();
          } catch(e){console.log('Error: ',e)}
      
          if (quote && quote.outAmount) {
            const outAmountNumber =
              Number(quote.outAmount) / Math.pow(10, tokenTwo.decimals);
            setTokenTwoAmount(outAmountNumber);
          } else {
              setTokenTwoAmount(0);
          }
      
          setQuoteResponse(quote);
      }

      //Get tokens price
      const debouncePriceCall = useCallback(debounce(getPrice, 500), [tokenOne, tokenTwo]);
  
      useEffect(() => {
        let from = searchParm.get('from');
        if(from){
          console.log(`searchParm.get('from'): `,from)
          for (let index = 0; index < tokenList.length; index++) {
            if(tokenList[index].address == from){
              setTokenOne(tokenList[index]);
              console.log('tokenOne: ',tokenOne)
            }
          }
        }
        let to = searchParm.get('to');
        if(to){
          console.log(`searchParm.get('to'): `,to)
          for (let index = 0; index < tokenList.length; index++) {
            if(tokenList[index].address == to){
              setTokenTwo(tokenList[index]);
              console.log('tokenTwo: ',tokenTwo)
            }
          }
        }
        
        debouncePriceCall();
        // getPrice(); //ayad
        console.log('getttttttttttttttttttttttttttt');
      }, [tokenOne, tokenTwo, debouncePriceCall, searchParm]);

      //This will called twice
      useEffect(() => {
        let from = searchParm.get('from');
        if(from){
          console.log(`searchParm.get('from'): `,from)
          for (let index = 0; index < tokenList.length; index++) {
            if(tokenList[index].address == from){
              setTokenOne(tokenList[index]);
              console.log('tokenOne: ',tokenOne)
            }
          }
        }
        let to = searchParm.get('to');
        if(to){
          console.log(`searchParm.get('to'): `,to)
          for (let index = 0; index < tokenList.length; index++) {
            if(tokenList[index].address == to){
              setTokenTwo(tokenList[index]);
              console.log('tokenTwo: ',tokenTwo)
            }
          }
        }
        debouncePriceCall();
        // getPrice(); //ayad
        console.log('getttttttttttt111111111111');
      });

      async function getPrice() {
        //https://price.jup.ag/v6/price?ids=So11111111111111111111111111111111111111112
        let tOnePrice;
        let tTwoPrice;
        try{
          tOnePrice = await ( await fetch (
              `https://price.jup.ag/v6/price?ids=${tokenOne.address}`
            )
          ).json();

          tTwoPrice = await ( await fetch (
            `https://price.jup.ag/v6/price?ids=${tokenTwo.address}`
            )
          ).json();
          
        } catch(e) {console.log('can not get price', e)}

        if (tOnePrice && tTwoPrice) {
          // const tOneAddress = tokenOne.address;
          // setTokenOnePriceR(tOnePrice.data);
          // setTokenOnePriceR(tTwoPrice); 

          //token price
          const {[tokenOne.address]: tokenOneD} = tOnePrice.data;
          const {[tokenTwo.address]: tokenTwoD} = tTwoPrice.data;

          setTokenOnePrice(tokenOneD.price);
          setTokenTwoPrice(tokenTwoD.price); 
          // console.log('tokenOneD: ',tokenOneD);
          // console.log('tokenOneD.price: ',tokenOneD.price);

          // console.log('tOnePrice.data: ',tOnePrice.data);
          // console.log('tTwoPrice: ',tTwoPrice);

          // console.log('tokenOnePriceR: ',tokenOnePriceR);
          // console.log('tokenTwoPriceR: ',tokenTwoPriceR);

          // if(tokenOnePriceR && tokenTwoPriceR) {
          //   console.log('tokenOnePriceR.price): ',tokenOnePriceR.price);
          //   console.log('tokenTwoPriceR: ',tokenTwoPriceR);
          // }

          // setTokenOnePrice(tOnePrice.data.price)
          // setTokenTwoPrice(tTwoPrice.price)
        } else {
          setTokenOnePrice(0)
          setTokenTwoPrice(0)
        }
      }

  
      // function switchTokens() {
      //     // setPrices(null);
      //     setTokenOneAmount(0);
      //     setTokenTwoAmount(0);
      //     const one = tokenOne;
      //     const two = tokenTwo;
      //     setTokenOne(two);
      //     setTokenTwo(one);
      //     // fetchPrices(two.address, one.address);
      // }

      function switchParams() {
        setTokenOneAmount(0);
        setTokenTwoAmount(0);

        // const from = searchParm.get('from');
        // const to = searchParm.get('to');

        router.push(`/swap2?from=${tokenTwo.address}&to=${tokenOne.address}`)
    }
  
      function openModal(asset: any) {
          setChangeToken(asset);
          setIsOpen(true);
      }
  
      // function modifyToken(i: any){
      //     // setPrices(null);
      //     setTokenOneAmount(0);
      //     setTokenTwoAmount(0);
      //     if (changeToken === 1) {
      //         /////ayad/////
      //         if(tokenTwoN == i){
      //             setTokenTwo(tokenOne);
      //             // tokenTwoN = tokenOneN;
      //             setTokenTwoN(tokenOneN);
      //         }
              
      //         setTokenOne(tokenList[i]);
      //         setTokenOneN(i);
      //     //   fetchPrices(tokenList[i].address, tokenTwo.address)
      //     } else {
      //         ////ayad//////
      //         if(tokenOneN == i) {
      //             setTokenOne(tokenTwo);
      //             //tokenOneN = tokenTwoN;
      //             setTokenOneN(tokenTwoN);
      //         }
              
      //         setTokenTwo(tokenList[i]);
      //         setTokenTwoN(i);
      //     //  fetchPrices(tokenOne.address, tokenList[i].address)
      //     }
      //     setIsOpen(false);
      // }

      function modifyUrlParam(i: any) {
        // let from = searchParm.get('from');
        // let to = searchParm.get('to');

        setTokenOneAmount(0);
        setTokenTwoAmount(0);

        if (changeToken === 1) {
          router.push(`/swap2?from=${i.address}&to=${tokenTwo.address}`)
        }
        else{
          router.push(`/swap2?from=${tokenOne.address}&to=${i.address}`)
        }

        setIsOpen(false);
      }
  
      async function signAndSendTransaction() {
          if (!wallet.connected || !wallet.signTransaction) {
            console.error(
              'Wallet is not connected or does not support signing transactions'
            );
            return;
          }
      
          // get serialized transactions for the swap
          const { swapTransaction } = await (
            await fetch('https://quote-api.jup.ag/v6/swap', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                quoteResponse,
                userPublicKey: wallet.publicKey?.toString(),
                wrapAndUnwrapSol: true,
                // feeAccount is optional. Use if you want to charge a fee.  feeBps must have been passed in /quote API.
                // feeAccount: "fee_account_public_key"
              }),
            })
          ).json();
      
          try {
              //sending transaction
              messageApi.destroy();
              messageApi.open({
                  type: 'loading',
                  content: 'Transaction is Pending...',
                  duration: 0,
              })
              
            const swapTransactionBuf = Buffer.from(swapTransaction, 'base64');
            const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
            const signedTransaction = await wallet.signTransaction(transaction);
      
            const rawTransaction = signedTransaction.serialize();
            const txid = await connection.sendRawTransaction(rawTransaction, {
              skipPreflight: true,
              maxRetries: 2,
            });
      
            const latestBlockHash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
              blockhash: latestBlockHash.blockhash,
              lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
              signature: txid
            }, 'confirmed');
            
            //Transaction Successful
            messageApi.destroy();
            messageApi.open({
            type: 'success',
            content: 'Transaction Successful',
            duration: 2.5,
            })
            
            console.log(`https://solscan.io/tx/${txid}`);
      
          } catch (error) {
              //Transaction Failed
              messageApi.destroy();
              messageApi.open({
                  type: 'error',
                  content: 'Transaction Failed',
                  duration: 2.50,
                })
              console.error('Error signing or sending the transaction:', error);
          }
      } 
      
      const settings = (
          <>
            <div>Slippage Tolerance</div>
            <div>
              <Radio.Group value={slippage} onChange={handleSlippageChange}>
                <Radio.Button value={0.5}>0.5%</Radio.Button>
                <Radio.Button value={2.5}>2.5%</Radio.Button>
                <Radio.Button value={5}>5.0%</Radio.Button>
              </Radio.Group>
            </div>
          </>
        );
      return (
        <DefaultLayout>
          <div className='flex flex-wrap justify-center text-center'>
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}

          {/* <div className={styles.App}> */}

          {/* <div className="text-center"> */}
          {/* <div className="w-full xl:w-2/3"> */}
              <div className="flex justify-center mt-10 w-full md:w-9/12 xl:w-2/3">

              {/* <div className={styles.mainWindow}> */}
                  {contextHolder}
                  <Modal
                      open={isOpen}
                      footer={null}
                      onCancel={() => setIsOpen(false)}
                      // title="Select a token"
                  >
                      <div className={styles.modalContent}>

                      <div className={styles.modalSearch}>
                      <input 
                      placeholder='search'
                      className={styles.modalSearchInput}
                      onChange={handleTokenListSearch}
                      />
                      </div>
                      
                      {/* {tokenList?.map((e: any, i: any) => {
                          return (
                          <div
                              className={styles.tokenChoice}
                              key={i}
                              onClick={() => modifyToken(i)}
                          >
                              <img src={e.img} alt={e.ticker} className={styles.tokenLogo} />
                              <div className={styles.tokenChoiceNames}>
                                  <div className={styles.tokenName}>{e.name}</div>
                                  <div className={styles.tokenTicker}>{e.ticker}</div>
                              </div>
                          </div>
                          );
                      })} */}

                      {/* {
                      query==''?tokenList?.map((e: any, i: any) => {
                          return (
                          <div
                              className={styles.tokenChoice}
                              key={i}
                              onClick={() => modifyToken(i)}
                          >
                              <img src={e.logoURI} alt={e.symbol} className={styles.tokenLogo} />
                              <div className={styles.tokenChoiceNames}>
                                  <div className={styles.tokenName}>{e.name}</div>
                                  <div className={styles.tokenTicker}>{e.symbol}</div>
                              </div>
                          </div>
                          );
                      })
                      :
                      tTokenList?.filter((token: any) => 
                      token.name.toLowerCase().includes(query) || //cheack token name
                      token.symbol.toLowerCase().includes(query) || //cheack token simbol
                      token.address.toLowerCase().includes(query)  //cheack token address
                      ).map((e: any, i: any) => {
                      // ).map((e: any, i:number , t =[tTokenList[0].address, tTokenList[1].address]) => {
                          return (
                          <div
                              className={styles.tokenChoice}
                              key={i}
                              // key={tTokenList.address}
                              onClick={() => modifyToken(i)}
                          >
                              <img src={e.logoURI} alt={e.symbol} className={styles.tokenLogo} />
                              <div className={styles.tokenChoiceNames}>
                                  <div className={styles.tokenName}>{e.name}</div>
                                  <div className={styles.tokenTicker}>{e.symbol}</div>
                              </div>
                          </div>
                          );
                      })
                      } */}
 
                      {
                        tokenList?.filter((token: any) => 
                          token.name.toLowerCase().includes(query) || //cheack token name
                          token.symbol.toLowerCase().includes(query) || //cheack token simbol
                          token.address.toLowerCase().includes(query)  //cheack token address
                          ).map((e: any, i: any) => {
                          return (
                          <div
                              className={styles.tokenChoice}
                              key={i}
                              // onClick={() => modifyToken(i)}
                              onClick={() => modifyUrlParam(e)}
                          >
                              <img src={e.logoURI} alt={e.symbol} className={styles.tokenLogo} />
                              <div className={styles.tokenChoiceNames}>
                                  <div className={styles.tokenName}>{e.name}</div>
                                  <div className={styles.tokenTicker}>{e.symbol}</div>
                              </div>
                          </div>
                          );
                      })
                      }

                      </div>
                  </Modal>
                  {/* <div className={styles.tradeBox}> */}
                  <div className="w-full rounded-lg p-4 bg-slate-950 xl:w-2/3">
                      <div className={styles.tradeBoxHeader}>
                          <h4>Swap</h4>
                          <Popover
                          content={settings}
                          title="Settings"
                          trigger="click"
                          placement="bottomRight"
                          >
                              <SettingOutlined className={styles.cog}/>
                          </Popover>
                      </div>
                      {/* <div className={styles.inputs}> */}
                      <div className='relative justify-center'>
                          <Input
                              placeholder="0"
                              value={tokenOneAmount}
                              onChange={changeAmount}
                              // onChange={handleFromValueChange}
                              // disabled={!prices}
                          />
                          {/* //ayad/////// */}
                          {/* <div className={styles.switchButton2}> */}
                          <div className='h-8 self-center'>
                              {/* <ArrowDownOutlined className={styles.switchArrow2} onClick={switchTokens}/> */}
                              <ArrowDownOutlined className={styles.switchArrow2} onClick={switchParams}/>
                          </div>
                          <Input placeholder="0" 
                          value={tokenOneAmount==0 ? 0 : tokenTwoAmount} 
                          disabled={true} 
                          />
                          {/* <div className={styles.switchButton} onClick={switchTokens}>
                              <ArrowDownOutlined className={styles.switchArrow} />
                          </div> */}
                          {/* <div className={styles.assetOne} onClick={() => openModal(1)}> */}
                          <div className={styles.assetOne} onClick={() => openModal(1)}>
                              <img src={tokenOne.logoURI} alt="assetOneLogo" className={styles.assetLogo} />
                              {/* <Image src={tokenOne.img} alt="assetOneLogo" width="22px" height="22px" className={styles.assetLogo} /> */}
                              {tokenOne.symbol}
                              <DownOutlined />
                          </div>
                          <div className={styles.assetTwo} onClick={() => openModal(2)}>
                              <img src={tokenTwo.logoURI} alt="assetTwoLogo" className={styles.assetLogo} />
                              {tokenTwo.symbol}
                              <DownOutlined />
                          </div>
                          <div className={styles.assetOnePrice}>
                            <h3>{tokenOnePrice} USDC</h3>
                          </div>
                          <div className={styles.assetTwoPrice}>
                            <h3>{tokenTwoPrice} USDC</h3>
                          </div>
                      </div>
                      {/* <div className={styles.swapButton} disabled={!tokenOneAmount || !isConnected} onClick={fetchDexSwap}>Swap</div> */}
                      {/* <button className={styles.swapButton} disabled={!tokenOneAmount || tokenOneAmount==0 || !wallet.publicKey} onClick={signAndSendTransaction}>{!wallet.publicKey ? "Connect wallet" : "Swap"}</button> */}
                      <div className="mb-5">
                                    <input
                                        type="submit"
                                        value={!wallet.publicKey ? "Connect wallet" : "Swap"}
                                        disabled={!tokenOneAmount || tokenOneAmount==0 || !wallet.publicKey}
                                        onClick={signAndSendTransaction}
                                        className="w-full mt-7 text-xl font-bold cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 
                                        disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                      </div>
                  </div>

                  {/* iFrame */}
                  <div className="flex">
                  <iframe
                    width="100%"
                    height="600"
                    src="https://birdeye.so/tv-widget/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?chain=solana&viewMode=pair&chartInterval=1D&chartType=CANDLE&chartTimezone=Asia%2FSingapore&chartLeftToolbar=show&theme=dark"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                  </div>
                 {/* </div> */}

              </div>
            {/* </div> */}

          {/* </div> */}

          {/* </div> */}
        </div>
        </DefaultLayout>
      )
  }

  //server side function
  // export const getServerSideProps = async () => {
  //   const query = await fetch('https://token.jup.ag/strict');
  //   const response:[] = await query.json();
  //   return {
  //     props:{
  //       tokenList: response.slice(0, 10) //take the first ten items
  //     }
  //   }
  // }
  export default Swap;