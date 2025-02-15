import { createClient, createWallet } from './explorer.js';
import { updateBlockDisplay } from './block.js';
import { checkBalance } from './balance.js';
import { sendTransaction, updateTransactionHistory } from './transactions.js';

async function init() {
  const client = createClient();
  const wallet = createWallet();

  // Get DOM elements
  const elements = {
    blockNumber: document.getElementById('block-number'),
    balanceForm: document.getElementById('balance-form'),
    balanceResult: document.getElementById('balance-result'),
    transactionForm: document.getElementById('transaction-form'),
    transactionResult: document.getElementById('transaction-result'),
    transactionsList: document.getElementById('transactions-list'),
  };

  try {
    // Initial updates
    await Promise.all([
      updateBlockDisplay(client, elements.blockNumber),
      updateTransactionHistory(client, elements.transactionsList),
    ]);

    // Event Listeners
    elements.balanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const address = document.getElementById('address').value;
      await checkBalance(client, address, elements.balanceResult);
    });

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
          await Promise.all([
            checkBalance(client, address, elements.balanceResult),
            updateTransactionHistory(client, elements.transactionsList),
          ]);
        }
      );
    });

    console.log('Successfully connected to the blockchain!');
  } catch (error) {
    console.error('Error connecting to the blockchain:', error);
    elements.blockNumber.textContent = 'Error connecting to blockchain';
    elements.blockNumber.style.color = 'red';
  }
}

init().catch(console.error);
