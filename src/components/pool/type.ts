export type Pool = {
    poolId: string, //"BjWinURsx9WnAW2XrCYXx7ZiWfX3GsS9z8ZvFwsDsUo4"
    programId?: string, //"97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo"
    poolCreator?: string, //"hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus"
    configId?: string, //"Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK"
    mintA: string, //"uBAsEVJJh8GKj6m5jXqLzWkB4PuysMpxmwFxDDk5Qdz"
    mintProgramA: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultA?: string, //"3fBVQc6JYf59gyU5m798q2qDpTdZjgt4qLpPfuzAcRBk"
    mintB: string, //"DYd2TX2skjBzSKdcciMZpPKXh1nV75vm9jSyEtws3Vwb"
    mintProgramB: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultB?: string, //"BobvpVczCcqiTuwkuSjvr2D6WYovcjXHKMUN3qJnPnpz"
    bump?: number, //254
    status?: number, //0
    lpAmount?: number, //10488
    openTime?: number, //1721191830
    poolPrice: string //"0.90909090909090909091"
}

export type PoolLogoURI = {
    poolId: string, //"BjWinURsx9WnAW2XrCYXx7ZiWfX3GsS9z8ZvFwsDsUo4"
    programId?: string, //"97MQhx2fniaNsQgC4G2M6tLUQBah1etEnhsKe1aMCXbo"
    poolCreator?: string, //"hCjWAhZNZ4z8gSKhokcZ3HFW761Bb2WhVkmemmajCus"
    configId?: string, //"Co1iQhsPe6HFp3ppdWhbhp1yX7Epkgt7A2aps4LkZWkK"
    mintA: string, //"uBAsEVJJh8GKj6m5jXqLzWkB4PuysMpxmwFxDDk5Qdz"
    mintProgramA: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultA?: string, //"3fBVQc6JYf59gyU5m798q2qDpTdZjgt4qLpPfuzAcRBk"
    mintB: string, //"DYd2TX2skjBzSKdcciMZpPKXh1nV75vm9jSyEtws3Vwb"
    mintProgramB: string, //"TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    vaultB?: string, //"BobvpVczCcqiTuwkuSjvr2D6WYovcjXHKMUN3qJnPnpz"
    bump?: number, //254
    status?: number, //0
    lpAmount?: number, //10488
    openTime?: number, //1721191830
    poolPrice: string, //"0.90909090909090909091"
    tokenAMetadata: {
        name: String,
        symbol: String,
        logoURI: string,
    }
    tokenBMetadata: {
        name: String,
        symbol: String,
        logoURI: string,
    }
}