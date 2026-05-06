import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────
const C = {
  bg: '#07060F',
  surface: '#110F20',
  surface2: '#1A1730',
  surface3: '#252240',
  accent: '#C92EF5',
  accentDark: '#8B1FAD',
  accentLight: 'rgba(201,46,245,0.13)',
  accentBorder: 'rgba(201,46,245,0.28)',
  cyan: '#18D9F4',
  cyanLight: 'rgba(24,217,244,0.1)',
  green: '#3DD68C',
  greenLight: 'rgba(61,214,140,0.1)',
  yellow: '#F5C518',
  yellowLight: 'rgba(245,197,24,0.1)',
  red: '#F56060',
  redLight: 'rgba(245,96,96,0.1)',
  text: '#EDE8FC',
  muted: '#8B80AC',
  dim: '#453D62',
  border: 'rgba(255,255,255,0.06)',
  border2: 'rgba(255,255,255,0.11)',
  glass: 'rgba(17,15,32,0.85)',
};

const S = {
  card: { background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: '22px 26px' },
  btn: { background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: '#fff', border: 'none', borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', letterSpacing: 0.3 },
  btnOutline: { background: 'transparent', color: C.text, border: `1px solid ${C.border2}`, borderRadius: 12, padding: '13px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  input: { background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 12, padding: '14px 16px', fontSize: 15, color: C.text, width: '100%', outline: 'none', fontFamily: 'inherit' },
};

const LOGO_IMG = "/logo.png"; // coloque sua logo.png na pasta public/

// ─── GLOBAL STYLES ──────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${C.dim}; border-radius: 4px; }
  input::placeholder { color: ${C.dim}; }
  input:focus { border-color: ${C.accent} !important; box-shadow: 0 0 0 3px ${C.accentLight}; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(1.7); opacity: 0; } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(201,46,245,0.3); } 50% { box-shadow: 0 0 40px rgba(201,46,245,0.6); } }
  .fade-up { animation: fadeUp 0.45s ease forwards; }
  .fade-in { animation: fadeIn 0.3s ease forwards; }
  .slide-down { animation: slideDown 0.3s ease forwards; }
  .btn-hover { transition: opacity 0.15s, transform 0.15s, box-shadow 0.15s; }
  .btn-hover:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(201,46,245,0.25); }
  .btn-hover:active { transform: scale(0.98); }
  .card-hover { transition: border-color 0.2s, background 0.2s, transform 0.2s; cursor: pointer; }
  .card-hover:hover { border-color: ${C.accentBorder} !important; background: ${C.surface2} !important; transform: translateY(-2px); }
  .icon-btn { transition: background 0.15s; cursor: pointer; }
  .icon-btn:hover { background: ${C.surface3} !important; }
  .row-hover { transition: background 0.15s; }
  .row-hover:hover { background: ${C.surface2} !important; }
  .nav-link { transition: color 0.15s; cursor: pointer; }
  .nav-link:hover { color: ${C.text} !important; }
  .gradient-text { background: linear-gradient(135deg, ${C.accent}, ${C.cyan}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .glow-card { animation: glow 3s ease-in-out infinite; }
  .float { animation: float 4s ease-in-out infinite; }
`;

// ─── DEMO DATA ──────────────────────────────────────────────────
let _id = 100;
const uid = () => ++_id;

const DEMO_VENUES = {
  allin: {
    slug: 'allin',
    name: 'ALLIN Karaokê',
    plan: 'pro',
    djPassword: 'allin2024',
    ownerEmail: 'guilherme@allin.com.br',
    ownerPassword: '123456',
    primaryColor: '#C92EF5',
    createdAt: Date.now() - 86400000 * 30,
    queue: [
      { id: 1, name: 'João S.', song: { title: 'Bohemian Rhapsody', artist: 'Queen' }, status: 'singing', number: 1, joinedAt: Date.now() - 300000 },
      { id: 2, name: 'Maria C.', song: { title: 'I Will Always Love You', artist: 'Whitney Houston' }, status: 'waiting', number: 2, joinedAt: Date.now() - 200000 },
      { id: 3, name: 'Pedro H.', song: { title: 'Evidências', artist: 'Chitãozinho & Xororó' }, status: 'waiting', number: 3, joinedAt: Date.now() - 100000 },
    ],
    stats: { totalSessions: 47, avgQueueSize: 8.2, totalSingers: 389 },
  },
};

const PLANS = [
  { id: 'starter', name: 'Starter', price: 79, desc: 'Ideal para começar', color: C.cyan, features: ['1 estabelecimento', 'Fila ilimitada', 'Senha DJ personalizada', 'Link exclusivo', 'Suporte por e-mail'] },
  { id: 'pro', name: 'Pro', price: 149, desc: 'Mais popular', color: C.accent, popular: true, features: ['1 estabelecimento', 'Tudo do Starter', 'Painel de estatísticas', 'Personalização de cores', 'Suporte prioritário'] },
  { id: 'multi', name: 'Multi', price: 299, desc: 'Para redes e franquias', color: C.yellow, features: ['Até 5 estabelecimentos', 'Tudo do Pro', 'Painel unificado', 'Relatórios avançados', 'Gerente de conta dedicado'] },
];

// ─── ROOT APP ────────────────────────────────────────────────────
export default function App() {
  const getInitialRoute = () => {
    const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
    if (path && path !== '' && path !== 'dj') return { route: 'venue', param: path };
    if (path === 'dj') return { route: 'dj', param: null };
    return { route: 'landing', param: null };
  };
  const _init = getInitialRoute();
  const [route, setRoute] = useState(_init.route);
  const [routeParam, setRouteParam] = useState(_init.param);
  const [venues, setVenues] = useState(() => {
    try {
      const saved = localStorage.getItem('fila_karaoke_venues');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Always keep demo venue
        return { ...DEMO_VENUES, ...parsed };
      }
    } catch(e) {}
    return DEMO_VENUES;
  });
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  const go = (r, param = null) => {
    setRoute(r);
    setRouteParam(param);
    window.scrollTo(0, 0);
    if (r === 'venue' && param) window.history.pushState({}, '', '/' + param);
    else if (r === 'dj' && param) window.history.pushState({}, '', '/' + param + '/dj');
    else if (r === 'landing') window.history.pushState({}, '', '/');
    else if (r === 'register') window.history.pushState({}, '', '/entrar');
    else if (r === 'dashboard' && param) window.history.pushState({}, '', '/dashboard/' + param);
  };

  const showToast = (msg, type = 'info') => {
    if (toastRef.current) clearTimeout(toastRef.current);
    setToast({ msg, type });
    toastRef.current = setTimeout(() => setToast(null), 3200);
  };

  const updateVenueQueue = (slug, newQueue) => {
    setVenues(prev => {
      const updated = { ...prev, [slug]: { ...prev[slug], queue: newQueue } };
      try { localStorage.setItem('fila_karaoke_venues', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
  };

  const registerVenue = (data) => {
    const venue = {
      slug: data.slug,
      name: data.name,
      plan: data.plan,
      djPassword: data.djPassword,
      ownerEmail: data.email,
      ownerPassword: data.password,
      primaryColor: C.accent,
      createdAt: Date.now(),
      queue: [],
      stats: { totalSessions: 0, avgQueueSize: 0, totalSingers: 0 },
    };
    setVenues(prev => {
      const updated = { ...prev, [data.slug]: venue };
      try { localStorage.setItem('fila_karaoke_venues', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });
    return venue;
  };

  const currentVenue = routeParam ? venues[routeParam] : null;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{GLOBAL_CSS}</style>

      {toast && (
        <div className="slide-down" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 9999, background: C.surface2, border: `1px solid ${toast.type === 'success' ? C.green : toast.type === 'error' ? C.red : C.border2}`, borderRadius: 12, padding: '12px 22px', fontSize: 14, color: C.text, display: 'flex', alignItems: 'center', gap: 8, backdropFilter: 'blur(12px)', whiteSpace: 'nowrap', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'} {toast.msg}
        </div>
      )}

      {route === 'landing'   && <LandingPage go={go} />}
      {route === 'register'  && <RegisterPage go={go} venues={venues} registerVenue={registerVenue} showToast={showToast} routeParam={routeParam} />}
      {route === 'dashboard' && <DashboardPage go={go} venue={currentVenue} updateQueue={(q) => updateVenueQueue(routeParam, q)} showToast={showToast} />}
      {route === 'venue'     && <VenuePage go={go} venue={currentVenue} updateQueue={(q) => updateVenueQueue(routeParam, q)} showToast={showToast} />}
      {route === 'dj'        && <DJPage go={go} venue={currentVenue} updateQueue={(q) => updateVenueQueue(routeParam, q)} showToast={showToast} />}
    </div>
  );
}

// ─── LANDING PAGE ────────────────────────────────────────────────
function LandingPage({ go }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: C.glass, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo />
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <span className="nav-link" style={{ color: C.muted, fontSize: 14 }} onClick={() => document.getElementById('planos')?.scrollIntoView({ behavior: 'smooth' })}>Planos</span>
            <span className="nav-link" style={{ color: C.muted, fontSize: 14 }} onClick={() => go('venue', 'allin')}>Ver Demo</span>
            <button style={{ ...S.btnOutline, padding: '9px 20px', fontSize: 13 }} className="btn-hover" onClick={() => go('register', 'login')}>Entrar</button>
            <button style={{ ...S.btn, width: 'auto', padding: '9px 22px', fontSize: 13 }} className="btn-hover" onClick={() => go('register', 'new')}>Começar grátis</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '100px 24px 80px' }}>
        <div style={{ position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,46,245,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 100, right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(24,217,244,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }} className="fade-up">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: C.accentLight, border: `1px solid ${C.accentBorder}`, borderRadius: 100, padding: '6px 16px', fontSize: 13, color: C.accent, marginBottom: 28, fontWeight: 500 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block', animation: 'pulseRing 1.5s ease infinite' }} />
            Novo · Gestão de fila para karaokê
          </div>

          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 800, lineHeight: 1.08, marginBottom: 24, letterSpacing: -1.5 }}>
            A fila do seu<br />
            <span className="gradient-text">karaokê no controle</span>
          </h1>

          <p style={{ fontSize: 'clamp(16px, 2.5vw, 20px)', color: C.muted, maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Cada cliente escolhe a música pelo celular, acompanha a fila em tempo real e o DJ controla tudo sem papel e sem gritaria.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button style={{ ...S.btn, width: 'auto', padding: '16px 36px', fontSize: 16 }} className="btn-hover glow-card" onClick={() => go('register', 'new')}>
              🎤 Criar minha conta grátis
            </button>
            <button style={{ ...S.btnOutline, padding: '16px 28px', fontSize: 15 }} className="btn-hover" onClick={() => go('venue', 'allin')}>
              Ver demonstração →
            </button>
          </div>

          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', marginTop: 36, flexWrap: 'wrap' }}>
            {['✅ Sem contrato', '✅ Setup em 5 minutos', '✅ Cancele quando quiser'].map(t => (
              <span key={t} style={{ fontSize: 13, color: C.muted }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* MOCKUP PREVIEW */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
          {[
            { icon: '📱', title: 'Cliente', desc: 'Escaneia o QR, escolhe a música e acompanha a posição em tempo real', color: C.accent },
            { icon: '🎧', title: 'DJ', desc: 'Painel com a fila completa, controle total — sem papel, sem confusão', color: C.cyan },
            { icon: '🏠', title: 'Dono', desc: 'Dashboard com estatísticas, configurações e link exclusivo do seu estabelecimento', color: C.yellow },
          ].map((item) => (
            <div key={item.title} style={{ ...S.card, textAlign: 'center', padding: '28px 24px' }} className="card-hover">
              <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${item.color}22, ${item.color}11)`, border: `1px solid ${item.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 16px' }}>{item.icon}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: C.text, marginBottom: 8 }}>{item.title}</div>
              <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '60px 24px', background: C.surface, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, marginBottom: 12 }}>Tudo que você precisa</h2>
            <p style={{ color: C.muted, fontSize: 16 }}>Desenvolvido pensando em bares, casas de show e eventos de karaokê</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { icon: '🎵', title: 'Música livre', desc: 'Cliente digita qualquer música — sem banco limitado' },
              { icon: '📲', title: 'Fila em tempo real', desc: 'Todo mundo vê a fila atualizada instantaneamente' },
              { icon: '🔐', title: 'Senha DJ exclusiva', desc: 'Cada casa tem sua própria senha personalizada' },
              { icon: '🔗', title: 'Link único', desc: 'filakara.com.br/sua-casa — fácil de colocar no QR' },
              { icon: '⬆️', title: 'Controle total', desc: 'DJ prioriza, remove e avança a fila com um clique' },
              { icon: '📊', title: 'Estatísticas', desc: 'Veja quantos cantaram, horários de pico e mais' },
            ].map(f => (
              <div key={f.title} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '20px 18px' }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: C.text, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="planos" style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 800, marginBottom: 12 }}>Planos simples e transparentes</h2>
            <p style={{ color: C.muted, fontSize: 16 }}>Sem taxas escondidas. Cancele quando quiser.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, alignItems: 'start' }}>
            {PLANS.map(plan => (
              <PlanCard key={plan.id} plan={plan} onSelect={() => go('register', `new-${plan.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 24px 80px', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }} className="float">🎤</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 16 }}>Pronto para organizar sua fila?</h2>
          <p style={{ color: C.muted, fontSize: 16, marginBottom: 28 }}>Comece agora em menos de 5 minutos. Sem cartão de crédito.</p>
          <button style={{ ...S.btn, width: 'auto', padding: '16px 40px', fontSize: 16 }} className="btn-hover glow-card" onClick={() => go('register', 'new')}>
            Criar conta grátis →
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: `1px solid ${C.border}`, padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 }}>
          <Logo small />
        </div>
        <p style={{ fontSize: 13, color: C.dim }}>© 2025 Fila Karaokê · Todos os direitos reservados</p>
      </footer>
    </div>
  );
}

