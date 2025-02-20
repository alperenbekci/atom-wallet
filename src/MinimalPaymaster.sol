// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "account-abstraction/core/BasePaymaster.sol";
import "account-abstraction/interfaces/PackedUserOperation.sol";

contract MinimalPaymaster is BasePaymaster {
    // Events for better monitoring
    event GasBalanceDeducted(address indexed account, uint256 maxCost, uint256 actualCost, uint256 overhead);
    event PaymasterDeposited(address indexed account, uint256 amount);
    event PaymasterWithdrawn(address indexed account, uint256 amount);

    // Gas overhead for validation and postOp
    uint256 public constant VALIDATION_GAS_OVERHEAD = 40000;
    uint256 public constant POST_OP_OVERHEAD = 40000;

    constructor(IEntryPoint _entryPoint) BasePaymaster(_entryPoint) {}

    struct PaymasterContext {
        uint256 maxCost;
        uint256 timestamp;
    }

    function _validatePaymasterUserOp(
        PackedUserOperation calldata userOp,
        bytes32 userOpHash,
        uint256 maxCost
    ) internal virtual override returns (bytes memory context, uint256 validationData) {
        // Ensure paymaster has enough deposit
        require(entryPoint.balanceOf(address(this)) >= maxCost, "Insufficient paymaster balance");

        // Add overhead to maxCost for safety
        uint256 maxCostWithOverhead = maxCost + VALIDATION_GAS_OVERHEAD + POST_OP_OVERHEAD;
        require(entryPoint.balanceOf(address(this)) >= maxCostWithOverhead, "Insufficient balance for overhead");

        // Pack the context with maxCost for postOp
        PaymasterContext memory pmContext = PaymasterContext({
            maxCost: maxCostWithOverhead,
            timestamp: block.timestamp
        });
        context = abi.encode(pmContext);

        // Return 0 as validationData to indicate success
        return (context, 0);
    }

    function _postOp(
        PostOpMode mode,
        bytes calldata context,
        uint256 actualGasCost,
        uint256 actualUserOpFeePerGas
    ) internal virtual override {
        // Decode the context
        PaymasterContext memory pmContext = abi.decode(context, (PaymasterContext));

        // Calculate actual cost including overhead
        uint256 totalCost = actualGasCost + POST_OP_OVERHEAD;

        // Ensure we don't exceed maxCost
        require(totalCost <= pmContext.maxCost, "Actual cost exceeded maxCost");

        // Emit event for monitoring
        emit GasBalanceDeducted(msg.sender, pmContext.maxCost, totalCost, POST_OP_OVERHEAD);
    }

    // Wrapper function for deposit that emits an event
    function depositAndEmit() public payable {
        deposit();
        emit PaymasterDeposited(msg.sender, msg.value);
    }

    // Wrapper function for withdrawTo that emits an event
    function withdrawToAndEmit(address payable withdrawAddress, uint256 amount) public onlyOwner {
        withdrawTo(withdrawAddress, amount);
        emit PaymasterWithdrawn(withdrawAddress, amount);
    }

    // View function to get current gas overhead settings
    function getOverheadSettings() external pure returns (uint256 validationOverhead, uint256 postOpOverhead) {
        return (VALIDATION_GAS_OVERHEAD, POST_OP_OVERHEAD);
    }
} 