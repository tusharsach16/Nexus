import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Users, Zap, Shield, Globe, Activity, ArrowRight, Code } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-[#f5f5f5] font-sans selection:bg-primary/30 selection:text-white relative overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-0 transform translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-dark-border glass !border-x-0 !border-t-0 !rounded-none">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/10 border border-white/10">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold tracking-tight">NexusChat</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <Link to="/login" className="hover:text-white transition-colors">Log in</Link>
            <Link to="/register" className="btn btn-primary px-5 py-2">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-6 pt-32 pb-24 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 leading-tight">
            Real-Time Chat, <br className="hidden md:block" />
            <span className="text-neutral-500">Built for Scale.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto">
            Experience seamless, zero-latency communication with an elegant, focused interface. NexusChat provides the performance of enterprise tools with the simplicity you crave.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/register" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-xl font-semibold shadow-xl shadow-primary/20 transition-all active:scale-95">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto flex items-center justify-center bg-dark-card border border-dark-border text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#27272a] shadow-lg transition-all active:scale-95">
              Log into Account
            </Link>
          </div>
        </section>

        {/* Preview Section */}
        <section className="container mx-auto px-6 pb-32">
          <div className="w-full max-w-5xl mx-auto bg-dark-card rounded-2xl border border-dark-border shadow-2xl overflow-hidden flex flex-col md:flex-row h-[500px]">
            {/* Sidebar Mock */}
            <div className="w-full md:w-80 bg-[#0f0f0f] border-r border-dark-border flex flex-col">
              <div className="p-4 border-b border-dark-border font-medium flex items-center gap-2">
                Messages
              </div>
              <div className="flex-1 p-3 space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${i === 1 ? 'bg-dark-card border border-dark-border shadow-sm' : 'hover:bg-dark-card/50'}`}>
                    <div className="w-12 h-12 rounded-xl bg-dark-card border border-dark-border flex-shrink-0 relative">
                      {i === 1 && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0f0f0f]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className={`text-sm font-semibold ${i === 1 ? 'text-white' : 'text-neutral-300'}`}>User {i}</span>
                        <span className="text-[10px] text-neutral-500">12:30</span>
                      </div>
                      <div className="text-xs text-neutral-400 truncate">Hey, are you free to chat?</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Chat Mock */}
            <div className="flex-1 bg-[#121212] flex flex-col relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:32px_32px]" />
              <div className="p-4 border-b border-dark-border flex items-center gap-3 bg-[#121212]/80 backdrop-blur z-10">
                <div className="w-10 h-10 rounded-xl bg-dark-card border border-dark-border" />
                <div>
                  <div className="font-semibold text-sm">User 1</div>
                  <div className="text-[10px] text-green-500 font-medium">Active Now</div>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col gap-4 overflow-hidden z-10">
                <div className="self-start max-w-[70%] bg-dark-card border border-dark-border shadow-md rounded-2xl rounded-tl-sm p-3.5 text-[13px] leading-relaxed">
                  Hey! Just checking out this new premium UI design.
                </div>
                <div className="self-end max-w-[70%] bg-primary text-white shadow-lg shadow-primary/20 rounded-2xl rounded-tr-sm p-3.5 text-[13px] leading-relaxed">
                  Looks refined and soft. The depth and accents add a lot to the experience!
                </div>
                <div className="self-start bg-dark-card border border-dark-border shadow-md rounded-full px-4 py-3 flex items-center gap-1.5 mt-2">
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                </div>
              </div>
              {/* Input Overlay Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none z-10" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-[#141414]/50 py-32 border-y border-dark-border relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything you need. Nothing you don't.</h2>
              <p className="text-neutral-400 max-w-2xl mx-auto">A robust set of features wrapped in a frictionless, thoughtfully designed environment.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                icon={<Zap className="w-6 h-6" />}
                title="Real-Time Messaging"
                desc="Powered by WebSockets for instantaneous delivery."
              />
              <FeatureCard 
                icon={<Users className="w-6 h-6" />}
                title="1-to-1 & Group Chat"
                desc="Seamlessly switch between private and team conversations."
              />
              <FeatureCard 
                icon={<Activity className="w-6 h-6" />}
                title="Typing Indicators"
                desc="Know exactly when your friends are drafting a response."
              />
              <FeatureCard 
                icon={<Globe className="w-6 h-6" />}
                title="Online Presence"
                desc="See who is online right now in real-time."
              />
              <FeatureCard 
                icon={<Shield className="w-6 h-6" />}
                title="Secure Auth (JWT)"
                desc="Enterprise-grade security keeps your data safe."
              />
              <FeatureCard 
                icon={<Zap className="w-6 h-6" />}
                title="Scalable Architecture"
                desc="Redis Pub/Sub ensures performance at scale."
              />
              <FeatureCard 
                icon={<Users className="w-6 h-6" />}
                title="Friend Requests"
                desc="Easily manage your connections and network."
              />
              <FeatureCard 
                icon={<MessageSquare className="w-6 h-6" />}
                title="Profile Management"
                desc="Customize your identity to stand out."
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-32 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">How it Works</h2>
              <p className="text-neutral-400">Three absolute steps to fluid communication.</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-12 text-center max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border shadow-lg flex items-center justify-center text-xl font-bold mb-6 text-primary">1</div>
                <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
                <p className="text-neutral-400 text-sm">Create your free account instantly.</p>
              </div>
              <div className="hidden md:block w-24 h-[1px] bg-dark-border" />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-dark-card border border-dark-border shadow-lg flex items-center justify-center text-xl font-bold mb-6 text-primary">2</div>
                <h3 className="text-xl font-semibold mb-2">Add Friends</h3>
                <p className="text-neutral-400 text-sm">Connect with your network effortlessly.</p>
              </div>
              <div className="hidden md:block w-24 h-[1px] bg-dark-border" />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-primary shadow-xl shadow-primary/30 flex items-center justify-center text-xl font-bold mb-6 text-white transform hover:scale-105 transition-transform">3</div>
                <h3 className="text-xl font-semibold mb-2">Start Chatting</h3>
                <p className="text-neutral-400 text-sm">Enjoy zero-latency messaging.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-dark-border pt-16 pb-8 bg-[#0f0f0f]">
          <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3 opacity-80">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-white/10">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold tracking-tight">NexusChat</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#features" className="hover:text-primary transition-colors">Features</a>
              <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                <Code className="w-4 h-4" /> GitHub
              </a>
            </div>
            <div className="text-neutral-600 text-sm">
              &copy; {new Date().getFullYear()} NexusChat. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 rounded-2xl glass hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1">
    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shadow-lg shadow-primary/5 mb-6 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-neutral-400 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