function PlanCard({ plan, onSelect }) {
  return (
    <div style={{ background: plan.popular ? `linear-gradient(160deg, ${C.surface2}, ${C.surface3})` : C.surface, border: `2px solid ${plan.popular ? plan.color : C.border}`, borderRadius: 20, padding: '28px 24px', position: 'relative', overflow: 'hidden' }}>
      {plan.popular && (
        <div style={{ position: 'absolute', top: 16, right: 16, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, color: '#fff', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 0.5 }}>
          POPULAR
        </div>
      )}
      {plan.popular && <div style={{ position: 'absolute', top: -60, right: -60, width: 160, height: 160, borderRadius: '50%', background: `radial-gradient(circle, ${plan.color}15 0%, transparent 70%)`, pointerEvents: 'none' }} />}
      <div style={{ fontSize: 13, color: plan.color, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>{plan.name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 6 }}>
        <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 40, fontWeight: 800, color: C.text }}>R${plan.price}</span>
        <span style={{ color: C.muted, fontSize: 14 }}>/mês</span>
      </div>
      <div style={{ fontSize: 13, color: C.muted, marginBottom: 22 }}>{plan.desc}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {plan.features.map(f => (
          <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: C.text }}>
            <span style={{ color: plan.color, fontSize: 14 }}>✓</span>{f}
          </div>
        ))}
      </div>
      <button style={{ ...S.btn, background: plan.popular ? `linear-gradient(135deg, ${plan.color}, ${C.accentDark})` : 'transparent', border: plan.popular ? 'none' : `1px solid ${plan.color}`, color: plan.popular ? '#fff' : plan.color }} className="btn-hover" onClick={onSelect}>
        Começar agora
      </button>
    </div>
  );
}

