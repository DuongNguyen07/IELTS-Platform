import Image from "next/image";
import { BRAND } from "@/constants";
export default function AuthHero() {
    return (
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/auth-hero-bg.png')" }}>
                <div className="absolute inset-0 bg-blue-600/40 backdrop-blur-[2px]"></div>
            </div>

            <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full">
                {/* Logo */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-200 rounded-xl flex items-center justify-center" data-alt="Logo">
                        <span>
                            <Image 
                            src="/images/logo-icon.png" 
                            alt="Logo" 
                            width={24} 
                            height={24}
                            className="object-contain"
                            />
                        </span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{BRAND.name}</h2>
                </div>

                {/* Text Content */}
                <div>
                    <h1 className="text-5xl font-black leading-tight mb-6">Boost your <br />IELTS Score with us</h1>
                    <p className="text-lg font-light text-white/90 max-w-md">Enhance your English proficiency and achieve your target IELTS score with our expert guidance and personalized learning strategies.</p>
                </div>

                {/*Trusted Badge*/}
                <div className="flex gap-3 items-center">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden" data-alt="Student profile picture">
                            <Image 
                            src="/images/student1.png" 
                            alt="Student" 
                            width={40} 
                            height={40}
                            className="object-cover"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden" data-alt="Student profile picture">
                            <Image 
                            src="/images/student2.png" 
                            alt="Student" 
                            width={40} 
                            height={40}
                            className="object-cover"
                            />
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden" data-alt="Student profile picture">
                            <Image 
                            src="/images/student3.png" 
                            alt="Student" 
                            width={40} 
                            height={40}
                            className="object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium ">Trusted by 1000+ students</p>
                    </div>
                </div>
            </div>

        </div>
        
    );
}