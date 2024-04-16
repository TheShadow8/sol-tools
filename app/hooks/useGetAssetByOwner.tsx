"use client";
import { useState, useEffect } from "react";
import {
  DigitalAsset,
  fetchAllDigitalAssetByOwner,
} from "@metaplex-foundation/mpl-token-metadata";

import { PublicKey, Umi } from "@metaplex-foundation/umi";

export default function useGetAssetByOwner(
  umi: Umi,
  ownerPublicKey: PublicKey | null
) {
  const [assets, setAssets] = useState<DigitalAsset[]>([]);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const fetchAssets = async () => {
      if (!ownerPublicKey) {
        return;
      }
      try {
        const assets = await fetchAllDigitalAssetByOwner(umi, ownerPublicKey);

        setAssets(assets);
      } catch (error) {
        setError(error);
      }
    };

    fetchAssets();
  }, [umi, ownerPublicKey]);

  return { assets, error };
}
