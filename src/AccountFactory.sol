// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "account-abstraction/interfaces/IEntryPoint.sol";
import "./SmartAccount.sol";

contract AccountFactory is Ownable {
    IEntryPoint public immutable entryPoint;
    
    event AccountCreated(address indexed account, address indexed owner, uint256 index);
    
    constructor(IEntryPoint _entryPoint) Ownable(msg.sender) {
        entryPoint = _entryPoint;
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
                    abi.encode(entryPoint, owner)
                ))
            )
        );
        
        address addr = address(uint160(uint256(hash)));
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return SmartAccount(payable(addr));
        }
        
        account = new SmartAccount{salt: bytes32(salt)}(entryPoint, owner);
        emit AccountCreated(address(account), owner, salt);
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
                    abi.encode(entryPoint, owner)
                ))
            )
        );
        return address(uint160(uint256(hash)));
    }
} 