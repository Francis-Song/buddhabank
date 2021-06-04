pragma solidity ^0.8.3;

import "./BuddhaToken.sol";

contract BuddhaBank {
    
BuddhaToken private buddhaToken;

    mapping(address => uint) public etherBalanceOf;
    mapping(address => uint) public depositStart; 
    mapping(address => bool) public isDeposited;   
    
    event Deposit(address indexed user, uint etherAmount, uint timeStart);
    event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);

    constructor(BuddhaToken _buddhaToken) {
        buddhaToken = _buddhaToken;
    }

    function deposit() public payable {
        require(msg.value > 0, "Value must be greater than 0");

        etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;
        depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;

        isDeposited[msg.sender] = true;

        emit Deposit(msg.sender, msg.value, block.timestamp);

    }

    function withdraw() public {
        require(isDeposited[msg.sender] == true, "not deposited");

        uint depositTime = block.timestamp - depositStart[msg.sender];
        uint interestPerSecond = 31668017 * (etherBalanceOf[msg.sender] / 1e16);
        uint interest = interestPerSecond * depositTime;

        payable(msg.sender).transfer(etherBalanceOf[msg.sender]);
        buddhaToken.mint(msg.sender, interest);

        etherBalanceOf[msg.sender] = 0;
        depositStart[msg.sender] = 0;
        isDeposited[msg.sender] = false;

        emit Withdraw(msg.sender, etherBalanceOf[msg.sender], depositTime, interest);

    }

}