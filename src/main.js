import { createClient, createWallet } from './explorer.js';
import { BlockService } from './services/BlockService.js';
import { BalanceService } from './services/BalanceService.js';
import { TransactionService } from './services/TransactionService.js';

async function init() {
  const client = createClient();
  const wallet = createWallet();

  // Initialize services
  const blockService = new BlockService(client);
  const balanceService = new BalanceService(client);
  const transactionService = new TransactionService(client, wallet);

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
    await blockService.execute(elements.blocksList);

    // Handle balance form submission
    elements.balanceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const address = document.getElementById('address').value;
      await balanceService.execute(address, elements.balanceResult);
    });

    // Handle transaction form submission
    elements.transactionForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const from = document.getElementById('from').value;
      const to = document.getElementById('to').value;
      const value = document.getElementById('value').value;

      elements.transactionResult.textContent = 'Sending transaction...';
      elements.transactionResult.classList.add('active');

      await transactionService.execute(
        from,
        to,
        value,
        elements.transactionResult,
        elements.transactionForm,
        async (address) => {
          await Promise.all([
            blockService.execute(elements.blocksList),
            balanceService.execute(address, elements.balanceResult),
            transactionService.updateTransactionHistory(
              elements.transactionsList
            ),
          ]);
        }
      );
    });

    // Update transaction history initially
    await transactionService.updateTransactionHistory(
      elements.transactionsList
    );

    console.log('Successfully connected to the blockchain!');
  } catch (error) {
    console.error('Error connecting to the blockchain:', error);
    elements.blocksList.innerHTML = '<p>Error connecting to blockchain</p>';
  }
}

// Call our init function
init().catch(console.error);
