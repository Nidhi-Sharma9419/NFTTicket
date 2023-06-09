//SPDX-License-Identifier:MIT
pragma solidity  ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol";

import "hardhat/console.sol";

contract NFTTicket is ERC1155, Ownable, VRFConsumerBaseV2 {

 event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint256[] randomWords;
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */

 VRFCoordinatorV2Interface COORDINATOR;

  // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

     // The gas lane to use, which specifies the maximum gas price to bump to.
    // For a list of available gas lanes on each network,
    // see https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c;

    // Depends on the number of requested values that you want sent to the
    // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
    // so 100,000 is a safe default for this example contract. Test and adjust
    // this limit based on the network that you select, the size of the request,
    // and the processing of the callback request in the fulfillRandomWords()
    // function.
    uint32 callbackGasLimit = 100000;

    // The default is 3, but you can set this higher.
    uint16 requestConfirmations = 3;

    // For this example, retrieve 2 random values in one request.
    // Cannot exceed VRFCoordinatorV2.MAX_NUM_WORDS.
    uint32 numWords = 1;

    address contractAddress;

    struct NFTInfo {
        string uri;
        address owner;
    }
    mapping(uint256 => NFTInfo) private _NFTInfo;

    event NFTTicketCreated(uint256 indexed tokenId);

    constructor(address marketplaceAddress) ERC1155("")  VRFConsumerBaseV2(0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625){
         contractAddress = marketplaceAddress;
         COORDINATOR = VRFCoordinatorV2Interface(
            0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625
        );
        s_subscriptionId = 2572; 
    }

    function createToken(string memory newUri, uint64 amount)
        public
        returns (uint256)
    {
        uint256 newTokenId = requestRandomWords();

        _mint(msg.sender, newTokenId, amount, "");
        setApprovalForAll(contractAddress, true);
        //Makes msg.sender the owner so that now they are the only ones capable of setting token uri
        _NFTInfo[newTokenId].owner = msg.sender;
        _NFTInfo[newTokenId].uri = newUri;
        emit NFTTicketCreated(newTokenId);
        return newTokenId;
    }

        // Assumes the subscription is funded sufficiently.
    function requestRandomWords()
        internal
        returns (uint256 requestId)
    {
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            randomWords: new uint256[](0),
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, numWords);
        return requestId;
    }

      function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].randomWords = _randomWords;
        emit RequestFulfilled(_requestId, _randomWords);
    }

     function addTokens(uint256 tokenId, uint64 amount) public {
        require(
            _NFTInfo[tokenId].owner == msg.sender,
            "Only token owner can mint extra tokens"
        );
        _mint(msg.sender, tokenId, amount, "");
        setApprovalForAll(contractAddress, true);
    }

    //What this function does is allow a custom uri for a token which doesn't need to follow {id} structure
    function uri(uint256 tokenId) public view override returns (string memory) {
        require(
            bytes(_NFTInfo[tokenId].uri).length != 0,
            "No uri exists for the token"
        );
        return (_NFTInfo[tokenId].uri);
    }

    function giveResaleApproval(uint256 tokenId) public {
        require(
            balanceOf(msg.sender, tokenId) > 0,
            "You must own this NFT in order to resell it"
        );
        setApprovalForAll(contractAddress, true);
        return;
    }

} 