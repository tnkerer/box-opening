# box-opening
A node.js script to public metadata to IPFS and update an ERC721 token URI. This script is used for updating NFT data in the event of Gacha-like box opening.

# Usage

```sh
node metadata.js [rarity(string)] [tokenid(int)]
```

Example:

```sh
node metadata.js "rare" 1
```

The node application will take six different rarities: `"common"`, `"rare"`, `"srare"`, `"epic"`, `"legend"` and `"slegend"`.

For more context on the values and rarities used in this script, please refer to [THIS!](https://whitepaper.planethorse.me/english-version-1.1/presales/presale-coming-soon-2022)

<p align="center">
  <img src="https://github.com/menezesphill/box-opening/blob/master/img/integration.png" alt="Box Opening Diagram"/>
</p>