// ─── REGISTER / LOGIN ────────────────────────────────────────────
function RegisterPage({ go, venues, registerVenue, showToast, routeParam }) {
  const isLogin = routeParam === 'login';
  const preselectedPlan = routeParam?.startsWith('new-') ? routeParam.replace('new-', '') : 'pro';

  const [mode, setMode] = useState(isLogin ? 'login' : 'signup');
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: '', slug: '', email: '', password: '', djPassword: '', plan: preselectedPlan });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

  const handleLogin = () => {
    const venue = Object.values(venues).find(v => v.ownerEmail === loginForm.email && v.ownerPassword === loginForm.password);
    if (venue) { go('dashboard', venue.slug); }
    else showToast('E-mail ou senha incorretos', 'error');
  };

  const handleNext = () => {
    if (step === 1 && (!form.name.trim() || !form.email.trim() || !form.password.trim())) { showToast('Preencha todos os campos', 'error'); return; }
    if (step === 2 && !form.slug.trim()) { showToast('Informe o nome do seu estabelecimento', 'error'); return; }
    if (step === 2 && venues[form.slug]) { showToast('Este slug já está em uso. Tente outro.', 'error'); return; }
    if (step === 3 && form.djPassword.length < 4) { showToast('Senha do DJ deve ter pelo menos 4 caracteres', 'error'); return; }
    if (step < 4) { setStep(s => s + 1); return; }
    const venue = registerVenue(form);
    showToast('Conta criada com sucesso! 🎉', 'success');
    go('dashboard', venue.slug);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => go('landing')}><Logo /></span>
          <button style={S.btnOutline} className="btn-hover" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Criar conta' : 'Já tenho conta'}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 460 }} className="fade-up">

          {mode === 'login' ? (
            <div>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>👋</div>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Bem-vindo de volta</h2>
                <p style={{ color: C.muted, fontSize: 14 }}>Entre na sua conta de dono</p>
              </div>
              <div style={S.card}>
                <Field label="E-mail" type="email" placeholder="seu@email.com" value={loginForm.email} onChange={v => setLoginForm(p => ({...p, email: v}))} />
                <div style={{ marginTop: 16 }}>
                  <Field label="Senha" type="password" placeholder="••••••••" value={loginForm.password} onChange={v => setLoginForm(p => ({...p, password: v}))} onEnter={handleLogin} />
                </div>
                <button style={{ ...S.btn, marginTop: 20 }} className="btn-hover" onClick={handleLogin}>Entrar →</button>
                <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: C.dim }}>
                  Demo: <span style={{ color: C.accent }}>guilherme@allin.com.br</span> / <span style={{ color: C.accent }}>123456</span>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <StepIndicator current={step} total={4} />
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 6 }}>
                  {['Sua conta', 'Seu estabelecimento', 'Senha do DJ', 'Escolha seu plano'][step - 1]}
                </h2>
                <p style={{ color: C.muted, fontSize: 13 }}>
                  {['Informações de acesso ao painel do dono', 'Como seus clientes vão te encontrar', 'A senha que o DJ vai usar no painel', 'Você pode mudar o plano depois'][step - 1]}
                </p>
              </div>

              <div style={S.card}>
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Field label="Seu nome" placeholder="Nome do responsável" value={form.name} onChange={v => set('name', v)} />
                    <Field label="E-mail" type="email" placeholder="seu@email.com" value={form.email} onChange={v => set('email', v)} />
                    <Field label="Senha da sua conta" type="password" placeholder="Mínimo 6 caracteres" value={form.password} onChange={v => set('password', v)} />
                  </div>
                )}

                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <Field label="Nome do estabelecimento" placeholder="Ex: ALLIN Karaokê" value={form.name} onChange={v => { set('name', v); set('slug', slugify(v)); }} />
                    <div>
                      <label style={{ display: 'block', fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: 500 }}>Link exclusivo</label>
                      <div style={{ display: 'flex', alignItems: 'center', background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 12, overflow: 'hidden' }}>
                        <span style={{ padding: '14px 12px', color: C.dim, fontSize: 13, whiteSpace: 'nowrap', borderRight: `1px solid ${C.border}` }}>filakara.com/</span>
                        <input style={{ ...S.input, background: 'transparent', border: 'none', flex: 1 }} placeholder="meu-karaoke" value={form.slug} onChange={e => set('slug', slugify(e.target.value))} />
                      </div>
                      {form.slug && <div style={{ fontSize: 12, color: C.green, marginTop: 6 }}>✓ filakara.com/{form.slug}</div>}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <Field label="Senha do DJ" type="password" placeholder="Crie uma senha para o painel do DJ" value={form.djPassword} onChange={v => set('djPassword', v)} />
                    <div style={{ marginTop: 12, padding: '12px 14px', background: C.accentLight, border: `1px solid ${C.accentBorder}`, borderRadius: 10, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>
                      💡 Esta senha é usada pelo seu DJ para acessar o painel de controle. Você pode alterá-la depois no dashboard.
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {PLANS.map(plan => (
                      <div key={plan.id} className="card-hover" style={{ background: form.plan === plan.id ? C.accentLight : C.surface2, border: `1px solid ${form.plan === plan.id ? C.accent : C.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => set('plan', plan.id)}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{plan.name}</div>
                          <div style={{ fontSize: 12, color: C.muted }}>{plan.desc}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: plan.popular ? C.accent : C.text }}>R${plan.price}</div>
                          <div style={{ fontSize: 11, color: C.muted }}>/mês</div>
                        </div>
                      </div>
                    ))}
                    <div style={{ fontSize: 12, color: C.dim, textAlign: 'center', marginTop: 4 }}>Teste grátis por 14 dias · Cancele quando quiser</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  {step > 1 && <button style={{ ...S.btnOutline, flex: 1 }} className="btn-hover" onClick={() => setStep(s => s - 1)}>← Voltar</button>}
                  <button style={{ ...S.btn, flex: 2 }} className="btn-hover" onClick={handleNext}>
                    {step < 4 ? 'Continuar →' : '🎉 Criar minha conta'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD (DONO) ────────────────────────────────────────────
function DashboardPage({ go, venue, updateQueue, showToast }) {
  const [tab, setTab] = useState('overview');
  const [editDjPassword, setEditDjPassword] = useState(false);
  const [newDjPass, setNewDjPass] = useState('');

  if (!venue) return <NotFound go={go} />;

  const active = venue.queue.filter(e => e.status !== 'done');
  const current = venue.queue.find(e => e.status === 'singing');
  const waiting = venue.queue.filter(e => e.status === 'waiting');

  const planInfo = PLANS.find(p => p.id === venue.plan) || PLANS[0];

  return (
    <div>
      {/* HEADER */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ cursor: 'pointer' }} onClick={() => go('landing')}><Logo small /></span>
            <span style={{ color: C.dim }}>›</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{venue.name}</span>
            <span style={{ fontSize: 11, background: planInfo.popular ? C.accentLight : C.surface3, color: planInfo.popular ? C.accent : C.muted, padding: '3px 10px', borderRadius: 20, fontWeight: 600 }}>{planInfo.name}</span>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={{ ...S.btnOutline, padding: '8px 16px', fontSize: 13 }} className="btn-hover" onClick={() => go('venue', venue.slug)}>
              👁️ Ver como cliente
            </button>
            <button style={{ ...S.btn, width: 'auto', padding: '8px 16px', fontSize: 13, background: `linear-gradient(135deg, ${C.cyan}CC, #0FA8C4)` }} className="btn-hover" onClick={() => go('dj', venue.slug)}>
              🎧 Painel DJ
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px 24px' }}>
        {/* TABS */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 4, width: 'fit-content' }}>
          {[['overview', '📊 Visão Geral'], ['queue', '🎤 Fila'], ['settings', '⚙️ Configurações']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ padding: '8px 18px', borderRadius: 9, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: 'none', background: tab === id ? `linear-gradient(135deg, ${C.accent}, ${C.accentDark})` : 'transparent', color: tab === id ? '#fff' : C.muted, transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="fade-up">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
              {[
                { label: 'Na fila agora', value: active.length, color: C.cyan, icon: '⏳' },
                { label: 'Cantando', value: current ? 1 : 0, color: C.green, icon: '🎤' },
                { label: 'Total de sessões', value: venue.stats.totalSessions, color: C.accent, icon: '📅' },
                { label: 'Cantores atendidos', value: venue.stats.totalSingers, color: C.yellow, icon: '🌟' },
              ].map(s => (
                <div key={s.label} style={{ ...S.card, textAlign: 'center' }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={S.card}>
                <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 }}>Seu link exclusivo</div>
                <div style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 10, padding: '12px 14px', fontSize: 14, color: C.accent, fontWeight: 500, marginBottom: 10, wordBreak: 'break-all' }}>
                  🔗 filakara.com/{venue.slug}
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>Compartilhe com os clientes ou coloque num QR Code</div>
              </div>
              <div style={S.card}>
                <div style={{ fontSize: 13, color: C.muted, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 }}>Senha do DJ</div>
                <div style={{ background: C.surface2, border: `1px solid ${C.border2}`, borderRadius: 10, padding: '12px 14px', fontSize: 14, color: C.text, fontWeight: 500, letterSpacing: 3, marginBottom: 10 }}>
                  {'•'.repeat(venue.djPassword.length)}
                </div>
                <div style={{ fontSize: 12, color: C.muted }}>Altere em Configurações → Senha do DJ</div>
              </div>
            </div>
          </div>
        )}

        {/* QUEUE */}
        {tab === 'queue' && (
          <div className="fade-up">
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <button style={{ ...S.btn, width: 'auto', padding: '10px 20px', fontSize: 13, background: `linear-gradient(135deg, ${C.cyan}CC, #0FA8C4)` }} className="btn-hover" onClick={() => go('dj', venue.slug)}>
                🎧 Abrir Painel do DJ
              </button>
            </div>
            {current && (
              <div style={{ background: C.greenLight, border: `1px solid rgba(61,214,140,0.3)`, borderRadius: 14, padding: '16px 20px', marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>🎤 Cantando agora</div>
                <div style={{ fontSize: 16, fontWeight: 700 }}>{current.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>🎵 {current.song.title} — {current.song.artist}</div>
              </div>
            )}
            <div style={S.card}>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>Aguardando ({waiting.length})</div>
              {waiting.length === 0 && <div style={{ color: C.muted, fontSize: 14, textAlign: 'center', padding: '16px 0' }}>Fila vazia</div>}
              {waiting.map((e, i) => (
                <div key={e.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderBottom: i < waiting.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 7, background: C.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.muted, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{e.name}</div>
                    <div style={{ fontSize: 12, color: C.muted }}>🎵 {e.song.title}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <div className="fade-up" style={{ maxWidth: 520 }}>
            <div style={{ ...S.card, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏠 Informações do estabelecimento</div>
              <Row label="Nome" value={venue.name} />
              <Row label="Slug / URL" value={`filakara.com/${venue.slug}`} />
              <Row label="Plano" value={planInfo.name} last />
            </div>
            <div style={{ ...S.card, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>🔐 Senha do DJ</div>
                <button style={{ ...S.btnOutline, padding: '7px 14px', fontSize: 12 }} className="btn-hover" onClick={() => setEditDjPassword(!editDjPassword)}>
                  {editDjPassword ? 'Cancelar' : 'Alterar'}
                </button>
              </div>
              {editDjPassword ? (
                <div>
                  <input style={S.input} type="password" placeholder="Nova senha do DJ" value={newDjPass} onChange={e => setNewDjPass(e.target.value)} autoFocus />
                  <button style={{ ...S.btn, marginTop: 10 }} className="btn-hover" onClick={() => { if (newDjPass.length >= 4) { venue.djPassword = newDjPass; setEditDjPassword(false); setNewDjPass(''); showToast('Senha atualizada!', 'success'); } else showToast('Mínimo 4 caracteres', 'error'); }}>
                    Salvar nova senha
                  </button>
                </div>
              ) : (
                <div style={{ fontSize: 14, color: C.muted }}>Senha com {venue.djPassword.length} caracteres · Use em Painel DJ</div>
              )}
            </div>
            <div style={S.card}>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>👤 Conta do dono</div>
              <Row label="E-mail" value={venue.ownerEmail} last />
              <button style={{ ...S.btnOutline, width: '100%', marginTop: 14, textAlign: 'center', color: C.red, borderColor: C.redLight }} className="btn-hover" onClick={() => go('landing')}>
                Sair da conta
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VENUE PAGE (CLIENTE) ────────────────────────────────────────
function VenuePage({ go, venue, updateQueue, showToast }) {
  const [step, setStep] = useState('register');
  const [name, setName] = useState('');
  const [songTitle, setSongTitle] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [myEntry, setMyEntry] = useState(null);

  if (!venue) return <NotFound go={go} />;

  const queue = venue.queue;
  const activeQueue = queue.filter(e => e.status !== 'done');
  const current = queue.find(e => e.status === 'singing');
  const myPos = myEntry ? activeQueue.findIndex(e => e.id === myEntry.id) + 1 : null;
  const isNext = myPos === 2;

  const handleJoin = () => {
    if (!name.trim() || !songTitle.trim()) return;
    const entry = { id: uid(), name: name.trim(), song: { title: songTitle.trim(), artist: songArtist.trim() || 'Artista não informado' }, status: 'waiting', number: queue.length + 1, joinedAt: Date.now() };
    updateQueue([...queue, entry]);
    setMyEntry(entry);
    setStep('confirm');
  };

  const reset = () => { setMyEntry(null); setSongTitle(''); setSongArtist(''); setName(''); setStep('register'); };

  const posColor = myPos === 1 ? C.green : myPos === 2 ? C.yellow : C.cyan;

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* VENUE HEADER */}
      <div style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: '0 20px' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', height: 58, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img src={LOGO_IMG} alt="Fila Karaokê" style={{ height: 34, width: 'auto', objectFit: 'contain' }} />
            <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{venue.name}</div>
          </div>
          <button style={{ background: C.accentLight, color: C.accent, border: `1px solid ${C.accentBorder}`, borderRadius: 9, padding: '7px 13px', fontSize: 12, fontWeight: 500, cursor: 'pointer' }} className="btn-hover" onClick={() => go('dj', venue.slug)}>
            🎧 DJ
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 20px 48px' }}>
        {step === 'register' && (
          <div className="fade-up" style={{ paddingTop: 32 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 52, marginBottom: 10 }} className="float">🎤</div>
              <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Entre na fila!</h1>
              <p style={{ color: C.muted, fontSize: 14 }}>Digite seu nome para começar</p>
            </div>
            <div style={S.card}>
              <Field label="Seu nome ou apelido" placeholder="Ex: João, DJ Batatinha..." value={name} onChange={setName} onEnter={() => name.trim() && setStep('search')} autoFocus />
            </div>
            <button style={{ ...S.btn, marginTop: 14, opacity: name.trim() ? 1 : 0.4 }} className="btn-hover" disabled={!name.trim()} onClick={() => name.trim() && setStep('search')}>
              Continuar →
            </button>
            {current && (
              <div style={{ ...S.card, marginTop: 20, background: C.greenLight, border: `1px solid rgba(61,214,140,0.25)` }}>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>🎤 Cantando agora</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{current.name}</div>
                <div style={{ fontSize: 13, color: C.muted }}>🎵 {current.song.title}</div>
              </div>
            )}
          </div>
        )}

        {step === 'search' && (
          <div className="fade-up" style={{ paddingTop: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26 }}>
              <button style={{ ...S.btnOutline, padding: '9px 13px' }} className="btn-hover" onClick={() => setStep('register')}>←</button>
              <div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700 }}>Olá, {name}! 👋</div>
                <div style={{ fontSize: 13, color: C.muted }}>Qual música você vai cantar?</div>
              </div>
            </div>
            <div style={S.card}>
              <Field label={<>Nome da música <span style={{ color: C.accent }}>*</span></>} placeholder="Ex: Evidências, Shallow..." value={songTitle} onChange={setSongTitle} autoFocus />
              <div style={{ marginTop: 16 }}>
                <Field label={<span>Artista <span style={{ fontSize: 11, color: C.dim, fontWeight: 400 }}>(opcional)</span></span>} placeholder="Ex: Adele, Queen..." value={songArtist} onChange={setSongArtist} onEnter={() => songTitle.trim() && handleJoin()} />
              </div>
            </div>
            {songTitle.trim() && (
              <div style={{ background: C.surface2, border: `1px solid ${C.accentBorder}`, borderRadius: 12, padding: '14px 18px', margin: '14px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ fontSize: 22 }}>🎵</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{songTitle}</div>
                  {songArtist && <div style={{ fontSize: 12, color: C.muted }}>{songArtist}</div>}
                </div>
              </div>
            )}
            <button style={{ ...S.btn, opacity: songTitle.trim() ? 1 : 0.4 }} className="btn-hover" disabled={!songTitle.trim()} onClick={handleJoin}>
              🎤 Entrar na Fila
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="fade-up" style={{ paddingTop: 40, textAlign: 'center' }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 24 }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', fontSize: 36 }}>🎉</div>
              <div style={{ position: 'absolute', inset: -6, borderRadius: '50%', border: `2px solid ${C.accent}`, opacity: 0.4, animation: 'pulseRing 1.8s ease infinite' }} />
            </div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Você está na fila!</h2>
            <p style={{ color: C.muted, marginBottom: 28 }}>Aguarde ser chamado</p>
            <div style={{ display: 'inline-block', background: C.accentLight, border: `1px solid ${C.accentBorder}`, borderRadius: 20, padding: '28px 40px', marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: C.muted, marginBottom: 4 }}>Sua posição</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 72, fontWeight: 900, color: C.accent, lineHeight: 1 }}>#{myPos}</div>
            </div>
            <div style={{ ...S.card, textAlign: 'left', marginBottom: 16 }}>
              <Row label="👤 Nome" value={myEntry?.name} />
              <Row label="🎵 Música" value={myEntry?.song.title} />
              <Row label="🎤 Artista" value={myEntry?.song.artist} last />
            </div>
            <button style={S.btn} className="btn-hover" onClick={() => setStep('tracking')}>📲 Acompanhar ao vivo</button>
          </div>
        )}

        {step === 'tracking' && (
          <div className="fade-up" style={{ paddingTop: 20 }}>
            {myPos === 2 && (
              <div style={{ background: C.yellowLight, border: `1px solid rgba(245,197,24,0.3)`, borderRadius: 12, padding: '12px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.yellow }}>Você é o próximo!</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Se prepare para subir no palco</div>
                </div>
              </div>
            )}
            {myPos === 1 && (
              <div style={{ background: C.greenLight, border: `1px solid rgba(61,214,140,0.3)`, borderRadius: 12, padding: '12px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>🎤</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.green }}>É a sua vez!</div>
                  <div style={{ fontSize: 12, color: C.muted }}>Suba no palco e divirta-se!</div>
                </div>
              </div>
            )}
            <div style={{ ...S.card, textAlign: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 4 }}>Sua posição</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, fontWeight: 900, color: posColor, lineHeight: 1 }}>
                {myPos === 1 ? '🎤 Agora!' : myPos === 2 ? '⚡ Próximo' : `#${myPos}`}
              </div>
              {myEntry && <div style={{ fontSize: 13, color: C.muted, marginTop: 8 }}>🎵 {myEntry.song.title}</div>}
            </div>
            {current && (
              <div style={{ background: C.greenLight, border: `1px solid rgba(61,214,140,0.25)`, borderRadius: 12, padding: '14px 16px', marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: C.green, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>🎤 Cantando agora</div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{current.name}</div>
                <div style={{ fontSize: 12, color: C.muted }}>🎵 {current.song.title} — {current.song.artist}</div>
              </div>
            )}
            <div style={S.card}>
              <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>Fila completa ({activeQueue.length})</div>
              {activeQueue.map((entry, i) => {
                const isMine = myEntry && entry.id === myEntry.id;
                const isCurrent = entry.status === 'singing';
                return (
                  <div key={entry.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: i < activeQueue.length - 1 ? `1px solid ${C.border}` : 'none', background: isMine ? C.accentLight : 'transparent', margin: isMine ? '0 -26px' : 0, padding: isMine ? '10px 26px' : '10px 0' }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: isCurrent ? C.greenLight : C.surface2, border: `1px solid ${isCurrent ? 'rgba(61,214,140,0.3)' : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: isCurrent ? C.green : C.muted, flexShrink: 0 }}>
                      {isCurrent ? '🎤' : i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: isMine ? 700 : 500, color: isMine ? C.accent : C.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {entry.name} {isMine && <span style={{ fontSize: 10, background: C.accentLight, color: C.accent, padding: '2px 6px', borderRadius: 4 }}>você</span>}
                      </div>
                      <div style={{ fontSize: 11, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.song.title}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button style={{ ...S.btnOutline, width: '100%', marginTop: 14, textAlign: 'center' }} className="btn-hover" onClick={reset}>
              Sair da fila
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DJ PAGE ─────────────────────────────────────────────────────
function DJPage({ go, venue, updateQueue, showToast }) {
  const [authed, setAuthed] = useState(false);
  const [code, setCode] = useState('');

  if (!venue) return <NotFound go={go} />;

  const tryLogin = () => {
    if (code === venue.djPassword) { setAuthed(true); }
    else { showToast('Senha incorreta', 'error'); }
  };

  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 360 }} className="fade-up">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: `linear-gradient(135deg, ${C.cyan}33, ${C.cyan}11)`, border: `1px solid ${C.cyan}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, margin: '0 auto 14px' }}>🎧</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, marginBottom: 6 }}>Painel do DJ</h2>
          <p style={{ color: C.muted, fontSize: 13 }}>{venue.name}</p>
        </div>
        <div style={S.card}>
          <Field label="Senha do DJ" type="password" placeholder="••••••••" value={code} onChange={setCode} onEnter={tryLogin} autoFocus />
          <button style={{ ...S.btn, marginTop: 14, background: `linear-gradient(135deg, ${C.cyan}CC, #0FA8C4)` }} className="btn-hover" onClick={tryLogin}>
            Entrar no painel
          </button>
        </div>
        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <span className="nav-link" style={{ fontSize: 13, color: C.muted }} onClick={() => go('venue', venue.slug)}>← Voltar para a fila</span>
        </div>
      </div>
    </div>
  );

  const queue = venue.queue;
  const current = queue.find(e => e.status === 'singing');
  const waiting = queue.filter(e => e.status === 'waiting');
  const done = queue.filter(e => e.status === 'done');

  const advance = () => {
    const q = queue.map(e => ({ ...e }));
    const singIdx = q.findIndex(e => e.status === 'singing');
    if (singIdx !== -1) q[singIdx].status = 'done';
    const nextIdx = q.findIndex(e => e.status === 'waiting');
    if (nextIdx !== -1) { q[nextIdx].status = 'singing'; showToast(`🎤 ${q[nextIdx].name} agora!`, 'success'); }
    else showToast('Fila vazia!', 'info');
    updateQueue(q);
  };

  const remove = (id) => { updateQueue(queue.filter(e => e.id !== id)); showToast('Removido', 'info'); };

  const prioritize = (id) => {
    const q = [...queue];
    const idx = q.findIndex(e => e.id === id);
    const firstWait = q.findIndex(e => e.status === 'waiting');
    if (idx > firstWait) { const [item] = q.splice(idx, 1); q.splice(firstWait, 0, item); }
    updateQueue(q);
    showToast('⬆️ Priorizado!', 'success');
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: `linear-gradient(135deg, ${C.surface}, ${C.surface2})`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: `linear-gradient(135deg, ${C.cyan}66, ${C.cyan}22)`, border: `1px solid ${C.cyan}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎧</div>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700 }}>Painel do DJ</div>
              <div style={{ fontSize: 11, color: C.muted }}>{venue.name}</div>
            </div>
          </div>
          <button style={{ ...S.btnOutline, padding: '7px 14px', fontSize: 12 }} className="btn-hover" onClick={() => go('venue', venue.slug)}>
            👁️ Fila pública
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '20px 20px 48px' }}>
        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
          {[
            { label: 'Na fila', value: waiting.length, color: C.cyan },
            { label: 'Cantando', value: current ? 1 : 0, color: C.green },
            { label: 'Cantaram', value: done.length, color: C.muted },
          ].map(s => (
            <div key={s.label} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '14px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* CURRENT */}
        <div style={{ background: current ? C.greenLight : C.surface, border: `1px solid ${current ? 'rgba(61,214,140,0.3)' : C.border}`, borderRadius: 16, padding: '18px 20px', marginBottom: 16 }}>
          <div style={{ fontSize: 11, color: current ? C.green : C.muted, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>🎤 Cantando Agora</div>
          {current ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700 }}>{current.name}</div>
                <div style={{ fontSize: 13, color: C.muted, marginTop: 2 }}>🎵 {current.song.title} — {current.song.artist}</div>
              </div>
              <button style={{ ...S.btn, width: 'auto', padding: '10px 18px', fontSize: 13, flexShrink: 0 }} className="btn-hover" onClick={advance}>
                Próximo →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: C.muted, fontSize: 14 }}>Ninguém cantando</span>
              {waiting.length > 0 && (
                <button style={{ background: C.greenLight, color: C.green, border: `1px solid rgba(61,214,140,0.3)`, borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} className="btn-hover" onClick={advance}>▶ Iniciar</button>
              )}
            </div>
          )}
        </div>

        {/* WAITING */}
        <div style={S.card}>
          <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 14 }}>Aguardando ({waiting.length})</div>
          {waiting.length === 0 && <div style={{ textAlign: 'center', color: C.muted, fontSize: 14, padding: '16px 0' }}>Fila vazia</div>}
          {waiting.map((entry, i) => (
            <div key={entry.id} className="row-hover" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderBottom: i < waiting.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: C.surface2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: C.muted, flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{entry.name}</div>
                <div style={{ fontSize: 12, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>🎵 {entry.song.title} — {entry.song.artist}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {i > 0 && (
                  <button className="icon-btn" style={{ width: 32, height: 32, borderRadius: 8, background: C.yellowLight, border: `1px solid rgba(245,197,24,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }} onClick={() => prioritize(entry.id)}>⬆️</button>
                )}
                <button className="icon-btn" style={{ width: 32, height: 32, borderRadius: 8, background: C.redLight, border: `1px solid rgba(245,96,96,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }} onClick={() => remove(entry.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        {done.length > 0 && (
          <div style={{ ...S.card, marginTop: 14 }}>
            <div style={{ fontSize: 12, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>✅ Já Cantaram ({done.length})</div>
            {done.map((entry, i) => (
              <div key={entry.id} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '7px 0', borderBottom: i < done.length - 1 ? `1px solid ${C.border}` : 'none', opacity: 0.55 }}>
                <span style={{ fontSize: 11 }}>✅</span>
                <span style={{ fontSize: 13, color: C.muted }}>{entry.name}</span>
                <span style={{ fontSize: 12, color: C.dim, marginLeft: 4 }}>— {entry.song.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── HELPERS ─────────────────────────────────────────────────────
function Logo({ small }) {
  return (
    <img
      src={LOGO_IMG}
      alt="Fila Karaokê"
      style={{ height: small ? 32 : 40, width: 'auto', objectFit: 'contain' }}
    />
  );
}

function Field({ label, type = 'text', placeholder, value, onChange, onEnter, autoFocus }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: C.muted, marginBottom: 8, fontWeight: 500 }}>{label}</label>
      <input style={S.input} type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} onKeyDown={e => e.key === 'Enter' && onEnter?.()} autoFocus={autoFocus} />
    </div>
  );
}

function Row({ label, value, last }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: last ? 'none' : `1px solid ${C.border}` }}>
      <span style={{ fontSize: 13, color: C.muted }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{value}</span>
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', marginBottom: 24 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ height: 4, width: i + 1 === current ? 24 : 14, borderRadius: 4, background: i + 1 <= current ? C.accent : C.surface3, transition: 'all 0.3s' }} />
      ))}
    </div>
  );
}

function NotFound({ go }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, padding: 24 }}>
      <div style={{ fontSize: 52 }}>🔍</div>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800 }}>Estabelecimento não encontrado</h2>
      <p style={{ color: C.muted, textAlign: 'center' }}>Verifique o link ou peça para o dono te enviar novamente</p>
      <button style={{ ...S.btn, width: 'auto', padding: '12px 28px' }} className="btn-hover" onClick={() => go('landing')}>← Voltar ao início</button>
    </div>
  );
}
