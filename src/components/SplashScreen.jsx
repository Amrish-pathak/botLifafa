export default function SplashScreen() {

  return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">

      <div className="relative">

        <div className="w-28 h-28 rounded-full border-4 border-blue-500 animate-pulse"></div>

        <div className="absolute top-3 left-3 w-22 h-22 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">

          ₹

        </div>

      </div>

      <h1 className="text-white text-3xl font-bold mt-8">
        Bot Lifafa
      </h1>

      <p className="text-gray-400 mt-2">
        Loading secure reward...
      </p>

      <div className="mt-10 flex gap-2">

        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>

        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>

        <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>

      </div>

    </div>
  );
}
