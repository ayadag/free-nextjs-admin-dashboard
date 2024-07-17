import { Connection } from '@solana/web3.js';

export type TxDetail = {
  state: 'success' | 'error',
  code?: string,
  message: string
}

const errorMessages = {
  '0x0': 'Account Address already in use',
  '0x1779': 'Init lp amount is too less(Because 100 amount lp will be locked), you need to increase tokens amount.',
  '0xbc4': 'The program expected this account to be already initialized.',
  '0x1772': 'Input token account empty.',
}

// const tx1 = '3xUQDeMRGpdGgWNPu8FyC35NF8GRup9qvexBUut9URfgdALeyKPy6eKFtBxwpTkkLXpFT4bFFhFNttkuRgJ53U6k' //Error Message: Init lp amount is too less(Because 100 amount lp will be locked).
// const tx1 = '4ErUNa82UKs8NNfqNRmf5fqzBe3tBR3g8SNkPn5tkPoH58ab1bMkz9DponK5pmT2HviV54RuRa5AMAT1QvonNcGR' //success
// const tx1 = 'Rjb7wHpgwr57kuFRwHUqFyDgKLBCDUSf9iyRMxcyzUUPa4hV7MHhbu7R3eWASwk5HWY4ioFbQYh9XZSDJpC2Naa' //already in use
// const tx1 = '3G5nvdDws8GnvV9YRg1qaDmogSJRzeW8MxKAkvmfNYRL4xhcec74hkcVdehkbEmY6PX5RCHtq9JEkDUDYwbSUkNr' //Message: The program expected this account to be already initialized.
// const connection1 = new Connection('https://api.devnet.solana.com/')

export async function getTransaction(connection:Connection, tx:string) {
  const txDetails = await connection.getTransaction(tx, {"maxSupportedTransactionVersion": 0});
  let txDetail: TxDetail;
  // console.log('tx: ', tx)
  // console.log('txDetails', txDetails);
  if(txDetails != null && txDetails?.meta?.err == null) {
    // console.log('Pool created successfully')
    txDetail = {
      state: 'success',
      message: 'Pool created successfully',
    }
    return txDetail;
  }
  // if(txDetails?.meta?.err != null) if(txDetails?.meta?.logMessages) console.log(txDetails?.meta?.logMessages[58]);
  else if (txDetails?.meta?.err != null) { 
    const len = txDetails?.meta?.logMessages?.length
    if(txDetails?.meta?.logMessages && len) {
      const errorC = txDetails?.meta?.logMessages[len-1].split('Program 97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo failed: custom program error: ');
      const errorCode = errorC[1]
      // console.log('Error code: ', errorCode)
      // console.log('Error messages: ', 
      //   errorCode == '0x0' ? errorMessages['0x0']
      //   : errorCode == '0x1779' ? errorMessages['0x1779']
      //   : errorCode == '0xbc4' ? errorMessages['0xbc4']
      //   : 'An Error happen'
      // )

      errorCode == '0x0' ? txDetail = {
        state: 'error',
        code: errorCode,
        message: errorMessages['0x0'],
      }
      : errorCode == '0x1779' ? txDetail = {
        state: 'error',
        code: errorCode,
        message: errorMessages['0x1779'],
      }
      : errorCode == '0xbc4' ? txDetail = {
        state: 'error',
        code: errorCode,
        message: errorMessages['0xbc4'],
      }
      : errorCode == '0x1772' ? txDetail = {
        state: 'error',
        code: errorCode,
        message: errorMessages['0x1772'],
      }
      : txDetail = {
        state: 'error',
        message: 'An Error happen',
      }

      return txDetail;
    }
  }
  else {
    txDetail = {
      state: 'error',
      message: 'Unkown',
    }
    return txDetail;
  }
}

// async function get() {
//   const res = await getTransaction(connection1, tx1);
//   console.log(res)
// }

// get()
