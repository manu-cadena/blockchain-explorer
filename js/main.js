import { createClient, createWallet } from './explorer.js';
import { formatEther, parseEther } from 'https://esm.sh/viem';

async function init() {
  // Initialize client
  const client = createClient();
  const wallet = createWallet();

  // Reference to HTML elements
  const blockNumberElement = document.getElementById('block-number');
  const balanceForm = document.getElementById('balance-form');
  const balanceResult = document.getElementById('balance-result');
  const transactionForm = document.getElementById('transaction-form');
  const transactionResult = document.getElementById('transaction-result');

  try {
    // Function to update the block number
    async function updateBlockNumber() {
      const blockNumber = await client.getBlockNumber();
      blockNumberElement.textContent = blockNumber.toString();
    }

    // Function to check balance
    async function checkBalance(address) {
      try {
        const balance = await client.getBalance({ address });
        const balanceInEther = formatEther(balance);
        balanceResult.textContent = `Balance: ${parseFloat(
          balanceInEther
        ).toFixed(2)} ETH`;
        balanceResult.classList.add('active');
      } catch (error) {
        balanceResult.textContent =
          'Error: Invalid address or unable to fetch balance';
        balanceResult.classList.add('active');
        console.error('Error fetching balance:', error);
      }
    }

    // Function to send transaction
    async function sendTransaction(from, to, value) {
      try {
        const tx = await wallet.sendTransaction({
          account: from,
          to: to,
          value: parseEther(value),
        });
        transactionResult.textContent = `Transaction sent! Hash: ${tx}`;
        transactionResult.classList.add('active');

        // Clear form
        transactionForm.reset();

        // Refresh balance after transaction
        await checkBalance(from);
      } catch (error) {
        transactionResult.textContent =
          'Error: Transaction failed. Check console for details.';
        transactionResult.classList.add('active');
        console.error('Transaction error:', error);
      }
    }

    // Initial block number update
    await updateBlockNumber();

    // Update block number every 5 seconds
    setInterval(updateBlockNumber, 5000);

    // Handle balance form submission
    balanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const address = document.getElementById('address').value;
      await checkBalance(address);
    });

    // Handle transaction form submission
    transactionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const from = document.getElementById('from').value;
      const to = document.getElementById('to').value;
      const value = document.getElementById('value').value;

      transactionResult.textContent = 'Sending transaction...';
      transactionResult.classList.add('active');

      await sendTransaction(from, to, value);
    });

    console.log('Successfully connected to the blockchain!');
  } catch (error) {
    console.error('Error connecting to the blockchain:', error);
    blockNumberElement.textContent = 'Error connecting to blockchain';
    blockNumberElement.style.color = 'red';
  }
}

// Call our init function
init().catch(console.error);
