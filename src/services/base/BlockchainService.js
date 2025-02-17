export class BlockchainError extends Error {
    constructor(message, originalError) {
        super(message);
        this.name = 'BlockchainError';
        this.originalError = originalError;
    }
}

export class BlockchainService {
    constructor(client) {
        if (this.constructor === BlockchainService) {
            throw new Error('Abstract class cannot be instantiated');
        }
        this.client = client;
    }

    async execute() {
        throw new Error('Method must be implemented');
    }

    handleError(error) {
        console.error(`${this.constructor.name} error:`, error);
        throw new BlockchainError(`Error in ${this.constructor.name}`, error);
    }
}