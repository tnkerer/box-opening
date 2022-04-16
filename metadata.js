const ethers = require("ethers");
const artifacts = require("./abi/PlanetHorseNFT.json");
const axios = require("axios");
const tokenTier = process.argv[2];
const tokenId = process.argv[3];
const {
  pinataApiKey,
  pinataSecretApiKey,
  signerPrivateKey,
  SpeedyNodeURL,
  IPFSBaseUrl,
} = require("./secrets.json");

// Randomizer

function populateChoices(values_, weights_) {
  let filledArray = [];
  for (var i = 0; i < values_.length; i++) {
    for (var j = 0; j < weights_[i]; j++) {
      filledArray.push(values_[i]);
    }
  }
  return filledArray;
}

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

// Data Sets for Randomizer

var commonDataset = {
  rarity: "Common",
  speed: choose(populateChoices([1, 2, 3, 4], [20, 20, 30, 30])),
  susten: choose(populateChoices([1, 2, 3, 4], [20, 20, 30, 30])),
  power: choose(populateChoices([1, 2, 3, 4], [20, 20, 30, 30])),
  sprint: choose(populateChoices([1, 2, 3, 4], [20, 20, 30, 30])),
  image: choose(
    populateChoices(
      [
        ["common1.gif", "Dark Brown Horse"],
        ["common2.gif", "Gray Horse"],
        ["common3.gif", "White Horse"],
        ["common4.gif", "Light Yellow Horse"],
        ["common5.gif", "Reddish Horse"],
        ["common6.gif", "Light Gray Horse"],
      ],
      [17, 17, 16, 16, 17, 17]
    )
  ),
  energy: 60,
};

var rareDataset = {
  rarity: "Rare",
  speed: choose(populateChoices([4, 5, 6, 7, 8], [20, 20, 20, 20, 20])),
  susten: choose(populateChoices([4, 5, 6, 7, 8], [20, 20, 20, 20, 20])),
  power: choose(populateChoices([4, 5, 6, 7, 8], [20, 20, 20, 20, 20])),
  sprint: choose(populateChoices([4, 5, 6, 7, 8], [20, 20, 20, 20, 20])),
  image: choose(
    populateChoices(
      [
        ["rare1.gif", "Blue Horse"],
        ["rare2.gif", "Cyan Horse"],
        ["rare3.gif", "Dark Green Horse"],
        ["rare4.gif", "Green Horse"],
        ["rare5.gif", "Orange Horse"],
        ["rare6.gif", "Pink Horse"],
      ],
      [17, 17, 16, 16, 17, 17]
    )
  ),
  energy: 75,
};

var srareDataset = {
  rarity: "Super Rare",
  speed: choose(populateChoices([8, 9, 10, 11, 12], [20, 20, 20, 20, 20])),
  susten: choose(populateChoices([8, 9, 10, 11, 12], [20, 20, 20, 20, 20])),
  power: choose(populateChoices([8, 9, 10, 11, 12], [20, 20, 20, 20, 20])),
  sprint: choose(populateChoices([8, 9, 10, 11, 12], [20, 20, 20, 20, 20])),
  image: choose(
    populateChoices(
      [
        ["srare1.gif", "Black Evil Horse"],
        ["srare2.gif", "Blue Evil Horse"],
        ["srare3.gif", "Purple Evil Horse"],
        ["srare4.gif", "Green Evil Horse"],
        ["srare5.gif", "Happy Yellow Horse"],
        ["srare6.gif", "Pink Love Horse"],
      ],
      [17, 17, 16, 16, 17, 17]
    )
  ),
  energy: 90,
};

var epicDataset = {
  rarity: "Epic",
  speed: choose(populateChoices([12, 13, 14, 15, 16], [20, 20, 20, 20, 20])),
  susten: choose(populateChoices([12, 13, 14, 15, 16], [20, 20, 20, 20, 20])),
  power: choose(populateChoices([12, 13, 14, 15, 16], [20, 20, 20, 20, 20])),
  sprint: choose(populateChoices([12, 13, 14, 15, 16], [20, 20, 20, 20, 20])),
  image: choose(
    populateChoices(
      [
        ["epic1.gif", "Wooden Horse"],
        ["epic2.gif", "Exquisite Black Horse"],
        ["epic3.gif", "Rainbow Unicorn"],
        ["epic4.gif", "Void Mare"],
        ["epic5.gif", "Exquisite White Horse"],
      ],
      [20, 20, 20, 20, 20]
    )
  ),
  energy: 105,
};

var legendDataset = {
  rarity: "Legendary",
  speed: choose(populateChoices([16, 17, 18, 19, 20], [20, 20, 20, 20, 20])),
  susten: choose(populateChoices([16, 17, 18, 19, 20], [20, 20, 20, 20, 20])),
  power: choose(populateChoices([16, 17, 18, 19, 20], [20, 20, 20, 20, 20])),
  sprint: choose(populateChoices([16, 17, 18, 19, 20], [20, 20, 20, 20, 20])),
  image: choose(
    populateChoices(
      [
        ["legend1.gif", "Undead Horse"],
        ["legend2.gif", "Ghost Horse"],
        ["legend3.gif", "Invisible Horse"],
        ["legend4.gif", "Nightmare"],
      ],
      [25, 25, 25, 25]
    )
  ),
  energy: 120,
};

