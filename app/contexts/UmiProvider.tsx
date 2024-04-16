"use client";
import React, { createContext, FC, ReactNode } from "react";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Umi } from "@metaplex-foundation/umi";
import { useWallet } from "@solana/wallet-adapter-react";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

export const UmiContext = createContext<{ umi: Umi }>({} as { umi: Umi });

export const UmiProvider: FC<{ children: ReactNode; endpoint: string }> = ({
  children,
  endpoint,
}) => {
  const wallet = useWallet();
  const umi = createUmi(endpoint)
    .use(walletAdapterIdentity(wallet))
    .use(mplTokenMetadata());

  return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
};
