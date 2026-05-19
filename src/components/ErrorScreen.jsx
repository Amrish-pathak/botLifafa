export default function ErrorScreen({
  title,
  message,
  onRetry,
}) {

  return (
    <div className="h-screen bg-black flex items-center justify-center p-5">

      <div className="bg-[#171717] border border-red-500 rounded-3xl p-6 w-full max-w-md text-center">

        <div className="text-6xl">
          ⚠️
        </div>

        <h2 className="text-white text-2xl font-bold mt-5">
          {title}
        </h2>

        <p className="text-gray-400 mt-3">
          {message}
        </p>

        <button
          onClick={onRetry}
          className="mt-6 bg-red-600 text-white w-full h-14 rounded-2xl text-lg font-bold"
        >
          Retry
        </button>

      </div>

    </div>
  );
}
