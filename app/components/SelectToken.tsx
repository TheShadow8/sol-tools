"use client";
import React, { use, useContext, useEffect, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { UmiContext } from "@/app/contexts/UmiProvider";
import useGetAssetByOwner from "@/app/hooks/useGetAssetByOwner";
import { PublicKey } from "@metaplex-foundation/umi";
import Select from "react-select";
import { SingleValue } from "react-select";
import { ActionType } from "./ActionButton";

export type OptionType = {
  label: string;
  value: PublicKey;
};

function SelectToken({
  setChooseToken,
  actionType,
  done,
}: {
  done: boolean;
  actionType: ActionType;
  setChooseToken: (token: string) => void;
}) {
  const wallet = useWallet();
  const { umi } = useContext(UmiContext);

  const { assets } = useGetAssetByOwner(
    umi,
    wallet.publicKey?.toBase58() as PublicKey
  );

  const [selectedOption, setSelectedOption] =
    useState<SingleValue<OptionType>>();

  useEffect(() => {
    if (done) {
      setChooseToken("");
      setSelectedOption(null);
    }
  }, [done, setChooseToken]);

  const options = assets
    .filter(
      (asset) =>
        (actionType === ActionType.RevokeFreeze &&
          asset.mint.freezeAuthority.__option === "Some") ||
        (actionType === ActionType.RevokeMint &&
          asset.mint.mintAuthority.__option === "Some")
    )
    .map((asset) => {
      return {
        label: asset.metadata.name,
        value: asset.publicKey,
      };
    });

  return (
    <Select
      placeholder="Select Token"
      value={selectedOption}
      onChange={(e) => {
        setSelectedOption(e);
        if (e?.value) {
          setChooseToken(e.value);
        }
      }}
      options={options}
      className="text-black h-full"
    />
  );
}

export default SelectToken;
