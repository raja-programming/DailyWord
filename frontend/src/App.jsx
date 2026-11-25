
import { useEffect, useState } from 'react'
import './App.css'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:8080/api/readings/external'

const WIDGET_SCRIPT_ID = 'dailyword-catholic-gallery-tamil'

const archives = [
  {
    year: '2026',
    title: '2026 தமிழ் திருப்பலி நாட்காட்டி',
    description: 'ஜனவரி முதல் டிசம்பர் வரை மாத வாரியான வாசகங்கள்',
    url: 'https://bible.catholicgallery.org/tamil-mass-reading/tr-2026/'
  },
  {
    year: '2027',
    title: '2027 தமிழ் திருப்பலி நாட்காட்டி',
    description: '2027 ஆண்டிற்கான மாத வாரியான திருப்பலி வாசகங்கள்',
    url: 'https://bible.catholicgallery.org/tamil-mass-reading/tr-2027/'
  }
]

function getLocalDate() {
  const now = new Date()

  return [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0')
  ].join('-')
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [widgetLoading, setWidgetLoading] = useState(true)
  const [widgetError, setWidgetError] = useState(false)

  // CALENDAR DATE SELECTION
  const [selectedDate, setSelectedDate] = useState(getLocalDate())
  const [externalReading, setExternalReading] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState(false)

  const closeMenu = () => setMenuOpen(false)

  // DATE BASED BACKEND API
  useEffect(() => {
    const controller = new AbortController()

    async function fetchReadings() {
      setApiLoading(true)
      setApiError(false)
      setExternalReading(null)

      try {
        const response = await fetch(
          `${API_BASE_URL}/${selectedDate}`,
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error('Reading not available')
        }

        const data = await response.json()
        setExternalReading(data)

      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('DailyWord API Error:', error)
          setApiError(true)
        }
      } finally {
        if (!controller.signal.aborted) {
          setApiLoading(false)
        }
      }
    }

    fetchReadings()

    return () => controller.abort()
  }, [selectedDate])

  // CATHOLIC GALLERY TAMIL WIDGET
  useEffect(() => {
    let script = document.getElementById(WIDGET_SCRIPT_ID)

    const handleLoad = () => {
      setWidgetLoading(false)
      setWidgetError(false)
      script.dataset.loaded = 'true'
    }

    const handleError = () => {
      setWidgetLoading(false)
      setWidgetError(true)
    }

    if (script?.dataset.loaded === 'true') {
      setWidgetLoading(false)
      return
    }

    if (!script) {
      script = document.createElement('script')
      script.id = WIDGET_SCRIPT_ID
      script.src =
        'https://cdn1.catholicgallery.org/wp-content/uploads/widgets/rich-card/cg_mrc_widget_tam.js'
      script.async = true
    }

    script.addEventListener('load', handleLoad)
    script.addEventListener('error', handleError)

    if (!script.isConnected) {
      document.body.appendChild(script)
    }

    return () => {
      script.removeEventListener('load', handleLoad)
      script.removeEventListener('error', handleError)
    }
  }, [])

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="site-header">

        <a
          className="brand"
          href="#home"
          aria-label="DailyWord home"
          onClick={closeMenu}
        >
          <span className="brand-mark">✝</span>

          <span className="brand-copy">
            <strong>DailyWord</strong>
            <small>GOD'S WORD EVERY DAY</small>
          </span>
        </a>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          className="mobile-menu-toggle"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="dailyword-navigation"
          onClick={() => setMenuOpen(previous => !previous)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* NAVIGATION */}
        <nav
          id="dailyword-navigation"
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#readings" onClick={closeMenu}>Today's Readings</a>
          <a href="#archive" onClick={closeMenu}>Archive</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#developer" onClick={closeMenu}>Developer</a>
        </nav>

        <a
          className="header-cta"
          href="#readings"
          onClick={closeMenu}
          aria-label="Read today's readings"
        >
          Read today <span>↗</span>
        </a>

      </header>

      <main id="home">

        {/* HERO */}
        <section className="hero-section">

          <div className="hero-copy">

            <div className="eyebrow">
              <span />
              DAILY CATHOLIC READINGS
            </div>

            <h1>
              உமது வார்த்தை
              <br />
              <em>என் பாதைக்கு</em>
              <br />
              விளக்கு.
            </h1>

            <p className="hero-lead">
              இறைவார்த்தையின் வழியில் ஒவ்வொரு நாளையும் தொடங்குங்கள்.
              இன்று இறைவன் உங்களுக்காக வைத்திருக்கும் செய்தியை வாசியுங்கள்.
            </p>

            <a className="gold-button" href="#readings">
              இன்றைய வாசகங்களை வாசிக்க <span>→</span>
            </a>

            <div className="scripture-quote">

              <span className="quote-mark">“</span>

              <div>
                <p>
                  உமது வார்த்தை என் கால்களுக்குத் தீபமும்,
                  என் பாதைக்கு ஒளியும் ஆகும்.
                </p>

                <small>திருப்பாடல்கள் 119:105</small>
              </div>

            </div>

          </div>

          <div className="hero-visual" aria-hidden="true">

            <div className="visual-orbit orbit-one" />
            <div className="visual-orbit orbit-two" />
            <div className="halo" />

            <div className="hero-cross">✝</div>

            <div className="bible-book">
              <div className="book-spine" />

              <div className="book-content">
                <span className="book-small">THE HOLY</span>
                <strong>BIBLE</strong>
                <span className="book-cross">✝</span>
                <span className="book-bottom">THE WORD OF GOD</span>
              </div>
            </div>

            <span className="spark spark-a">✦</span>
            <span className="spark spark-b">✧</span>
            <span className="spark spark-c">✦</span>

          </div>

          <div className="hero-bottom-line">
            <span>FAITH</span>
            <i />
            <span>HOPE</span>
            <i />
            <span>LOVE</span>
          </div>

        </section>

        {/* DATE PANEL */}
        <section className="date-panel">

          <div className="date-intro">
            <span className="section-kicker">
              YOUR DAILY MOMENT WITH GOD
            </span>

            <h2>திருப்பலி வாசகங்கள்</h2>

            <p>
              தினமும் புதுப்பிக்கப்படும் தமிழ் திருப்பலி வாசகங்கள்.
            </p>
          </div>

          <div className="date-control">

            <label htmlFor="reading-date">
              📅 SELECT READING DATE
            </label>

            <strong>திருப்பலி வாசகங்கள் தேர்வு</strong>

            <input
              id="reading-date"
              type="date"
              value={selectedDate}
              max={getLocalDate()}
              onChange={(event) => setSelectedDate(event.target.value)}
            />

            <button
              type="button"
              onClick={() => setSelectedDate(getLocalDate())}
            >
              இன்று வாசகங்கள்
            </button>

            <p>விரும்பிய தேதியைத் தேர்வு செய்து வாசக விவரங்களைப் பாருங்கள்.</p>

          </div>

        </section>

        {/* READINGS */}
        <section className="readings-section" id="readings">

          <div className="section-heading">
            <span className="section-kicker">
              THE WORD OF GOD
            </span>

            <h2>இன்றைய இறைவார்த்தைகள்</h2>

            <p>
              வாசிப்போம் · தியானிப்போம் · வாழ்வில் கடைப்பிடிப்போம்
            </p>
          </div>

          {/* SELECTED DATE API READINGS */}
          <div className="selected-reading-panel">

            <span className="section-kicker">
              SELECTED DATE READINGS
            </span>

            <h3>{selectedDate}</h3>

            {apiLoading && (
              <p>வாசக விவரங்கள் ஏற்றப்படுகின்றன...</p>
            )}

            {apiError && (
              <p>
                இந்தத் தேதிக்கான வாசக விவரங்களைப் பெற முடியவில்லை.
                Backend இயங்குகிறதா என்று சரிபார்க்கவும்.
              </p>
            )}

            {externalReading && (
              <>
                <p>
                  திருவழிபாட்டு காலம்: {externalReading.season || 'தகவல் இல்லை'}
                </p>

                <div className="api-reading-list">

                  <p>
                    <strong>முதல் வாசகம்:</strong>{' '}
                    {externalReading.readings?.firstReading || 'தகவல் இல்லை'}
                  </p>

                  <p>
                    <strong>பதிலுரைப் பாடல்:</strong>{' '}
                    {externalReading.readings?.psalm || 'தகவல் இல்லை'}
                  </p>

                  {externalReading.readings?.secondReading && (
                    <p>
                      <strong>இரண்டாம் வாசகம்:</strong>{' '}
                      {externalReading.readings.secondReading}
                    </p>
                  )}

                  <p>
                    <strong>நற்செய்தி:</strong>{' '}
                    {externalReading.readings?.gospel || 'தகவல் இல்லை'}
                  </p>

                </div>

                {externalReading.usccbLink && (
                  <a
                    href={externalReading.usccbLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Full Reading ↗
                  </a>
                )}
              </>
            )}

          </div>

          {widgetLoading && !widgetError && (
            <div className="feedback-panel">
              <span className="spinner" />
              <p>திருப்பலி வாசகங்கள் ஏற்றப்படுகின்றன...</p>
            </div>
          )}

          {widgetError && (
            <div className="feedback-panel error-panel">

              <span className="feedback-icon">!</span>

              <p>
                வாசகங்களை ஏற்ற முடியவில்லை.
                இணைய இணைப்பைச் சரிபார்க்கவும்.
              </p>

              <a
                href="https://www.catholicgallery.org/tamil-mass-readings-today/"
                target="_blank"
                rel="noreferrer"
              >
                Catholic Gallery-ல் வாசிக்க ↗
              </a>

            </div>
          )}

          <div className="cg-widget-frame">
            <div className="cg_mrc_widget_tam"></div>
          </div>

        </section>

        {/* ARCHIVE */}
        <section className="archive-section" id="archive">

          <div className="archive-heading">
            <span className="section-kicker">
              READING ARCHIVE
            </span>

            <h2>முந்தைய நாட்களின் வாசகங்கள்</h2>

            <p>
              ஆண்டைத் தேர்வு செய்து மாத வாரியான வாசகங்களைப் பாருங்கள்.
            </p>
          </div>

          <div className="archive-grid">

            {archives.map(item => (
              <a
                key={item.year}
                className="archive-card"
                href={item.url}
                target="_blank"
                rel="noreferrer"
              >
                <span className="archive-label">
                  YEAR ARCHIVE
                </span>

                <h3>{item.title}</h3>

                <p>{item.description}</p>

                <strong>
                  View Calendar ↗
                </strong>
              </a>
            ))}

          </div>

          <p className="archive-note">
            Calendar archive provided by Catholic Gallery.
          </p>

        </section>

        {/* ABOUT */}
        <section className="closing-section" id="about">

          <div className="closing-cross">✝</div>

          <span className="section-kicker">
            WALK IN HIS LIGHT
          </span>

          <h2>இறைவார்த்தை நம் வாழ்வின் ஒளி.</h2>

          <p>
            ஒவ்வொரு நாளும் நம்பிக்கையோடு தொடங்கட்டும்.
          </p>

          <div className="closing-motto">
            வாசிப்போம் <i /> தியானிப்போம் <i /> வாழ்வோம்
          </div>

        </section>

        {/* DEVELOPER */}
        <section className="developer-section" id="developer">

          <div className="developer-heading">
            <span className="section-kicker">
              MEET THE DEVELOPER
            </span>

            <h2>About the Developer</h2>

            <p>
              DailyWord இணையதளத்தை உருவாக்கிய Developer.
            </p>
          </div>

          <div className="developer-card">

            <div className="developer-avatar">
              RM
              <span>✦</span>
            </div>

            <div className="developer-info">

              <span className="developer-role-label">
                JAVA FULL STACK DEVELOPER
              </span>

              <h3>RAJA MANICKAM R</h3>

              <p className="developer-designation">
                Java Full Stack Developer
                <span>•</span>
                Java Developer
                <span>•</span>
                Software Developer
              </p>

              <div className="developer-location">
                <span>⌖</span>
                Chennai, Tamil Nadu
              </div>

              <div className="developer-links">

                <a className="contact-link" href="tel:+918524863327">
                  <span>☎</span>
                  +91 8524863327
                </a>

                <a
                  className="contact-link"
                  href="mailto:rajamanickam4607@gmail.com"
                >
                  <span>✉</span>
                  rajamanickam4607@gmail.com
                </a>

              </div>

              <div className="developer-social-icons">

                <a
                  className="social-icon"
                  href="https://linkedin.com/in/rajamanickamofficial"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/>
                  </svg>
                </a>

                <a
                  className="social-icon"
                  href="https://github.com/raja-programmin"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.68-1.28-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
                  </svg>
                </a>

              </div>

            </div>

          </div>

        </section>

      </main>

      {/* FOOTER */}
      <footer className="site-footer">

        <a className="footer-brand" href="#home">
          <span>✝</span> DailyWord
        </a>

        <p>
          © {new Date().getFullYear()} DailyWord. All rights reserved.
        </p>

        <small>
          Made with faith and love <span>♥</span>
        </small>

      </footer>

    </div>
  )
}

export default App
