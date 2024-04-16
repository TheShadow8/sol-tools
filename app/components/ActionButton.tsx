"use client";
import React, { useCallback, useContext } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import { UmiContext } from "@/app/contexts/UmiProvider";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  AuthorityType,
  createSetAuthorityInstruction,
} from "@solana/spl-token";
import { toast } from "react-toastify";

export enum ActionType {
  CreateToken = 3,
  RevokeMint = AuthorityType.MintTokens,
  RevokeFreeze = AuthorityType.FreezeAccount,
}

export default function ActionButton({
  label,
  actionType,
  chooseToken,
  onClick,
  setIsProccess,
  isProccess,
  setError,
  setDone,
}: {
  label: string;
  actionType: ActionType;
  onClick?: (e: any) => void;
  chooseToken?: string;
  isProccess: boolean;
  setIsProccess: React.Dispatch<React.SetStateAction<boolean>>;
  setError?: React.Dispatch<React.SetStateAction<string>>;
  setDone?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { umi } = useContext(UmiContext);

  const wallet = useWallet();
  const { connection } = useConnection();

  const onClickRevoke = useCallback(async () => {
    try {
      if (!chooseToken || !wallet.publicKey) {
        setError && setError("Please select a token");
        return;
      }

      const handleRevoke = async (actionType: ActionType) => {
        console.log(
          `----- RevokeMint.tsx:28 chooseToken : \n ${JSON.stringify(
            chooseToken
          )} \n-----`
        );

        const revokeFee =
          parseFloat(process.env.NEXT_PUBLIC_REVOKE_FEE as string) || 0.01;

        const lamports = revokeFee * LAMPORTS_PER_SOL;

        setIsProccess(true);

        const transaction = new Transaction().add(
          createSetAuthorityInstruction(
            new PublicKey(chooseToken),
            wallet.publicKey as PublicKey,
            actionType.valueOf(),
            null
          ),
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey as PublicKey,
            toPubkey: new PublicKey(
              process.env.NEXT_PUBLIC_PAY_WALLET as string
            ),
            lamports,
          })
        );

        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight },
        } = await connection.getLatestBlockhashAndContext();

        const signature = await wallet.sendTransaction(
          transaction,
          connection,
          {
            minContextSlot,
          }
        );

        await connection.confirmTransaction({
          blockhash,
          lastValidBlockHeight,
          signature,
        });
      };

      switch (actionType) {
        case ActionType.CreateToken:
          break;

        default:
          await handleRevoke(actionType);
          break;
      }

      toast.success(
        `You have revoked ${
          actionType === 0 ? "mint" : "freeze"
        } authority SUCCESSFULLY !!!`
      );

      setDone && setDone(true);
      setIsProccess(false);
    } catch (error) {
      console.log(
        `----- RevokeMint.tsx:26 error : \n ${JSON.stringify(error)} \n-----`
      );

      setIsProccess(false);

      toast.error(
        `ERROR when revoking ${
          actionType === 0 ? "mint" : "freeze"
        } authority. Please try again !!!`
      );
    }
  }, [actionType, chooseToken, connection, setDone, setIsProccess, wallet]);

  const className =
    "z-0 group relative inline-flex items-center justify-center bg-[#512da8] p-3 font-semibold rounded-md hover:bg-black";

  return (
    <>
      {wallet.connected ? (
        <button
          disabled={isProccess}
          className={className}
          onClick={
            actionType === ActionType.CreateToken ? onClick : onClickRevoke
          }
        >
          {isProccess ? "Proccessing..." : label}
        </button>
      ) : (
        <WalletMultiButton
          style={{ width: "100%", justifyContent: "center" }}
          className={className}
        />
      )}
    </>
  );
}
