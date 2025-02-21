# Smart Account Contracts

This project includes a smart account system based on Account Abstraction (EIP-4337).

## Contracts

- `SmartAccount.sol`: ERC-4337 compatible smart account contract
- `AccountFactory.sol`: Factory contract for creating new smart accounts
- `MinimalPaymaster.sol`: A simple paymaster implementation
- `SmartAccountRegistry.sol`: Username registration system

## Setup

1. Install Foundry:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Install dependencies:
```bash
forge install
```

3. Compile contracts:
```bash
forge build
```

## Testing

To run tests:
```bash
forge test
```

For detailed test output:
```bash
forge test -vvv
```

## Deployment

1. Create a `.env` file:
```bash
cp .env.example .env
```

2. Edit the `.env` file:
```
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
```

3. Deploy contracts:
```bash
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Paymaster Funding

To fund the MinimalPaymaster:
```bash
forge script script/Fund.s.sol --rpc-url $RPC_URL --broadcast
```

This script:
- Deposits 0.1 ETH into MinimalPaymaster
- Adds a 0.1 ETH stake for MinimalPaymaster (with a 1-day unstake period)

## Contract Addresses (Units Network)

- EntryPoint: `0x5FBe6efF3cCde930542d535297166487c5d9ED5e`
- AccountFactory: `0x4731b9A288AfBBc5b95AbeC9f7B7f1FD4dE079D1`
- MinimalPaymaster: `0xe652A2E58c549a0C0589499b028d1af8c1f3A49d`
- SmartAccountRegistry: `0x5c303c80AAc8AC998501e46951eb55c6DfA7c1E2`

## License

MIT

