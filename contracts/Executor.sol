// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "./Implementation.sol";

/**
 * @title A simple multi-signature executor proxy
 * 
 * @author renope, inspired by openzeppelin Proxy, Governance
 * 
 * @dev This kind of proxy can be used for all implementations but here to facilitate
 * the use of the proxy we have one single-function implementation imported and deployed 
 * in the constructor.
 * @dev The list of members is set once in constructor and cannot be changed later
 * @dev The execution quorum is set once in constructor and cannot be changed later
 * @dev Rules are simple too. 
 *          only members can vote to execute, execute when reach the quorum.
 * @dev The function users call in fact is the same selector as the function they want 
 * to be called in the implementation;(they call implementation abi on executor address)
 * @dev as no functions in the executor has the same selector as the implementation 
 * function(s), the fallback function is activated
 * @dev fallback function countes user votes and calls the implementation if votes 
 * reached the quorum
 */
contract Executor {

    address[] members_;
    uint256 quorum;
    address public implementation;

    mapping(address => bool) public userExists;

    mapping(bytes32 => uint256) dataLastIndex;
    mapping(bytes32 => mapping(uint256 => uint256)) dataIndexScore;
    mapping(address => mapping(bytes32 => mapping(uint256 => bool))) userDataScored;

    constructor(address[] memory _members, uint256 _quorum) {
        uint256 len = _members.length;
        require(
            quorum <= len, 
            "Executor: Quorum must be lesser than or equal to the _members length"
        );

        for(uint256 i; i < len; i++) {
            userExists[_members[i]] = true;
        }

        members_ = _members;
        quorum = _quorum;
        implementation = address(new Implementation(address(this)));
    }   


    function members() public view returns(address[] memory m) {
        uint len = members_.length;
        m = new address[](len);

        for(uint i; i < len; i++) {
            m[i] = members_[i];
        }
    }
    
    fallback() external payable virtual {
        bytes32 dataHash = keccak256(msg.data);
        uint256 dataIndex = dataLastIndex[dataHash];
        require(
            userExists[msg.sender], 
            "Executor: You cannot vote in this Execution"
        );
        require(
            !userDataScored[msg.sender][dataHash][dataIndex], 
            "Executor: You have voted in this call before"
        );
        userDataScored[msg.sender][dataHash][dataIndex] = true;
        dataIndexScore[dataHash][dataIndex] ++;

        if(dataIndexScore[dataHash][dataIndex] >= quorum){
            dataLastIndex[dataHash] ++;
            _call(implementation);
        }
    }

    function _call(address _implementation) internal virtual {
        assembly {
            // Copy msg.data. We take full control of memory in this inline assembly
            // block because it will not return to Solidity code. We overwrite the
            // Solidity scratch pad at memory position 0.
            calldatacopy(0, 0, calldatasize())

            // Call the implementation.
            // out and outsize are 0 because we don't know the size yet.
            let result := call(gas(), _implementation, 0, 0, calldatasize(), 0, 0)

            // Copy the returned data.
            returndatacopy(0, 0, returndatasize())

            switch result
            // call returns 0 on error.
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }

    receive() external payable virtual {revert();}
}