var slegendDataset = {
  rarity: "Super Legendary",
  speed: choose(populateChoices([20, 21, 22, 23, 24], [20, 20, 20, 20, 20])),
  susten: choose(populateChoices([20, 21, 22, 23, 24], [20, 20, 20, 20, 20])),
  power: choose(populateChoices([20, 21, 22, 23, 24], [20, 20, 20, 20, 20])),
  sprint: choose(populateChoices([20, 21, 22, 23, 24], [20, 20, 20, 20, 20])),
  image: choose(
    populateChoices(
      [
        ["slegend1.gif", "Glitch Horse"],
        ["slegend2.gif", "Wildfire"],
        ["slegend3.gif", "Hologram Horse"],
      ],
      [33, 34, 33]
    )
  ),
  energy: 135,
};

// Creating JSON metadata

function setDataset(tokenTier_) {
  let dataset;
  if (tokenTier_ == "common")
    dataset = choose(
      populateChoices(
        [
          commonDataset,
          rareDataset,
          srareDataset,
          epicDataset,
          legendDataset,
          slegendDataset,
        ],
        [400, 300, 200, 70, 25, 5]
      )
    );
  if (tokenTier_ == "rare")
    dataset = choose(
      populateChoices(
        [
          commonDataset,
          rareDataset,
          srareDataset,
          epicDataset,
          legendDataset,
          slegendDataset,
        ],
        [200, 400, 200, 125, 70, 5]
      )
    );
  if (tokenTier_ == "srare")
    dataset = choose(
      populateChoices(
        [
          commonDataset,
          rareDataset,
          srareDataset,
          epicDataset,
          legendDataset,
          slegendDataset,
        ],
        [150, 250, 400, 125, 70, 5]
      )
    );
  if (tokenTier_ == "epic")
    dataset = choose(
      populateChoices(
        [
          commonDataset,
          rareDataset,
          srareDataset,
          epicDataset,
          legendDataset,
          slegendDataset,
        ],
        [75, 125, 300, 400, 80, 20]
      )
    );
  if (tokenTier_ == "legend")
    dataset = choose(
      populateChoices(
        [
          commonDataset,
          rareDataset,
          srareDataset,
          epicDataset,
          legendDataset,
          slegendDataset,
        ],
        [15, 85, 200, 200, 400, 100]
      )
    );
  if (tokenTier_ == "slegend")
    dataset = choose(
      populateChoices(
        [
          commonDataset,
          rareDataset,
          srareDataset,
          epicDataset,
          legendDataset,
          slegendDataset,
        ],
        [0, 0, 0, 10, 50, 40]
      )
    );
  return dataset;
}

dataset = setDataset(tokenTier);

var metadata = {
  name: dataset.image[1],
  image: `${IPFSBaseUrl}${dataset.image[0]}`,
  tokenId: tokenId,
  description:
    "Planet Horse first generation horse. This is a horse that you can trade, race and breed. This is a first edition collectible and shows you are an early supporter of the Planet Horse Family!",
  attributes: [
    {
      trait_type: "Rarity",
      value: dataset.rarity,
    },
    {
      trait_type: "Energy",
      value: dataset.energy,
    },
    {
      trait_type: "Speed",
      value: dataset.speed,
      max_value: 24,
    },
    {
      trait_type: "Susten",
      value: dataset.susten,
      max_value: 24,
    },
    {
      trait_type: "Power",
      value: dataset.power,
      max_value: 24,
    },
    {
      trait_type: "Sprint",
      value: dataset.sprint,
      max_value: 24,
    },
  ],
};

// @dev you can check if the metadata is correct by toggling off the following comment:
//console.log(metadata)

// Writing to the blockchain the address pointing to the Metadata on IPFS

// Declaring Blockchain variables
const ethersProvider = new ethers.providers.JsonRpcProvider(SpeedyNodeURL);
const planetHorseABI = artifacts.abi;
const planetHorseAddress = artifacts.networks[80001].address;
const wallet = new ethers.Wallet(signerPrivateKey, ethersProvider);
const planetHorseContract = new ethers.Contract(
  planetHorseAddress,
  planetHorseABI,
  wallet
);

// @dev you can check if the eth node provider is working by toggling the following block comment:
/* ethersProvider.getBlockNumber().then((result) => {
  console.log("Current Block Number:" + result);
}); */

const updateURI = async (planetHorseContract_, ipfsHash_, tokenId_) => {
  try {
    planetHorseContract_
      .setRevealedURI(
        `https://gateway.pinata.cloud/ipfs/${ipfsHash_}`,
        tokenId_
      )
      .then((transferResult) => {
        console.log(transferResult);
      });
  } catch (error) {
    console.log(error);
  }
};

// Uploading Metadata to IPFS

const pinJSONToIPFS = async () => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  const res = await axios
    .post(url, metadata, {
      maxContentLength: "Infinity",
      headers: {
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then(async function (response) {
      var IPFSHash = await response.data.IpfsHash;
      console.log(`https://gateway.pinata.cloud/ipfs/${IPFSHash}`);
      updateURI(planetHorseContract, IPFSHash, tokenId);
    });
};

pinJSONToIPFS();
