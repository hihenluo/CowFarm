// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract milkToken is ERC20 {
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 1e18;

    constructor(address devAddress) ERC20("milk Token", "MILK") {
        require(devAddress != address(0), "Invalid dev address");

        // 100% langsung ke dev
        _mint(devAddress, MAX_SUPPLY);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
