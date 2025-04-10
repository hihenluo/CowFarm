// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IERC20 {
    function transfer(address recipient, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
}

contract CowFarm {
    using ECDSA for bytes32;

    address public owner;
    address public giveawayWallet;
    address public constant DEAD = address(0x000000000000000000000000000000000000dEaD);
    address public signer; // signer backend

    IERC20 public milkToken;

    uint public cowPrice = 100_000 * 1e18;
    uint public milkPerDayPerCow = 10_000 * 1e18;
    uint public referralReward = 50_000 * 1e18;

    struct User {
        uint cowCount;
        uint lastClaim;
        bool hasClaimedFreeCow;
        string referralCode;
        address referrer;
        uint referralEarnings;
    }

    mapping(address => User) public users;
    mapping(string => address) public referralCodeToAddress;
    mapping(uint256 => bool) public hasClaimedFID;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    event CowBought(address indexed user, uint count);
    event MilkClaimed(address indexed user, uint amount);
    event ReferralUsed(address indexed user, address indexed referrer);
    event FreeCowClaimed(address indexed user, address indexed referrer);

    constructor(address _milkToken, address _giveawayWallet, address _signer) {
        owner = msg.sender;
        milkToken = IERC20(_milkToken);
        giveawayWallet = _giveawayWallet;
        signer = _signer;

        users[owner].cowCount = 10;
        users[owner].lastClaim = block.timestamp;
    }

    function setMilkToken(address _milkToken) external onlyOwner {
        milkToken = IERC20(_milkToken);
    }

    function setGiveawayWallet(address _wallet) external onlyOwner {
        giveawayWallet = _wallet;
    }

    function setCowPrice(uint _price) external onlyOwner {
        cowPrice = _price;
    }

    function setMilkPerDayPerCow(uint _reward) external onlyOwner {
        milkPerDayPerCow = _reward;
    }

    function setReferralReward(uint _reward) external onlyOwner {
        referralReward = _reward;
    }

    function setSigner(address _signer) external onlyOwner {
        signer = _signer;
    }

    function withdrawMilk(address to, uint amount) external onlyOwner {
        require(milkToken.transfer(to, amount), "Withdraw failed");
    }

    function registerReferralCode(string calldata code) external {
        require(bytes(code).length >= 3, "Code too short");
        require(referralCodeToAddress[code] == address(0), "Code exists");

        referralCodeToAddress[code] = msg.sender;
        users[msg.sender].referralCode = code;
    }

    function buyCow(uint count) external {
        require(count > 0, "Invalid count");

        uint total = cowPrice * count;
        require(milkToken.transferFrom(msg.sender, address(this), total), "Transfer failed");

        uint burnAmount = (total * 80) / 100;
        uint giveawayAmount = total - burnAmount;

        require(milkToken.transfer(DEAD, burnAmount), "Burn failed");
        require(milkToken.transfer(giveawayWallet, giveawayAmount), "Giveaway transfer failed");

        users[msg.sender].cowCount += count;
        if (users[msg.sender].lastClaim == 0) {
            users[msg.sender].lastClaim = block.timestamp;
        }

        emit CowBought(msg.sender, count);
    }

    function claimMilk() external {
        User storage user = users[msg.sender];
        require(user.cowCount > 0, "No cows");

        uint elapsed = block.timestamp - user.lastClaim;
        require(elapsed > 0, "Nothing to claim");

        uint reward = (elapsed * user.cowCount * milkPerDayPerCow) / 1 days;
        user.lastClaim = block.timestamp;

        require(milkToken.transfer(msg.sender, reward), "Milk transfer failed");
        emit MilkClaimed(msg.sender, reward);

        if (user.referrer != address(0)) {
            uint refBonus = (reward * 20) / 100;
            users[user.referrer].referralEarnings += refBonus;
            require(milkToken.transfer(user.referrer, refBonus), "Ref bonus failed");
        }
    }

   function claimFreeCowWithFID(string calldata code, uint256 fid, bytes calldata signature) external {
    require(!users[msg.sender].hasClaimedFreeCow, "Already claimed");
    require(!hasClaimedFID[fid], "FID already claimed");

    bytes32 messageHash = keccak256(abi.encodePacked(msg.sender, fid));
    
    // Ini pengganti manual dari toEthSignedMessageHash()
    bytes32 ethSignedMessageHash = keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32", messageHash)
    );

    address recovered = ECDSA.recover(ethSignedMessageHash, signature);
    require(recovered == signer, "Invalid signature");

    address ref = referralCodeToAddress[code];
    require(ref != address(0) && ref != msg.sender, "Invalid referral");

    hasClaimedFID[fid] = true;
    users[msg.sender].hasClaimedFreeCow = true;
    users[msg.sender].cowCount = 1;
    users[msg.sender].lastClaim = block.timestamp;
    users[msg.sender].referrer = ref;

    require(milkToken.transfer(ref, referralReward), "Referral reward failed");

    emit ReferralUsed(msg.sender, ref);
    emit FreeCowClaimed(msg.sender, ref);
}


    function getUserCowCount(address userAddr) external view returns (uint) {
        return users[userAddr].cowCount;
    }

    function getPendingMilk(address userAddr) external view returns (uint) {
        User storage user = users[userAddr];
        if (user.cowCount == 0 || user.lastClaim == 0) return 0;
        uint elapsed = block.timestamp - user.lastClaim;
        return (elapsed * user.cowCount * milkPerDayPerCow) / 1 days;
    }
}
