export default function FreshFitsLoader({ size = 64 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="overflow-visible"
    >
      {/* Outer brush stroke circle - main stroke */}
      <path
        d="M 85 50 
           C 85 70, 70 88, 50 88 
           C 30 88, 12 70, 12 50 
           C 12 30, 28 15, 50 14 
           C 72 13, 88 30, 85 50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="[stroke-dasharray:280] [stroke-dashoffset:280] animate-[draw_1.8s_ease-in-out_infinite]"
      />

      {/* Secondary circle stroke for brush texture - slightly offset */}
      <path
        d="M 83 48 
           C 84 68, 68 85, 50 86 
           C 32 87, 14 68, 15 50 
           C 16 32, 32 16, 50 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
        className="[stroke-dasharray:200] [stroke-dashoffset:200] animate-[draw_1.8s_ease-in-out_0.1s_infinite]"
      />

      {/* Third stroke for more texture - inner */}
      <path
        d="M 86 52 
           C 86 72, 72 89, 52 89"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
        className="[stroke-dasharray:80] [stroke-dashoffset:80] animate-[draw_1.8s_ease-in-out_0.15s_infinite]"
      />

      {/* Bottom left brush accent */}
      <path
        d="M 20 72 C 16 68, 14 62, 14 58"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
        className="[stroke-dasharray:30] [stroke-dashoffset:30] animate-[draw_1.8s_ease-in-out_0.2s_infinite]"
      />

      {/* Top left brush accent */}
      <path
        d="M 22 28 C 18 32, 16 36, 15 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity="0.4"
        className="[stroke-dasharray:25] [stroke-dashoffset:25] animate-[draw_1.8s_ease-in-out_0.25s_infinite]"
      />

      {/* Stylized F - vertical line with slight tilt */}
      <path
        d="M 52 22 L 48 78"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        className="[stroke-dasharray:60] [stroke-dashoffset:60] animate-[draw_1.8s_ease-in-out_0.3s_infinite]"
      />

      {/* F top horizontal - angled slightly */}
      <path
        d="M 30 34 L 68 30"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        className="[stroke-dasharray:40] [stroke-dashoffset:40] animate-[draw_1.8s_ease-in-out_0.4s_infinite]"
      />

      {/* F middle horizontal - shorter, angled */}
      <path
        d="M 34 52 L 62 49"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        className="[stroke-dasharray:30] [stroke-dashoffset:30] animate-[draw_1.8s_ease-in-out_0.5s_infinite]"
      />
    </svg>
  );
}
