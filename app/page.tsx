import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navigation */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                <span className="text-white text-xs font-bold">ICD</span>
              </div>
              <span className="text-lg font-semibold">ICD App</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Hero section */}
        <div className="container mx-auto px-6 py-16 text-center">
          <div className="max-w-3xl mx-auto">
            {/* Central logo with glow effect */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center z-10 relative">
                  <span className="text-white text-xl font-bold">ICD</span>
                </div>
                <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Try ICD App Pro for 30 days free
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Enhance your coding experience with AI-powered intelligence and
              automation
            </p>
            <div className="flex justify-center">
              <Link
                href="/register"
                className="bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 text-lg font-medium"
              >
                Start free trial
              </Link>
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-8">
              Everything in ICD App Free and:
            </h2>

            <div className="space-y-4">
              <div className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Unlimited agent mode and chat with GPT-4</span>
              </div>

              <div className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Unlimited code completions</span>
              </div>

              <div className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>Access to Anthropic Claude 3.5/3.7 Sonnet, OpenAI o1, and more</span>
              </div>

              <div className="flex items-start">
                <svg
                  className="h-6 w-6 text-green-500 mr-3 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>300 premium requests to use the latest models and code review</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing section */}
        <div className="container mx-auto px-6 py-12 border-t border-gray-800">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">
              Billing frequency after 30-day free trial
            </h2>

            <p className="text-gray-400 mb-8">
              To prevent abuse, we require billing information upfront. Your
              30-day free trial will automatically convert to a paid plan after
              the trial ends. You can cancel anytime from settings before the
              trial expires to avoid being billed.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Monthly plan */}
              <div className="relative border border-gray-800 rounded-lg p-6 flex flex-col transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="flex items-center mb-4">
                  <div className="h-5 w-5 rounded-full border-2 border-blue-500 flex items-center justify-center mr-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                  </div>
                  <span className="font-medium">Pay monthly</span>
                </div>
                <div className="text-3xl font-bold mb-2">
                  $10.00{" "}
                  <span className="text-lg font-normal text-gray-400">
                    USD / month after trial
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                  <div className="flex items-center mb-2">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Full access to all Pro features
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Cancel anytime
                  </div>
                </div>
              </div>

              {/* Annual plan */}
              <div className="relative border border-gray-800 rounded-lg p-6 flex flex-col transition-all hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20">
                <div className="absolute -top-3 -right-3 bg-blue-500 text-xs px-2 py-1 rounded-full text-white font-medium">
                  BEST VALUE
                </div>
                <div className="flex items-center mb-4">
                  <div className="h-5 w-5 rounded-full border-2 border-gray-500 flex items-center justify-center mr-3">
                    <div className="h-2 w-2 rounded-full bg-transparent"></div>
                  </div>
                  <span className="font-medium">Pay yearly</span>
                  <span className="ml-2 text-xs bg-blue-900 text-blue-300 px-2 py-0.5 rounded">
                    Save $20.00
                  </span>
                </div>
                <div className="text-3xl font-bold mb-2">
                  $100.00{" "}
                  <span className="text-lg font-normal text-gray-400">
                    USD / year after trial
                  </span>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-800 text-sm text-gray-400">
                  <div className="flex items-center mb-2">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Full access to all Pro features
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-4 w-4 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    16% savings compared to monthly
                  </div>
                </div>
              </div>
            </div>

            {/* Bonus info */}
            <div className="mt-8 bg-blue-900/30 border border-blue-800 rounded-lg p-4">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <p>
                    Bonus: Premium requests will remain unlimited while billing is
                    postponed. We&apos;ll share an updated timeline once it&apos;s
                    available.
                  </p>
                  <a
                    href="#learn-more"
                    className="text-blue-400 hover:underline mt-1 inline-block"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <div className="mt-8">
              <Link
                href="/register"
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium text-lg flex items-center justify-center group transition-all duration-200"
              >
                <span>Upgrade now</span>
                <svg
                  className="ml-2 h-5 w-5 transform transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Business info */}
            <p className="text-center mt-6 text-gray-400 text-sm">
              Part of an organization?
              <Link
                href="/subscribe/business"
                className="text-blue-400 hover:underline ml-1"
              >
                Upgrade to ICD App Business
              </Link>
              <span className="ml-1">to enable across teams.</span>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-2">
                  <span className="text-white text-xs font-bold">ICD</span>
                </div>
                <span className="text-lg font-semibold text-white">ICD App</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                © {new Date().getFullYear()} ICD Technologies Inc.
              </p>
            </div>

            <div className="flex space-x-6">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Support
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
