export function SpecialRibbon() {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-10 h-36 w-36 overflow-hidden">
      <div className="absolute top-[1.7rem] -left-[3.4rem] flex w-[12.5rem] rotate-[-45deg] flex-col items-center justify-center bg-red-600 py-2 text-center text-[11px] font-extrabold leading-[1.1] tracking-[0.18em] text-white uppercase shadow-[0_1px_3px_rgba(0,0,0,0.28)]">
        <span>Monthly</span>
        <span>Special</span>
      </div>
    </div>
  );
}
