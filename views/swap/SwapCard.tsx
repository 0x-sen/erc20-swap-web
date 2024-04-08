import { ethers } from 'ethers';
import { useUniswapQuote } from '../../hooks/data/useUniswapQuote'
import { useCallback } from 'react'
import { useAccount } from 'wagmi';

const SwapCard = () => {
  const { address } = useAccount()
  const { data } = useUniswapQuote({
    recipient: address as string,
    tokenIn: "ETH",
    // tokenIn: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
    tokenOut: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    amount: "1000000000000000" // 0.001
  });
  const swap = useCallback(async () => {
    // @ts-ignore
    if (!data?.quote?.methodParameters) {
      console.error("Transaction data is missing");
      return;
    }
    // @ts-ignore
    const { calldata, to, value } = data?.quote?.methodParameters || {}
    if (!window?.ethereum) {
      return
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    // const { calldata, value } = getSwapMethodParameters({
    //   permit2Signature,
    //   trade,
    //   address,
    //   ...getFees(trade),
    // })
    const signer = provider.getSigner();
    const tx = await signer.sendTransaction({
      from: address,
      to,
      data: calldata,
      value,
    });
    const res = await tx.wait()
    console.log('res', res);
  }, [data, address])
  return (
    <div>
      <button onClick={swap}>swap</button>
    </div>
  )
}

export default SwapCard