
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

// ===============================
// DAILY BIBLE VERSES
// ===============================

const dailyVerses = [
  {
    text: 'அஞ்சாதே, நான் உன்னோடு இருக்கிறேன்; கலங்காதே, நான் உன் கடவுள்.',
    reference: 'எசாயா 41:10',
    explanation: 'நாம் பயப்படும்போதும் இறைவன் நம்முடன் இருந்து நம்மைத் தாங்குகிறார்.',
    lesson: 'எந்தச் சூழ்நிலையிலும் நம்பிக்கையை இழக்காமல் இறைவனை நம்புவோம்.'
  },
  {
    text: 'ஆண்டவர் என் ஆயர்; எனக்கேதும் குறையில்லை.',
    reference: 'திருப்பாடல்கள் 23:1',
    explanation: 'ஒரு நல்ல ஆயர் தன் ஆடுகளைப் பாதுகாப்பதுபோல் இறைவன் நம்மைப் பாதுகாக்கிறார்.',
    lesson: 'நம் தேவைகளை இறைவனிடம் ஒப்படைத்து நம்பிக்கையுடன் வாழ்வோம்.'
  },
  {
    text: 'உமது வார்த்தை என் கால்களுக்குத் தீபமும், என் பாதைக்கு ஒளியும் ஆகும்.',
    reference: 'திருப்பாடல்கள் 119:105',
    explanation: 'இறைவார்த்தை நம் வாழ்க்கைப் பாதையில் சரியான வழியைக் காட்டுகிறது.',
    lesson: 'ஒவ்வொரு நாளும் இறைவார்த்தையை வாசித்து அதன்படி நடப்போம்.'
  },
  {
    text: 'அமைதியை உங்களுக்கு விட்டுச் செல்கிறேன்; என் அமைதியையே உங்களுக்கு அளிக்கிறேன்.',
    reference: 'யோவான் 14:27',
    explanation: 'உலகம் தர முடியாத உண்மையான அமைதியை இயேசு நமக்குத் தருகிறார்.',
    lesson: 'கவலைகளுக்கு நடுவிலும் இறை அமைதியைத் தேடுவோம்.'
  },
  {
    text: 'எனக்கு வலுவூட்டுகிறவரின் துணைகொண்டு அனைத்தையும் செய்ய எனக்கு ஆற்றல் உண்டு.',
    reference: 'பிலிப்பியர் 4:13',
    explanation: 'இறைவனின் துணை நம்முடைய பலவீனங்களைக் கடக்க உதவுகிறது.',
    lesson: 'சவால்களை எதிர்கொள்ளும்போது இறைவனின் வல்லமையை நம்புவோம்.'
  },
  {
    text: 'கடவுளால் எல்லாம் இயலும்.',
    reference: 'மத்தேயு 19:26',
    explanation: 'மனிதனால் முடியாததாகத் தோன்றினாலும் இறைவனால் எல்லாம் இயலும்.',
    lesson: 'நம்பிக்கையுடன் முயற்சி செய்து இறைவனிடம் வேண்டுவோம்.'
  },
  {
    text: 'கடவுளிடம் அன்புகூர்வோருக்கு எல்லாம் நன்மைக்கே பயன்படும்.',
    reference: 'உரோமையர் 8:28',
    explanation: 'நம் வாழ்க்கையின் ஒவ்வொரு சூழ்நிலையிலும் இறைவன் நன்மைக்காகச் செயல்படுகிறார்.',
    lesson: 'நல்லதும் கடினமானதுமான காலங்களில் இறைவனை நம்புவோம்.'
  }
]

