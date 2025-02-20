// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISmartAccountRegistry {
    function setFactoryAuthorization(address factory, bool authorized) external;
    function registerName(string calldata name, address account) external;
    function resolveName(string calldata name) external view returns (address);
    function resolveAddress(address account) external view returns (string memory);
    function isNameAvailable(string calldata name) external view returns (bool);
} 