"use client";

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { message as Message } from 'antd';
import bs58 from 'bs58';

import {
  createWithdrawWithheldTokensFromAccountsInstruction,
  getAssociatedTokenAddress,
  getTransferFeeAmount,
  TOKEN_2022_PROGRAM_ID,
  unpackAccount,
} from '@solana/spl-token';
// import {
//   Raydium,
//   TxVersion,
// } from '@raydium-io/raydium-sdk-v2';
// import {
//   useConnection,
//   useWallet,
// } from '@solana/wallet-adapter-react';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  Keypair,
  PublicKey,
  Transaction,
} from '@solana/web3.js';

import Error from '../../alert/error';
// import { notify } from '../../utils/notifications';
import { Successful } from '../../alert/successful';
import { TxDetail } from './getTxDetails';

// import styles from './swap.module.css';
// import tList from './tokenList2.json';
// import { getTokensList } from './walletTokens';

// export const metadata: Metadata = {
//   title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
//   description: "This is Next.js Signin Page TailAdmin Dashboard Template",
// };

const WithdrawC: React.FC = () => {
    const wallet = useWallet();
    const { publicKey, signAllTransactions, sendTransaction } = useWallet();

    // const connection = new Connection('https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY_HERE');
    // const connection = new Connection('https://api.devnet.solana.com/');
    const { connection } = useConnection()
    const [messageApi, contextHolder] = Message.useMessage();

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
    // let [tokenList, setTokenList] = useState<any>(tList); //token list
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

    // let getTokensL = new getTokensList; //get wallet token list

    const owner = publicKey || undefined;
    // const owner: Keypair = Keypair.fromSecretKey(Uint8Array.from(bs58.decode("43EeRipwq7QZurfASn7CnYuJ14pVaCEv7KWav9vknt1bFR6qspYXC2DbaC2gGydrVx4TFtWfyCFkEaLLLMB2bZoT")))
    // const txVersion = TxVersion.V0 // or TxVersion.LEGACY
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


    //ayad/////////////////////////////////////////////////////////////
    // const [mint, setMint] = useState<string | undefined>('');
    const [mint, setMint] = useState<string | undefined>(undefined);
    const [tokenOwner, setTokenOwner] = useState<string | undefined>(owner?.toBase58())
    const [ata, setAta] = useState('');
    const [withheld, setWithheld] = useState('');

    //Handle mint changes
    useEffect(() => {
        if (!mint || !tokenOwner) { return console.log('!mint || !tokenOwner') }

        getATADetails();

        async function getATADetails() {
            if (!mint || !tokenOwner) { return console.log('!mint || !tokenOwner') }
            const ATAdress = await getAssociatedTokenAddress(
                new PublicKey(mint),
                // payer.publicKey,
                // owner,
                new PublicKey(tokenOwner),
                false,
                TOKEN_2022_PROGRAM_ID
            );

            setAta(ATAdress.toBase58())
            console.log('ATAdress.toBase58(): ', ATAdress.toBase58())
            console.log('setAta: ', ata)
        }
    }, [mint])


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
        }, 15000);
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

    //Handle txId changes
    // useEffect(() => {
    //     // try {
    //     if (!txId) { return console.log('!txId') }
    //     //    get();
    //     setTimeout(get, 500) //call get function after 0.5 second
    //     // } catch (err) {console.log(err)}
    // }, [txId])

    //Handle txDetails changes
    useEffect(() => {
        if (!txDetails) { return console.log('!txDetails') }
        console.log('txDetails: ', txDetails);
        setMessage(txDetails.message) //transaction message
        if (txDetails.state == 'success') {
            showSuccessfulMessage(); //show successful message for 15 seccond
        }
        else if (txDetails.state == 'error') {
            showErrorMessage(); //show error message for 10 seccond
        }
    }, [txDetails])



    //Get transaction details
    // async function get() {
    //     const txD = await getTransaction(connection, txId)
    //     if (!txD) { return console.log('!txD') }
    //     setTxDetails(txD)
    // }

    //Start withdraw action
    async function withdrawf(event: any) {
        event.preventDefault(); //to cancell page reload
        await withdrawF();
    }

    async function withdrawF() {
        if (!publicKey || !mint) { return console.log('!publicKey') }
        const balance = await connection.getBalance(publicKey);
        if (balance < 10000000) { // 0.01 SOL
            setTxDetails({
                state: 'error',
                message: 'Not enough SOL in payer account, please fund your wallet'
            })
            return console.error('Not enough SOL in payer account, please fund your wallet');
        }

        const allAccounts = await connection.getProgramAccounts(TOKEN_2022_PROGRAM_ID, {
            commitment: 'confirmed',
            filters: [
                {
                    memcmp: {
                        offset: 0,
                        //   bytes: mint.toString(),
                        bytes: mint,
                    },
                },
            ],
        });

        const accountsToWithdrawFrom = [];

        for (const accountInfo of allAccounts) {
            const account = unpackAccount(
                accountInfo.pubkey,
                accountInfo.account,
                TOKEN_2022_PROGRAM_ID
            );

            // We then extract the transfer fee extension data from the account
            const transferFeeAmount = getTransferFeeAmount(account);

            if (
                transferFeeAmount !== null &&
                transferFeeAmount.withheldAmount > BigInt(0)
            ) {
                accountsToWithdrawFrom.push(accountInfo.pubkey);
            }
        }

        if (accountsToWithdrawFrom.length === 0) {
            setTxDetails({
                state: 'error',
                message: 'No accounts to withdraw from: no transfers have been made'
            })
            return console.error('No accounts to withdraw from: no transfers have been made');
        } else {
            console.log('Found', accountsToWithdrawFrom.length, 'accounts to withdraw from 🤑');
            console.log('accountsToWithdrawFrom: ', accountsToWithdrawFrom) //ayad
        }

        const withdrawWithheldAuthority = Keypair.fromSecretKey(
            // new Uint8Array(withheld)
            new Uint8Array(bs58.decode(withheld))
        );

        // const withdrawTokensSig = await withdrawWithheldTokensFromAccounts(
        //     connection, // connection to use
        //     owner, // payer of the transaction fee
        //     new PublicKey(mint), // the token mint
        //     // recipientKeypair.publicKey, // the destination account
        //     new PublicKey(ata),  // the destination account
        //     withdrawWithheldAuthority, // the withdraw withheld token authority
        //     [], // signing accounts
        //     accountsToWithdrawFrom, // source accounts from which to withdraw withheld fees
        //     undefined, // options for confirming the transaction
        //     TOKEN_2022_PROGRAM_ID // SPL token program id
        // );

        // console.log(
        //     'Bag secured, check it:',
        //     `https://solana.fm/tx/${withdrawTokensSig}?cluster=devnet-solana`
        // );

        const instruction = createWithdrawWithheldTokensFromAccountsInstruction(
            new PublicKey(mint), // the token mint
            new PublicKey(ata),  // the destination account
            withdrawWithheldAuthority.publicKey, // the withdraw withheld token authority
            [], // signing accounts
            accountsToWithdrawFrom, // source accounts from which to withdraw withheld fees
            TOKEN_2022_PROGRAM_ID // SPL token program id
        );
        const transaction = new Transaction()
        .add(instruction);
            // .add(feeVaultAccountInstruction, instruction);

        const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.feePayer = publicKey;
        try {
            let transactionSignature = await sendTransaction(transaction, connection);
            console.log("Transaction Signature", transactionSignature);
            setTxId(String(transactionSignature))
            setTxDetails({
                state: 'success',
                message: 'Withdraw successful'
            })
        } catch (error) {
            console.error("Transaction failed", error);
            setTxDetails({
                state: 'error',
                message: 'Withdraw unsuccessful'
            })
        }
    }

    return (
        <>
            <div ref={messageRef}></div> {/*scroll to this emty dev*/}
            {/* <div ref={messageRef}></div>  */}
            {successful && Successful(message, txId)} {/*sccessful message*/}
            {/* {error && Error(message, details, messageRef)} error message */}
            {error && Error(message, undefined, txId)}

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
                                Withdraw Token Fee
                            </h2>

                            <form onSubmit={(event) => withdrawf(event)}>
                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Token Mint
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter token mint address"
                                            // step="0.000000001"
                                            onChange={(e) => setMint(String(e.target.value))}
                                            // defaultValue={tokenOneAmount}
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Token Owner
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter token owner address"
                                            // step="0.000000001"
                                            onChange={(e) => setTokenOwner(String(e.target.value))}
                                            defaultValue={tokenOwner}
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        {`Recipient (Associated Token Address)`}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Enter recipient address"
                                            // step="0.000000001"
                                            onChange={(e) => setAta(String(e.target.value))}
                                            defaultValue={ata}
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="mb-2.5 block font-medium text-black dark:text-white">
                                        Withdraw Withheld Authority
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            placeholder="Enter withdraw withheld wuthority keypair"
                                            // step="0.000000001"
                                            onChange={(e) => setWithheld(String(e.target.value))}
                                            // defaultValue={tokenTwoAmount}
                                            required
                                            className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
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
                                <div>
                                    <p>{mint}</p>
                                    <p>{tokenOwner}</p>
                                    <p>{ata}</p>
                                    <p>{withheld}</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WithdrawC;



/*
accountsToWithdrawFrom: "94aKctbsWoHiwcJZvKuU2oiuosmppNobyVjjkHfRduRv"
Transaction Signature 2vPiJkV1GoCxSi5jCK7cczYuG6gmQfpJGw1UGShEbLR7sBkEDocBdXjwfSdMXcdiV3HqnuntGkU5ThCXaC7SeuV2
 */