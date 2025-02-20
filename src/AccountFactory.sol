// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "account-abstraction/interfaces/IEntryPoint.sol";
import "./SmartAccount.sol";
import "./SmartAccountRegistry.sol";

contract AccountFactory is Ownable {
    IEntryPoint public immutable entryPoint;
    SmartAccountRegistry public immutable nameRegistry;
    
    event AccountCreated(address indexed account, address indexed owner, uint256 index);
    
    constructor(IEntryPoint _entryPoint, SmartAccountRegistry _nameRegistry) Ownable(msg.sender) {
        entryPoint = _entryPoint;
        nameRegistry = _nameRegistry;
    }
    
    /**
     * @dev Creates a new smart account for the given owner.
     * @param owner The owner of the new account
     * @param salt A salt to determine the account address
     * @return account The address of the newly created account
     */
    function createAccount(address owner, uint256 salt) public returns (SmartAccount account) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(abi.encodePacked(
                    type(SmartAccount).creationCode,
                    abi.encode(entryPoint, owner, nameRegistry)
                ))
            )
        );
        
        address addr = address(uint160(uint256(hash)));
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return SmartAccount(payable(addr));
        }
        
        account = new SmartAccount{salt: bytes32(salt)}(entryPoint, owner, nameRegistry);
        emit AccountCreated(address(account), owner, salt);
    }
    
    /**
     * @dev Creates a new smart account with a name for the given owner.
     * @param owner The owner of the new account
     * @param salt A salt to determine the account address
     * @param name The name to register for the account
     * @return account The address of the newly created account
     */
    function createAccountWithName(
        address owner,
        uint256 salt,
        string calldata name
    ) external returns (SmartAccount account) {
        // First check if the name is available
        require(nameRegistry.isNameAvailable(name), "Name not available");
        
        // Create the account
        account = createAccount(owner, salt);
        
        // Register the name
        nameRegistry.registerName(name, address(account));
        
        return account;
    }
    
    /**
     * @dev Calculates the counterfactual address of an account that would be deployed with given parameters.
     * @param owner The owner of the account
     * @param salt A salt to determine the account address
     * @return The address that would be assigned to the account
     */
    function getAddress(address owner, uint256 salt) public view returns (address) {
        bytes32 hash = keccak256(
            abi.encodePacked(
                bytes1(0xff),
                address(this),
                salt,
                keccak256(abi.encodePacked(
                    type(SmartAccount).creationCode,
                    abi.encode(entryPoint, owner, nameRegistry)
                ))
            )
        );
        return address(uint160(uint256(hash)));
    }
} 