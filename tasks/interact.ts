import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
<<<<<<< HEAD
import { parseUnits } from "@ethersproject/units";
import { getAddress } from "@zetachain/protocol-contracts";
import ERC20Custody from "@zetachain/protocol-contracts/abi/evm/ERC20Custody.sol/ERC20Custody.json";
import { prepareData } from "@zetachain/toolkit/helpers";
import { utils, ethers } from "ethers";
import ERC20 from "@openzeppelin/contracts/build/contracts/ERC20.json";

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  const [signer] = await hre.ethers.getSigners();

  const data = prepareData(
    args.contract,
    [],
    []
  );

  let tx;

  if (args.token) {
    const custodyAddress = getAddress("erc20Custody", hre.network.name as any);
    const custodyContract = new ethers.Contract(
      custodyAddress,
      ERC20Custody.abi,
      signer
    );
    const tokenContract = new ethers.Contract(args.token, ERC20.abi, signer);
    const decimals = await tokenContract.decimals();
    const value = parseUnits(args.amount, decimals);
    const approve = await tokenContract.approve(custodyAddress, value);
    await approve.wait();

    tx = await custodyContract.deposit(signer.address, args.token, value, data);
    tx.wait();
  } else {
    const value = parseUnits(args.amount, 18);
    const to = getAddress("tss", hre.network.name as any);
    tx = await signer.sendTransaction({ data, to, value });
  }
=======
import { parseEther } from "@ethersproject/units";
import { getAddress } from "@zetachain/protocol-contracts";
import { prepareData } from "@zetachain/toolkit/helpers";
import bech32 from "bech32";
import { utils } from "ethers";

const main = async (args: any, hre: HardhatRuntimeEnvironment) => {
  const [signer] = await hre.ethers.getSigners();
  let recipient;
  try {
    if (bech32.decode(args.recipient)) {
      recipient = utils.solidityPack(
        ["bytes"],
        [utils.toUtf8Bytes(args.recipient)]
      );
    }
  } catch (e) {
    recipient = args.recipient;
  }

  const data = prepareData(
    args.contract,
    ["address", "bytes"],
    [args.targetToken, recipient]
  );
  const to = getAddress("tss", hre.network.name);
  const value = parseEther(args.amount);

  const tx = await signer.sendTransaction({ data, to, value });
>>>>>>> 412a84dca856e2135f943daf97cde448045baabb

  if (args.json) {
    console.log(JSON.stringify(tx, null, 2));
  } else {
    console.log(`🔑 Using account: ${signer.address}\n`);

    console.log(`🚀 Successfully broadcasted a token transfer transaction on ${hre.network.name} network.
📝 Transaction hash: ${tx.hash}
<<<<<<< HEAD
  `);
=======
`);
>>>>>>> 412a84dca856e2135f943daf97cde448045baabb
  }
};

task("interact", "Interact with the contract", main)
  .addParam("contract", "The address of the withdraw contract on ZetaChain")
  .addParam("amount", "Amount of tokens to send")
<<<<<<< HEAD
  .addOptionalParam("token", "The address of the token to send")
  .addFlag("json", "Output in JSON")
=======
  .addFlag("json", "Output in JSON")
  .addParam("targetToken")
  .addParam("recipient")
>>>>>>> 412a84dca856e2135f943daf97cde448045baabb
