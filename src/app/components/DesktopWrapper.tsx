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
  projectTitle: string;
  setProjectTitle: (v: string) => void;
  selectIntro: () => void;
  selectVersion: (id: string) => void;
  addVersion: () => void;
  renameVersion: (id: string, label: string) => void;
  duplicateVersion: (id: string) => void;
  deleteVersion: (id: string) => void;
  updateVersion: (id: string, patch: Partial<Version>) => void;
  goPrev: () => void;
  goNext: () => void;
  canPrev: boolean;
  canNext: boolean;
};

export function DesktopWrapper(_props: Props) {
  return (
    <div className="flex h-full items-center justify-center bg-[#06070a] px-8 text-center text-white">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.3em] text-[#dfe66a]">Payer</p>
        <h1 className="mt-3 text-3xl font-semibold">A focused storefront and finance experience.</h1>
        <p className="mt-4 text-sm leading-7 text-white/70">
          The template scaffolding has been removed in favor of a simpler product experience for merchants and customers.
        </p>
      </div>
    </div>
  );
}
