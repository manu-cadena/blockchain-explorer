export async function getLatestBlocks(client) {
  try {
    const latestBlock = await client.getBlockNumber();
    const blocks = [];

    // Convert to regular number for iteration
    const blockCount = Number(latestBlock);

    // Get all blocks from 0 to latest
    for (let i = blockCount; i >= 0; i--) {
      const block = await client.getBlock({
        blockNumber: BigInt(i),
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

  // Add click handler to show modal with block details
  blockElement.addEventListener('click', () => {
    setupBlockModal(block);
  });

  return blockElement;
}

export function renderDetailedBlock(block) {
  return `
        <div class="block-details-content">
            <div class="detail-label">Block Number</div>
            <div class="detail-value">${block.number.toString()}</div>
            
            <div class="detail-label">Block Hash</div>
            <div class="detail-value" style="white-space: nowrap; overflow-x: auto;">${
              block.hash
            }</div>
            
            <div class="detail-label">Tx Hash</div>
            <div class="detail-value" style="white-space: nowrap; overflow-x: auto;">${
              block.transactions[0] || 'No transactions'
            }</div>
            
            <div class="detail-label">Timestamp</div>
            <div class="detail-value">${new Date(
              Number(block.timestamp) * 1000
            ).toLocaleString()}</div>
            
            <div class="detail-label">Gas Used</div>
            <div class="detail-value">${block.gasUsed.toString()}</div>
            
            <div class="detail-label">Gas Limit</div>
            <div class="detail-value">${block.gasLimit.toString()}</div>
            
            <div class="detail-label">Base Fee</div>
            <div class="detail-value">${
              block.baseFeePerGas ? formatGwei(block.baseFeePerGas) : 'N/A'
            }</div>
            
            <div class="detail-label">Transactions</div>
            <div class="detail-value">${block.transactions.length} transaction${
    block.transactions.length !== 1 ? 's' : ''
  }</div>
        </div>
    `;
}

export function setupBlockModal(blockData) {
  const modal = document.getElementById('block-modal');
  const closeBtn = document.querySelector('.close-modal');
  const detailsContent = document.getElementById('block-details-content');

  detailsContent.innerHTML = renderDetailedBlock(blockData);
  modal.classList.add('active');

  closeBtn.onclick = () => {
    modal.classList.remove('active');
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.classList.remove('active');
    }
  };
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

// Helper function to format gwei values
function formatGwei(value) {
  return `${value.toString()} Gwei`;
}
