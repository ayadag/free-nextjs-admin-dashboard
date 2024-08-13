"use client";
import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  message as Message,
  Modal,
} from 'antd';
import BN from 'bn.js';
import {
  useRouter,
  useSearchParams,
} from 'next/navigation';

import { DownOutlined } from '@ant-design/icons';
import {
  Raydium,
  TxVersion,
} from '@raydium-io/raydium-sdk-v2';
// import {
//   useConnection,
//   useWallet,
// } from '@solana/wallet-adapter-react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Connection,
  PublicKey,
} from '@solana/web3.js';

import { Attention } from '../../alert/attention';
import Error from '../../alert/error';
// import { notify } from '../../utils/notifications';
import { Successful } from '../../alert/successful';
import {
  getTransaction,
  TxDetail,
} from './getTxDetails';
// import { PublicKey } from '@solana/web3.js';
import styles from './swap.module.css';
import tList from './tokenList2.json';
import { getTokensList } from './walletTokens';

const CreatePool: React.FC = () => {
    const wallet = useWallet();
    const { publicKey, signAllTransactions } = useWallet();

    // const { connection } = useConnection()
    const connection = new Connection('https://api.devnet.solana.com/');
    const [messageApi, contextHolder] = Message.useMessage();

    const [slippage, setSlippage] = useState(2.5);
    // const [tokenOneAmount, setTokenOneAmount] = useState(null);
    // const [tokenTwoAmount, setTokenTwoAmount] = useState(null);
    const [tokenOneAmount, setTokenOneAmount] = useState(0);
    const [tokenTwoAmount, setTokenTwoAmount] = useState(0);

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
    let [tokenListU, setTokenListU] = useState<any>(); //token list
    // const [txDetails, setTxDetails] = useState<TxDetail>({
    //     state: 'success',
    //     // code: string,
    //     message: "Ok"
    // });
    const [txDetails, setTxDetails] = useState<TxDetail | undefined>();
    const [txId, setTxId] = useState('')
    // const [txDetails, setTxDetails] = useState<any>();

    const [error, setError] = useState<boolean>(false);
    const messageRef = useRef<any>(null); //ref to scroll
    const [successful, setSuccessful] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('Pool created successfully');
    const [details, setDetails] = useState<string>(''); //Error message details
    const [poolId, setPoolId] = useState<string | undefined>(undefined)
    const [showPoolId, setShowPoolId] = useState<boolean>(false)

    let getTokensL = new getTokensList; //get wallet token list

    const owner = publicKey || undefined;
    // const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
    const txVersion = TxVersion.V0 // or TxVersion.LEGACY
    // let raydium: Raydium | undefined

    const [tokenOne, setTokenOne] = useState(
        {
            "symbol": "SOL",
            "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
            "name": "Wrapped SOL",
            "address": "So11111111111111111111111111111111111111112",
            "decimals": 9,
            "uri": "",
            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        }
    );
    const [tokenTwo, setTokenTwo] = useState(
        {
            "symbol": "USDC",
            "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
            "name": "USD Coin /sol",
            "address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
            "decimals": 6,
            "uri": "",
            "programId": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
        }
    );

    const searchParm = useSearchParams();
    const router = useRouter();

    //scroll effect whenever the message change
    useEffect(() => {
        messageRef.current?.scrollIntoView();
    }, [error, txDetails]);

    //Show Successful message
    const showSuccessfulMessage = () => {
        // window.scroll({
        //   top:0, //scroll to the top of page
        //   behavior: 'smooth'
        // })
        setSuccessful(true) //show successful message
        setShowPoolId(true) //show pool id
        // messageRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            setSuccessful(false); //hide successful message after 10s
        }, 10000);
    };

    //Show Error message
    const showErrorMessage = () => {
        // window.scrollTo({
        //   top:0, //scroll to the top of page
        //   behavior: 'smooth'
        // })
        // router.push(`/tokenv1/create`)
        setError(true) //show Error message
        // window.scrollTo(0,0) //scroll to x=0 y=0
        // router.push(`/tokenv1/create`)
        setTimeout(() => {
            setError(false); //hide Error message after 10s
        }, 10000);
    };

    //get wallet tokens
    useEffect(() => {
        let tList: any[] = [];
        let walletTokens: any[] = [];
        async function getTokenList() {
            try {
                walletTokens = await getTokensL.getUri(String(wallet.publicKey))
                setTokenListU(walletTokens);

                for (let index = 0; index < walletTokens.length; index++) {
                    const token = walletTokens[index];
                    const logoURI = await getLogoURI(token.uri);
                    // console.log('logoURI: ', logoURI)
                    tList.push({
                        symbol: token.symbol,
                        logoURI: logoURI,
                        name: token.name,
                        address: token.mint,
                        uri: token.uri,
                        decimals: token.decimals,
                        programId: token.programId,
                    })
                }

                setTokenList(tList);

            } catch (e) { console.log('can not get wallet tokens', e) }
        }
        getTokenList(); //get token list
    }, [wallet, connection]);

    //Get Logo url from uri
    async function getLogoURI(uri: string) {
        if (uri == '') { return ''; }
        try {
            // console.log("`${uri}`: ", `${uri}`)
            const meta = await (await fetch(
                `${uri}`
            )
            ).json();
            const logU: string = meta.image;
            // console.log('logU: ', logU)
            return logU
        } catch (error) {
            console.error('Error in getLogoURI: ', error)
            const logU: string = '';
            return logU
        }
    }

    //open Modal
    function openModal(asset: any) {
        setChangeToken(asset);
        setIsOpen(true);
    }

    //handle Token List Search
    function handleTokenListSearch(e: any) {
        if (e.target.value != '') {
            setQuery(e.target.value.toLowerCase());
        } else {
            setQuery(e.target.value);
        }
    }

    //modify Url Param
    function modifyUrlParam(i: any) {
        setTokenOneAmount(0);
        setTokenTwoAmount(0);

        if (changeToken === 1) {
            // setTokenOne(i);
            router.push(`/pool/create?from=${i.address}&to=${tokenTwo.address}`)
        }
        else {
            // setTokenTwo(i);
            router.push(`/pool/create?from=${tokenOne.address}&to=${i.address}`)
        }

        setIsOpen(false);
    }

    //Handle change of token one or token two or searchParam
    useEffect(() => {
        let from = searchParm.get('from');
        if (from) {
            //   console.log(`searchParm.get('from'): `,from)
            for (let index = 0; index < tokenList.length; index++) {
                if (tokenList[index].address == from) {
                    setTokenOne(tokenList[index]);
                    //   console.log('tokenOne: ',tokenOne)
                }
            }
        }
        let to = searchParm.get('to');
        if (to) {
            //   console.log(`searchParm.get('to'): `,to)
            for (let index = 0; index < tokenList.length; index++) {
                if (tokenList[index].address == to) {
                    setTokenTwo(tokenList[index]);
                    //   console.log('tokenTwo: ',tokenTwo)
                }
            }
        }
    }, [tokenOne, tokenTwo, searchParm]);

    //Crete Pool
    async function cretePool(event: any) {
        event.preventDefault(); //to cancell page reload
        await createPool();
    }

    //Handle txId changes
    useEffect(() => {
        // try {
        if (!txId) { return console.log('!txId') }
        //    get();
        setTimeout(get, 500) //call get function after 0.5 second
        // } catch (err) {console.log(err)}
    }, [txId])

    //Handle txDetails changes
    useEffect(() => {
        if (!txDetails) { return console.log('!txDetails') }
        console.log('txDetails: ', txDetails);
        setMessage(txDetails.message) //transaction message
        if (txDetails.state == 'success') {
            showSuccessfulMessage(); //show successful message for 10 seccond
        }
        else if (txDetails.state == 'error') {
            showErrorMessage(); //show successful message for 10 seccond
        }
    }, [txDetails])

    //Create Pool
    const createPool = async () => {
        const raydium = await initSdk({ loadToken: false }) //ayad

        const mintA = {
            address: tokenOne.address,
            programId: tokenOne.programId,
            decimals: tokenOne.decimals,
        }
        const mintAAmount = new BN(tokenOneAmount)

        const mintB = {
            address: tokenTwo.address,
            programId: tokenTwo.programId,
            decimals: tokenTwo.decimals,
        }
        const mintBAmount = new BN(tokenTwoAmount)

        const startTime = new BN(0)

        // let createPoolFunction = raydium.cpmm.createPool
        const { execute, extInfo } = await raydium.cpmm.createPool({
            programId: new PublicKey('97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo'), // devnet: DEVNET_PROGRAM_ID.CREATE_CPMM_POOL_PROGRAM
            // poolFeeAccount: new PublicKey('8niFqtDg5vk6ANcw8pQEq6MB8gKMqRsRy8gM41QkxJhQ'),  // devnet HGt6hRAEmpTdkTdMnshmcjZYN1JVRrhHPtVGbk4Br8Zx
            poolFeeAccount: new PublicKey('DWSb1UKCzFBAu9rNccuUqheEG46VdrLHNhBVGKA4xyqh'),  // devnet HxKiEkhNNcifMj3Jz22QbXcD7mNg3PCm1cNe3WYjYeR9


            // poolFeeAccount: new PublicKey('G11FKBRaAkHAKuLCgLM6K6NUc9rTjPAznRCjZifrTQe2'), // Ayad you shold change that!
            mintA,
            mintB,
            //   mintAAmount: new BN(1),
            mintAAmount,
            // mintBAmount: new BN(1000),
            //   mintBAmount: new BN(10000),
            mintBAmount,
            //   startTime: new BN(0),
            startTime,
            associatedOnly: false,
            ownerInfo: {
                // feePayer: owner.publicKey, //ayad
                useSOLBalance: true,
            },
            txVersion,
        })

        const { txId } = await execute()
        // console.log('txId: ', txId)
        setTxId(txId)
        setPoolId(extInfo.address.poolId.toString())
        console.log('poolId', extInfo.address.poolId.toString(), poolId)
    }

    //Get transaction details
    async function get() {
        const txD = await getTransaction(connection, txId)
        if (!txD) { return console.log('!txD') }
        setTxDetails(txD)
    }

    //Init raydium sdk
    let raydium: Raydium | undefined
    const initSdk = async (params?: { loadToken?: boolean }) => {
        if (raydium) return raydium
        // if (!owner) return console.log('wallet not connected')
        raydium = await Raydium.load({
            owner,
            signAllTransactions, //ayad
            connection,
            cluster: 'devnet', // 'mainnet' | 'devnet'
            disableFeatureCheck: true,
            disableLoadToken: !params?.loadToken,
            blockhashCommitment: 'finalized',
            // urlConfigs: {
            //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
            // },
        })

        return raydium
    }

    return (
        <>
            <div><Attention /></div>
            <div ref={messageRef}></div> {/*scroll to this emty dev*/}
            {/* <Breadcrumb pageName="Create Pool" /> */}
            {/* <div ref={messageRef}></div>  */}
            {successful && Successful(message, txId)} {/*sccessful message*/}
            {/* {error && Error(message, details, messageRef)} error message */}
            {error && Error(message, undefined, txId)}

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

            {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark"> */}
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                {/* <div className="flex flex-wrap items-center"> */}
                <div className="flex flex-wrap justify-center">

                    {/* <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2"> */}
                    <div className="w-full xl:w-2/3">
                        <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                            {/* <span className="mb-1.5 block font-medium">Start for free</span> */}
                            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                                {/* Sign In to TailAdmin */}
                                Create Pool on Gluon                            </h2>

                            <form onSubmit={(event) => cretePool(event)}>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Token one
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Enter token one amount"
                                            step="0.000000001"
                                            onChange={(e) => setTokenOneAmount(Number(e.target.value))}
                                            // defaultValue={tokenOneAmount}
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />

                                        <span className="absolute right-4 top-4">
                                            {/* <div className="absolute right-4 top-4"> */}

                                            <div className={styles.assetOne} onClick={() => openModal(1)}>
                                                <img src={tokenOne.logoURI} alt="assetOneLogo" className={styles.assetLogo} />
                                                {/* <Image src={tokenOne.img} alt="assetOneLogo" width="22px" height="22px" className={styles.assetLogo} /> */}
                                                {tokenOne.symbol}
                                                <DownOutlined />
                                            </div>

                                            {/* </div> */}
                                        </span>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Token two
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Enter token two amount"
                                            step="0.000000001"
                                            onChange={(e) => setTokenTwoAmount(Number(e.target.value))}
                                            // defaultValue={tokenTwoAmount}
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />

                                        <span className="absolute right-4 top-4">
                                            <div className={styles.assetTwo} onClick={() => openModal(2)}>
                                                <img src={tokenTwo.logoURI} alt="assetTwoLogo" className={styles.assetLogo} />
                                                {tokenTwo.symbol}
                                                <DownOutlined />
                                            </div>

                                        </span>
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <input
                                        type="submit"
                                        value="Crete Pool"
                                        className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                                    />
                                </div>

                                {showPoolId && <div className="mt-6 text-center">
                                    {/* <p className='text-white'>Created Pool Id:</p> */}
                                    <p className='text-white'>
                                        {`Created pool id: ${poolId}`}
                                        {/* <Link href="/auth/signup" className="text-primary">
                                            Sign Up
                                        </Link> */}
                                    </p>
                                </div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CreatePool;
