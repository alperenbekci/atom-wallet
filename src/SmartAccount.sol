// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";
import "account-abstraction/core/BaseAccount.sol";
import "account-abstraction/interfaces/IEntryPoint.sol";
import "account-abstraction/interfaces/PackedUserOperation.sol";
import "./SmartAccountRegistry.sol";

contract SmartAccount is BaseAccount {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

    address public owner;
    IEntryPoint private immutable _entryPoint;
    SmartAccountRegistry public immutable nameRegistry;
    uint256 private constant SIG_VALIDATION_FAILED = 1;

    event OwnerUpdated(address indexed previousOwner, address indexed newOwner);
    event NameRegistered(string indexed name);
    event NameReleased(string indexed name);
    event NameRenewed(string indexed name);

    error InvalidUsername(string username);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner");
        _;
    }

    constructor(
        IEntryPoint anEntryPoint,
        address anOwner,
        SmartAccountRegistry registry
    ) {
        _entryPoint = anEntryPoint;
        owner = anOwner;
        nameRegistry = registry;
    }

    /**
     * @dev Helper function to resolve a username to an account address
     * @param registry The SmartAccountRegistry contract
     * @param username The username to resolve (with or without .units suffix)
     * @return The account address
     */
    function resolveUsername(SmartAccountRegistry registry, string memory username) public view returns (address) {
        // Add .units suffix if not present
        if (bytes(username).length <= 6 || !_hasSuffix(username, ".units")) {
            username = string.concat(username, ".units");
        }
        
        address account = registry.resolveName(username);
        if (account == address(0)) revert InvalidUsername(username);
        return account;
    }

    /**
     * @dev Internal function to check if a string ends with a suffix
     */
    function _hasSuffix(string memory str, string memory suffix) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory suffixBytes = bytes(suffix);
        
        if (strBytes.length < suffixBytes.length) return false;
        
        for (uint i = 0; i < suffixBytes.length; i++) {
            if (strBytes[strBytes.length - suffixBytes.length + i] != suffixBytes[i]) {
                return false;
            }
        }
        
        return true;
    }

    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }

    function _validateSignature(PackedUserOperation calldata userOp, bytes32 userOpHash)
        internal virtual override returns (uint256 validationData)
    {
        bytes32 hash = MessageHashUtils.toEthSignedMessageHash(userOpHash);
        address recovered = ECDSA.recover(hash, userOp.signature);
        if (owner != recovered)
            return SIG_VALIDATION_FAILED;
        return 0;
    }

    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPoint();
        (bool success, bytes memory result) = dest.call{value: value}(func);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function executeBatch(address[] calldata dest, uint256[] calldata value, bytes[] calldata func) external {
        _requireFromEntryPoint();
        require(dest.length == func.length && value.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            (bool success, bytes memory result) = dest[i].call{value: value[i]}(func[i]);
            if (!success) {
                assembly {
                    revert(add(result, 32), mload(result))
                }
            }
        }
    }

    function updateOwner(address newOwner) external onlyOwner {
        require(newOwner != address(0), "new owner cannot be zero address");
        address oldOwner = owner;
        owner = newOwner;
        emit OwnerUpdated(oldOwner, newOwner);
    }

    // Name service functions
    function registerName(string calldata name) external onlyOwner {
        nameRegistry.registerName(name, address(this));
        emit NameRegistered(name);
    }

    function releaseName(string calldata name) external onlyOwner {
        nameRegistry.releaseName(name);
        emit NameReleased(name);
    }

    function renewName(string calldata name) external onlyOwner {
        nameRegistry.renewName(name);
        emit NameRenewed(name);
    }

    function getName() external view returns (string memory) {
        return nameRegistry.resolveAddress(address(this));
    }

    receive() external payable {}
} 