import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import axios from 'axios';
import Image from 'next/image';

// import { useRouter } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import {
  createCreateMetadataAccountV3Instruction,
  PROGRAM_ID,
} from '@metaplex-foundation/mpl-token-metadata-2';
// import {
//   AuthorityType,
//   createAssociatedTokenAccountInstruction,
//   createInitializeMintInstruction,
//   createMintToInstruction,
//   createSetAuthorityInstruction,
//   getAssociatedTokenAddress,
//   getMinimumBalanceForRentExemptMint,
//   MINT_SIZE,
// } from '@solana/spl-token';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createInitializeTransferFeeConfigInstruction,
  createMintToInstruction,
  ExtensionType,
  getAssociatedTokenAddress,
  getMinimumBalanceForRentExemptMint,
  getMintLen,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token-3';
import {
  useConnection,
  useWallet,
} from '@solana/wallet-adapter-react';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';

import Error from '../alert/error';
// import { notify } from '../../utils/notifications';
import { Successful } from '../alert/successful';

type Token = {
  name: string,
  symbol: string,
  decimals: number | undefined,
  amount: number | undefined,
  image: string,
  description: string,
}
const TOKEN_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');//ayad, TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb  2022spl-token
export const Create: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  // const { networkConfiguration } = useNetworkConfiguration();

  const [tokenUri, setTokenUri] = useState("");
  const [tokenMintAddress, setTokenMintAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [enabled, setEnabled] = useState(false); //ayad
  const [image, setImage] = useState(); //ayad

  const [token, setToken] = useState<Token>({
    name: "",
    symbol: "",
    decimals: Number(''),
    amount: Number(''),
    image: "",
    description: "",
  });
  const [successful, setSuccessful] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('Token create successfully');
  const [txid, setTxid] = useState<string>('3AnaX234ysBdwBxD8YMqgV2afbjkJswKVp7YPnkLM7jjgBx5VxV4odNEXaxxtqjE5js5G14e9YeLrusZ7CtGAZ7v');
  const [error, setError] = useState<boolean>(false);
  const [details, setDetails] = useState<string>(''); //Error message details

  // const messageRef = useRef<null | HTMLElement>(null); //ref to scroll
  const messageRef = useRef<any>(null); //ref to scroll
  // const router = useRouter();

  const payer = publicKey;
  const mintKeypair = Keypair.generate();
        // Address for Mint Account
  const mint = mintKeypair.publicKey;

        // Transaction signature returned from sent transaction
  let transactionSignature: string;

        // Authority that can mint new tokens
  const mintAuthority = publicKey;
  const decimals = 9;

  // if(!connection || !publicKey){return console.log('!connection || !publicKey')}

  //scroll effect whenever the message change
  useEffect(() => {
    messageRef.current?.scrollIntoView();
  }, [error,txid]);

  const handleFormFieldChange = (fieldName: any, e: any) => {
    setToken({ ...token, [fieldName]: e.target.value });
  };

  const showSuccessfulMessage= () => {
    // window.scroll({
    //   top:0, //scroll to the top of page
    //   behavior: 'smooth'
    // })
    setSuccessful(true) //show successful message
    // messageRef.current?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      setSuccessful(false); //hide successful message after 15s
    }, 15000);
  };

  const showErrorMessage= () => {
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

  //CREATE TOKEN FUNCION
  const createToken = useCallback(
    async (token: Token) => {
      if (!connection || !publicKey) { return console.log('!connection || !publicKey') }

      const lamports = await getMinimumBalanceForRentExemptMint(connection);
      const mintKeypair = Keypair.generate();
      const tokenATA = await getAssociatedTokenAddress(
        mintKeypair.publicKey,
        publicKey
      );
      // showSuccessful(); //show sccessful message

      try {
        console.log('token: ', token)
        const metadataUrl = await uploadMetadata(token);
        if (!metadataUrl) { return console.error('!metadataUrl') }
        console.log(metadataUrl);

        const createMetadataInstruction = createCreateMetadataAccountV3Instruction({
          metadata: PublicKey.findProgramAddressSync([
            Buffer.from("metadata"),
            PROGRAM_ID.toBuffer(),
            mintKeypair.publicKey.toBuffer(),
          ],
            PROGRAM_ID
          )[0],
          mint: mintKeypair.publicKey,
          mintAuthority: publicKey,
          payer: publicKey,
          updateAuthority: publicKey,
          },
          {
            createMetadataAccountArgsV3: {
              data: {
                name: token.name,
                symbol: token.symbol,
                uri: metadataUrl,
                creators: null,
                sellerFeeBasisPoints: 0,
                uses: null,
                collection: null,
              },
              isMutable: false,
              collectionDetails: null,
            },
        });
        /////////////////////////////////////////////
        const transferFeeConfigAuthority = new PublicKey(publicKey);
        const withdrawWithheldAuthority = new PublicKey(publicKey);
        const feeBasisPoints = 300;
        const maxFee = BigInt(100);
        const mintLen = getMintLen([ExtensionType.MetadataPointer, ExtensionType.TransferFeeConfig]);

        // Minimum lamports required for Mint Account
        // const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataExtension + metadataLen);

        // Instruction to invoke System Program to create new account
        if(!payer){return console.log('!payer')}
        const createAccountInstruction = SystemProgram.createAccount({
          fromPubkey: payer, // Account that will transfer lamports to created account
          newAccountPubkey: mint, // Address of the account to create
          space: mintLen, // Amount of bytes to allocate to the created account
          lamports, // Amount of lamports transferred to created account
          programId: TOKEN_2022_PROGRAM_ID, // Program assigned as owner of created account
        });

        // Instruction to initialize Metadata Pointer Extension
        // const initializeMetadataPointerInstruction =
        //     createInitializeMetadataPointerInstruction(
        //         mint, // Mint Account address
        //         updateFromUser, // Authority that can set the metadata address
        //         mint, // Account address that holds the metadata
        //         TOKEN_2022_PROGRAM_ID
        // );

        // Instruction to initialize TransferFeeConfig Extension
        const initializeTransferFeeConfig =
            createInitializeTransferFeeConfigInstruction(
                mint, // Mint Account address
                transferFeeConfigAuthority, // Authority to update fees
                withdrawWithheldAuthority, // Authority to withdraw fees
                feeBasisPoints, // Basis points for transfer fee calculation
                maxFee, // Maximum fee per transfer
                TOKEN_2022_PROGRAM_ID // Token Extension Program ID
        );

        // Instruction to initialize Mint Account data
        if(!mintAuthority){return console.log('!mintAuthority')}
        const initializeMintInstruction = createInitializeMintInstruction(
          mint, // Mint Account Address
          decimals, // Decimals of Mint
          mintAuthority, // Designated Mint Authority
          null, // Optional Freeze Authority
          TOKEN_2022_PROGRAM_ID // Token Extension Program ID
        );

        // Instruction to initialize Metadata Account data
        // const initializeMetadataInstruction = createInitializeInstruction({
        //   programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        //   metadata: mint, // Account address that holds the metadata
        //   updateAuthority: updateFromUser, // Authority that can update the metadata
        //   mint: mint, // Mint Account address
        //   mintAuthority: mintAuthority, // Designated Mint Authority
        //   name: metaData.name,
        //   symbol: metaData.symbol,
        //   uri: metaData.uri,
        // });

        // const updateFieldInstruction = createUpdateFieldInstruction({
        //   programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        //   metadata: mint, // Account address that holds the metadata
        //   updateAuthority: updateFromUser, // Authority that can update the metadata
        //   field: metaData.additionalMetadata[0][0], // key
        //   value: metaData.additionalMetadata[0][1], // value
        // });
        // const updateFieldInstruction2 = createUpdateFieldInstruction({
        //   programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        //   metadata: mint, // Account address that holds the metadata
        //   updateAuthority: updateFromUser, // Authority that can update the metadata
        //   field: metaData.additionalMetadata[1][0], // key
        //   value: metaData.additionalMetadata[1][1], // value
        // });
        // const updateFieldInstruction3 = createUpdateFieldInstruction({
        //   programId: TOKEN_2022_PROGRAM_ID, // Token Extension Program as Metadata Program
        //   metadata: mint, // Account address that holds the metadata
        //   updateAuthority: updateFromUser, // Authority that can update the metadata
        //   field: metaData.additionalMetadata[2][0], // key
        //   value: metaData.additionalMetadata[2][1], // value
        // });

        // const owner = new PublicKey(event.target.owner.value);
        const owner = publicKey;
        const mintAmount = BigInt(40_000_000 * Math.pow(10, decimals));

        const transaction = new Transaction().add(
          createAccountInstruction,
          // initializeMetadataPointerInstruction,
          initializeTransferFeeConfig,
          initializeMintInstruction,
          // initializeMetadataInstruction,
          // updateFieldInstruction,
          // updateFieldInstruction2,
          // updateFieldInstruction3

          createMetadataInstruction //ayad
        );

        const { blockhash, lastValidBlockHeight } =    await connection.getLatestBlockhash();
        transaction.recentBlockhash = blockhash;
        transaction.lastValidBlockHeight = lastValidBlockHeight;
        transaction.feePayer = publicKey;

        try {
          const serializedTransaction = transaction.serialize({    requireAllSignatures: false,
          });
          const base64 = serializedTransaction.toString("base64");
          console.log("TEST TX", base64);
          transactionSignature = await sendTransaction(
              transaction,
              connection,
              {signers: [mintKeypair]}
          );

          postMessage(
              `LET'S GOOO:"https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
          );
          //ayad/////////
          console.log("Mint Address", mint.toBase58());
          console.log("Transaction Signature", transactionSignature);

      }
      catch (error) {
          console.error("Transaction failed", error);
      }
      // console.log("Mint Address", mint.toBase58());
        // console.log("Transaction Signature", transactionSignature);

      // Create associated token account
    const ATAdress = await getAssociatedTokenAddress(
        mint,
        payer,
        false,
        TOKEN_2022_PROGRAM_ID
    );
    console.log("ATA", ATAdress.toBase58());
    console.log("Mint", mint.toBase58());
    // Instruction to create associated token account
    const ATA = createAssociatedTokenAccountInstruction(
        publicKey,
        ATAdress,
        publicKey,
        mintKeypair.publicKey,
        TOKEN_2022_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
    );
    console.log("ATA2", ATA);

    // Instruction to mint tokens to associated token account
    const mintToInstruction = createMintToInstruction(
        mint, // Mint Account address
        ATAdress, // Mint to
        mintAuthority, // Mint Authority address
        mintAmount, // Amount
        [], // Additional signers
        TOKEN_2022_PROGRAM_ID // Token Extension Program ID
    );

    // Transaction to create associated token account and mint tokens
    const transaction2 = new Transaction().add(
        ATA,
        mintToInstruction
    );
    const {
        blockhash: blockhash2,
        lastValidBlockHeight: lastValidBlockHeight2
    } = await connection.getLatestBlockhash();

    transaction2.recentBlockhash = blockhash2;
    transaction2.lastValidBlockHeight = lastValidBlockHeight2;
    transaction2.feePayer = publicKey;

    try {
        const serializedTransaction = transaction2.serialize(
            {
                requireAllSignatures: false,
            }
        );
        const base64 = serializedTransaction.toString("base64");
        console.log("TEST TX", base64);
        transactionSignature = await sendTransaction(
            transaction2,
            connection,
            {signers: []}
        );

        postMessage(
            `LET'S GOOO:"https://solana.fm/tx/${transactionSignature}?cluster=devnet-solana`
        );
    }
    catch (error) {
        console.error("Transaction failed", error);
    }

        // const createNewTokenTransaction = new Transaction().add(
        //   SystemProgram.createAccount({
        //     fromPubkey: publicKey,
        //     newAccountPubkey: mintKeypair.publicKey,
        //     space: MINT_SIZE,
        //     lamports: lamports,
        //     programId: TOKEN_PROGRAM_ID,
        //   }),
        //   createInitializeMintInstruction(
        //     mintKeypair.publicKey,
        //     Number(token.decimals),
        //     publicKey,
        //     publicKey,
        //     TOKEN_PROGRAM_ID
        //   ),
        //   createAssociatedTokenAccountInstruction(
        //     publicKey,
        //     tokenATA,
        //     publicKey,
        //     mintKeypair.publicKey
        //   ),
        //   createMintToInstruction(
        //     mintKeypair.publicKey,
        //     tokenATA,
        //     publicKey,
        //     Number(token.amount) * Math.pow(10, Number(token.decimals))
        //   ),
        //   createMetadataInstruction,

        //   //ayad//////////////////
        //   createSetAuthorityInstruction(
        //     mintKeypair.publicKey, // mint acocunt || token account
        //     // tokenATA,
        //     publicKey, // current auth
        //     AuthorityType.FreezeAccount, // authority type
        //     null
        //   )
        // );

        // const signature = await sendTransaction(
        //   createNewTokenTransaction,
        //   connection,
        //   {
        //     signers: [mintKeypair],
        //   }
        // );

        // setTokenMintAddress(mintKeypair.publicKey.toString());
        //   // notify({
        //   //     type: "success",
        //   //     message: "Token create successfully",
        //   //     txid: signature,
        //   // });
        
        // setMessage('Token create successfully');
        // setTxid(`${signature}`);
        // showSuccessfulMessage(); //show successful message for 10 seccond
        // console.log('Token create successfully txid: ', signature); //ayad
      } catch (error: any) {
          // notify({ type: "error", message: "Token Creation failed, try later" });
          setMessage('Token Creation failed, try later')
          showErrorMessage()
          console.error('Token Creation failed, try later') //ayad
      }
      setIsLoading(false);
    },
    [publicKey, connection, sendTransaction]
  );

  //IMAGE UPLOAD IPFS
  const handleImageChange = async (event: any) => {
    const file = event.target.files[0];

    if (file) {
      const imgUrl = await uploadImagePinata(file);
      if (!imgUrl) { return console.error('!imgUrl') }
      setToken({ ...token, image: imgUrl });
      //   setImage(event.target.files[0]); //ayad
    }
    //////ayad
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
    // else {setImage(undefined)}  //deleate image
    ///////ayad///////////
  };

  const uploadImagePinata = async (file: any) => {
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: "6668ea235b402194ceba",
            pinata_secret_api_key: "0b71fe595e053c9829ad2bb224d2d7ef33f3d8bb50d2b4da03cbe209dd739920",
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        // console.log('ImgHash: ', ImgHash)
        return ImgHash;
      } catch (error: any) {
        //   notify({ type: "error", message: "Upload image failed" });
        setMessage('Upload image failed')
        showErrorMessage()
        console.error('Upload image failed')
      }
      setIsLoading(false);
    }
  };

  //METADATA
  const uploadMetadata = async (token: Token) => {
    setIsLoading(true);
    const { name, symbol, description, image } = token;
    if (!name || !symbol || !description || !image) {
      //   return notify({ type: "error", message: "Data Is Missing" });
      setMessage('Data Is Missing')
      showErrorMessage()
      return console.error('Data Is Missing: !name || !symbol || !description || !image',
        token.name,
        token.symbol,
        token.description,
        token.image
      )
    }

    const data = JSON.stringify({
      name: name,
      symbol: symbol,
      description: description,
      image: image,
    });

    try {
      const response = await axios({
        method: "POST",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers: {
          pinata_api_key: "6668ea235b402194ceba",
          pinata_secret_api_key: "0b71fe595e053c9829ad2bb224d2d7ef33f3d8bb50d2b4da03cbe209dd739920",
          "Content-Type": "application/json",
        },
      });

      const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      return url;
    } catch (error: any) {
      //   notify({ type: "error", message: "Upload to Pinnata Json failed" });
      setMessage('Upload to Json data failed')
      showErrorMessage()
      console.error('Upload to Pinnata Json failed')
    }
    setIsLoading(false);
  };
  return (
    <>
      <div ref={messageRef}></div> {/*scroll to this emty dev*/}
      <Breadcrumb pageName="CreateTokenV1" />
      {/* <div ref={messageRef}></div>  */}
      {successful && Successful(message, txid)} {/*sccessful message*/}
      {/* {error && Error(message, details, messageRef)} error message */}
      {error && Error(message, details)} 
      

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
      {/* <Successful/> */}
        <div className="flex flex-col gap-9">
          {/* <!-- Main Input Details --> */}
          {/* {mainInput && */}
          {/* <Successful/> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Main Details
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Image
                </label>
                <input
                  type="file"
                  className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                  onChange={handleImageChange}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) =>
                    handleFormFieldChange
                      ("name", e)}
                  required
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Symbol
                </label>
                <input
                  type="text"
                  placeholder="Symbol"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) =>
                    handleFormFieldChange
                      ("symbol", e)}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Description"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) => handleFormFieldChange("description", e)}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Supply
                </label>
                <input
                  type="number"
                  placeholder="Supply"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) =>
                    handleFormFieldChange
                      ("amount", e)}
                />
              </div>

              <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  Descimals
                </label>
                <input
                  type="number"
                  placeholder="Descimals"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                  onChange={(e) =>
                    handleFormFieldChange
                      ("decimals", e)}
                />
              </div>

            </div>
          </div>
          {/* } */}

          {/* <!-- Extensions switch --> */}
          {/* <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Extensions
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">
              <div>
                <label
                  htmlFor="toggle3"
                  className="flex cursor-pointer select-none items-center"
                >
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="toggle3"
                      className="sr-only"
                      onChange={() => {
                        setEnabled(!enabled);
                      }}
                    />
                    <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
                    <div
                      className={`dot absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${enabled && "!right-1 !translate-x-full !bg-primary dark:!bg-white"
                        }`}
                    >
                      <span className={`hidden ${enabled && "!block"}`}>
                        <svg
                          className="fill-white dark:fill-black"
                          width="11"
                          height="8"
                          viewBox="0 0 11 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.0915 0.951972L10.0867 0.946075L10.0813 0.940568C9.90076 0.753564 9.61034 0.753146 9.42927 0.939309L4.16201 6.22962L1.58507 3.63469C1.40401 3.44841 1.11351 3.44879 0.932892 3.63584C0.755703 3.81933 0.755703 4.10875 0.932892 4.29224L0.932878 4.29225L0.934851 4.29424L3.58046 6.95832C3.73676 7.11955 3.94983 7.2 4.1473 7.2C4.36196 7.2 4.55963 7.11773 4.71406 6.9584L10.0468 1.60234C10.2436 1.4199 10.2421 1.1339 10.0915 0.951972ZM4.2327 6.30081L4.2317 6.2998C4.23206 6.30015 4.23237 6.30049 4.23269 6.30082L4.2327 6.30081Z"
                            fill=""
                            stroke=""
                            strokeWidth="0.4"
                          ></path>
                        </svg>
                      </span>
                      <span className={`${enabled && "hidden"}`}>
                        <svg
                          className="h-4 w-4 stroke-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          ></path>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div className='px-2'>Transfer Tax</div>
                </label>
              </div>
            </div>
          </div> */}

        </div>

        <div className="flex flex-col gap-9">
          {/* <!-- Textarea Fields --> */}
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white">
                Overview
              </h3>
            </div>
            <div className="flex flex-col gap-5.5 p-6.5">

              <div className='self-center'>
                {image && <span className="h-12 w-12 rounded-full">
                  <Image
                    width={112}
                    height={112}
                    // src={"/images/user/user-01.png"}
                    src={URL.createObjectURL(image)}
                    style={{
                      width: "auto",
                      height: "auto",
                    }}
                    alt="User"
                  />
                </span>}
              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  {`Name : ${token.name}`}
                </label>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  {`Symbol : ${token.symbol}`}
                </label>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  {`Description : ${token.description}`}
                </label>
                <label className="mb-0 block text-sm font-medium text-black dark:text-white">
                  {`Supply : ${token.amount}`}
                </label>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  {`Decimals : ${token.decimals}`}
                </label>

              </div>

              <div className='self-center'>
                <button
                  className="flex justify-center rounded bg-primary px-25 py-2 font-medium text-gray hover:bg-opacity-90"
                  type="submit"
                  //   onClick={() => onClick({decimals: Number(descimals), amount: Number(supply), metadata: metadata, symbol: symbol, tokenName: name})}
                  onClick={() => createToken(token)}
                >
                  Create
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  )
}  