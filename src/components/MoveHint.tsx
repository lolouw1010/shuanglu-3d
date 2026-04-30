type MoveHintProps = {
  message: string;
};

export function MoveHint({ message }: MoveHintProps) {
  return (
    <div className="rounded border border-amber-200/20 bg-[#271513]/88 px-4 py-3 text-sm text-amber-50">
      <span className="mr-2 text-amber-200/75">当前：</span>
      <span>{message}</span>
    </div>
  );
}
