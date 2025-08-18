import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export const Navbar = () => {

  return (
    <nav className="flex w-full items-center justify-between border-t border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500" />
        <h1 className="text-base font-bold md:text-2xl">Evently</h1>
      </div>
      <div className="flex gap-2"> <SignedOut>
        <SignInButton ><button className="w-24 transform rounded-lg border px-6 py-2 font-medium transition-all duration-300 hover:-translate-y-0.5  md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
          Login
        </button></SignInButton>
        <SignUpButton>
          <button className="w-24 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 md:w-32 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            SignUp
          </button>
        </SignUpButton>
      </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn></div>

    </nav>
  );
};
