'use client';

export function BlogsLoadingView() {
  return (
    <div className="min-h-screen flex py-40 justify-center">
      <div className="relative size-6">
        <div className="absolute h-full w-full">
          {Array.from({ length: 12 }, (_, i) => i + 1).map((val, i) => (
            <div
              key={val}
              className="bg-foreground/60 absolute animate-[spinner-fade_1.2s_linear_infinite] rounded-full"
              style={{
                top: '0',
                left: '50%',
                marginLeft: '-1.25px',
                transformOrigin: '1.25px 14px',
                transform: `rotate(${i * 30}deg)`,
                opacity: 0,
                animationDelay: `${i * 0.1}s`,
                height: '10px',
                width: '1.5px',
              }}
            />
          ))}
        </div>
        <span className="sr-only">Loading</span>
      </div>
    </div>
  );
}
