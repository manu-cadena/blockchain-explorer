import {
  BlockchainService,
  BlockchainError,
} from './base/BlockchainService.js';
import { formatEther, parseEther } from 'https://esm.sh/viem';

export class TransactionService extends BlockchainService {
  constructor(client, wallet) {
    super(client);
    this.wallet = wallet;
  }

  async execute(from, to, value, resultElement, formElement, callback) {
    try {
      await this.sendTransaction(
        from,
        to,
        value,
        resultElement,
        formElement,
        callback
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async sendTransaction(from, to, value, resultElement, formElement, callback) {
    try {
      const tx = await this.wallet.sendTransaction({
        account: from,
        to: to,
        value: parseEther(value),
      });

      this.updateUISuccess(resultElement, tx, formElement);

      if (callback) {
        await callback(from);
      }
    } catch (error) {
      this.handleError(error);
      this.updateUIError(resultElement);
    }
  }

  updateUISuccess(resultElement, tx, formElement) {
    resultElement.textContent = `Transaction sent! Hash: ${tx}`;
    resultElement.classList.add('active');
    formElement.reset();
  }

  updateUIError(resultElement) {
    resultElement.textContent =
      'Error: Transaction failed. Check console for details.';
    resultElement.classList.add('active');
  }

  async updateTransactionHistory(transactionsList) {
    try {
      const blockNumber = await this.client.getBlockNumber();
      transactionsList.innerHTML = '';

      for (let i = Number(blockNumber); i >= 0; i--) {
        const block = await this.client.getBlock({
          blockNumber: BigInt(i),
        });

        for (const txHash of block.transactions) {
          const tx = await this.client.getTransaction({ hash: txHash });
          this.renderTransaction(tx, transactionsList);
        }
      }
    } catch (error) {
      this.handleError(error);
      transactionsList.innerHTML = '<p>Error loading transaction history</p>';
    }
  }

  renderTransaction(tx, transactionsList) {
    const txElement = document.createElement('div');
    txElement.className = 'transaction-item';
    txElement.innerHTML = `
            <div class="address">From: ${tx.from}</div>
            <div class="address">To: ${tx.to}</div>
            <div class="amount">${parseFloat(formatEther(tx.value)).toFixed(
              4
            )} ETH</div>
        `;
    transactionsList.appendChild(txElement);
  }
}
