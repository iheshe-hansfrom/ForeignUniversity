"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import {
  Heart,
  Users,
  ArrowRight,
  Zap,
  Globe,
  Shield,
} from "lucide-react";
// Placeholder images
const PLACEHOLDER_IMAGES = {
  hero: "/images/date01.jpg",
  feature1: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?w=800&h=600&fit=crop&q=80",
  feature2: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop&q=80",
  premium: "https://images.unsplash.com/photo-1579547945413-497e1b99dac0?w=800&h=800&fit=crop&q=80",
  human: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=800&fit=crop&q=80",
};

const Section = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <section
    className={`flex flex-col justify-center relative overflow-hidden px-6 py-10 ${className}`}
  >
    {children}
  </section>
);

export default function MarrimiPage() {
  const router = useRouter();
  const images = PLACEHOLDER_IMAGES;
  const [loading, setLoading] = useState(true);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  useEffect(() => {
    // 짧은 로딩 애니메이션 후 표시
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#050505] text-white selection:bg-[#ff3d77] selection:text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-none">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="text-2xl font-black tracking-tighter italic">
          MARRY<span className="text-[#ff3d77]">ME</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            defaultValue="marrimi"
            onChange={(e) => {
              if (e.target.value === "teobeok") router.push("/");
            }}
            className="px-3 py-2 pr-6 bg-white/10 border border-white/20 rounded-full text-sm font-medium text-white outline-none cursor-pointer hover:bg-white/20 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22white%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_8px_center]"
          >
            <option value="teobeok" className="text-black">
              터벅
            </option>
            <option value="marrimi" className="text-black">
              매리미
            </option>
          </select>
        </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <Section className="pt-32">
        <motion.div
          style={{ opacity, scale }}
          className="relative z-10 max-w-6xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.3em] mb-8"
          >
            The Future of Connection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] mb-10 uppercase"
          >
            스치는 인연을
            <br />
            <span className="text-gradient-marrimi">영원한 운명</span>으로
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl opacity-50 mb-12 max-w-2xl mx-auto font-medium"
          >
            바쁜 일상 속에서도 사랑을 꿈꾸는 당신을 위해,
            <br />
            매리미가 가장 따뜻한 3D 매칭 경험을 설계합니다.
          </motion.p>

          <div className="flex items-center justify-center">
            <button className="w-full md:w-auto bg-[#ff3d77] px-10 py-5 rounded-2xl text-lg font-black tracking-widest hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,61,119,0.3)]">
              데이트 매칭 App '매리미'
            </button>
          </div>
        </motion.div>

        {/* 3D Hero Image */}
        <div className="mt-20 relative max-w-5xl mx-auto">
          {images.hero && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl animate-float"
            >
              <img
                src={images.hero}
                className="w-full aspect-video object-cover"
                alt="3D Hero"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
            </motion.div>
          )}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#ff3d77]/20 rounded-full blur-[120px] -z-10" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />
        </div>
      </Section>

      {/* Section 2: Features Bento */}
      <Section className="bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-6">
              Next-Gen <span className="text-[#ff3d77]">Features</span>
            </h2>
            <p className="opacity-40 max-w-xl font-medium">
              단순한 매칭을 넘어선 기술력. 당신의 매력을 가장 입체적으로 전달하는
              매리미만의 솔루션입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="md:col-span-7 glass-panel rounded-[2.5rem] p-10 group overflow-hidden relative"
            >
              <div className="flex gap-8">
                <div className="relative z-10 flex-1 self-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#ff3d77]/20 flex items-center justify-center text-[#ff3d77] mb-8">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-3xl font-black uppercase mb-4 leading-tight">
                    AI 입체 프로필
                    <br />
                    <span className="opacity-40">3D Avatar System</span>
                  </h3>
                  <p className="opacity-50">
                    사진 한 장으로는 부족한 당신의 매력. 목소리와 움직임이 담긴
                    입체적인 프로필로 진심을 전하세요.
                  </p>
                </div>
                <div className="w-48 shrink-0 overflow-hidden rounded-2xl mt-[50px]">
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/images/grok-video-6ea80487-838b-4d73-b5e7-96310cd6fd27.mp4" type="video/mp4" />
                  </video>
                </div>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-5 glass-panel rounded-[2.5rem] p-10 flex flex-col group overflow-hidden relative"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 mb-8">
                  <Globe size={24} />
                </div>
                <h3 className="text-3xl font-black uppercase mb-4 leading-tight">
                  정교한 데이터
                  <br />
                  <span className="opacity-40">AI Analysis</span>
                </h3>
                <p className="opacity-50">
                  AI가 분석한 수만 개의 데이터를 통해 당신과 가장 결이 닮은
                  사람을 찾아냅니다.
                </p>
              </div>
              <div className="mt-auto pt-10">
                {images.feature2 && (
                  <img
                    src="/images/date02.webp"
                    className="w-full h-48 object-cover rounded-2xl grayscale group-hover:grayscale-0 transition-all"
                    alt="3D Data"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Section 3: Premium Experience */}
      <Section className="bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="premium-card rounded-[3rem] p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(255,215,0,0.1)_0%,transparent_50%)]" />

            <div className="flex-1 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-bold uppercase tracking-widest mb-8 border border-yellow-500/20">
                <Shield size={16} /> Premium Membership
              </div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                오직 당신만을 위한
                <br />
                <span className="text-yellow-500">프라이빗한 약속</span>
              </h2>
              <p className="text-lg opacity-40 mb-12 max-w-md font-medium">
                엄격한 인증을 거친 소수의 분들만이 머무는 곳. 품격 있는 만남이
                시작되는 특별한 공간입니다.
              </p>
              <button className="bg-yellow-500 text-black px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-yellow-400 transition-all">
                Apply Now
              </button>
            </div>

            <div className="flex-1 relative">
              {images.premium && (
                <motion.div
                  animate={{
                    rotateY: [0, 10, 0],
                    rotateX: [0, -5, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative z-10"
                >
                  <img
                    src="/images/date03.jpg"
                    className="w-full rounded-3xl shadow-2xl border border-white/5"
                    alt="3D Premium"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              )}
              <div className="absolute inset-0 bg-yellow-500/20 blur-[100px] -z-10" />
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: Human Touch */}
      <Section>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-20">
          <div className="flex-1 order-2 md:order-1">
            {images.human && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl"
              >
                <img
                  src="/images/date04.jpeg"
                  className="w-full aspect-square object-cover"
                  alt="3D Manager"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}
          </div>
          <div className="flex-1 order-1 md:order-2">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold uppercase tracking-widest mb-8 border border-blue-500/20">
              <Users size={16} /> Human Touch
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
              혼자가 아닌 여정,
              <br />
              <span className="text-blue-500">든든한 조력자</span>
            </h2>
            <p className="text-lg opacity-40 mb-12 font-medium">
              결혼정보회사 출신 베테랑 매니저들이 당신의 고민을 듣고, 첫 만남의
              설렘이 결실을 맺을 때까지 함께 걷습니다.
            </p>
            <button className="group flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl text-lg font-black uppercase tracking-widest hover:bg-[#ff3d77] hover:text-white transition-all">
              Consult Now{" "}
              <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-32 px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-20">
            <div className="max-w-md">
              <div className="text-4xl font-black tracking-tighter italic mb-8">
                MARRY<span className="text-[#ff3d77]">ME</span>
              </div>
              <p className="opacity-30 text-lg font-medium leading-relaxed">
                매리미는 진정성 있는 만남을 추구하는 프리미엄 매칭 플랫폼입니다.
                당신의 소중한 인연을 위해 최선을 다합니다.
              </p>
            </div>
          </div>
          <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-bold uppercase tracking-widest opacity-20">
            <div>© 2026 MarryMe Inc. All rights reserved.</div>
            <div className="flex gap-10">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center"
          >
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="mb-12"
            >
              <Heart
                size={80}
                className="text-[#ff3d77] fill-[#ff3d77] drop-shadow-[0_0_30px_rgba(255,61,119,0.5)]"
              />
            </motion.div>
            <div className="text-3xl font-black tracking-tighter uppercase mb-4">
              Crafting Your Destiny
            </div>
            <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="w-full h-full bg-[#ff3d77]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
