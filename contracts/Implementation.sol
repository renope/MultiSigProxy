// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

/**
 * @title A Simple call counter contract to test the MultiSigExecutor
 */
contract Implementation {

    address executor; // Contract that counts the votes and calls the implementation
    uint256 public counter; // number of transaction calls to the implementation

    constructor(address _executor) {
        executor = _executor;
    }

    /**
     * @dev Increases the counter number
     * 
     * Requirements:
     *
     * - only executor can call this function
     */
    function increment() public {
        require(msg.sender == executor, "only executor can call this function");
        counter ++;
    }
}
