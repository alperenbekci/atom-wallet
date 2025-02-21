# Smart Account Contracts

Bu proje, Account Abstraction (EIP-4337) tabanlı akıllı hesap sistemini içerir.

## Kontratlar

- `SmartAccount.sol`: ERC-4337 uyumlu akıllı hesap kontratı
- `AccountFactory.sol`: Yeni akıllı hesaplar oluşturmak için fabrika kontratı
- `MinimalPaymaster.sol`: Basit bir paymaster implementasyonu
- `SmartAccountRegistry.sol`: Kullanıcı adı kayıt sistemi

## Kurulum

1. Foundry'yi yükleyin:
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

2. Dependencies'leri yükleyin:
```bash
forge install
```

3. Kontratları derleyin:
```bash
forge build
```

## Test

Testleri çalıştırmak için:
```bash
forge test
```

Detaylı test çıktısı için:
```bash
forge test -vvv
```

## Deploy

1. `.env` dosyasını oluşturun:
```bash
cp .env.example .env
```

2. `.env` dosyasını düzenleyin:
```
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
```

3. Kontratları deploy edin:
```bash
forge script script/Deploy.s.sol --rpc-url $RPC_URL --broadcast
```

## Paymaster Fonlama

MinimalPaymaster'ı fonlamak için:
```bash
forge script script/Fund.s.sol --rpc-url $RPC_URL --broadcast
```

Bu script:
- MinimalPaymaster'a 0.1 ETH deposit yapar
- MinimalPaymaster için 0.1 ETH stake ekler (1 günlük unstake süresi ile)

## Kontrat Adresleri (Units Network)

- EntryPoint: `0x5FBe6efF3cCde930542d535297166487c5d9ED5e`
- AccountFactory: `0x4731b9A288AfBBc5b95AbeC9f7B7f1FD4dE079D1`
- MinimalPaymaster: `0xe652A2E58c549a0C0589499b028d1af8c1f3A49d`
- SmartAccountRegistry: `0x5c303c80AAc8AC998501e46951eb55c6DfA7c1E2`

## Lisans

MIT
