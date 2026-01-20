import Image from 'next/image';
export default function SocialLogin() {
  return (
    <>
      {/* Divider */}
      <div className="relative flex items-center py-4">
        <div className="flex-grow border-t border-gray-200"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-wider">
          Or sign in with
        </span>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>

      {/* Social Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          className="flex items-center justify-center gap-2 h-11 border border-gray-200 rounded-lg bg-white hover:bg-gray-100 transition-colors"
        >
          <Image src="/images/google-icon.png" alt="Google" width={20} height={20} />
          <span className="text-sm font-semibold text-gray-700">Google</span>
        </button>
        
        <button
          type="button"
          className="flex items-center justify-center gap-2 h-11 border border-gray-200 rounded-lg bg-white hover:bg-gray-100 transition-colors"
        >
          <Image src="/images/facebook-icon.png" alt="Facebook" width={20} height={20} />
          <span className="text-sm font-semibold text-gray-700">Facebook</span>
        </button>
      </div>
    </>
  );
}