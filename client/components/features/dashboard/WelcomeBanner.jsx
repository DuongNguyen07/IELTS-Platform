export default function WelcomeBanner({ user }) {
    return (
      <div className="mb-12">
        <h1 className="text-gray-900 text-4xl md:text-5xl font-black tracking-tight mb-2">
            Welcome back, <span className="text-blue-600">{user?.name || 'Student'}</span>!
        </h1>
        <p className="text-gray-500 text-lg">
            Your IELTS journey is {user?.journeyProgress ? `${user.journeyProgress}% complete` : '0% complete'}. Keep up the great work!
        </p>
      </div>  
    );
}