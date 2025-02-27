export function BackgroundVideo() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden">
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/18458403-hd_1920_1080_24fps-3G3TXyfoAJnvxgzeuqlJbnFOtP4pqZ.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

