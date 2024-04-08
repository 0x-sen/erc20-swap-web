import { http, createConfig } from "wagmi";
import { mainnet, sepolia, arbitrum } from "wagmi/chains";

export const config = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
    // [sepolia.id]: http(),
    // [arbitrum.id]: http(),
  },
});
