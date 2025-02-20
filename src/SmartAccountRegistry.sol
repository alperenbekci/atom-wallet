// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SmartAccountRegistry is Ownable {
    using Strings for uint256;
    
    // Name to address mapping
    mapping(string => address) private names;
    // Address to name mapping
    mapping(address => string) private addresses;
    // Name reservation expiry timestamps
    mapping(string => uint256) private nameExpiry;

    // Events
    event NameRegistered(string indexed name, address indexed account, uint256 expiryTime);
    event NameReleased(string indexed name, address indexed account);
    event NameRenewed(string indexed name, address indexed account, uint256 newExpiryTime);

    // Constants
    uint256 public constant REGISTRATION_PERIOD = 365 days;
    uint256 public constant MIN_NAME_LENGTH = 3; // Not including .units
    uint256 public constant MAX_NAME_LENGTH = 32; // Not including .units
    string public constant NAME_SUFFIX = ".units";

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Validates a name format
     * @param name The name to validate
     * @return bool True if the name is valid
     */
    function _isValidName(string calldata name) internal pure returns (bool) {
        bytes memory nameBytes = bytes(name);
        uint256 length = nameBytes.length;
        
        // Check if name ends with .units
        if (length <= 6) return false; // ".units" is 6 characters
        
        // Check the suffix
        for (uint i = 0; i < 6; i++) {
            if (nameBytes[length - 6 + i] != bytes(NAME_SUFFIX)[i]) {
                return false;
            }
        }
        
        // Check the name length (excluding .units)
        uint256 baseLength = length - 6;
        if (baseLength < MIN_NAME_LENGTH || baseLength > MAX_NAME_LENGTH) {
            return false;
        }
        
        // Check characters (only allow a-z, 0-9, and -)
        for (uint i = 0; i < baseLength; i++) {
            bytes1 char = nameBytes[i];
            if (!(
                (char >= 0x30 && char <= 0x39) || // 0-9
                (char >= 0x61 && char <= 0x7A) || // a-z
                char == 0x2D // -
            )) {
                return false;
            }
        }
        
        // Cannot start or end with hyphen
        if (nameBytes[0] == 0x2D || nameBytes[baseLength - 1] == 0x2D) {
            return false;
        }
        
        return true;
    }

    /**
     * @dev Registers a name for a Smart Account
     * @param name The name to register (must end with .units)
     * @param account The Smart Account address
     */
    function registerName(string calldata name, address account) external {
        require(_isValidName(name), "Invalid name format");
        require(account != address(0), "Invalid account address");
        require(names[name] == address(0) || nameExpiry[name] < block.timestamp, "Name already taken");
        require(bytes(addresses[account]).length == 0, "Account already has a name");

        names[name] = account;
        addresses[account] = name;
        nameExpiry[name] = block.timestamp + REGISTRATION_PERIOD;

        emit NameRegistered(name, account, nameExpiry[name]);
    }

    /**
     * @dev Releases a registered name
     * @param name The name to release (must end with .units)
     */
    function releaseName(string calldata name) external {
        require(_isValidName(name), "Invalid name format");
        address account = names[name];
        require(account != address(0), "Name not registered");
        require(msg.sender == account, "Not name owner");

        delete names[name];
        delete addresses[account];
        delete nameExpiry[name];

        emit NameReleased(name, account);
    }

    /**
     * @dev Renews a name registration
     * @param name The name to renew (must end with .units)
     */
    function renewName(string calldata name) external {
        require(_isValidName(name), "Invalid name format");
        require(names[name] != address(0), "Name not registered");
        require(msg.sender == names[name], "Not name owner");

        nameExpiry[name] = block.timestamp + REGISTRATION_PERIOD;
        emit NameRenewed(name, msg.sender, nameExpiry[name]);
    }

    /**
     * @dev Gets the address associated with a name
     * @param name The name to look up (must end with .units)
     * @return The associated address
     */
    function resolveName(string calldata name) external view returns (address) {
        require(_isValidName(name), "Invalid name format");
        require(nameExpiry[name] > block.timestamp, "Name expired or not registered");
        return names[name];
    }

    /**
     * @dev Gets the name associated with an address
     * @param account The address to look up
     * @return The associated name
     */
    function resolveAddress(address account) external view returns (string memory) {
        string memory name = addresses[account];
        require(bytes(name).length > 0 && nameExpiry[name] > block.timestamp, "No valid name for address");
        return name;
    }

    /**
     * @dev Checks if a name is available
     * @param name The name to check (must end with .units)
     * @return True if the name is available
     */
    function isNameAvailable(string calldata name) external view returns (bool) {
        if (!_isValidName(name)) return false;
        return names[name] == address(0) || nameExpiry[name] < block.timestamp;
    }

    /**
     * @dev Gets the expiry time of a name
     * @param name The name to check (must end with .units)
     * @return The expiry timestamp
     */
    function getNameExpiry(string calldata name) external view returns (uint256) {
        require(_isValidName(name), "Invalid name format");
        return nameExpiry[name];
    }
} 