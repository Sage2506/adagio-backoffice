export const LoadingSpinner = () => {
  return (
    <div
      className="flex min-h-screen w-full items-center justify-center bg-background px-6 text-on-surface"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className="h-10 w-10 animate-spin rounded-full border-4 border-primary-fixed border-t-primary"
          aria-hidden="true"
        />
        <p className="font-body-md text-body-md text-on-surface-variant">
          Connecting to Adagio...
        </p>
      </div>
    </div>
  );
};