function getDailyVerse() {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 0)

  const dayNumber = Math.floor(
    (today - startOfYear) / (1000 * 60 * 60 * 24)
  )

  return dailyVerses[dayNumber % dailyVerses.length]
}


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

  const [selectedDate, setSelectedDate] = useState(getLocalDate())
  const [externalReading, setExternalReading] = useState(null)
  const [apiLoading, setApiLoading] = useState(false)
  const [apiError, setApiError] = useState(false)




  const dailyVerse = getDailyVerse()

  const shareDailyVerse = async () => {
    const shareText = `இன்றைய இறைவசனம்

"${dailyVerse.text}"
${dailyVerse.reference}

விளக்கம்: ${dailyVerse.explanation}

இன்றைய வாழ்க்கைப் பாடம்: ${dailyVerse.lesson}

DailyWord`

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'இன்றைய இறைவசனம் - DailyWord',
          text: shareText
        })
      } else {
        await navigator.clipboard.writeText(shareText)
        window.alert('இறைவசனம் Copy செய்யப்பட்டது!')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        window.alert('Share செய்ய முடியவில்லை.')
      }
    }
  }

  const closeMenu = () => setMenuOpen(false)

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

  const formattedDate = new Date(
    `${selectedDate}T00:00:00`
  ).toLocaleDateString('ta-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="app-shell">

      {/* HEADER */}
      <header className="site-header">
        <a
          className="brand"
          href="#home"
          onClick={closeMenu}
          aria-label="DailyWord Home"
        >
          <span className="brand-mark">✝</span>

          <span className="brand-copy">
            <strong>DailyWord</strong>
            <small>GOD'S WORD EVERY DAY</small>
          </span>
        </a>

        <button
          type="button"
          className={`mobile-menu-toggle ${menuOpen ? 'active' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(previous => !previous)}
        >
          <span />
          <span />
          <span />
        </button>

        <nav
          className={`main-nav ${menuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
        >
          <a href="#home" onClick={closeMenu}>Home</a>
          <a href="#daily-verse" onClick={closeMenu}>Daily Verse</a>
          <a href="#readings" onClick={closeMenu}>Readings</a>
          <a href="#archive" onClick={closeMenu}>Archive</a>
          <a href="#about" onClick={closeMenu}>About</a>
          <a href="#developer" onClick={closeMenu}>Developer</a>
        </nav>

        <a className="header-cta" href="#readings" onClick={closeMenu}>
          Read Today's Word <span>↗</span>
        </a>
      </header>

      <main id="home">

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-background-glow" />

          <div className="hero-copy">
            <div className="eyebrow">
              <span />
              YOUR DAILY CATHOLIC COMPANION
            </div>

            <h1>
              உமது வார்த்தை
              <br />
              <em>என் பாதைக்கு</em>
              <br />
              விளக்கு.
            </h1>

            <p className="hero-lead">
              இறைவார்த்தையின் வழியில் ஒவ்வொரு நாளையும்
              நம்பிக்கையோடு தொடங்குங்கள். இன்று இறைவன்
              உங்களுக்காக வைத்திருக்கும் செய்தியை வாசியுங்கள்.
            </p>

            <div className="hero-actions">
              <a className="gold-button" href="#readings">
                இன்றைய வாசகங்கள் <span>→</span>
              </a>

              <a className="text-button" href="#about">
                எங்களைப் பற்றி <span>↗</span>
              </a>
            </div>

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

          <div className="hero-visual" aria-label="Holy Bible illustration">
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

            <div className="visual-caption">
              <span>✦</span>
              WALK IN HIS LIGHT
            </div>
          </div>

          <div className="hero-bottom-line">
            <span>FAITH</span>
            <i />
            <span>HOPE</span>
            <i />
            <span>LOVE</span>
          </div>
        </section>

        {/* INTRO STRIP */}
        <section className="intro-strip">
          <div className="intro-item">
            <span className="intro-icon">✝</span>
            <div>
              <strong>Daily Readings</strong>
              <small>தினசரி திருப்பலி வாசகங்கள்</small>
            </div>
          </div>

          <div className="intro-divider" />

          <div className="intro-item">
            <span className="intro-icon">✧</span>
            <div>
              <strong>Faith & Prayer</strong>
              <small>நம்பிக்கையும் ஜெபமும்</small>
            </div>
          </div>

          <div className="intro-divider" />

          <div className="intro-item">
            <span className="intro-icon">♡</span>
            <div>
              <strong>Grow in Faith</strong>
              <small>இறைவழியில் வளர்வோம்</small>
            </div>
          </div>
        </section>

        {/* DAILY BIBLE VERSE */}
        <section className="daily-verse-section" id="daily-verse">
          <div className="daily-verse-card">

            <div className="daily-verse-top">
              <span className="section-kicker">YOUR DAILY WORD</span>
              <span className="daily-verse-cross">✝</span>
            </div>

            <div className="daily-verse-content">
              <span className="daily-verse-icon">📖</span>

              <h2>இன்றைய இறைவசனம்</h2>

              <p className="daily-verse-text">
                “{dailyVerse.text}”
              </p>

              <span className="daily-verse-reference">
                {dailyVerse.reference}
              </span>

              <div className="daily-verse-divider">✦</div>

              <h3>வசனத்தின் விளக்கம்</h3>
              <p>{dailyVerse.explanation}</p>

              <h3>இன்றைய வாழ்க்கைப் பாடம்</h3>
              <p>{dailyVerse.lesson}</p>

              <button
                type="button"
                className="daily-verse-share"
                onClick={shareDailyVerse}
              >
                ↗ வசனத்தைப் பகிரவும்
              </button>
            </div>

            <span className="daily-verse-decoration">✦</span>
          </div>
        </section>

        {/* DATE SELECTOR */}
        <section className="date-panel" id="readings">
          <div className="date-intro">
            <span className="section-kicker">
              YOUR DAILY MOMENT WITH GOD
            </span>

            <h2>திருப்பலி வாசகங்கள்</h2>

            <p>
              இறைவார்த்தையோடு உங்கள் நாளைத் தொடங்குங்கள்.
              விரும்பிய தேதிக்கான வாசகங்களைத் தேர்வு செய்யுங்கள்.
            </p>
          </div>

<div className="date-control">
  <label htmlFor="reading-date">
    <span>▦</span> SELECT READING DATE
  </label>

  <strong>வாசகங்களுக்கான தேதியைத் தேர்வு செய்யுங்கள்</strong>

  <input
    id="reading-date"
    type="date"
    value={selectedDate}
    max={getLocalDate()}
    onChange={(event) => {
      if (event.target.value) {
        setSelectedDate(event.target.value)
      }
    }}
    onClick={(event) => {
      event.currentTarget.showPicker?.()
    }}
  />

  <button
    type="button"
    onClick={() => setSelectedDate(getLocalDate())}
  >
    <span>✦</span> இன்றைய வாசகங்கள்
  </button>

  <p>தேர்ந்தெடுக்கப்பட்ட தேதி: {formattedDate}</p>
</div>
</section>

        {/* API READINGS */}
        <section className="readings-section">
          <div className="section-heading">
            <span className="section-kicker">THE WORD OF GOD</span>
            <h2>இன்றைய இறைவார்த்தைகள்</h2>
            <p>
              வாசிப்போம் <i>·</i> தியானிப்போம் <i>·</i> வாழ்வில் கடைப்பிடிப்போம்
            </p>
            <div className="heading-decoration">
              <span />
              ✦
              <span />
            </div>
          </div>

          <div className="selected-reading-panel">
            <div className="reading-panel-heading">
              <div>
                <span className="section-kicker">SELECTED DATE READINGS</span>
                <h3>{formattedDate}</h3>
              </div>
              <span className="reading-cross">✝</span>
            </div>

            {apiLoading && (
              <div className="feedback-panel">
                <span className="spinner" />
                <p>வாசக விவரங்கள் ஏற்றப்படுகின்றன...</p>
              </div>
            )}

            {apiError && (
              <div className="feedback-panel error-panel">
                <span className="feedback-icon">!</span>
                <p>
                  இந்தத் தேதிக்கான வாசக விவரங்களைப் பெற முடியவில்லை.
                  சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.
                </p>
              </div>
            )}

            {externalReading && (
              <>
                <div className="season-label">
                  <span>✦</span>
                  {externalReading.season || 'திருவழிபாட்டு வாசகங்கள்'}
                </div>

                <div className="api-reading-list">
                  <article className="api-reading-item">
                    <span className="reading-number">01</span>
                    <div>
                      <small>FIRST READING</small>
                      <h4>முதல் வாசகம்</h4>
                      <p>
                        {externalReading.readings?.firstReading || 'தகவல் இல்லை'}
                      </p>
                    </div>
                  </article>

                  <article className="api-reading-item">
                    <span className="reading-number">02</span>
                    <div>
                      <small>RESPONSORIAL PSALM</small>
                      <h4>பதிலுரைப் பாடல்</h4>
                      <p>
                        {externalReading.readings?.psalm || 'தகவல் இல்லை'}
                      </p>
                    </div>
                  </article>

                  {externalReading.readings?.secondReading && (
                    <article className="api-reading-item">
                      <span className="reading-number">03</span>
                      <div>
                        <small>SECOND READING</small>
                        <h4>இரண்டாம் வாசகம்</h4>
                        <p>{externalReading.readings.secondReading}</p>
                      </div>
                    </article>
                  )}

                  <article className="api-reading-item gospel-reading">
                    <span className="reading-number">04</span>
                    <div>
                      <small>HOLY GOSPEL</small>
                      <h4>நற்செய்தி</h4>
                      <p>
                        {externalReading.readings?.gospel || 'தகவல் இல்லை'}
                      </p>
                    </div>
                  </article>
                </div>

                {externalReading.usccbLink && (
                  <a
                    className="reading-source-link"
                    href={externalReading.usccbLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Full Reading <span>↗</span>
                  </a>
                )}
              </>
            )}
          </div>

          {/* CATHOLIC GALLERY WIDGET */}
          <div className="widget-heading">
            <span className="section-kicker">TODAY'S MASS READINGS</span>
            <h3>தமிழ் திருப்பலி வாசகங்கள்</h3>
            <p>இன்றைய திருப்பலியின் முழுமையான தமிழ் வாசகங்கள்</p>
          </div>

          {widgetLoading && !widgetError && (
            <div className="feedback-panel widget-loading">
              <span className="spinner" />
              <p>திருப்பலி வாசகங்கள் ஏற்றப்படுகின்றன...</p>
            </div>
          )}

          {widgetError && (
            <div className="feedback-panel error-panel">
              <span className="feedback-icon">!</span>
              <p>
                வாசகங்களை ஏற்ற முடியவில்லை. இணைய இணைப்பைச் சரிபார்க்கவும்.
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
            <div className="cg_mrc_widget_tam" />
          </div>
        </section>

        {/* ARCHIVE */}
        <section className="archive-section" id="archive">
          <div className="archive-heading">
            <span className="section-kicker">READING ARCHIVE</span>
            <h2>முந்தைய நாட்களின் வாசகங்கள்</h2>
            <p>
              ஆண்டைத் தேர்வு செய்து மாத வாரியான திருப்பலி வாசகங்களைப் பாருங்கள்.
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
                <div className="archive-card-top">
                  <span className="archive-label">YEAR ARCHIVE</span>
                  <span className="archive-icon">▦</span>
                </div>

                <strong className="archive-year">{item.year}</strong>
                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <span className="archive-link">
                  View Calendar <span>↗</span>
                </span>
              </a>
            ))}
          </div>

          <p className="archive-note">
            Calendar archive provided by Catholic Gallery.
          </p>
        </section>

        {/* ABOUT */}
        <section className="closing-section" id="about">
          <div className="closing-decoration closing-decoration-one">✦</div>
          <div className="closing-decoration closing-decoration-two">✧</div>

          <div className="closing-cross">✝</div>

          <span className="section-kicker">WALK IN HIS LIGHT</span>

          <h2>
            இறைவார்த்தை
            <br />
            நம் வாழ்வின் ஒளி.
          </h2>

          <p>
            ஒவ்வொரு நாளும் நம்பிக்கையோடு தொடங்கட்டும்.
            இறைவனின் அன்பும் அமைதியும் உங்கள் வாழ்வில் நிறைந்திருக்கட்டும்.
          </p>

          <div className="closing-motto">
            வாசிப்போம் <i /> தியானிப்போம் <i /> வாழ்வோம்
          </div>
        </section>

        {/* DEVELOPER */}
        <section className="developer-section" id="developer">
          <div className="developer-heading">
            <span className="section-kicker">THE PERSON BEHIND DAILYWORD</span>
            <h2>About the Developer</h2>
            <p>DailyWord இணையதளத்தை உருவாக்கிய Developer.</p>
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
                  href=""
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                  </svg>
                </a>

                <a
                  className="social-icon"
                  href=""
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.17c-3.2.7-3.87-1.36-3.87-1.36-.53-1.33-1.28-1.68-1.28-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z" />
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
