import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BlockService } from '../src/services/BlockService.js';
import { BlockchainError } from '../src/services/base/BlockchainService.js';

describe('BlockService', () => {
  let blockService;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      getBlockNumber: vi.fn(),
      getBlock: vi.fn(),
    };
    blockService = new BlockService(mockClient);
  });

  it('should fetch all blocks successfully', async () => {
    // Arrange
    mockClient.getBlockNumber.mockResolvedValue(BigInt(2));
    mockClient.getBlock.mockImplementation(({ blockNumber }) => {
      return Promise.resolve({
        number: blockNumber,
        hash: '0x123',
        transactions: [],
        timestamp: '1000000',
        gasUsed: BigInt(21000),
        gasLimit: BigInt(30000),
      });
    });

    // Act
    const blocks = await blockService.getLatestBlocks();

    // Assert
    expect(blocks.length).toBe(3); // Blocks 0, 1, and 2
    expect(mockClient.getBlock).toHaveBeenCalledTimes(3);
  });

  it('should handle errors when fetching blocks', async () => {
    // Arrange
    mockClient.getBlockNumber.mockRejectedValue(new Error('Network error'));

    // Act & Assert
    await expect(blockService.getLatestBlocks()).rejects.toThrow(
      BlockchainError
    );
  });
});
