import Image from 'next/image';
import Button from 'client/components/ui/Button';

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
        <Button
          type="button"
          variant="social"
          size="social"
          icon={
            <Image 
              src="/images/google-logo.png" 
              alt="Google Logo"
              width={20}
              height={20}
            />
          }
        >
          Google
        </Button>
        
        <Button
          type="button"
          variant="social"
          size="social"
          icon={
            <Image 
              src="/images/facebook-logo.png" 
              alt="Facebook Logo"
              width={20}
              height={20}
            />
          }
        >
          Apple
        </Button>
      </div>
    </>
  );
}