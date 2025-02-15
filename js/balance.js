import { formatEther } from 'https://esm.sh/viem';

export async function checkBalance(client, address, balanceResult) {
  try {
    const balance = await client.getBalance({ address });
    const balanceInEther = formatEther(balance);
    balanceResult.textContent = `Balance: ${parseFloat(balanceInEther).toFixed(
      2
    )} ETH`;
    balanceResult.classList.add('active');
  } catch (error) {
    balanceResult.textContent =
      'Error: Invalid address or unable to fetch balance';
    balanceResult.classList.add('active');
    console.error('Error fetching balance:', error);
  }
}
