export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Neural Palette
        </h1>
        <p className="text-center text-lg mb-4">
          AI��n��ƣ��/�����թ��
        </p>
        <div className="grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left gap-4 mt-8">
          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              Neural Identity
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              ��ƣ��nDNA���W��n'��X
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              Neural Muse
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              AIu\/�gL^��׷����
            </p>
          </div>

          <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
            <h2 className="mb-3 text-2xl font-semibold">
              Neural Echo
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              AIա�Ag����餺U�_�T�
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
