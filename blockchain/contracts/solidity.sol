// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DocumentNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;

    enum RequestStatus { Pending, Approved, Rejected }

    struct DocumentRequest {
        address user;
        string name;
        string dob;
        string gender;
        string contact;
        string addressDetails;
        string ipfsHash;  // Optional: uploaded file hash
        RequestStatus status;
        uint256 tokenId;
    }

    mapping(uint256 => DocumentRequest) public requests;
    mapping(address => uint256[]) public userRequests;

    event DocumentRequested(uint256 requestId, address indexed user);
    event DocumentApproved(uint256 requestId, uint256 tokenId);
    event DocumentRejected(uint256 requestId);

    constructor() ERC721("DocumentNFT", "AAD") Ownable(msg.sender) {
        tokenCounter = 1;
    }

    /// Called by users via React app
    function requestDocument(
        string memory _name,
        string memory _dob,
        string memory _gender,
        string memory _contact,
        string memory _addressDetails,
        string memory _ipfsHash
    ) public {
        uint256 requestId = tokenCounter++;
        DocumentRequest storage req = requests[requestId];
        req.user = msg.sender;
        req.name = _name;
        req.dob = _dob;
        req.gender = _gender;
        req.contact = _contact;
        req.addressDetails = _addressDetails;
        req.ipfsHash = _ipfsHash;
        req.status = RequestStatus.Pending;
        req.tokenId = 0;

        userRequests[msg.sender].push(requestId);

        emit DocumentRequested(requestId, msg.sender);
    }

    /// Called by Issuing Authority (contract owner)
    function approveDocument(uint256 _requestId, string memory _tokenURI) public onlyOwner {
        DocumentRequest storage req = requests[_requestId];
        require(req.status == RequestStatus.Pending, "Already processed");

        uint256 newTokenId = _requestId;
        _safeMint(req.user, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        req.status = RequestStatus.Approved;
        req.tokenId = newTokenId;

        emit DocumentApproved(_requestId, newTokenId);
    }

    /// Optional: allow rejection
    function rejectDocument(uint256 _requestId) public onlyOwner {
        DocumentRequest storage req = requests[_requestId];
        require(req.status == RequestStatus.Pending, "Already processed");

        req.status = RequestStatus.Rejected;

        emit DocumentRejected(_requestId);
    }

    /// Returns all request IDs for a user
    function getUserRequests(address user) public view returns (uint256[] memory) {
        return userRequests[user];
    }

    /// Returns request details
    function getRequestDetails(uint256 requestId) public view returns (
        address, string memory, string memory, string memory, string memory, string memory, string memory, RequestStatus, uint256
    ) {
        DocumentRequest memory r = requests[requestId];
        return (
            r.user,
            r.name,
            r.dob,
            r.gender,
            r.contact,
            r.addressDetails,
            r.ipfsHash,
            r.status,
            r.tokenId
        );
    }
}
