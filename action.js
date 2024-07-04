const { Connection, PublicKey, Transaction, SystemProgram, Keypair } = require('@solana/web3.js');

const YOUR_WALLET_ADDRESS = '7xUyZbcLWc9TvhBLWcPH7VUFVtcuVvMG7faCqPjFaFbo'; // Replace with your actual wallet address

async function handleGet(req, res) {
  res.json({
    name: "View Website and Send SOL",
    description: "View a website by sending 1$ worth of SOL",
    icon: "https://example.com/icon.png",
    parameters: [],
  });
}

async function handlePost(req, res) {
  try {
    const connection = new Connection('https://api.devnet.solana.com');

    if (!req.body.wallet) {
      return res.status(400).json({ error: 'Wallet address is required' });
    }

    let fromPubkey;
    try {
      fromPubkey = new PublicKey(req.body.wallet);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid wallet address provided' });
    }

    const amountInLamports = 1000000; // This is an example amount, not exactly $1

    // Get a recent blockhash
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    // Create a new keypair for the fee payer
    const feePayer = Keypair.generate();

    const transaction = new Transaction();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = feePayer.publicKey;
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: fromPubkey,
        toPubkey: new PublicKey(YOUR_WALLET_ADDRESS),
        lamports: amountInLamports,
      })
    );

    const serializedTransaction = transaction.serialize({ requireAllSignatures: false });

    res.json({
      transaction: serializedTransaction.toString('base64'),
      website_url: "https://your-website-url.com", // URL to your website
    });
  } catch (error) {
    console.error('Error in handlePost:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
}

module.exports = { handleGet, handlePost };
