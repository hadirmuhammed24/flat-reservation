import React, { useState, useEffect, useMemo } from 'react';
import type { Flat, FilterState } from './types';
import { INITIAL_FLATS } from './data/flatsData';

import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { FlatCard } from './components/FlatCard';
import { FlatModal } from './components/FlatModal';
import { AddFlatModal } from './components/AddFlatModal';
import { Footer } from './components/Footer';
import { Compass, RotateCcw, SearchX } from 'lucide-react';
import { getTerms, getTermPrice, getDisplayTerm } from './utils/rental';
import { normalizeFlats, pickLang, readMeters } from './utils/display';
import { loadSession, registerAccount, signInAccount, signOut, type Account } from './utils/accounts';
import { AuthScreen } from './components/AuthScreen';
import {
  hiddenFlatIds,
  loadReports,
  loadRequests,
  loadReviews,
  loadSaved,
  makeCode,
  persistReports,
  persistRequests,
  persistReviews,
  persistSaved,
  suggestAlternatives,
  type GuestReview,
  type MismatchReport,
  type RecordDraft,
  type ReportReason,
  type StayRequest,
} from './utils/stay';
import {
  BeachesPage,
  MinePage,
  PolicyPage,
  RequestsPage,
  SavedPage,
  ServicesPage,
  SiteNav,
  type AppPage,
} from './components/SitePages';

