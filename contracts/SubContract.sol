// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;



contract SubContract {
    mapping (address => Subscription) addressToSubscription;

    struct Subscription {
        address[] subTo;
        address[] subFrom;
    }

    function createUser() public {
        addressToSubscription[msg.sender] = Subscription(new address[](0), new address[](0));
    }

    function subscribe (address _subscribeTo) public {
        Subscription storage subFrom = addressToSubscription[msg.sender];
        Subscription storage subTo = addressToSubscription[_subscribeTo];

        int subFromIndex = _checkIfSubscribed(subFrom.subTo, _subscribeTo);
        int subToIndex = _checkIfSubscribed(subTo.subFrom, msg.sender);

        if(subToIndex == -1 && subFromIndex == -1) {
            subFrom.subTo.push(_subscribeTo);
            subTo.subFrom.push(msg.sender);
            addressToSubscription[msg.sender] = subFrom;
            addressToSubscription[_subscribeTo] = subTo;
        } else {
            subFrom.subTo[uint(subFromIndex)] = subFrom.subTo[subFrom.subTo.length - 1];
            subTo.subFrom[uint(subToIndex)] = subTo.subFrom[subTo.subFrom.length - 1];
            subFrom.subTo.pop();
            subTo.subFrom.pop();
        }
    }

    function fetchMySubs() public view returns(Subscription memory) {
        Subscription memory mySubs = addressToSubscription[msg.sender];

        return mySubs;
    }

    function _checkIfSubscribed(address[] memory _subs, address _user) private pure returns(int) {
        for(uint i = 0; i < _subs.length; i++) {
            if(_subs[i] == _user) {
                return int(i);
            }
        }

        return -1;
    }


}
