const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    Account,
   } = require("@solana/web3.js");

const newPair = new Keypair(); //used to create wallet
//newPair is a wallet object of type Keypair and can be used to drop crypto into this wallet

const myPublicKey = new PublicKey(newPair._keypair.publicKey).toString(); //public key of the wallet which can be used to uniquely id the wallet over the blockchain
const mySecretKey = newPair._keypair.secretKey; //secret key used for transactions in the wallet

const getWalletBalance = async() => {
    try{
        const connection = new Connection(clusterApiUrl("devnet"),"confirmed"); //connection object can be used to get balance
        //devnet is a replica of the main network of solana that can be used by devs to test the features of solana. clusterApiUrl gives us the url of the devnet to be used for the connection object.
        const myWallet = await Keypair.fromSecretKey(mySecretKey); //creates a wallet object from secretkey
        const walletBalance = await connection.getBalance(
            new PublicKey(myWallet.publicKey) //get wallet balance for this public key of the wallet
        );
        console.log("The public key used was " + myPublicKey);
        console.log("Wallet balance: " + parseInt(walletBalance)/LAMPORTS_PER_SOL +"SOL");
    }catch (err){
        console.log(err);
    }
}

//airdrop sol to wallet max 2 at a time
const airDrop = async() => {
    try{
        const connection = new Connection(clusterApiUrl("devnet"),"confirmed");
        const myWallet = await Keypair.fromSecretKey(mySecretKey);

        //Now, we first create an airdrop signature using the wallet details and the amount of SOL we want to airdrop (you can airdrop at max 2SOL in one transaction). We then await a confirmation for the transaction from the network.

        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(myWallet.publicKey),
            2*LAMPORTS_PER_SOL
        );
        await connection.confirmTransaction(fromAirDropSignature);
    }catch(err){
        console.log(err);
    }
}

const driverFunction = async () => {
    await getWalletBalance();
    await airDrop();
    await getWalletBalance();
}
driverFunction();


