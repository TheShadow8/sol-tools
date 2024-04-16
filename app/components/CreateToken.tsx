"use client";
import React, { useCallback, useContext, useState } from "react";
import ActionButton, { ActionType } from "./ActionButton";
import { PublicKey, sol } from "@metaplex-foundation/umi";

import {
  createAndMint,
  TokenStandard,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
import { UmiContext } from "@/app/contexts/UmiProvider";
import { transferSol } from "@metaplex-foundation/mpl-toolbox";
import FormElement from "./FormElement";
import Image from "next/image";
import { toast } from "react-toastify";

export default function CreateToken() {
  const { umi } = useContext(UmiContext);

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [tokenName, setTokenName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [decimals, setDecimals] = useState<number>(0);
  const [error, setError] = useState<{ name: string; message: string }>({
    name: "",
    message: "",
  });

  const [imageError, setImageError] = useState<string>("");
  const [inputKey, setInputKey] = useState<string>(Date.now().toString());

  const [isProccess, setIsProccess] = useState<boolean>(false);

  function clearForm() {
    setTokenName("");
    setSymbol("");
    setAmount(0);
    setDecimals(0);
    setDescription("");
    setPreviewImage(null);
    setInputKey(Date.now().toString());
    setError({ name: "", message: "" });
  }

  const createToken = useCallback(async () => {
    if (!decimals || decimals <= 0 || decimals > 9) {
      setError({ name: "decimals", message: "Invalid decimals" });
      return;
    }

    if (!amount || amount <= 0 || amount > 1000000000) {
      setError({ name: "supply", message: "Invalid amount" });
      return;
    }

    // validate name , symbol and description with regex text numbers and length
    const nameRegex = /^[a-zA-Z0-9\s]{1,10}$/;
    const symbolRegex = /^[a-zA-Z0-9]{1,8}$/;
    const descriptionRegex = /^[a-zA-Z0-9\s]{0,100}$/;

    if (!nameRegex.test(tokenName)) {
      setError({ name: "name", message: "Invalid name" });
      return;
    }

    if (!symbolRegex.test(symbol)) {
      setError({ name: "symbol", message: "Invalid symbol" });
      return;
    }

    if (!descriptionRegex.test(description)) {
      setError({ name: "description", message: "Invalid description" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedImage as File);
      formData.append("name", tokenName);
      formData.append("symbol", symbol);
      formData.append("description", description);

      setIsProccess(true);

      const res = await fetch("/api/token", {
        method: "POST",
        body: formData,
      });

      const { metaUrl } = await res.json();

      if (!metaUrl) {
        throw new Error(
          "ERROR when create token metadata. Please try again !!!"
        );
      }

      const mint = generateSigner(umi);

      await createAndMint(umi, {
        mint,
        name: tokenName,
        symbol: symbol,
        uri: metaUrl,
        sellerFeeBasisPoints: percentAmount(0),
        decimals,
        amount: amount * Math.pow(10, decimals),
        tokenStandard: TokenStandard.Fungible,
      })
        .add(
          transferSol(umi, {
            destination: process.env.NEXT_PUBLIC_PAY_WALLET as PublicKey,
            amount: sol(
              parseFloat(process.env.NEXT_PUBLIC_CREATE_FEE as string) || 0.05
            ),
          })
        )
        .sendAndConfirm(umi);

      toast.success(
        `You have created and mint a new ${tokenName} TOKEN SUCCESSFULLY !!!`
      );

      clearForm();
      setIsProccess(false);
    } catch (error) {
      toast.error(
        `ERROR when creating a new ${tokenName}. Please try again !!!`
      );
      setIsProccess(false);
      clearForm();
    }
  }, [tokenName, symbol, decimals, amount, selectedImage, description, umi]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageError("");

    if (file) {
      if (file.size > 2097152) {
        setImageError("Image must be less than 2MB");
        setInputKey(Date.now().toString());
        setPreviewImage(null);
        return;
      }

      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setPreviewImage(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Solana Token Creator</h1>
        <p className="text-base">
          The cheapest Solana token creation tool on the market.
          <br />
          Cheapest, friendly, and fast.
        </p>
      </div>
      <div
        style={{
          borderRadius: "21.2px",
          padding: "1.2px",
          backgroundImage:
            "linear-gradient(var(--gradient-rotate, 246deg), #da2eef 7.97%, #2b6aff 49.17%, #39d0d8 92.1%)",
        }}
        className="relative cyberpunk-bg-light mt-14"
      >
        <div className="flex flex-col relative height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium transition-transform-background motion-reduce:transition-none z-10 bg-cyberpunk-card-bg rounded-[21.2px]">
          <div className="relative flex w-full p-3 flex-auto flex-col place-content-inherit align-items-inherit h-auto break-words text-left overflow-hidden subpixel-antialiased py-5 px-3 lg:py-8 lg:px-6">
            <form>
              <div className="gap-4 flex flex-col">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="group flex flex-col w-full group relative justify-end">
                      <div className="h-full flex flex-col">
                        <div
                          className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-unit-10 min-h-unit-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background"
                          style={{ cursor: "text" }}
                        >
                          <FormElement
                            error={error}
                            label="Name"
                            name="name"
                            type="text"
                            value={tokenName}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setError({ name: "name", message: "" });
                              setTokenName(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="group flex flex-col w-full group relative justify-end ">
                      <div className="h-full flex flex-col">
                        <div
                          className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-unit-10 min-h-unit-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background"
                          style={{ cursor: "text" }}
                        >
                          <FormElement
                            error={error}
                            label="Symbol"
                            name="symbol"
                            type="text"
                            value={symbol}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setError({ name: "symbol", message: "" });
                              setSymbol(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-4">
                    <div>
                      <div className="group flex flex-col w-full group relative justify-end ">
                        <div className="h-full flex flex-col">
                          <div
                            className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-unit-10 min-h-unit-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background"
                            style={{ cursor: "text" }}
                          >
                            <FormElement
                              error={error}
                              label="Decimals"
                              name="decimals"
                              type="number"
                              value={decimals || ""}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setError({ name: "decimals", message: "" });
                                setDecimals(parseInt(e.target.value, 10));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="group flex flex-col w-full group relative justify-end ">
                        <div className="h-full flex flex-col">
                          <div
                            className="relative w-full inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-unit-10 min-h-unit-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background"
                            style={{ cursor: "text" }}
                          >
                            <FormElement
                              error={error}
                              label="Supply"
                              name="supply"
                              type="number"
                              value={amount || ""}
                              onChange={(
                                e: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setError({ name: "supply", message: "" });
                                setAmount(parseInt(e.target.value, 10));
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="grow flex flex-col">
                    <span className="font-semibold relative -top-1">Image</span>
                    <div className="bg-default-100 grow rounded-medium grid place-content-center cursor-pointer">
                      <input
                        type="file"
                        placeholder=" "
                        accept="image/*"
                        key={inputKey}
                        onChange={handleImageChange}
                      />
                      {imageError && (
                        <p className="text-red-500 mt-2 text-xs italic">
                          {imageError}
                        </p>
                      )}
                      {previewImage && (
                        <Image
                          className="mt-2 rounded-full"
                          height={100}
                          width={100}
                          src={previewImage}
                          alt="Preview"
                        />
                      )}
                      {/* <ImageUploader setSelectedImage={setSelectedImage} /> */}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="group flex flex-col w-full">
                    <div
                      className="relative w-full tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 h-unit-10 min-h-unit-10 rounded-medium !h-auto transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background py-2"
                      style={{ cursor: "text" }}
                    >
                      <FormElement
                        error={error}
                        label="Description"
                        name="description"
                        type="textarea"
                        value={description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setDescription(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <ActionButton
                  actionType={ActionType.CreateToken}
                  onClick={async (e) => {
                    e.preventDefault();
                    await createToken();
                  }}
                  label="Create Token"
                  setIsProccess={setIsProccess}
                  isProccess={isProccess}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
