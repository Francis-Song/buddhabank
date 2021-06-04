// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract BuddhaToken is Context, ERC20 {
    address public minter;

    event MinterChanged(address indexed from, address to);

    constructor() ERC20("BuddhaToken", "BUD") {
         minter = msg.sender;
    }

    function changeMinter(address BuddhaBank) public returns (bool) {
        require(minter == msg.sender, "Not the owner");
        minter = BuddhaBank;

        emit MinterChanged(msg.sender, BuddhaBank);
        return(true);
    }
    
    function mint(address account, uint256 amount) public {
        require(msg.sender == minter, "Not the minter");
        _mint(account, amount);
    }
}