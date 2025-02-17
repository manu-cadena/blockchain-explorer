import { createClient, createWallet } from './explorer.js';
import { updateBlocksDisplay } from './services/blockService.js';
import { checkBalance } from './services/balanceService.js';
import {
  sendTransaction,
  updateTransactionHistory,
} from './services/transactionService.js';

async function init() {
  const client = createClient();
  const wallet = createWallet();

  // Get DOM elements
  const elements = {
    blocksList: document.getElementById('blocks-list'),
    balanceForm: document.getElementById('balance-form'),
    balanceResult: document.getElementById('balance-result'),
    transactionForm: document.getElementById('transaction-form'),
    transactionResult: document.getElementById('transaction-result'),
    transactionsList: document.getElementById('transactions-list'),
  };

  try {
    // Initial blocks display
    await Promise.all([
      updateBlocksDisplay(client, elements.blocksList),
      updateTransactionHistory(client, elements.transactionsList),
    ]);

    // Handle balance form submission
    elements.balanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const address = document.getElementById('address').value;
      await checkBalance(client, address, elements.balanceResult);
    });

    // Handle transaction form submission
    elements.transactionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const from = document.getElementById('from').value;
      const to = document.getElementById('to').value;
      const value = document.getElementById('value').value;

      elements.transactionResult.textContent = 'Sending transaction...';
      elements.transactionResult.classList.add('active');

      await sendTransaction(
        wallet,
        from,
        to,
        value,
        elements.transactionResult,
        elements.transactionForm,
        async (address) => {
          // Update blocks, balance, and transaction history after transaction
          await Promise.all([
            updateBlocksDisplay(client, elements.blocksList),
            checkBalance(client, address, elements.balanceResult),
            updateTransactionHistory(client, elements.transactionsList),
          ]);
        }
      );
    });

    console.log('Successfully connected to the blockchain!');
  } catch (error) {
    console.error('Error connecting to the blockchain:', error);
    elements.blocksList.innerHTML = '<p>Error connecting to blockchain</p>';
  }
}

// Call our init function
init().catch(console.error);
