type Version = {
  id: string;
  label: string;
  subtitle?: string;
  [key: string]: unknown;
};

type Props = {
  versions: Version[];
  view: "intro" | "version";
  activeId: string | null;
  selectIntro: () => void;
  selectVersion: (id: string) => void;
  updateVersion: (id: string, patch: Partial<Version>) => void;
  goPrev: () => void;
  goNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export function MobileWrapper(_props: Props) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#06070a] px-6 py-10 text-center text-white">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.3em] text-[#dfe66a]">Payer</p>
        <h1 className="mt-3 text-2xl font-semibold">Simple, merchant-first flows.</h1>
        <p className="mt-3 text-sm leading-7 text-white/70">
          This wrapper now serves as a lightweight shell for the Payer product instead of the old template presentation.
        </p>
      </div>
    </div>
  );
}
