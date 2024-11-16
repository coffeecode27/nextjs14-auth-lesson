// not-found.tsx adalah spesial file yg ada di nextjs app router yg akan ditampilkan(secara otomatis) ketika sebuah halaman tidak ditemukan

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="shadow-md backdrop-blur-sm bg-black/10 rounded-lg p-8">
        <h1 className="text-8xl text-black font-semibold">404</h1>
        <h2 className="text-2xl text-black font-semibold">Page Not Found</h2>
      </div>
    </div>
  );
}
