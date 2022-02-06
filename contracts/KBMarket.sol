//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

// security against transactions for multiple requests
import '@openzeppelin/contracts/utils/Counters.sol';

import 'hardhat/console.sol';

contract KBMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
}