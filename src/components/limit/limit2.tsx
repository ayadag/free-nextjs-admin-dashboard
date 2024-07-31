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
import BN from 'bn.js';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  CreateOrderParams,
  LimitOrderProvider,
} from '@jup-ag/limit-order-sdk';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  PublicKey,
  VersionedTransaction,
} from '@solana/web3.js';

/*
import {
  CreateOrderParams,
  LimitOrderProvider,
  OrderHistoryItem,
  ownerFilter,
  TradeHistoryItem,
} from '@jup-ag/limit-order-sdk';
import {
    CancelOrder,
    OrderFields,
    validateCancelOrderFields,
} from './utils/validate';
  */
import { connection2 as connection } from '../../config';
import styles from './swap.module.css';
// import tokenList from './tokenList.json';
// import tokenList from './tokenList2.json';
import tList from './tokenList2.json';
import { OrderFields } from './utils/validate';

type Order = {
  inAmount: number,
  outAmount: number,
  inputMint: string,
  outputMint: string,
  inputDecimal: number,
  outputDecimal: number
}
// let tokenListSearch: any[] | undefined;

// const Swap = ({tokenList}:{tokenList:[]}) => {
const LimitC = () => {
  const wallet = useWallet();
  const { publicKey, sendTransaction } = useWallet();
  // const connection = useConnection();
  // const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE');
  //   const connection = new Connection('https://raydium-raydium-5ad5.mainnet.rpcpool.com/');
  const [messageApi, contextHolder] = message.useMessage();
  const limitOrder = new LimitOrderProvider(connection);

  const [slippage, setSlippage] = useState(2.5);
  // const [tokenOneAmount, setTokenOneAmount] = useState(null);
  // const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
  const [tokenOneAmount, setTokenOneAmount] = useState(0);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(0);
  // const [tokenRate, setTokenRate] = useState<any>(0);
  const [tokenRate, setTokenRate] = useState<number>(0);

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
      try {
        const tList: [] = await (await fetch(
          `https://token.jup.ag/strict` //strict
          // `https://token.jup.ag/all` //all
        )
        ).json();
        // setTTokenList(tList);
        setTokenList(tList);
        // setTokenList(tList.splice(0,10));  //splice(0,10) to take gest the first ten idems.
        console.log('tokenList: ', tokenList);
      } catch (e) { console.log('can not get price', e) }
    }
    getTokenList(); //get token list
  }, [wallet.publicKey]);

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
    if (e.target.value != '') {
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

  function changeTokenOneAmount(e: any) {
    setTokenOneAmount(e.target.value);
    // if(e.target.value && prices){
    //   setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
    // }else{
    // //   setTokenTwoAmount(null);
    // setTokenTwoAmount(0);
    // }
  }

  function changeTokenRateAmount(e: any) {
    setTokenRate(e.target.value);
    // if(e.target.value && prices){
    //   setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
    // }else{
    // //   setTokenTwoAmount(null);
    // setTokenTwoAmount(0);
    // }
  }

  // function changeTokenTwoAmount(e: any) {
  //   setTokenTwoAmount(e.target.value);
  //   // if(e.target.value && prices){
  //   //   setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2))
  //   // }else{
  //   // //   setTokenTwoAmount(null);
  //   // setTokenTwoAmount(0);
  //   // }
  // }

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

  // //Handle token one Amunt change
  // const debounceTokenOneCall = useCallback(debounce(getTokenTwoAmount, 500), [tokenOne, tokenTwo, tokenRate]);

  // useEffect(() => {
  //   debounceTokenOneCall(tokenOneAmount);
  // }, [tokenOneAmount, debounceTokenOneCall]);

  // async function getTokenTwoAmount(currentAmount: number) {
  //   if (isNaN(currentAmount) || currentAmount <= 0) {
  //     console.error('Invalid fromAmount value:', currentAmount);
  //     return;
  //   }

  //   const tTowAmount = tokenOneAmount / tokenRate;
  //   setTokenTwoAmount(tTowAmount);
  //   return;
  // }

  //Handle token one or rate Amount change
  const debounceTokenCall = useCallback(debounce(getTokenTwoAmount, 500), [tokenOneAmount, tokenRate]);

  useEffect(() => {
    debounceTokenCall(tokenOneAmount, tokenRate);
  }, [tokenOneAmount, tokenRate, debounceTokenCall]);

  async function getTokenTwoAmount(tOA: number, tRA: number) {
    // if (isNaN(tOA) || tOA <= 0 || isNaN(tTA) || tTA <= 0 || isNaN(tRA) || tRA <= 0) {
    if (isNaN(tOA) || isNaN(tRA)) {
      console.error('Invalid fromAmount value:', tOA, tRA);
      return;
    }

    const tTA = tOA / tRA;
    setTokenTwoAmount(tTA);
    return;
  }

  //Handle token two Amount change
  // const debounceTokenOneCall = useCallback(debounce(getTokenOneAmount, 500), [tokenTwo]);

  // useEffect(() => {
  //   debounceTokenOneCall(tokenTwoAmount, tokenRate);
  // }, [tokenTwoAmount, debounceTokenOneCall]);

  // async function getTokenOneAmount(tTA: number, tRA: number) {
  //   // if (isNaN(tOA) || tOA <= 0 || isNaN(tTA) || tTA <= 0 || isNaN(tRA) || tRA <= 0) {
  //     if (isNaN(tTA) || isNaN(tRA)) {
  //       console.error('Invalid fromAmount value:', tTA, tRA);
  //     return;
  //   }

  //   const tOneAmount = tokenTwoAmount * tokenRate;
  //   setTokenOneAmount(tOneAmount);
  //   return;
  // }


  //Handle token one change
  // const debounceQuoteCall = useCallback(debounce(getQuote, 500), [tokenOne, tokenTwo]);

  // useEffect(() => {
  //   debounceQuoteCall(tokenOneAmount);
  // }, [tokenOneAmount, debounceQuoteCall]);

  // async function getQuote(currentAmount: number) {
  //   if (isNaN(currentAmount) || currentAmount <= 0) {
  //     console.error('Invalid fromAmount value:', currentAmount);
  //     return;
  //   }

  //   // const quote = await (
  //   //   await fetch(
  //   //     `https://quote-api.jup.ag/v6/quote?inputMint=${tokenOne.address}&outputMint=${tokenTwo.address}&amount=${currentAmount * Math.pow(10, tokenOne.decimals)}&slippage=${slippage}`
  //   //   )
  //   // ).json();

  //   let quote;
  //   try {
  //     quote = await (
  //       await fetch(
  //         `https://quote-api.jup.ag/v6/quote?inputMint=${tokenOne.address}&outputMint=${tokenTwo.address}&amount=${currentAmount * Math.pow(10, tokenOne.decimals)}&slippage=${slippage}`
  //       )
  //     ).json();
  //   } catch (e) { console.log('Error: ', e) }

  //   if (quote && quote.outAmount) {
  //     const outAmountNumber =
  //       Number(quote.outAmount) / Math.pow(10, tokenTwo.decimals);
  //     setTokenTwoAmount(outAmountNumber);
  //   } else {
  //     setTokenTwoAmount(0);
  //   }

  //   setQuoteResponse(quote);
  // }

  //Get tokens price
  const debouncePriceCall = useCallback(debounce(getPrice, 500), [tokenOne, tokenTwo]);

  useEffect(() => {
    let from = searchParm.get('from');
    if (from) {
      console.log(`searchParm.get('from'): `, from)
      for (let index = 0; index < tokenList.length; index++) {
        if (tokenList[index].address == from) {
          setTokenOne(tokenList[index]);
          console.log('tokenOne: ', tokenOne)
        }
      }
    }
    let to = searchParm.get('to');
    if (to) {
      console.log(`searchParm.get('to'): `, to)
      for (let index = 0; index < tokenList.length; index++) {
        if (tokenList[index].address == to) {
          setTokenTwo(tokenList[index]);
          console.log('tokenTwo: ', tokenTwo)
        }
      }
    }

    debouncePriceCall();

    // setTimeout(() => {
    //   getTokenRate()
    // }, 1000)
    // getTokenRate(); //ayad

    // getPrice(); //ayad
    console.log('getttttttttttttttttttttttttttt');
  }, [tokenOne, tokenTwo, debouncePriceCall, searchParm]);

  //This will called twice
  useEffect(() => {
    let from = searchParm.get('from');
    if (from) {
      console.log(`searchParm.get('from'): `, from)
      for (let index = 0; index < tokenList.length; index++) {
        if (tokenList[index].address == from) {
          setTokenOne(tokenList[index]);
          console.log('tokenOne: ', tokenOne)
        }
      }
    }
    let to = searchParm.get('to');
    if (to) {
      console.log(`searchParm.get('to'): `, to)
      for (let index = 0; index < tokenList.length; index++) {
        if (tokenList[index].address == to) {
          setTokenTwo(tokenList[index]);
          console.log('tokenTwo: ', tokenTwo)
        }
      }
    }
    debouncePriceCall();
    // getPrice(); //ayad
    console.log('getttttttttttt111111111111');
  });

  //Get token Rate
  useEffect(() => {
    setTimeout(() => {
      getTokenRate();
    }, 1000)
    // }, [tokenOnePrice, tokenTwoPrice])
  }, [tokenOne, tokenTwo])

  //Get token Rate twice every 40 sec
  useEffect(() => {
    setTimeout(() => {
      getTokenRate();
      console.log('10 sec')
    }, 10000)
    // }, [tokenOnePrice, tokenTwoPrice])
  }, [])

  //Get token Rate after 50 sec
  // setTimeout(() => {
  //   getTokenRate();
  //   console.log('50 sec')
  // }, 50000);

  async function getPrice() {
    //https://price.jup.ag/v6/price?ids=So11111111111111111111111111111111111111112
    let tOnePrice;
    let tTwoPrice;
    try {
      tOnePrice = await (await fetch(
        `https://price.jup.ag/v6/price?ids=${tokenOne.address}`
      )
      ).json();

      tTwoPrice = await (await fetch(
        `https://price.jup.ag/v6/price?ids=${tokenTwo.address}`
      )
      ).json();

    } catch (e) { console.log('can not get price', e) }

    if (tOnePrice && tTwoPrice) {
      // const tOneAddress = tokenOne.address;
      // setTokenOnePriceR(tOnePrice.data);
      // setTokenOnePriceR(tTwoPrice); 

      //token price
      const { [tokenOne.address]: tokenOneD } = tOnePrice.data;
      const { [tokenTwo.address]: tokenTwoD } = tTwoPrice.data;

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

  // get Token Rate
  async function getTokenRate() {
    const tOPrice = tokenOnePrice;
    const tTPrice = tokenTwoPrice;
    const tRate = tTPrice / tOPrice;
    if (isNaN(tRate)) { return console.log('tRate NaN', tRate) }
    // setTokenRate(tRate);
    setTimeout(() => {
      setTokenRate(tRate);
    }, 1000)
    return;
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

    router.push(`/limit?from=${tokenTwo.address}&to=${tokenOne.address}`)
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
      router.push(`/limit?from=${i.address}&to=${tokenTwo.address}`)
    }
    else {
      router.push(`/limit?from=${tokenOne.address}&to=${i.address}`)
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

  async function signAndSendTransaction2() {
    if (!wallet.connected || !wallet.signTransaction || !publicKey) {
      console.error(
        'Wallet is not connected or does not support signing transactions'
      );
      return;
    }

    const order: Order = {
      inAmount: tokenOneAmount,
      outAmount: tokenTwoAmount,
      inputMint: tokenOne.address,
      outputMint: tokenTwo.address,
      inputDecimal: tokenOne.decimals,
      outputDecimal: tokenTwo.decimals
    }

    const base = Keypair.generate();

    let orderData: OrderFields = {
      owner: publicKey,
      // inAmount: new BN(order1.inAmount), // 1 USDC
      inAmount: new BN(order.inAmount * Math.pow(10, order.inputDecimal)), // 1 USDC decimals 9
      inputMint: new PublicKey(order.inputMint), // USDC mainnet mint
      // outAmount: new BN(order1.outAmount), // 1 SOL
      outAmount: new BN(order.outAmount * Math.pow(10, order.outputDecimal)), // 1 SOL decimals 9
      outputMint: new PublicKey(order.outputMint), // SOL mint
      base: base.publicKey,
      expiredAt: null,
    }

    // validateCreateOrderFields(orderData); //ayad

    // const { tx, orderPubKey } = await limitOrder.createOrder(
    //     orderData as CreateOrderParams
    // );
    // console.log('orderPubKey: ', orderPubKey);

    // // const trx = await sendAndConfirmTransaction(connection, tx, [Owner, base]);
    // const trx = await sendTransaction(tx, connection, {signers: [base]});
    // return console.log(`[✅] Order placed successfully TRX: ${trx}`);

    try {
      //sending transaction
      messageApi.destroy();
      messageApi.open({
        type: 'loading',
        content: 'Transaction is Pending...',
        duration: 0,
      })

      const { tx, orderPubKey } = await limitOrder.createOrder(
        orderData as CreateOrderParams
      );
      console.log('orderPubKey: ', orderPubKey);

      // const trx = await sendAndConfirmTransaction(connection, tx, [Owner, base]);
      const trx = await sendTransaction(tx, connection, { signers: [base] });

      //Transaction Successful
      messageApi.destroy();
      messageApi.open({
        type: 'success',
        content: 'Transaction Successful',
        duration: 2.5,
      })

      return console.log(`[✅] Order placed successfully TRX: ${trx}`);
    }
    catch (err) {
      //Transaction Failed
      messageApi.destroy();
      messageApi.open({
        type: 'error',
        content: 'Transaction Failed',
        duration: 2.50,
      })
      console.error('Error signing or sending the transaction:', err);
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
    <>
      {/* <Breadcrumb pageName="Limit Order" /> */}
      <div className='relative flex flex-wrap justify-center text-center'>
        {/* <div className="flex flex-wrap justify-center text-center rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"> */}
        {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}

        {/* <div className={styles.App}> */}

        {/* <div className="text-center"> */}
        {/* <div className="w-full xl:w-2/3"> */}
        {/* <div className="flex justify-center mt-10 w-full md:w-9/12 xl:w-2/3"> */}

        {/* <div className='grid grid-flow-row-2 gap-1'> */}
        {/* <div className="flex flex-row gap-0"> */}
        {/* <div className='flex-1 flex flex-col relative h-full'> */}
        {/* <div> */}
        <div className='relative'>
          {/* <div className='relative'> */}
          {/* <div> */}
          <div>

            <div className="flex justify-center mt-10 w-full">

              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                {/* <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 xl:grid-cols-3"> */}

                <div className="flex flex-col gap-0">
                  {/* <div className="flex flex-col gap-0 xl:grid-cols-2"> */}
                  {/* <div className="flex"> */}
                  <div className="flex h-70 sm:h-125">
                    {/* <div className="flex h-70 sm:h-125 xl:w-125"> */}
                    <iframe
                      className='rounded-xl'
                      width="100%"
                      // height="404"
                      // height="507"
                      height="100%"
                      // src="https://birdeye.so/tv-widget/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?chain=solana&viewMode=pair&chartInterval=1D&chartType=CANDLE&chartTimezone=Asia%2FSingapore&chartLeftToolbar=show&theme=dark"
                      src={`https://birdeye.so/tv-widget/${tokenTwo.address}?chain=solana&viewMode=pair&chartInterval=1D&chartType=CANDLE&chartTimezone=Asia%2FSingapore&chartLeftToolbar=show&theme=dark`}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>

                {/* <div className="grid grid-cols-1 gap-0 xl:grid-cols-2"> */}
                {/* <div className="flex flex-col gap-0"> */}
                <div className="flex flex-col gap-0">
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
                  {/* <div className="w-full rounded-lg p-4 bg-slate-950 xl:w-2/3"> */}
                  {/* <div className="w-full rounded-lg p-4 bg-slate-900 xl:w-2/3"> */}
                  {/* <div className="w-full rounded-lg p-4 bg-slate-900"> */}
                  <div className="w-full rounded-lg p-4 dark:border-strokedark dark:bg-boxdark">{/* dark:border-strokedark dark:bg-boxdark */}
                    {/* <div className="w-full rounded-lg p-4 bg-gray-2 dark:bg-meta-4 xl:w-2/3">// bg-gray-2 dark:bg-meta-4 */}
                    <div className={styles.tradeBoxHeader}>
                      <h4>{`You're Selling`}</h4>
                      <Popover
                        content={settings}
                        title="Settings"
                        trigger="click"
                        placement="bottomRight"
                      >
                        <SettingOutlined className={styles.cog} />
                      </Popover>
                    </div>
                    {/* <div className={styles.inputs}> */}
                    <div className='relative justify-center'>
                      <Input
                        placeholder="0"
                        value={tokenOneAmount}
                        onChange={changeTokenOneAmount}
                      // onChange={handleFromValueChange}
                      // disabled={!prices}
                      />

                      {/* Sell MNGO at rate */}
                      <div className='flex'>
                        <Input
                          placeholder="0"
                          value={tokenRate}
                          onChange={changeTokenRateAmount}
                        // onChange={handleFromValueChange}
                        // disabled={!prices}
                        />
                        {/* <label className='text-center px-1'>x</label> */}
                      </div>

                      {/* //ayad/////// */}
                      {/* <div className={styles.switchButton2}> */}
                      <div className='h-8 self-center'>
                        {/* <ArrowDownOutlined className={styles.switchArrow2} onClick={switchTokens}/> */}
                        <ArrowDownOutlined className={styles.switchArrow2} onClick={switchParams} />
                      </div>

                      <Input
                        placeholder="0"
                        // value={tokenOneAmount == 0 ? 0 : tokenTwoAmount}
                        value={tokenTwoAmount}
                        // onChange={changeTokenTwoAmount}
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

                      {/* Sell MNGO at rate */}
                      <div className={styles.assetOneRate}>
                        <h3>Sell {tokenOne.symbol} at rate</h3>
                      </div>
                      <div className={styles.assetTwoSymbol}>
                        <h3>{tokenTwo.symbol}</h3>
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
                        value={!wallet.publicKey ? "Connect wallet" : "Place Limit Order"}
                        disabled={!tokenOneAmount || tokenOneAmount == 0 || !wallet.publicKey}
                        onClick={signAndSendTransaction2}
                        className="w-full mt-7 text-xl font-bold cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 
                                        disabled:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:border-y-green-950"
                      />
                    </div>
                  </div>

                  {/* iFrame */}

                </div>
                {/* <div className="flex flex-col gap-0">
              <div className="flex">
                <iframe
                  width="100%"
                  height="400"
                  src="https://birdeye.so/tv-widget/DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263?chain=solana&viewMode=pair&chartInterval=1D&chartType=CANDLE&chartTimezone=Asia%2FSingapore&chartLeftToolbar=show&theme=dark"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
            </div> */}
              </div>

              {/* </div> */}

              {/* <div className='flex w-full bg-black'></div> */}

            </div>
            {/* </div> */}

            {/* </div> */}

            {/* </div> */}

          </div>

          {/* <div className="flex flex-row gap-0"> */}
          {/* <div className="gap-0"> */}
          {/* <div className='relative w-screen'> */}
          {/* <div className='relative w-svw'> */}
          {/* <div className='absolute w-dvw'> */}
          <div className='absolute w-full pt-1'>

            {/* <div className='flex justify-center mt-10 w-full h-16'>
              <div className="grid grid-cols-1 gap-1 sm:grid-cols-2">
                <div className="flex flex-col justify-start gap-0 w-70 bg-slate-500"></div>
                <div className="flex flex-col gap-0 w-full bg-slate-500"></div>
              </div>
            </div> */}

            {/* <div className='flex justify-center mt-10 w-full h-16'>
              <div className="grid grid-cols-5 gap-8">
                <div className="col-span-5 xl:col-span-3">
                  <div className="flex flex-col w-132.5 h-3 bg-slate-500"></div>
                  <label className='w-full bg-slate-300'>Hhhh</label>
                  <input type="text" className='w-full' />
                </div>
                <div className="col-span-5 xl:col-span-2">
                  <div className="flex flex-col w-full h-3 bg-slate-500"></div>
                </div>
              </div>
            </div> */}

            {/* <div className='flex justify-center mt-10 w-full h-16'> */}
            <div className="flex flex-col">
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
            </div>


            <div className="flex flex-col">
              {/* <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3 xl:grid-cols-5"> */}
              <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
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
                {/* <div className="hidden p-2.5 text-center xl:block xl:p-5"> */}
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Mint A
                  </h5>
                </div>
                {/* <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Mint B
            </h5>
          </div> */}
                {/* <div className="hidden p-2.5 text-center xl:block xl:p-5"> */}
                <div className="p-2.5 text-center xl:p-5">
                  <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Mint B
                  </h5>
                </div>
                {/* <div className="hidden p-2.5 text-center sm:block xl:p-5"> */}
                <div className="p-2.5 text-center xl:p-5">
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
            </div>

            <div className="w-full flex justify-center xl:max-w-7xl lg:max-w-[90vw] lg:mx-auto">
              <div className="w-full overflow-hidden">
                <div className="flex flex-row flex-wrap">
                  <div className="flex space-x-2 justify-start items-start overflow-y-auto">
                    <button type="button" className="rounded-2xl px-4 py-2 text-xs text-white/20 border border-transparent whitespace-nowrap dark:hover:!text-v2-primary">Open Orders</button>
                    <button type="button" className="rounded-2xl px-4 py-2 text-xs text-white/20 border whitespace-nowrap dark:hover:!text-v2-primary !text-v2-primary border-v2-primary/20 bg-v2-primary/5">Order History</button>
                  </div>
                  <div className="ml-auto flex justify-end space-x-2 text-xs dark:text-white-50">
                    <button type="button" className="flex items-center border border-black-10 dark:border-white/10 px-3 py-1.5 rounded-lg dark:hover:!text-v2-primary dark:hover:!bg-v2-primary/5 dark:hover:!border-v2-primary/25">
                      <div className="mr-2 fill-current">
                        <svg width="8" height="8" viewBox="0 0 12 12" fill="inherit" xmlns="http://www.w3.org/2000/svg">
                          <g clip-path="url(#clip0_841_4053)">
                            <path d="M11.6466 4.23513V0.706082L10.4111 1.94156C9.3173 0.741165 7.72912 0 6 0C2.6827 0 0 2.6827 0 6C0 9.3173 2.68203 12 6 12C7.69405 12 9.21142 11.2939 10.3059 10.165L9.31797 9.14128C8.50601 10.0234 7.30561 10.5879 6 10.5879C3.45892 10.5879 1.41216 8.5411 1.41216 6.00002C1.41216 3.45894 3.45892 1.41218 6 1.41218C7.34135 1.41218 8.57615 2.01238 9.42317 2.92954L8.11757 4.23515L11.6466 4.23513Z" fill="inherit"></path>
                          </g>
                          <defs><clipPath id="clip0_841_4053"><rect width="12" height="12" fill="white"></rect></clipPath></defs></svg>
                      </div>
                      Refetch Data
                    </button>

                    <button type="button" className="flex items-center border border-black-10 dark:border-white/10 px-3 py-1.5 rounded-lg cursor-disabled opacity-50 !dark:hover:transparent">
                      <div className="mr-2 fill-current">
                        <svg width="9" height="10" viewBox="0 0 9 10" fill="inherit" xmlns="http://www.w3.org/2000/svg"><path d="M4.50199 9.2001C5.9011 9.19955 7.22 8.54806 8.07149 7.43792C8.92239 6.3272 9.20858 4.88472 8.84603 3.53331C8.48348 2.18189 7.51283 1.07615 6.2197 0.541774C4.92716 0.00728354 3.4588 0.103964 2.24759 0.80435C1.03634 1.50419 0.220046 2.72811 0.0382167 4.1151C-0.143612 5.50214 0.329903 6.89527 1.31978 7.88401C2.16299 8.72887 3.30837 9.20238 4.502 9.20019L4.50199 9.2001ZM6.89263 7.09072C6.32848 7.65377 5.58305 7.99874 4.78872 8.06521C3.99441 8.13113 3.20232 7.91415 2.55306 7.45217L7.25136 2.74669C7.71444 3.39653 7.93308 4.18923 7.86715 4.98461C7.80178 5.77947 7.45625 6.526 6.89265 7.09076L6.89263 7.09072ZM2.11135 2.30944C2.6755 1.74639 3.42093 1.40142 4.21525 1.33495C5.00956 1.26903 5.80165 1.48601 6.45092 1.94799L1.75261 6.65459C1.28898 6.0053 1.07035 5.21205 1.13628 4.41668C1.20165 3.6207 1.54717 2.87415 2.11132 2.30954L2.11135 2.30944Z" fill="inherit"></path>
                        </svg>
                      </div>Cancel All
                    </button>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full mt-3 text-xs overflow-x-auto border rounded-lg border-white/5">
                    <div className="border-b border-b-white/5 bg-white/[.02] text-xs dark:text-white-50 flex justify-between min-w-[1200px] py-3 font-semibold dark:font-normal px-5 lg:px-0">
                      <div className="basis-2/6 px-6">
                        Price
                      </div>
                      <div className="basis-4/6 flex justify-between">
                        <div className="basis-3/12 text-center">
                          Limit Price
                        </div>
                        <div className="basis-3/12 text-center">
                          Expiry
                        </div>
                        <div className="basis-3/12 text-center">
                          Filled Size
                        </div>
                        <div className="basis-2/12 text-center">
                          Status
                        </div>
                        <div className="basis-1/12">
                        </div>
                      </div>
                    </div>

                    <div className="px-5 lg:px-0 relative overflow-y-auto min-w-[1200px] h-[372px] xs:h-[620px]">
                      <button className="flex justify-between items-center border-b border-white/5 dark:text-white/50 h-[62px] w-full">
                        <div className="basis-2/6 min-w-[280px] flex items-center px-6">
                          <div className="flex -space-x-2 cursor-pointer">
                            <span className="relative">
                              <img src="https://wsrv.nl/?w=48&amp;h=48&amp;url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FMangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac%2Ftoken.png" alt="MNGO" width="20" height="20" className='object-cover rounded-full max-w-5 max-h-5'></img>
                            </span>
                            <span className="relative">
                              <img src="https://wsrv.nl/?w=48&amp;h=48&amp;url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png" alt="SOL" width="20" height="20" className='object-cover rounded-full max-w-5 max-h-5'></img>
                            </span>
                          </div>
                          <div className="flex whitespace-nowrap items-center ml-5 font-semibold ">
                            <span>1637 MNGO</span>
                            <div className="h-2.5 w-4 mx-1">
                              <svg width="16" height="10" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9339 9.08485L16.0326 1.18357C15.6735 0.80576 15.1766 0.589184 14.6554 0.581696C14.1341 0.575134 13.6326 0.779509 13.2632 1.14795C12.8948 1.5164 12.6904 2.01795 12.696 2.53921C12.7026 3.0614 12.9191 3.55734 13.2969 3.91734L17.9676 8.58054H2.43406C1.36626 8.58054 0.5 9.44679 0.5 10.5146C0.5 11.5833 1.36626 12.4496 2.43406 12.4496H17.9244L13.2969 17.0838C12.5741 17.845 12.5891 19.0431 13.3316 19.7847C14.0741 20.5263 15.2732 20.5413 16.0326 19.8175L23.9339 11.9163C24.2976 11.5544 24.502 11.0622 24.5001 10.5484C24.5011 10.5325 24.5011 10.5166 24.5001 10.5006C24.5011 10.4847 24.5011 10.4688 24.5001 10.4528C24.5001 9.94001 24.2967 9.44782 23.9339 9.08501L23.9339 9.08485Z" fill="currentColor"></path>
                              </svg>
                            </div>
                            <span>0.180549641 SOL</span>
                          </div>
                        </div>
                        <div className="basis-4/6 flex items-center justify-between">
                          <div className="basis-3/12 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <span>0.0001103</span>
                              <span>SOL per $MNGO</span>
                            </div>
                          </div>
                          <div className="basis-3/12 text-center">
                            Never
                          </div>
                          <div className="basis-3/12 text-center">
                            <span className="dark:text-white">1637/1637 MNGO</span> (100.00%)
                          </div>
                          <div className="basis-2/12 flex items-center justify-center px-3 py-1.5">
                            <span className="flex items-center font-semibold space-x-1 text-[#40C1C9]">
                              <svg width="12" height="12" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 0C8.5204 0 0 8.5204 0 19C0 29.4796 8.5204 38 19 38C29.4796 38 38 29.4796 38 19C38 8.5204 29.4796 0 19 0ZM28.6 14.7592L18.4408 26.32C18.0814 26.72 17.6002 26.9606 17.0814 26.9606H17.0018C16.5221 26.9606 16.0424 26.7606 15.6814 26.4013L9.47983 20.1593C8.75951 19.439 8.75951 18.239 9.47983 17.5186C10.2002 16.7983 11.4002 16.7983 12.1205 17.5186L16.9613 22.3594L25.8005 12.2798C26.4802 11.4798 27.6802 11.4392 28.4411 12.1205C29.2411 12.8001 29.3203 13.9592 28.6 14.7592Z" fill="#40C1C9"></path>
                              </svg>
                              <span>Completed</span>
                            </span>
                          </div>
                          <div className="basis-1/12 h-5 text-black/50 dark:text-white/50 flex items-center justify-center rotate-180">
                            <svg width="12" height="12" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 5.70711C0.683416 6.09763 1.31658 6.09763 1.7071 5.70711L4.99999 2.41421L8.29288 5.70711C8.6834 6.09763 9.31657 6.09763 9.70709 5.70711C10.0976 5.31658 10.0976 4.68342 9.70709 4.29289L5.7071 0.292893C5.31657 -0.097631 4.68341 -0.097631 4.29289 0.292893L0.292893 4.29289C-0.0976309 4.68342 -0.0976309 5.31658 0.292893 5.70711Z" fill="currentColor"></path>
                            </svg>
                          </div>
                        </div>
                      </button>
                      <button className="flex justify-between items-center border-b border-white/5 dark:text-white/50 h-[62px] w-full">
                        <div className="basis-2/6 min-w-[280px] flex items-center px-6">
                          <div className="flex -space-x-2 cursor-pointer">
                            <span className="relative">
                              <img src="https://wsrv.nl/?w=48&amp;h=48&amp;url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FMangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac%2Ftoken.png" alt="MNGO" width="20" height="20" className='object-cover rounded-full max-w-5 max-h-5'></img>
                            </span>
                            <span className="relative">
                              <img src="https://wsrv.nl/?w=48&amp;h=48&amp;url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png" alt="SOL" width="20" height="20" className='object-cover rounded-full max-w-5 max-h-5'></img>
                            </span>
                          </div>
                          <div className="flex whitespace-nowrap items-center ml-5 font-semibold ">
                            <span>1637 MNGO</span>
                            <div className="h-2.5 w-4 mx-1">
                              <svg width="16" height="10" viewBox="0 0 25 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.9339 9.08485L16.0326 1.18357C15.6735 0.80576 15.1766 0.589184 14.6554 0.581696C14.1341 0.575134 13.6326 0.779509 13.2632 1.14795C12.8948 1.5164 12.6904 2.01795 12.696 2.53921C12.7026 3.0614 12.9191 3.55734 13.2969 3.91734L17.9676 8.58054H2.43406C1.36626 8.58054 0.5 9.44679 0.5 10.5146C0.5 11.5833 1.36626 12.4496 2.43406 12.4496H17.9244L13.2969 17.0838C12.5741 17.845 12.5891 19.0431 13.3316 19.7847C14.0741 20.5263 15.2732 20.5413 16.0326 19.8175L23.9339 11.9163C24.2976 11.5544 24.502 11.0622 24.5001 10.5484C24.5011 10.5325 24.5011 10.5166 24.5001 10.5006C24.5011 10.4847 24.5011 10.4688 24.5001 10.4528C24.5001 9.94001 24.2967 9.44782 23.9339 9.08501L23.9339 9.08485Z" fill="currentColor"></path>
                              </svg>
                            </div>
                            <span>0.180549641 SOL</span>
                          </div>
                        </div>
                        <div className="basis-4/6 flex items-center justify-between">
                          <div className="basis-3/12 text-center">
                            <div className="flex items-center justify-center space-x-1">
                              <span>0.0001103</span>
                              <span>SOL per $MNGO</span>
                            </div>
                          </div>
                          <div className="basis-3/12 text-center">
                            Never
                          </div>
                          <div className="basis-3/12 text-center">
                            <span className="dark:text-white">0/1637 MNGO</span> (0.00%)
                          </div>
                          <div className="basis-2/12 flex items-center justify-center px-3 py-1.5">
                            <span className="flex items-center font-semibold space-x-1 text-[#be431a]">
                              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.0336 16.2126L8.2336 10.0126L2.0336 3.81263C1.7961 3.57903 1.66172 3.25951 1.66016 2.92669C1.65938 2.59309 1.79141 2.27357 2.02734 2.03763C2.26328 1.80247 2.5828 1.67045 2.9164 1.67201C3.25 1.67357 3.56874 1.80795 3.80234 2.04623L9.99994 8.24623L16.1999 2.04623C16.4335 1.80795 16.7523 1.67357 17.0859 1.67201C17.4187 1.67045 17.739 1.80248 17.9749 2.03763C18.2109 2.27357 18.3429 2.59309 18.3413 2.92669C18.3406 3.25951 18.2062 3.57903 17.9687 3.81263L11.7663 10.0126L17.9663 16.2126C18.2038 16.4462 18.3382 16.7658 18.3397 17.0986C18.3405 17.4322 18.2085 17.7517 17.9725 17.9876C17.7366 18.2228 17.4171 18.3548 17.0835 18.3533C16.7499 18.3517 16.4311 18.2173 16.1975 17.979L9.99994 11.779L3.79994 17.979C3.31088 18.4611 2.52494 18.4579 2.039 17.9736C1.55384 17.4884 1.54994 16.7025 2.03119 16.2126L2.0336 16.2126Z" fill="currentColor"></path></svg>
                              <span>Cancelled</span>
                            </span>
                          </div>
                          <div className="basis-1/12 h-5 text-black/50 dark:text-white/50 flex items-center justify-center rotate-180">
                            <svg width="12" height="12" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M0.292893 5.70711C0.683416 6.09763 1.31658 6.09763 1.7071 5.70711L4.99999 2.41421L8.29288 5.70711C8.6834 6.09763 9.31657 6.09763 9.70709 5.70711C10.0976 5.31658 10.0976 4.68342 9.70709 4.29289L5.7071 0.292893C5.31657 -0.097631 4.68341 -0.097631 4.29289 0.292893L0.292893 4.29289C-0.0976309 4.68342 -0.0976309 5.31658 0.292893 5.70711Z" fill="currentColor"></path>
                            </svg>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className='flex overflow-auto scroll'> */}
            {/* <div className={styles.scroll}>
              <div className='min-w-28 text-center bg-slate-300 mr-1'>box-1</div>
              <div className='min-w-28 text-center bg-slate-300 mr-1'>box-2</div>
              <div className='min-w-28 text-center bg-slate-300 mr-1'>box-3</div>
              <div className='min-w-28 text-center bg-slate-300 mr-1'>box-1</div>
              <div className='min-w-28 text-center bg-slate-300 mr-1'>box-1</div>
              <div className='min-w-28 text-center bg-slate-300 mr-1'>box-1</div>
              <div className='min-w-28 text-center bg-slate-300 mr-1'>box-1</div>
            </div> */}

          </div>

        </div>

      </div>
    </>
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
export default LimitC;