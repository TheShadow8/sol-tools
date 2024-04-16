"use client";
import ActionButton, { ActionType } from "./ActionButton";
import SelectToken from "@/app/components/SelectToken";
import React, { useState } from "react";

type RevokeCardProps = {
  title: string;
  desc: string;
  type: ActionType;
};

export default function RevokeCard({ title, desc, type }: RevokeCardProps) {
  const [chooseToken, setChooseToken] = useState<string>("");
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isProccess, setIsProccess] = useState<boolean>(false);

  const label =
    type === ActionType.RevokeMint
      ? "Revoke Mint Authority"
      : "Revoke Freeze Authority";

  return (
    <div>
      <div
        style={{
          borderRadius: "21.2px",
          padding: "1.2px",
          backgroundImage:
            "linear-gradient(var(--gradient-rotate, 246deg), #da2eef 7.97%, #2b6aff 49.17%, #39d0d8 92.1%)",
        }}
        className="relative"
      >
        <div className="flex flex-col relative height-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-medium transition-transform-background motion-reduce:transition-none bg-cyberpunk-card-bg rounded-[21.2px]">
          <div className="flex p-3 w-full justify-start items-center shrink-0 overflow-inherit color-inherit subpixel-antialiased rounded-t-large pt-4 px-3 lg:pt-8 lg:px-6">
            <div className="flex flex-col gap-3">
              <span className="text-lg font-bold">{title}</span>
              <span className="text-sm">{desc}</span>
            </div>
          </div>
          <div className="relative flex w-full p-3 flex-auto flex-col break-words text-left overflow-y-unset subpixel-antialiased pb-4 px-3 lg:pb-8 lg:px-6">
            <div className="flex flex-col gap-4 w-full">
              <SelectToken
                done={done}
                actionType={type}
                setChooseToken={setChooseToken}
              />
              {!chooseToken && error && (
                <p className="text-red-500 text-xs italic">{error}</p>
              )}

              <ActionButton
                actionType={type}
                chooseToken={chooseToken}
                setDone={setDone}
                label={label}
                setIsProccess={setIsProccess}
                isProccess={isProccess}
                setError={setError}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
