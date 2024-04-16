import { ActionType } from "./ActionButton";
import RevokeCard from "./RevokeCard";

export default function RevokeFreeze() {
  const title = "Are you going to Create a Liquidity Pool?";
  const desc = `You'll need to "Revoke Freeze Authority" of the Token first. No worries, you can take care of that right here. And guess what? It's just ${process.env.NEXT_PUBLIC_REVOKE_FEE} SOL.`;
  const type = ActionType.RevokeFreeze;

  return <RevokeCard title={title} desc={desc} type={type} />;
}
