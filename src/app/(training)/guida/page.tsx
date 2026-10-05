"use client";

export default function Page() {
  return (
    <div className="flex flex-col grow bg-white relative">
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
        <div className="loading loading-spinner" />
      </div>
      <iframe
        title="Guida OII"
        src="/guida-proxy"
        className="absolute inset-0 size-full"
        sandbox="allow-scripts allow-top-navigation-by-user-activation"
      />
    </div>
  );
}
