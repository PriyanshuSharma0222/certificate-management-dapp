// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AadhaarNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    enum RequestStatus { Pending, Approved, Rejected }

    struct AadhaarRequest {
        address user;
        string name;
        string dob;
        string gender;
        string addressDetails;
        string ipfsHash;  // Optional: uploaded file hash
        RequestStatus status;
        uint256 tokenId;
    }

    mapping(uint256 => AadhaarRequest) public requests;
    mapping(address => uint256[]) public userRequests;

    event AadhaarRequested(uint256 requestId, address indexed user);
    event AadhaarApproved(uint256 requestId, uint256 tokenId);
    event AadhaarRejected(uint256 requestId);

    constructor() ERC721("AadhaarNFT", "AAD") Ownable(msg.sender) {
        tokenCounter = 1;
    }

    /// Called by users via React app
    function requestAadhaar(
        string memory _name,
        string memory _dob,
        string memory _gender,
        string memory _addressDetails,
        string memory _ipfsHash
    ) public {
        uint256 requestId = tokenCounter++;
        AadhaarRequest storage req = requests[requestId];
        req.user = msg.sender;
        req.name = _name;
        req.dob = _dob;
        req.gender = _gender;
        req.addressDetails = _addressDetails;
        req.ipfsHash = _ipfsHash;
        req.status = RequestStatus.Pending;
        req.tokenId = 0;

        userRequests[msg.sender].push(requestId);

        emit AadhaarRequested(requestId, msg.sender);
    }

    /// Called by Issuing Authority (contract owner)
    function approveAadhaar(uint256 _requestId, string memory _tokenURI) public onlyOwner {
        AadhaarRequest storage req = requests[_requestId];
        require(req.status == RequestStatus.Pending, "Already processed");

        uint256 newTokenId = _requestId;
        _safeMint(req.user, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        req.status = RequestStatus.Approved;
        req.tokenId = newTokenId;

        emit AadhaarApproved(_requestId, newTokenId);
    }

    /// Optional: allow rejection
    function rejectAadhaar(uint256 _requestId) public onlyOwner {
        AadhaarRequest storage req = requests[_requestId];
        require(req.status == RequestStatus.Pending, "Already processed");

        req.status = RequestStatus.Rejected;

        emit AadhaarRejected(_requestId);
    }

    /// Returns all request IDs for a user
    function getUserRequests(address user) public view returns (uint256[] memory) {
        return userRequests[user];
    }

    /// Returns request details
    function getRequestDetails(uint256 requestId) public view returns (
        address, string memory, string memory, string memory, string memory, string memory, RequestStatus, uint256
    ) {
        AadhaarRequest memory r = requests[requestId];
        return (
            r.user,
            r.name,
            r.dob,
            r.gender,
            r.addressDetails,
            r.ipfsHash,
            r.status,
            r.tokenId
        );
    }
}
