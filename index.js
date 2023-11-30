const app = require('./utils/setup');
const { address, availableNetworks, provider, signer } = require('./utils/evm');
const { ethers } = require('ethers');
const Token = require('./Token.json');

app.get('/', (req, res) =>
  res.status(200).json({
    message: 'Hello World! My Ethereum wallet address is: ' + address(),
    availableNetworks: availableNetworks(),
  })
);
//contract location 0xCdc46d1e16c2Eb5832f3B69e0f8eb6993FdAF684
//network sepolia

const balance = async (network, address) => {
  const result = await provider(network).getBalance(address);
  return ethers.utils.formatEther(result);
};

const GetHashOf = async (address, network) => 
{
  const provider = await provider(network);
  const token = new ethers.Contract(
    Token.address,
    Token.abi,
    address
  );
  let chainHash = await token.HashOf(address);  
  return chainHash;
}

app
  .route('/balance/:network')
  .get(async (req, res) => {
    try {
      const { network } = req.params;
      const value = await balance(network, '0xCdc46d1e16c2Eb5832f3B69e0f8eb6993FdAF684');
      const hash = GetHashOf(network, '0xCdc46d1e16c2Eb5832f3B69e0f8eb6993FdAF684');
      res.status(200).json({
        message: 'My balance is ' + value + ' ethers',
        hash : hash
      });
    } catch (e) {
      const error = e.toString();
      res.status(400).json({ error });
    }
  })
  .post(async (req, res) => {
    try {
      const { network } = req.params;
      const { to, amount } = req.body;
      const value = ethers.utils.parseEther(amount);
      const tx = await signer(network).sendTransaction({ to, value });
      await tx.wait();
      res.status(200).json('ok');
    } catch (e) {
      const error = e.toString();
      res.status(400).json({ error });
    }
  });
