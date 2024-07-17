
"use client"
import React, { useEffect } from 'react';

import { useParams } from 'next/navigation';

function Pools() {
    const path = useParams
    useEffect(() => {
        getPools();
    })

    const getPools = async () => {
        const url = 'https://serverless-fy6j77er0-ayads-projects.vercel.app';
        const searchParam = {
            page: 1,
            perPage: 3,
        }
    
        try {
            const pools = await ( await fetch(
                // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
                // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
                // `http://localhost:3000/api/pools?page=1&perPage=3`  
                // `https://serverless-qyjftt2jf-ayads-projects.vercel.app/api/pools?page=1&perPage=3` //https://serverless-qyjftt2jf-ayads-projects.vercel.app
                // `http://localhost:3000/api/pools?page=1&perPage=3`
                `/api/pools?page=1&perPage=3`
            )
            ).json();
//               //Create fetch's options
//   const options = {
//     mode: 'cors',
//     method: 'GET',
//     credentials: 'include',
//     headers: {
//        'Content-Type': 'application/json',
//        Origin: `https://google.com/`,
//     }
//  }

//  //Fetch data from the API
//  const res = await fetch('changeForYouURL', options);

            // const pools = await ( await fetch(
            //     // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
            //     // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
            //     `https://serverless-fy6j77er0-ayads-projects.vercel.app/api/pools?page=1&perPage=3`  
            //     , {mode: 'cors', method: 'GET', 
            //         headers: {
            //                'Content-Type': 'application/json',
            //                Origin: `http://localhost:3000`,
            //         }
            //     }
            // )
            // ).json();

            console.log(pools)
        } catch (error) {
            console.log('error', error)
        }
        // const pools = await ( await fetch(
        //     // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        //     // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        //     `https://serverless-278sktyk2-ayads-projects.vercel.app/api/pools?page=1&perPage=3`    
        // )
        // ).json();
    
        // const pools = await fetch(
        //     // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        //     // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        //     `https://serverless-278sktyk2-ayads-projects.vercel.app/api/pools?page=1&perPage=3`    
        // )
    
        // const pools = await( await fetch('https:serverless-278sktyk2-ayads-projects.vercel.app/api/pools?page=1&perPage=3', {
        //     headers:{
        //       accept: 'application/json',
        //       'User-agent': 'learning app',
        //     }
        //   })).json();
    
        // const pools = fetch(
        //     // `${url}/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        //     // `${url}/api/pools?page=${searchParam.page}&perPage=${searchParam.perPage}`
        //     `https://serverless-278sktyk2-ayads-projects.vercel.app/api/pools?page=1&perPage=3`    
        // )
        // // .then(res => console.log(res))
        // .then(function(serverPromise){ 
        //     serverPromise.json()
        //       .then(function(j) { 
        //         console.log(j); 
        //       })
        //       .catch(function(e){
        //         console.log(e);
        //       });
        // })
    
        // .catch(function(e){
        //       console.log(e);
        // });
    
        // console.log(pools)
    }
    return (
        <h1>Hello world</h1>
    )
}
export default Pools;