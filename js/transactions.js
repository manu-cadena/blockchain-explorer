import { formatEther, parseEther } from 'https://esm.sh/viem';

export async function sendTransaction(
  wallet,
  from,
  to,
  value,
  transactionResult,
  transactionForm,
  updateCallback
) {
  try {
    const tx = await wallet.sendTransaction({
      account: from,
      to: to,
      value: parseEther(value),
    });

    transactionResult.textContent = `Transaction sent! Hash: ${tx}`;
    transactionResult.classList.add('active');
    transactionForm.reset();

    if (updateCallback) {
      await updateCallback(from);
    }
  } catch (error) {
    transactionResult.textContent =
      'Error: Transaction failed. Check console for details.';
    transactionResult.classList.add('active');
    console.error('Transaction error:', error);
  }
}

export async function updateTransactionHistory(client, transactionsList) {
  try {
    const blockNumber = await client.getBlockNumber();
    transactionsList.innerHTML = '';

    // Convert blockNumber to regular number for Math.min()
    const blocksToFetch = Math.min(10, Number(blockNumber));

    // Use BigInt for blockchain operations
    for (let i = blockNumber; i > blockNumber - BigInt(blocksToFetch); i--) {
      const block = await client.getBlock({ blockNumber: i }); // i is already BigInt
      for (const txHash of block.transactions) {
        const tx = await client.getTransaction({ hash: txHash });
        const txElement = createTransactionElement(tx);
        transactionsList.appendChild(txElement);
      }
    }
  } catch (error) {
    console.error('Error updating transaction history:', error);
    transactionsList.innerHTML = '<p>Error loading transaction history</p>';
  }
}

function createTransactionElement(tx) {
  const txElement = document.createElement('div');
  txElement.className = 'transaction-item';
  txElement.innerHTML = `
        <div class="address">From: ${tx.from}</div>
        <div class="address">To: ${tx.to}</div>
        <div class="amount">${parseFloat(formatEther(tx.value)).toFixed(
          2
        )} ETH</div>
    `;
  return txElement;
}
