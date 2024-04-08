import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { ChainId } from "@uniswap/sdk-core";

interface UniswapQuoteRequest {
  tokenInChainId: number;
  tokenIn: string;
  tokenOutChainId: number;
  tokenOut: string;
  amount: string;
  sendPortionEnabled: boolean;
  type: string;
  intent: string;
  configs: Array<{
    protocols: string[];
    enableUniversalRouter: boolean;
    routingType: string;
    recipient: string;
    enableFeeOnTransferFeeFetching: boolean;
  }>;
}

interface UniswapQuoteResponse {
  quote: string;
}
interface UniswapQuoteRequets {
  recipient: string;
  tokenIn: string;
  tokenOut: string;
  amount:string;
}

const fetchUniswapQuote = async ({recipient,tokenIn,tokenOut,amount}:UniswapQuoteRequets): Promise<UniswapQuoteResponse> => {
  const body: UniswapQuoteRequest = {
    tokenInChainId: ChainId.MAINNET,
    tokenIn,
    tokenOutChainId: ChainId.MAINNET,
    tokenOut,
    amount,
    sendPortionEnabled: true,
    type: "EXACT_INPUT",
    intent: "quote",
    configs: [
      {
        protocols: ["V2", "V3", "MIXED"],
        enableUniversalRouter: true,
        routingType: "CLASSIC",
        recipient,
        enableFeeOnTransferFeeFetching: true,
      },
    ],
  };

  const response = await fetch(
    // "https://ohtgzyo4va.execute-api.us-east-2.amazonaws.com/prod/quote",
    "https://interface.gateway.uniswap.org/v2/quote",
    {
      method: "POST",
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }

  return response.json() as Promise<UniswapQuoteResponse>;
};

export const useUniswapQuote = ({recipient, tokenIn, tokenOut, amount}:UniswapQuoteRequets): UseQueryResult<
  UniswapQuoteResponse,
  Error
> => {
  return useQuery<UniswapQuoteResponse, Error>({
    queryKey: ["uniswapQuote"],
    queryFn: () => fetchUniswapQuote({ recipient, tokenIn, tokenOut, amount }),
  });
};
