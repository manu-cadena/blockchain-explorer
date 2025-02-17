export async function getLatestBlocks(client, count = 10) {
  try {
    const latestBlock = await client.getBlockNumber();
    const blocks = [];

    // Convert count to BigInt and handle the range calculation
    const startBlock = BigInt(latestBlock);
    const blockCount = BigInt(count);

    for (let i = startBlock; i > startBlock - blockCount && i >= 0n; i--) {
      const block = await client.getBlock({
        blockNumber: i, // i is already BigInt
      });
      blocks.push(block);
    }

    return blocks;
  } catch (error) {
    console.error('Error fetching blocks:', error);
    throw error;
  }
}

export function renderBlock(block) {
  const blockElement = document.createElement('div');
  blockElement.className = 'block-item';

  // Convert BigInt values to strings for display
  const timestamp = new Date(Number(block.timestamp) * 1000).toLocaleString();
  const blockNumber = block.number.toString();
  const gasUsed = block.gasUsed.toString();

  blockElement.innerHTML = `
        <div class="block-number">
            Block #${blockNumber}
        </div>
        <div class="block-details">
            <div>Hash: ${block.hash.slice(0, 18)}...</div>
            <div>Gas Used: ${gasUsed}</div>
        </div>
        <div class="block-timestamp">
            ${timestamp}
        </div>
        <div class="block-transactions">
            ${block.transactions.length} txns
        </div>
    `;

  return blockElement;
}

export async function updateBlocksDisplay(client, blocksListElement) {
  try {
    const blocks = await getLatestBlocks(client);
    blocksListElement.innerHTML = ''; // Clear existing blocks

    blocks.forEach((block) => {
      const blockElement = renderBlock(block);
      blocksListElement.appendChild(blockElement);
    });
  } catch (error) {
    console.error('Error updating blocks display:', error);
    blocksListElement.innerHTML = '<p>Error loading blocks</p>';
  }
}
