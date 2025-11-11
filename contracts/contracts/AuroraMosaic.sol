// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title AuroraMosaic – encrypted generative tapestry wall
/// @notice Fully homomorphic encrypted collaborative panel with NFT minting flow.
/// @dev Mirrors PixelWall mechanics while providing a fresh naming scheme for the frontend.
contract AuroraMosaic is SepoliaConfig, ERC721URIStorage {

    struct TileSlot {
        euint32 encryptedColor;
        address artisan;
        uint64 updatedAt;
    }

    struct PanelMeta {
        uint16 width;
        uint16 height;
        bool isSealed;
        uint64 createdAt;
        uint64 sealedAt;
        euint32 encryptedBrushCount;
        string lastLoreCID;
    }

    struct TileView {
        bytes32 encryptedColor;
        address artisan;
        uint64 updatedAt;
    }

    /// @dev Cooldown in seconds between two brush strokes made by the same address.
    uint256 public constant BRUSH_COOLDOWN = 60;
    /// @dev Hard limit on panel dimensions to prevent excessive gas usage.
    uint16 public constant MAX_DIMENSION = 256;

    uint256 private _nextPanelId = 1;
    uint256 private _nextRelicId = 1;

    mapping(uint256 => PanelMeta) private _panels;
    mapping(uint256 => mapping(uint256 => mapping(uint256 => TileSlot))) private _tiles;
    mapping(address => uint256) public lastBrushAt;
    mapping(address => euint32) private _encryptedContributionCount;
    mapping(uint256 => uint256) private _panelToRelicId;

    event PanelStarted(uint256 indexed panelId, uint16 width, uint16 height, address indexed curator);
    event PanelSealed(uint256 indexed panelId, address indexed sealingArtist);
    event TileBrushed(
        uint256 indexed panelId,
        uint256 x,
        uint256 y,
        address indexed artisan,
        bytes32 encryptedColorHandle
    );
    event PanelForged(uint256 indexed panelId, uint256 relicId, address indexed minter, string loreCID);

    error PanelNotFound(uint256 panelId);
    error PanelAlreadySealed(uint256 panelId);
    error PanelNotSealed(uint256 panelId);
    error TileOutOfBounds(uint256 panelId, uint256 x, uint256 y);
    error BrushCooldownActive(address artisan, uint256 secondsRemaining);
    error PanelAlreadyForged(uint256 panelId);

    constructor() ERC721("AuroraMosaic Relic", "AUR") {}

    /// @notice Creates a new collaborative encrypted panel.
    /// @param width Panel width (defaults to 128 if value equals zero).
    /// @param height Panel height (defaults to 128 if value equals zero).
    /// @dev Initializes encrypted counters with FHE zero handles for deterministic access.
    function initiatePanel(uint16 width, uint16 height) external returns (uint256 panelId) {
        if (width == 0) {
            width = 128;
        }
        if (height == 0) {
            height = 128;
        }
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
            revert TileOutOfBounds(0, width, height);
        }

        panelId = _nextPanelId++;
        PanelMeta storage panel = _panels[panelId];
        panel.width = width;
        panel.height = height;
        panel.createdAt = uint64(block.timestamp);
        panel.encryptedBrushCount = FHE.asEuint32(0);

        FHE.allowThis(panel.encryptedBrushCount);

        emit PanelStarted(panelId, width, height, msg.sender);
    }

    /// @notice Sets the encrypted color of a tile within a panel.
    /// @param panelId Target panel identifier.
    /// @param x Column index (0-based).
    /// @param y Row index (0-based).
    /// @param encryptedColorExt Encrypted color payload (external handle).
    /// @param inputProof Proof required to convert external handle to internal handle.
    function applyTile(
        uint256 panelId,
        uint256 x,
        uint256 y,
        externalEuint32 encryptedColorExt,
        bytes calldata inputProof
    ) external {
        PanelMeta storage panel = _panels[panelId];
        if (panel.width == 0) {
            revert PanelNotFound(panelId);
        }
        if (panel.isSealed) {
            revert PanelAlreadySealed(panelId);
        }
        if (x >= panel.width || y >= panel.height) {
            revert TileOutOfBounds(panelId, x, y);
        }

        uint256 lastStroke = lastBrushAt[msg.sender];
        if (lastStroke != 0 && block.timestamp < lastStroke + BRUSH_COOLDOWN) {
            revert BrushCooldownActive(msg.sender, lastStroke + BRUSH_COOLDOWN - block.timestamp);
        }
        lastBrushAt[msg.sender] = block.timestamp;

        euint32 encryptedColor = FHE.fromExternal(encryptedColorExt, inputProof);

        TileSlot storage slot = _tiles[panelId][x][y];
        slot.encryptedColor = encryptedColor;
        slot.artisan = msg.sender;
        slot.updatedAt = uint64(block.timestamp);

        FHE.allow(slot.encryptedColor, msg.sender);
        FHE.allowThis(slot.encryptedColor);

        // Increment encrypted stroke counters.
        panel.encryptedBrushCount = FHE.add(panel.encryptedBrushCount, FHE.asEuint32(1));
        FHE.allow(panel.encryptedBrushCount, msg.sender);
        FHE.allowThis(panel.encryptedBrushCount);

        if (!FHE.isInitialized(_encryptedContributionCount[msg.sender])) {
            _encryptedContributionCount[msg.sender] = FHE.asEuint32(0);
            FHE.allowThis(_encryptedContributionCount[msg.sender]);
        }
        _encryptedContributionCount[msg.sender] =
            FHE.add(_encryptedContributionCount[msg.sender], FHE.asEuint32(1));
        FHE.allow(_encryptedContributionCount[msg.sender], msg.sender);
        FHE.allowThis(_encryptedContributionCount[msg.sender]);

        emit TileBrushed(panelId, x, y, msg.sender, euint32.unwrap(encryptedColor));
    }

    /// @notice Seals a panel to freeze further modifications.
    /// @param panelId Target panel identifier.
    function sealPanel(uint256 panelId) external {
        PanelMeta storage panel = _panels[panelId];
        if (panel.width == 0) {
            revert PanelNotFound(panelId);
        }
        if (panel.isSealed) {
            revert PanelAlreadySealed(panelId);
        }

        panel.isSealed = true;
        panel.sealedAt = uint64(block.timestamp);

        emit PanelSealed(panelId, msg.sender);
    }

    /// @notice Mints an NFT snapshot for a sealed panel.
    /// @param panelId Target panel identifier.
    /// @param loreCID IPFS CID pointing to the rendered panel and metadata payload.
    function forgePanelRelic(uint256 panelId, string calldata loreCID) external returns (uint256 relicId) {
        PanelMeta storage panel = _panels[panelId];
        if (panel.width == 0) {
            revert PanelNotFound(panelId);
        }
        if (!panel.isSealed) {
            revert PanelNotSealed(panelId);
        }
        if (_panelToRelicId[panelId] != 0) {
            revert PanelAlreadyForged(panelId);
        }

        relicId = _nextRelicId++;
        _safeMint(msg.sender, relicId);
        string memory tokenUri = string.concat("ipfs://", loreCID);
        _setTokenURI(relicId, tokenUri);

        panel.lastLoreCID = loreCID;
        _panelToRelicId[panelId] = relicId;

        emit PanelForged(panelId, relicId, msg.sender, loreCID);
    }

    /// @notice Returns summary metadata for a panel.
    function describePanel(uint256 panelId)
        external
        view
        returns (PanelMeta memory meta, uint256 relicId)
    {
        meta = _panels[panelId];
        if (meta.width == 0) {
            revert PanelNotFound(panelId);
        }
        relicId = _panelToRelicId[panelId];
    }

    /// @notice Fetches the encrypted color handle and artisan metadata for a tile.
    function viewTile(uint256 panelId, uint256 x, uint256 y) external view returns (TileView memory) {
        PanelMeta storage panel = _panels[panelId];
        if (panel.width == 0) {
            revert PanelNotFound(panelId);
        }
        if (x >= panel.width || y >= panel.height) {
            revert TileOutOfBounds(panelId, x, y);
        }

        TileSlot storage slot = _tiles[panelId][x][y];
        return TileView({
            encryptedColor: euint32.unwrap(slot.encryptedColor),
            artisan: slot.artisan,
            updatedAt: slot.updatedAt
        });
    }

    /// @notice Returns the encrypted color handle stored for a tile.
    function tileColor(uint256 panelId, uint256 x, uint256 y) external view returns (euint32) {
        PanelMeta storage panel = _panels[panelId];
        if (panel.width == 0) {
            revert PanelNotFound(panelId);
        }
        if (x >= panel.width || y >= panel.height) {
            revert TileOutOfBounds(panelId, x, y);
        }

        return _tiles[panelId][x][y].encryptedColor;
    }

    /// @notice Returns the encrypted total number of brush strokes applied to a panel.
    function panelBrushTotal(uint256 panelId) external view returns (euint32) {
        PanelMeta storage panel = _panels[panelId];
        if (panel.width == 0) {
            revert PanelNotFound(panelId);
        }
        return panel.encryptedBrushCount;
    }

    /// @notice Returns the encrypted contribution counter for an artisan address.
    function artisanContribution(address artisan) external view returns (euint32) {
        return _encryptedContributionCount[artisan];
    }

    /// @notice Utility helper returning the relic id minted for a panel (if any).
    function panelRelicId(uint256 panelId) external view returns (uint256) {
        return _panelToRelicId[panelId];
    }

}

