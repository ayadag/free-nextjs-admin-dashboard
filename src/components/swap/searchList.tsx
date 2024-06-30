// import styles from './swap.module.css';
// import tokenList from '../../app/swap/tokenList.json';

// const searchList = (tokenListSearch: any) => {
//     function modifyToken(i: any){
//         // setPrices(null);
//         setTokenOneAmount(0);
//         setTokenTwoAmount(0);
//         if (changeToken === 1) {
//             /////ayad/////
//             if(tokenTwoN == i){
//                 setTokenTwo(tokenOne);
//                 // tokenTwoN = tokenOneN;
//                 setTokenTwoN(tokenOneN);
//             }
            
//             setTokenOne(tokenList[i]);
//             setTokenOneN(i);
//         //   fetchPrices(tokenList[i].address, tokenTwo.address)
//         } else {
//             ////ayad//////
//             if(tokenOneN == i) {
//                 setTokenOne(tokenTwo);
//                 //tokenOneN = tokenTwoN;
//                 setTokenOneN(tokenTwoN);
//             }
            
//             setTokenTwo(tokenList[i]);
//             setTokenTwoN(i);
//         //  fetchPrices(tokenOne.address, tokenList[i].address)
//         }
//         setIsOpen(false);
//     }
//     return(
//         <div>
//             {tokenListSearch?tokenListSearch?.map((e: any, i: any) => {
//                           return (
//                           <div
//                               className={styles.tokenChoice}
//                               key={i}
//                               onClick={() => modifyToken(i)}
//                           >
//                               <img src={e.img} alt={e.ticker} className={styles.tokenLogo} />
//                               <div className={styles.tokenChoiceNames}>
//                                   <div className={styles.tokenName}>{e.name}</div>
//                                   <div className={styles.tokenTicker}>{e.ticker}</div>
//                               </div>
//                           </div>
//                           );
//                       })

//                       :tokenList?.map((e: any, i: any) => {
//                           return (
//                           <div
//                               className={styles.tokenChoice}
//                               key={i}
//                               onClick={() => modifyToken(i)}
//                           >
//                               <img src={e.img} alt={e.ticker} className={styles.tokenLogo} />
//                               <div className={styles.tokenChoiceNames}>
//                                   <div className={styles.tokenName}>{e.name}</div>
//                                   <div className={styles.tokenTicker}>{e.ticker}</div>
//                               </div>
//                           </div>
//                           );
//                       })}
//         </div>
//     )
// }
// export default searchList;