export const App: React.FC = () => {
  const [lang, setLang] = useState<'ar' | 'en'>('ar');
  const isAr = lang === 'ar';

  // Synchronize document dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Load flats from localStorage or use initial data
  const [flats, setFlats] = useState<Flat[]>(() => {
    const seed = INITIAL_FLATS.map((flat) => normalizeFlats([flat], [flat])[0]);
    const saved = localStorage.getItem('matrouh_flats_v2');
    if (saved) {
      try {
        const stored = normalizeFlats(JSON.parse(saved), seed);
        const ids = new Set(stored.map((flat) => flat.id));
        const withNew = [...stored, ...seed.filter((flat) => !ids.has(flat.id))];
        return withNew.map((flat) => {
          const origin = seed.find((item) => item.id === flat.id);
          if (!origin || flat.ownerId) return flat;
          return { ...flat, canInspectBeforePay: origin.canInspectBeforePay, videoFilmedOn: origin.videoFilmedOn ?? flat.videoFilmedOn };
        });
      } catch {
        return seed;
      }
    }
    return seed;
  });

  // Save to localStorage when flats change
  useEffect(() => {
    localStorage.setItem('matrouh_flats_v2', JSON.stringify(flats));
  }, [flats]);

  // Selected flat for detailed modal
  const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null);

  // Add flat modal open state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [account, setAccount] = useState<Account | null>(() => loadSession());
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const [authIntent, setAuthIntent] = useState<'add' | null>(null);
  const [page, setPage] = useState<AppPage>('home');
  const [savedIds, setSavedIds] = useState<string[]>(() => loadSaved());
  const [requests, setRequests] = useState<StayRequest[]>(() => loadRequests());
  const [reviews, setReviews] = useState<GuestReview[]>(() => loadReviews());
  const [reports, setReports] = useState<MismatchReport[]>(() => loadReports());

  useEffect(() => persistSaved(savedIds), [savedIds]);
  useEffect(() => persistRequests(requests), [requests]);
  useEffect(() => persistReviews(reviews), [reviews]);
  useEffect(() => persistReports(reports), [reports]);

  const requestAuth = (mode: 'login' | 'register', intent: 'add' | null = null) => {
    setAuthIntent(intent);
    setAuthMode(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const finishAuth = (next: Account) => {
    setAccount(next);
    setAuthMode(null);
    if (authIntent === 'add') setIsAddModalOpen(true);
    setAuthIntent(null);
  };

  // Filters State
  const initialFilters: FilterState = {
    rentalTerm: 'all',
    area: 'all',
    searchQuery: '',
    minPrice: 0,
    maxPrice: 5000,
    bedrooms: 'any',
    hasSeaView: false,
    hasElevator: false,
    hasAC: false,
    guests: 0,
    inspectOnly: false,
    hasVideo: false,
    nearBeach: false,
    sortBy: 'recommended',
  };

  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
  };

  const handleResetFilters = () => {
    setFilters(initialFilters);
  };

  const handleAddFlat = (newFlat: Flat) => {
    const [safe] = normalizeFlats([{ ...newFlat, ownerId: account?.id }], []);
    if (!safe) return;
    setFlats((prev) => [safe, ...prev]);
    setPage('mine');
  };

  const openFlat = (flat: Flat) => {
    setAuthMode(null);
    setSelectedFlat(flat);
    const next = `#flat=${encodeURIComponent(flat.id)}`;
    if (window.location.hash !== next) window.history.replaceState(null, '', next);
  };

  const closeFlat = () => {
    setSelectedFlat(null);
    if (window.location.hash.startsWith('#flat=')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  useEffect(() => {
    if (!account) return;
    const id = decodeURIComponent(window.location.hash.replace(/^#flat=/, ''));
    if (!window.location.hash.startsWith('#flat=') || !id) return;
    const found = flats.find((flat) => flat.id === id);
    if (found) setSelectedFlat(found);
  }, [flats, account]);

  const hidden = useMemo(() => hiddenFlatIds(reports), [reports]);

  const recordStay = (flat: Flat, draft: RecordDraft) => {
    if (!account) return { code: '' };
    const existing = requests.find(
      (row) => row.accountId === account.id && row.flatId === flat.id && row.kind === draft.kind && row.status === 'open',
    );
    const code = existing?.code ?? makeCode();
    const row: StayRequest = {
      id: existing?.id ?? `req-${Date.now()}`,
      code,
      kind: draft.kind,
      status: 'open',
      flatId: flat.id,
      titleAr: pickLang(flat.title, 'ar'),
      titleEn: pickLang(flat.title, 'en'),
      area: flat.area,
      accountId: account.id,
      guestName: account.name,
      whenLabel: draft.whenLabel,
      details: draft.details,
      holdAmount: draft.holdAmount,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };
    setRequests((prev) => [row, ...prev.filter((item) => item.id !== row.id)]);
    return { code };
  };

  const setRequestStatus = (flatId: string, status: StayRequest['status']) => {
    if (!account) return;
    setRequests((prev) =>
      prev.map((row) =>
        row.accountId === account.id && row.flatId === flatId && row.status === 'open' ? { ...row, status } : row,
      ),
    );
  };

  // Filter & Sort Logic
  const filteredFlats = useMemo(() => {
    const sortPrice = (flat: Flat) => {
      const term = getDisplayTerm(flat, filters.rentalTerm);
      const price = getTermPrice(flat, term);
      if (price == null) return Number.NaN;
      // Normalise monthly prices to a nightly equivalent so mixed lists sort sensibly
      return filters.rentalTerm === 'all' && term !== 'summer' ? price / 30 : price;
    };

    const comparePrice = (a: Flat, b: Flat, direction: 1 | -1) => {
      const pa = sortPrice(a);
      const pb = sortPrice(b);
      const aMissing = !Number.isFinite(pa);
      const bMissing = !Number.isFinite(pb);
      if (aMissing && bMissing) return 0;
      if (aMissing) return 1;
      if (bMissing) return -1;
      return (pa - pb) * direction;
    };

    return flats
      .filter((flat) => {
        if (filters.area !== 'all' && flat.area !== filters.area) {
          return false;
        }

        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const haystack = [
            pickLang(flat.title, 'ar'),
            pickLang(flat.title, 'en'),
            pickLang(flat.areaName, 'ar'),
            pickLang(flat.areaName, 'en'),
            pickLang(flat.description, 'ar'),
            pickLang(flat.description, 'en'),
          ]
            .join(' ')
            .toLowerCase();
          if (!haystack.includes(q)) return false;
        }

        // A listing offered without a number stays visible as "price on request".
        // On "all", the slider is a nightly cap, so it only limits summer prices.
        if (filters.rentalTerm === 'all') {
          const nightly = getTermPrice(flat, 'summer');
          if (nightly != null && nightly > filters.maxPrice) return false;
        } else if (!getTerms(flat).includes(filters.rentalTerm)) {
          return false;
        } else {
          const termPrice = getTermPrice(flat, filters.rentalTerm);
          if (termPrice != null && termPrice > filters.maxPrice) return false;
        }

        // Bedrooms filter
        if (filters.bedrooms !== 'any' && flat.bedrooms < filters.bedrooms) {
          return false;
        }

        // Sea View
        if (filters.hasSeaView && !flat.hasSeaView) {
          return false;
        }

        // Elevator
        if (filters.hasElevator && !flat.hasElevator) {
          return false;
        }

        // AC
        if (filters.hasAC && !(flat.amenities ?? []).includes('ac')) {
          return false;
        }

        if (filters.guests > 0 && flat.maxGuests < filters.guests) return false;
        if (filters.inspectOnly && !flat.canInspectBeforePay) return false;
        if (filters.hasVideo && !flat.videoUrl) return false;
        if (filters.nearBeach) {
          const metres = readMeters(flat);
          if (metres == null || metres > 100) return false;
        }
        if (hidden.has(flat.id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'price_asc') {
          return comparePrice(a, b, 1);
        }
        if (filters.sortBy === 'price_desc') {
          return comparePrice(a, b, -1);
        }
        if (filters.sortBy === 'rating') {
          return b.rating - a.rating;
        }
        if (filters.sortBy === 'distance') {
          return (readMeters(a) ?? Number.POSITIVE_INFINITY) - (readMeters(b) ?? Number.POSITIVE_INFINITY);
        }
        // Recommended default: featured first, then rating
        if (a.isFeatured && !b.isFeatured) return -1;
        if (!a.isFeatured && b.isFeatured) return 1;
        return b.rating - a.rating;
      });
  }, [flats, filters, hidden]);

  const scrollToCatalog = () => {
    const el = document.getElementById('flats-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col font-sans">
        <header className="bg-white/80 backdrop-blur-xl border-b border-sky-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
            <span className="font-extrabold text-xl bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-400 bg-clip-text text-transparent">
              {isAr ? 'مصايف مرسى مطروح' : 'Matrouh Escapes'}
            </span>
            <button
              type="button"
              onClick={() => setLang(isAr ? 'en' : 'ar')}
              className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 border border-slate-200"
            >
              {isAr ? 'EN' : 'عربي'}
            </button>
          </div>
        </header>
        <AuthScreen
          lang={lang}
          mode={authMode === 'register' ? 'register' : 'login'}
          required
          onMode={setAuthMode}
          onClose={() => undefined}
          onLogin={async (email, password) => {
            const result = await signInAccount(email, password);
            if (result.account) finishAuth(result.account);
            return result.error ?? null;
          }}
          onRegister={async (input) => {
            const result = await registerAccount(input);
            if (result.account) finishAuth(result.account);
            return result.error ?? null;
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* 1. Navbar */}
      <Navbar
        lang={lang}
        setLang={setLang}
        account={account}
        onHome={() => {
          setAuthMode(null);
          setPage('home');
        }}
        onOpenAuth={(mode) => requestAuth(mode)}
        onSignOut={() => {
          signOut();
          setAccount(null);
        }}
        onOpenAddModal={() => (account ? setIsAddModalOpen(true) : requestAuth('login', 'add'))}
        totalFlats={flats.filter((flat) => !hidden.has(flat.id)).length}
      />

      {!authMode && (
        <SiteNav
          lang={lang}
          page={page}
          savedCount={savedIds.length}
          requestCount={account ? requests.filter((row) => row.accountId === account.id).length : 0}
          onNavigate={(next) => {
            setPage(next);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {authMode ? (
        <AuthScreen
          lang={lang}
          mode={authMode}
          onMode={setAuthMode}
          onClose={() => setAuthMode(null)}
          onLogin={async (email, password) => {
            const result = await signInAccount(email, password);
            if (result.account) finishAuth(result.account);
            return result.error ?? null;
          }}
          onRegister={async (input) => {
            const result = await registerAccount(input);
            if (result.account) finishAuth(result.account);
            return result.error ?? null;
          }}
        />
      ) : page === 'saved' ? (
        <SavedPage
          lang={lang}
          flats={flats.filter((flat) => savedIds.includes(flat.id) && !hidden.has(flat.id))}
          onOpen={openFlat}
          onRemove={(id) => setSavedIds((prev) => prev.filter((item) => item !== id))}
        />
      ) : page === 'requests' ? (
        <RequestsPage
          lang={lang}
          rows={account ? requests.filter((row) => row.accountId === account.id) : []}
          signedIn={account !== null}
          onOpenFlat={(id) => {
            const found = flats.find((flat) => flat.id === id);
            if (found) openFlat(found);
          }}
          onSignIn={() => requestAuth('login')}
        />
      ) : page === 'beaches' ? (
        <BeachesPage
          lang={lang}
          onPick={(area) => {
            handleFilterChange({ area });
            setPage('home');
          }}
        />
      ) : page === 'policy' ? (
        <PolicyPage lang={lang} />
      ) : page === 'services' ? (
        <ServicesPage lang={lang} />
      ) : page === 'mine' ? (
        <MinePage
          lang={lang}
          signedIn={account !== null}
          flats={account ? flats.filter((flat) => flat.ownerId === account.id) : []}
          onOpen={openFlat}
          onDelete={(id) => setFlats((prev) => prev.filter((flat) => flat.id !== id))}
          onSignIn={() => requestAuth('login')}
          onAdd={() => (account ? setIsAddModalOpen(true) : requestAuth('login', 'add'))}
        />
      ) : (
      <>
      {/* 2. Hero Banner */}
      <HeroBanner
        lang={lang}
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={scrollToCatalog}
      />

      {/* 3. Main Catalog Container */}
      <main id="flats-catalog" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-sky-700/80">
              {isAr ? 'دليل الإقامة' : 'Stay guide'}
            </p>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {isAr ? 'شقق وشاليهات مطروح' : 'Matrouh flats & chalets'}
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-100/80 border border-amber-200 px-3 py-1.5 rounded-full">
            <Compass className="w-3.5 h-3.5" />
            {isAr ? 'مباشرة من المالك' : 'Direct from the owner'}
          </span>
        </div>

        {/* Filter Bar */}
        <FilterBar
          lang={lang}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          matchingCount={filteredFlats.length}
        />

        {hidden.size > 0 && (
          <p className="mb-4 text-xs font-bold text-rose-800 bg-rose-50 border border-rose-200 rounded-2xl px-4 py-3">
            {isAr
              ? `أُخفيت ${hidden.size} شقة بعد تكرار شكاوى عدم المطابقة على هذا الجهاز.`
              : `${hidden.size} listing${hidden.size === 1 ? '' : 's'} hidden on this device after repeated mismatch reports.`}
          </p>
        )}

        {/* Catalog Grid */}
        {filteredFlats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFlats.map((flat, i) => (
              <div
                key={flat.id}
                className="animate-rise flex flex-col"
                style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
              >
                <FlatCard
                  flat={flat}
                  term={filters.rentalTerm}
                  lang={lang}
                  signedIn={account !== null}
                  saved={savedIds.includes(flat.id)}
                  onToggleSave={() =>
                    setSavedIds((prev) => (prev.includes(flat.id) ? prev.filter((id) => id !== flat.id) : [flat.id, ...prev]))
                  }
                  onRequestSignIn={() => requestAuth('login')}
                  onSelect={openFlat}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative overflow-hidden bg-white/90 rounded-[2rem] p-12 text-center border border-white shadow-[0_20px_50px_-24px_rgba(12,74,110,0.45)] max-w-lg mx-auto space-y-4">
            <div className="absolute -top-16 -end-10 w-40 h-40 rounded-full bg-cyan-200/50 blur-2xl" />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-600 to-cyan-400 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/30">
              <SearchX className="w-8 h-8" />
            </div>
            <h3 className="relative text-lg font-black text-slate-800">
              {isAr ? 'لا توجد شقق بهذه الشروط' : 'No flats match these filters'}
            </h3>
            <p className="relative text-sm text-slate-500 leading-relaxed">
              {isAr
                ? 'هذه المنطقة ما زالت بلا إعلان مطابق. وسّع البحث، أو أضف شقتك من هنا.'
                : 'This area has no matching listing yet. Widen the search, or add your flat.'}
            </p>
            <button
              onClick={handleResetFilters}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-700 to-cyan-600 hover:from-sky-800 hover:to-cyan-700 text-white font-bold text-xs shadow-md shadow-sky-700/25 transition-all hover:scale-105"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{isAr ? 'إعادة ضبط كل الفلاتر' : 'Reset all filters'}</span>
            </button>
          </div>
        )}

      </main>
      </>
      )}

      {/* 4. Details Modal */}
      <FlatModal
        flat={authMode ? null : selectedFlat}
        lang={lang}
        signedIn={account !== null}
        saved={selectedFlat ? savedIds.includes(selectedFlat.id) : false}
        onToggleSave={() => {
          if (!selectedFlat) return;
          setSavedIds((prev) =>
            prev.includes(selectedFlat.id) ? prev.filter((id) => id !== selectedFlat.id) : [selectedFlat.id, ...prev],
          );
        }}
        openRequest={
          account && selectedFlat
            ? requests.find((row) => row.accountId === account.id && row.flatId === selectedFlat.id && row.status === 'open') ??
              requests.find((row) => row.accountId === account.id && row.flatId === selectedFlat.id) ??
              null
            : null
        }
        reviews={selectedFlat ? reviews.filter((row) => row.flatId === selectedFlat.id) : []}
        onRecord={(draft) => (selectedFlat ? recordStay(selectedFlat, draft) : { code: '' })}
        onReject={() => {
          if (!selectedFlat) return [];
          setRequestStatus(selectedFlat.id, 'rejected');
          return suggestAlternatives(
            flats.filter((flat) => !hidden.has(flat.id)),
            selectedFlat,
          );
        }}
        onKeep={() => {
          if (selectedFlat) setRequestStatus(selectedFlat.id, 'kept');
        }}
        onAddReview={(rating, text) => {
          if (!account || !selectedFlat) return 'signin';
          const cleaned = text.trim();
          if (cleaned.length < 8) return 'short';
          const row: GuestReview = {
            id: `rev-${Date.now()}`,
            flatId: selectedFlat.id,
            accountId: account.id,
            name: account.name,
            rating,
            text: cleaned,
            createdAt: new Date().toISOString(),
          };
          setReviews((prev) => [row, ...prev.filter((item) => !(item.flatId === row.flatId && item.accountId === row.accountId))]);
          return null;
        }}
        onReport={(reason: ReportReason) => {
          if (!account || !selectedFlat) return 'signed_out';
          if (reports.some((row) => row.flatId === selectedFlat.id && row.accountId === account.id)) return 'duplicate';
          setReports((prev) => [
            ...prev,
            {
              id: `rep-${Date.now()}`,
              flatId: selectedFlat.id,
              accountId: account.id,
              reason,
              createdAt: new Date().toISOString(),
            },
          ]);
          return 'ok';
        }}
        onShare={async () => {
          if (!selectedFlat) return false;
          const url = `${window.location.origin}${window.location.pathname}${window.location.search}#flat=${encodeURIComponent(selectedFlat.id)}`;
          await navigator.clipboard.writeText(url);
          return true;
        }}
        onPickAlternative={openFlat}
        onRequestSignIn={() => {
          closeFlat();
          requestAuth('login');
        }}
        onClose={closeFlat}
      />

      {/* 5. Add Flat Modal */}
      <AddFlatModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        lang={lang}
        onAddFlat={handleAddFlat}
      />

      {/* 6. Footer */}
      <Footer
        lang={lang}
        onBeach={(area) => {
          setAuthMode(null);
          handleFilterChange({ area });
          setPage('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onPage={(next) => {
          setAuthMode(null);
          setPage(next);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
};

export default App;
