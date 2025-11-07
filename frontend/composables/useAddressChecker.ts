export default function (address: string, networkName: string) {
  console.log(address, networkName)
  const regexMap = [
    { network: "btc", regex: /^1[a-km-zA-HJ-NP-Z1-9]{25,34}$/ },
    { network: "btc", regex: /^3[a-km-zA-HJ-NP-Z1-9]{25,34}$/ },
    { network: "btc", regex: /^bc1[q|p][a-z0-9]{38,64}$/ },
    { network: "erc20", regex: /^0x[a-fA-F0-9]{40}$/ },
    { network: "bep-20", regex: /^0x[a-fA-F0-9]{40}$/ },
    { network: "trc-20", regex: /^T[a-zA-Z0-9]{33}$/ },
    { network: "sol", regex: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/ },
    {
      network: "ltc",
      regex: /^[LM3][a-km-zA-HJ-NP-Z1-9]{26,33}$/,
    },
    { network: "ltc", regex: /^ltc1[q|p][a-z0-9]{38,64}$/ },
    {
      network: "doge",
      regex: /^D{1}[5-9A-HJ-NP-U]{1}[1-9A-HJ-NP-Za-km-z]{32}$/,
    },
    { network: "xrp", regex: /^r[0-9a-zA-Z]{24,34}$/ },
    { network: "ada", regex: /^addr1[0-9a-z]{38,120}$/ },
    { network: "dot", regex: /^1[a-km-zA-HJ-NP-Z1-9]{47,48}$/ },
  ];

  for (let { network, regex } of regexMap) {
    if (regex.test(address) && network === networkName) {
      return true;
    }
  }

  return false;
}
