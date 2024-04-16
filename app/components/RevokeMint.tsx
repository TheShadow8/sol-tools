import { ActionType } from "./ActionButton";
import RevokeCard from "./RevokeCard";

export default function RevokeMint() {
  const title = "Revoke Mint Authority";
  const desc = `Revoking mint authority ensures that no more tokens can be minted beyond the total supply, offering security and peace of mind to buyers. And It's also just ${process.env.NEXT_PUBLIC_REVOKE_FEE} SOL.`;
  const type = ActionType.RevokeMint;

  return <RevokeCard title={title} desc={desc} type={type} />;
}
