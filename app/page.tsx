"use client";

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import {
  MapPin,
  Wallet,
  Calendar,
  Globe,
  CreditCard,
  ChevronRight,
  Menu,
  X,
  Languages,
  ArrowRight,
  Sparkles,
  Search,
  Navigation
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Image Generation Service ---
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

async function generateTeobeokImage(prompt: string) {
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9",
          },
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    }
  }
  return `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0, 10))}/1280/720`;
}

// --- Components ---

const GeneratedImage = ({ prompt, className }: { prompt: string; className?: string }) => {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    generateTeobeokImage(prompt).then(url => {
      if (mounted) {
        setImgUrl(url);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [prompt]);

  return (
    <div className={cn("relative overflow-hidden bg-stone-200", className)}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-8 h-8 text-stone-400" />
          </motion.div>
        </div>
      )}
      {imgUrl && (
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={imgUrl}
          alt="Generated Visual"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  );
};

export default function Page() {
  const [lang, setLang] = useState<'ko' | 'en' | 'ja' | 'zh'>('ko');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [routeTrigger, setRouteTrigger] = useState(false);
  const router = useRouter();
  const { scrollYProgress } = useScroll();

  const content = {
    ko: {
      intro: {
        title: "당신의 보폭에 맞춰 걷는 여행, 터벅과 함께.",
        desc: "서두르지 않아도 괜찮아요. AI가 제안하는 나만의 속도, 나만의 국내 여행 이야기를 시작해보세요.",
      },
      budget: {
        title: "나의 예산으로 그리는 가장 완벽한 지도",
        desc: "\"100만 원으로 제주도 일주일 살기가 가능할까?\" 고민하지 마세요. 당신이 정한 예산 안에서 최고의 경험을 큐레이션합니다.",
        cta: "100만원 여행 추천",
      },
      curation: {
        title: "알려지지 않은 숨은 보석을 발견하는 즐거움",
        desc: "남들 다 가는 곳 말고, 당신의 취향이 머무는 곳. AI가 엄선한 국내 구석구석의 보석 같은 명소를 추천합니다.",
      },
      scheduling: {
        title: "복잡한 계획은 AI에게, 당신은 설렘만 챙기세요",
        desc: "동선 꼬일 걱정 없는 완벽한 타임라인. 터벅 AI가 실시간 교통과 거리를 계산해 최적의 루트를 그려냅니다.",
        btn: "루트 생성하기",
      },
      global: {
        title: "언어의 장벽을 넘어, 세계와 한국을 잇다",
        desc: "다국어 지원과 구글 지도 기반 서비스로, 한국이 처음인 친구도 마치 동네 주민처럼 자유롭게 누빌 수 있습니다.",
      },
      finance: {
        title: "결제부터 송금까지, 여행의 무게를 가볍게",
        desc: "한패스(Hanpass)와의 강력한 결합으로 환전과 결제 고민 끝. 손가락 하나로 끝내는 스마트한 여행 금융을 경험하세요.",
        btn: "송금/결제 확인",
      }
    },
    en: {
      intro: {
        title: "A journey at your own pace, with Teobeok.",
        desc: "It's okay to take it slow. Start your own domestic travel story with a pace suggested by AI.",
      },
      budget: {
        title: "The perfect map drawn with your budget",
        desc: "Don't worry about whether a week in Jeju is possible with 1 million won. We curate the best experiences within your budget.",
        cta: "Recommend 1M Won Trip",
      },
      curation: {
        title: "The joy of discovering hidden gems",
        desc: "Not where everyone else goes, but where your taste lingers. AI recommends hidden gems all across the country.",
      },
      scheduling: {
        title: "Leave complex plans to AI, just bring your excitement",
        desc: "A perfect timeline without worrying about routes. Teobeok AI calculates real-time traffic and distance to draw the optimal route.",
        btn: "Generate Route",
      },
      global: {
        title: "Beyond language barriers, connecting the world and Korea",
        desc: "With multi-language support and Google Maps-based services, even friends visiting Korea for the first time can explore like locals.",
      },
      finance: {
        title: "From payment to transfer, lighten your travel burden",
        desc: "End exchange and payment worries with a strong integration with Hanpass. Experience smart travel finance at your fingertips.",
        btn: "Check Transfer/Payment",
      }
    }
  };

  const currentContent = lang === 'ko' ? content.ko : content.en;

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-stone-900 font-sans selection:bg-stone-200">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold tracking-tighter flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center">
              <Navigation className="w-4 h-4 text-white" />
            </div>
            터벅 <span className="text-stone-400 font-light">Teobeok</span>
          </motion.div>

          <select
            defaultValue="teobeok"
            onChange={(e) => {
              if (e.target.value === 'marrimi') router.push('/marrimi');
            }}
            className="px-3 py-2 pr-6 bg-stone-100 border border-stone-200 rounded-full text-sm font-medium text-stone-700 outline-none cursor-pointer hover:bg-stone-200 transition-colors appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2344403a%22%20stroke-width%3D%222%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_8px_center]"
          >
            <option value="teobeok">터벅</option>
            <option value="marrimi">매리미</option>
          </select>
        </div>
      </nav>

      <main>
        {/* Section 1: Intro */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden pt-20">
          <div className="absolute inset-0 z-0">
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 20, ease: "linear" }}
              className="w-full h-full"
            >
              <img
                src="/images/hanyoc.jpg"
                alt="한옥마을 여행"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-black/20" />
            <SnowEffect />
          </div>

          <div className="relative z-10 text-center px-6 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
                {currentContent.intro.title}
              </h1>
              <p className="text-lg md:text-xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
                {currentContent.intro.desc}
              </p>
            </motion.div>
          </div>

          <motion.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 flex flex-col items-center gap-2"
          >
            <span className="text-xs uppercase tracking-widest font-medium">Scroll to explore</span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-px h-12 bg-white/30"
            />
          </motion.div>
        </section>

        {/* Section 2: Budget */}
        <section className="py-32 px-6 bg-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-stone-600 text-sm font-medium">
                  <Wallet className="w-4 h-4" /> Smart Budgeting
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                  {currentContent.budget.title}
                </h2>
                <p className="text-lg text-stone-500 font-light leading-relaxed">
                  {currentContent.budget.desc}
                </p>

                <BudgetInteraction cta={currentContent.budget.cta} />
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-2xl shadow-stone-200"
              >
                <img
                  src="/images/chabot.jpg"
                  alt="Budget App UI"
                  className="w-full h-full object-cover aspect-[4/5] transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Section 3: Curation */}
        <section className="py-32 px-6 bg-[#FDFCF8]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-stone-600 text-sm font-medium mb-4">
                  <MapPin className="w-4 h-4" /> Curated Spots
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                  {currentContent.curation.title}
                </h2>
                <p className="text-lg text-stone-500 font-light max-w-2xl mx-auto mt-4">
                  {currentContent.curation.desc}
                </p>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CurationCard
                title={lang === 'ko' ? "안개 낀 산정 호수" : "Misty Mountain Lake"}
                comment={lang === 'ko' ? "새벽의 고요함이 머무는 곳" : "Where the silence of dawn lingers"}
                prompt="Misty dawn at a mountain lake, mysterious and peaceful Korean natural landscape, high-resolution landscape photography style."
              />
              <CurationCard
                title={lang === 'ko' ? "달빛 아래 한옥" : "Hanok under Moonlight"}
                comment={lang === 'ko' ? "처마 끝에 걸린 그리움" : "Longing hanging on the eaves"}
                prompt="Moonlight hanging on the eaves of a Hanok, mysterious and peaceful Korean traditional architecture, high-resolution photography style."
                imageSrc="/images/image 746.png"
              />
              <CurationCard
                title={lang === 'ko' ? "비밀의 숲길" : "Secret Forest Path"}
                comment={lang === 'ko' ? "나만 알고 싶은 초록빛" : "The green light I want to keep secret"}
                prompt="Sunlight filtering through a dense green forest path in Korea, ethereal and calm atmosphere, high-resolution nature photography."
                imageSrc="/images/3a47bfb820037bb3332da6c3c4fa0be2.jpg"
              />
            </div>
          </div>
        </section>

        {/* Section 4: Scheduling */}
        <section className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <div className="relative order-2 md:order-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-3xl overflow-hidden shadow-2xl"
              >
                <img
                  src="/images/navi.jpg"
                  alt="AI 루트 스케줄링"
                  className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </motion.div>
              <RouteAnimation trigger={routeTrigger} />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8 order-1 md:order-2"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-100 rounded-full text-stone-600 text-sm font-medium">
                <Calendar className="w-4 h-4" /> AI Scheduling
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                {currentContent.scheduling.title}
              </h2>
              <p className="text-lg text-stone-500 font-light leading-relaxed">
                {currentContent.scheduling.desc}
              </p>
              <button
                onClick={() => setRouteTrigger(!routeTrigger)}
                className="px-8 py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-800 transition-all flex items-center gap-2"
              >
                {currentContent.scheduling.btn} <Sparkles className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Section 5: Global */}
        <section className="py-32 px-6 bg-stone-900 text-white">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white/70 text-sm font-medium">
                <Globe className="w-4 h-4" /> Global Support
              </div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                {currentContent.global.title}
              </h2>
              <p className="text-lg text-white/60 font-light leading-relaxed">
                {currentContent.global.desc}
              </p>
              <div className="flex gap-4">
                {['KO', 'EN', 'JA', 'ZH'].map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l.toLowerCase() as any)}
                    className={cn(
                      "w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-xs font-bold transition-all",
                      lang === l.toLowerCase() ? "bg-white text-stone-900" : "hover:bg-white/10"
                    )}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="rounded-3xl overflow-hidden"
            >
              <img
                src="/images/google.webp"
                alt="글로벌 다국어 지원"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 hover:scale-110"
              />
            </motion.div>
          </div>
        </section>

        {/* Section 6: Hanpass */}
        <section className="py-32 px-6 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="bg-stone-50 rounded-[3rem] p-12 md:p-24 grid md:grid-cols-2 gap-20 items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-stone-200/50 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />

              <div className="relative z-10 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-stone-200 rounded-full text-stone-600 text-sm font-medium">
                  <CreditCard className="w-4 h-4" /> Hanpass Integration
                </div>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                  {currentContent.finance.title}
                </h2>
                <p className="text-lg text-stone-500 font-light leading-relaxed">
                  {currentContent.finance.desc}
                </p>
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,0,0,0.1)" }}
                  className="px-8 py-4 bg-stone-900 text-white rounded-full font-semibold flex items-center gap-2 group"
                >
                  {currentContent.finance.btn}
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="/images/hanpass.jpg"
                    alt="한패스 결제 서비스"
                    className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-stone-400/10 blur-2xl -z-10 rounded-full animate-pulse" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-stone-50 py-20 px-6 border-t border-stone-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <Navigation className="w-6 h-6" /> 터벅
          </div>
          <div className="flex gap-8 text-sm text-stone-400">
            <a href="#" className="hover:text-stone-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-stone-900 transition-colors">Contact Us</a>
          </div>
          <div className="text-sm text-stone-400">
            © 2026 Teobeok AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function BudgetInteraction({ cta }: { cta: string }) {
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="space-y-6">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowResults(!showResults)}
        className="text-2xl font-bold text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-3 group"
      >
        <span className="underline decoration-stone-200 underline-offset-8 group-hover:decoration-stone-900 transition-all">
          {cta}
        </span>
        <ChevronRight className="w-6 h-6" />
      </motion.button>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-4 overflow-hidden"
          >
            {[
              { name: "Jeju Island", price: "850k~" },
              { name: "Gyeongju", price: "450k~" },
              { name: "Busan", price: "600k~" },
              { name: "Gangneung", price: "500k~" }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-stone-50 rounded-2xl border border-stone-100 hover:border-stone-300 transition-all cursor-pointer"
              >
                <div className="text-sm font-bold">{item.name}</div>
                <div className="text-xs text-stone-400">{item.price}</div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CurationCard({ title, comment, prompt, imageSrc }: { title: string; comment: string; prompt: string; imageSrc?: string }) {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative rounded-3xl overflow-hidden bg-white shadow-xl shadow-stone-200/50"
    >
      {imageSrc ? (
        <img src={imageSrc} alt={title} className="aspect-[3/4] w-full object-cover group-hover:scale-110 transition-transform duration-700" />
      ) : (
        <GeneratedImage prompt={prompt} className="aspect-[3/4] group-hover:scale-110 transition-transform duration-700" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-white"
        >
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-sm text-white/70 font-light">{comment}</p>
        </motion.div>
      </div>
      <div className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
    </motion.div>
  );
}

function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const flakes: { x: number; y: number; r: number; speed: number; wind: number; opacity: number }[] = [];
    const COUNT = 200;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1.5 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.6 + 0.4,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const f of flakes) {
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
        ctx.fill();
        f.y += f.speed;
        f.x += Math.sin(f.y * 0.01) * 0.5 + f.wind;
        if (f.y > canvas.height) { f.y = -f.r; f.x = Math.random() * canvas.width; }
        if (f.x > canvas.width) f.x = 0;
        if (f.x < 0) f.x = canvas.width;
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />;
}

function RouteAnimation({ trigger }: { trigger: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 400 400">
        <motion.path
          d="M 50 350 Q 100 100 200 200 T 350 50"
          fill="none"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="2"
          strokeDasharray="5,5"
        />
        <motion.path
          d="M 50 350 Q 100 100 200 200 T 350 50"
          fill="none"
          stroke="black"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: trigger ? 1 : 0 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.circle
          cx="50" cy="350" r="4" fill="black"
          initial={{ opacity: 0 }}
          animate={{ opacity: trigger ? 1 : 0 }}
        />
        <motion.circle
          cx="350" cy="50" r="4" fill="black"
          initial={{ opacity: 0 }}
          animate={{ opacity: trigger ? 1 : 0 }}
          transition={{ delay: trigger ? 2 : 0 }}
        />
      </svg>
    </div>
  );
}
