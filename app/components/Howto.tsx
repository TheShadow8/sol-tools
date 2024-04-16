import React from "react";

export default function Howto() {
  return (
    <div>
      <div className="flex flex-col gap-5 mb-10">
        <h1 className="text-2xl font-bold">Create Solana Token</h1>
        <p className="text-base">
          Let&apos;s make it happen! Easily create your own Solana SPL Token
          with our simple 7+1 step process - no coding necessary.
        </p>
        <p className="text-base">
          Make your Solana Token uniquely yours! In just under 5 minutes, and at
          a lowest cost, transform your vision into reality.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">How to use Solana Token Creator</h1>
        <p className="text-base">1. First up, connect your Solana wallet.</p>
        <p className="text-base">
          2. Next, let&apos;s name your Token. Choose a name that best
          represents your project.
        </p>
        <p className="text-base">
          3. Now, pick a symbol for your Token (maximum 8 characters).
        </p>
        <p className="text-base">
          4. Decide on the number of decimals: 0 for a Whitelist Token, 5 for a
          utility Token, or 9 for a meme token.
        </p>
        <p className="text-base">
          5. Give a brief description of your SPL Token, so everyone knows what
          it&apos;s all about.
        </p>
        <p className="text-base">
          6. Upload an image for your token in PNG format.
        </p>
        <p className="text-base">
          7. Determine the supply of your Token - how many do you want out there
        </p>
        <p className="text-base">
          8. Hit that create button, accept the transaction, and then sit back
          and wait for your tokens to be ready.
        </p>
        <p className="text-base">
          And here&apos;s the deal: the cost of Token creation is just{" "}
          {process.env.NEXT_PUBLIC_CREATE_FEE} SOL, covering all fees for SPL
          Token Creation
        </p>
        <p className="text-base">
          Once the creation process kicks off, it&apos;ll be done in a jiffy!
          Once it&apos;s complete, you&apos;ll find the total supply of the
          token in your wallet.
        </p>
        <p className="text-base">
          With your wallet, you have the power to manage your token, create
          additional supply, or even freeze it as needed. Enjoy the simplicity
          and affordability of Solana Token creation with our super-friendly
          platform.
        </p>
      </div>
    </div>
  );
}
