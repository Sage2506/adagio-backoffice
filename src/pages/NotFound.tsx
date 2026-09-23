import { Link } from "react-router";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-margin-mobile py-16 text-on-background md:px-margin-desktop">
      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-72 w-72 rounded-full bg-tertiary-fixed/50 blur-3xl" aria-hidden="true" />

      <section className="relative z-10 w-full max-w-2xl text-center">
        <div className="mb-8 flex justify-center">
          <img src="/Logotipo.png" alt="Adagio" className="h-20 w-auto object-contain dark:hidden" />
          <img src="/logoBlanco.png" alt="Adagio" className="hidden h-20 w-auto object-contain dark:block" />
        </div>

        <p className="mb-3 font-label-md text-label-md uppercase text-primary">Error 404</p>
        <h1 className="font-display-lg text-display-lg-mobile text-on-background md:text-display-lg">
          This page has left the stage
        </h1>
        <div className="mx-auto my-8 h-1 w-16 rounded-full bg-primary" />
        <p className="mx-auto mb-10 max-w-lg font-body-lg text-body-lg text-on-surface-variant">
          The address you entered does not exist or is no longer available. Return home and continue exploring Adagio.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 font-label-md text-label-md text-on-primary transition-colors hover:bg-surface-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Go home
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-outline-variant px-7 py-3 font-label-md text-label-md text-on-surface transition-colors hover:bg-surface-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Go to dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
