const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-6">
      <div className="max-w-md space-y-4">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive text-2xl font-bold">
          404
        </span>
        <h1 className="text-3xl font-semibold">Page Not Found</h1>
        <p className="text-muted-foreground">
          The link you followed may be broken or the page may have been removed.
        </p>
        <a
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg gradient-primary text-white shadow-lg hover:shadow-primary/40 transition"
        >
          Return to dashboard
        </a>
      </div>
    </div>
  );
};

export default NotFound;
