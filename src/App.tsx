import { useState, useMemo } from 'react'
import './App.css'

interface LessonMeta {
  title: string
  description: string
  icon: string
  parts: number
  order?: number
  category: string
}

const PALETTE = ['#2563eb', '#7c3aed', '#0891b2', '#16a34a', '#dc2626', '#d97706']

const metaModules = import.meta.glob<{ default: LessonMeta }>(
  '../subjects/*/meta.json',
  { eager: true }
)

const allLessons = Object.entries(metaModules)
  .map(([path, mod]) => {
    const id = path.match(/\.\.\/subjects\/(.+)\/meta\.json/)?.[1] ?? ''
    return { id, ...mod.default, url: `/subjects/${id}/` }
  })
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('ທັງໝົດ')

  const categories = useMemo(() => {
    const unique = [...new Set(allLessons.map((l) => l.category))]
    return ['ທັງໝົດ', ...unique]
  }, [])

  const lessons = useMemo(() => {
    return allLessons.filter((l) => {
      const matchCat = activeCategory === 'ທັງໝົດ' || l.category === activeCategory
      const q = query.toLowerCase()
      const matchQuery =
        !q ||
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [query, activeCategory])

  return (
    <>
      <header className="home-header">
        <div className="home-header-inner">
          <div className="home-hero-text">
            <div className="home-badge">🎓 ຫ້ອງຮຽນ IT</div>
            <h1>ຮຽນຮູ້ດ້ານ IT<br />ໄດ້ທຸກທີ່ ທຸກເວລາ</h1>
            <p>ສື່ການສອນແບບໂຕ້ຕອບ ພາສາລາວ — ຮຽນໄດ້ດ້ວຍຕົນເອງ</p>
          </div>
          <div className="home-stat">
            <span className="home-stat-num">{allLessons.length}</span>
            <span className="home-stat-label">ບົດຮຽນ</span>
          </div>
        </div>
        <div className="home-wave">
          <svg viewBox="0 0 1200 56" preserveAspectRatio="none">
            <path d="M0,28 C300,56 900,0 1200,28 L1200,56 L0,56 Z" fill="#f3f4f6" />
          </svg>
        </div>
      </header>

      <main className="home-main">
        {/* Search + Filter */}
        <div className="search-filter-wrap">
          <div className="search-box">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
            </svg>
            <input
              type="search"
              className="search-input"
              placeholder="ຄົ້ນຫາບົດຮຽນ..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="search-clear" onClick={() => setQuery('')}>✕</button>
            )}
          </div>

          <div className="category-list">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-btn${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Section heading */}
        <div className="lessons-section-title">
          <h2>{activeCategory === 'ທັງໝົດ' ? 'ບົດຮຽນທັງໝົດ' : activeCategory}</h2>
          <span className="lessons-count">{lessons.length} ບົດ</span>
        </div>

        {/* Grid */}
        {lessons.length > 0 ? (
          <div className="lessons-grid">
            {lessons.map((lesson, i) => {
              const color = PALETTE[i % PALETTE.length]
              return (
                <a key={lesson.id} href={lesson.url} className="lesson-card">
                  <div
                    className="lesson-card-banner"
                    style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}
                  >
                    <span className="lesson-card-emoji">{lesson.icon}</span>
                  </div>
                  <div className="lesson-card-body">
                    <span className="lesson-category-tag">{lesson.category}</span>
                    <h3 className="lesson-card-title">{lesson.title}</h3>
                    <p className="lesson-card-desc">{lesson.description}</p>
                    <div className="lesson-card-footer">
                      <span
                        className="lesson-parts-badge"
                        style={{ color, borderColor: `${color}44`, background: `${color}11` }}
                      >
                        {lesson.parts} ພາກ
                      </span>
                      <span className="lesson-start-btn" style={{ background: color }}>
                        ເລີ່ມຮຽນ →
                      </span>
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <div className="no-results">
            <span>🔍</span>
            <p>ບໍ່ພົບບົດຮຽນ "<strong>{query}</strong>"</p>
            <button onClick={() => { setQuery(''); setActiveCategory('ທັງໝົດ') }}>
              ລ້າງການຄົ້ນຫາ
            </button>
          </div>
        )}
      </main>

      <footer className="home-footer">
        <p>ສ້າງດ້ວຍ ❤️ ສຳລັບນັກຮຽນລາວ</p>
      </footer>
    </>
  )
}

export default App
