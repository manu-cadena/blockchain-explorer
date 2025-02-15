export async function getBlockNumber(client) {
  return await client.getBlockNumber();
}

export async function updateBlockDisplay(client, blockNumberElement) {
  try {
    const blockNumber = await getBlockNumber(client);
    blockNumberElement.textContent = blockNumber.toString();
  } catch (error) {
    console.error('Error updating block number:', error);
    blockNumberElement.textContent = 'Error fetching block number';
    blockNumberElement.style.color = 'red';
  }
}
