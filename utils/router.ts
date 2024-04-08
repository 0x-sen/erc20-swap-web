import { Percent } from '@uniswap/sdk-core'
import {
  FlatFeeOptions,
  SwapOptions as UniversalRouterSwapOptions,
  SwapRouter as UniversalSwapRouter,
} from '@uniswap/universal-router-sdk'
import { FeeOptions } from '@uniswap/v3-sdk'


export const slippageToleranceToPercent = (slippage: number): Percent => {
  const basisPoints = Math.round(slippage * 100)
  return new Percent(basisPoints, 10_000)
}


interface MethodParameterArgs {
  permit2Signature?: any
  trade: any
  address: string
  feeOptions?: FeeOptions
  flatFeeOptions?: FlatFeeOptions
}

export const getSwapMethodParameters = ({
  permit2Signature,
  trade,
  address,
  feeOptions,
  flatFeeOptions,
}: MethodParameterArgs): { calldata: string; value: string } => {
  const slippageTolerancePercent = slippageToleranceToPercent(trade.slippageTolerance)
  const baseOptions = {
    slippageTolerance: slippageTolerancePercent,
    recipient: address,
    fee: feeOptions,
    flatFee: flatFeeOptions,
  }

  const universalRouterSwapOptions: UniversalRouterSwapOptions = permit2Signature
    ? {
        ...baseOptions,
        inputTokenPermit: {
          signature: permit2Signature.signature,
          ...permit2Signature.permitMessage,
        },
      }
    : baseOptions
  return UniversalSwapRouter.swapERC20CallParameters(trade, universalRouterSwapOptions)
}