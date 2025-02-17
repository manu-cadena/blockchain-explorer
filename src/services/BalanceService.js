import {
  BlockchainService,
  BlockchainError,
} from './base/BlockchainService.js';
import { formatEther } from 'https://esm.sh/viem';

export class BalanceService extends BlockchainService {
  async execute(address, resultElement) {
    try {
      await this.checkBalance(address, resultElement);
    } catch (error) {
      this.handleError(error);
    }
  }

  async checkBalance(address, resultElement) {
    try {
      const balance = await this.client.getBalance({ address });
      const balanceInEther = formatEther(balance);
      this.updateUI(resultElement, balanceInEther);
    } catch (error) {
      this.handleError(error);
      this.showError(resultElement);
    }
  }

  updateUI(resultElement, balanceInEther) {
    resultElement.textContent = `Balance: ${parseFloat(balanceInEther).toFixed(
      2
    )} ETH`;
    resultElement.classList.add('active');
  }

  showError(resultElement) {
    resultElement.textContent =
      'Error: Invalid address or unable to fetch balance';
    resultElement.classList.add('active');
  }
}
