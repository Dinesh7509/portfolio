import React, { Component } from 'react'
import { roles, stats, skills, jobs, projects, education } from './data'

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

/* Fades/slides its children in when scrolled into view */
class Reveal extends Component {
  state = { seen: false }
  ref = React.createRef()

  componentDidMount() {
    if (reduced()) return this.setState({ seen: true })
    this.io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { this.setState({ seen: true }); this.io.disconnect() }
    }, { threshold: 0.15 })
    this.io.observe(this.ref.current)
  }

  componentWillUnmount() {
    if (this.io) this.io.disconnect()
  }

  render() {
    const { as: Tag = 'div', delay = 0, className = '', children, ...rest } = this.props
    return (
      <Tag ref={this.ref} className={`rv ${this.state.seen ? 'in' : ''} ${className}`}
           style={{ '--d': `${delay}s` }} {...rest}>
        {children}
      </Tag>
    )
  }
}

const K = ({ children }) => <span className="k">{children}</span>
const S = ({ children }) => <span className="s">{children}</span>
const N = ({ children }) => <span className="n">{children}</span>

const profileLines = [
  <>{'{'}</>,
  <>{'  '}<K>"name"</K>: <S>"Dinesh Kumar"</S>,</>,
  <>{'  '}<K>"role"</K>: <S>"Software Developer"</S>,</>,
  <>{'  '}<K>"location"</K>: <S>"Indore, MP"</S>,</>,
  <>{'  '}<K>"experience_years"</K>: <N>4</N>,</>,
  <>{'  '}<K>"backend"</K>: [<S>"Laravel"</S>, <S>"Django"</S>, <S>"NestJS"</S>],</>,
  <>{'  '}<K>"frontend"</K>: [<S>"React.js"</S>],</>,
  <>{'  '}<K>"cloud"</K>: [<S>"AWS Lambda"</S>, <S>"S3"</S>],</>,
  <>{'  '}<K>"open_to_work"</K>: <N>true</N></>,
  <>{'}'}</>,
]

class Terminal extends Component {
  state = { shown: reduced() ? profileLines.length : 0 }

  componentDidMount() { this.tick() }
  componentWillUnmount() { clearTimeout(this.timer) }

  tick = () => {
    if (this.state.shown >= profileLines.length) return
    this.timer = setTimeout(() => {
      this.setState(s => ({ shown: s.shown + 1 }), this.tick)
    }, 260)
  }

  render() {
    return (
      <div className="term" aria-label="Profile shown as an API response">
        <div className="bar">
          <i /><i /><i />&nbsp; GET /developer/dinesh-kumar &nbsp;<span style={{ color: 'var(--ok)' }}>200 OK</span>
        </div>
        <pre>
          {profileLines.slice(0, this.state.shown).map((line, i) => <div key={i}>{line}</div>)}
          <span className="cur" />
        </pre>
      </div>
    )
  }
}

/* Counts 0 -> n */
class Stat extends Component {
  state = { v: 0 }

  componentDidMount() {
    const { n } = this.props
    if (reduced()) return this.setState({ v: n })
    this.id = setInterval(() => {
      if (this.state.v >= n) return clearInterval(this.id)
      this.setState(s => ({ v: s.v + 1 }))
    }, 260)
  }

  componentWillUnmount() { clearInterval(this.id) }

  render() {
    return <div><b>{this.state.v}</b><span>{this.props.label}</span></div>
  }
}

/* Types and deletes each role in turn */
class RoleText extends Component {
  state = { text: '' }
  r = 0
  c = 0
  del = false

  componentDidMount() {
    if (reduced()) return this.setState({ text: roles[0] })
    this.tick()
  }

  componentWillUnmount() { clearTimeout(this.timer) }

  tick = () => {
    const w = roles[this.r]
    this.c += this.del ? -1 : 1
    this.setState({ text: w.slice(0, this.c) })
    let ms = this.del ? 35 : 75
    if (!this.del && this.c === w.length) { this.del = true; ms = 1400 }
    else if (this.del && this.c === 0) { this.del = false; this.r = (this.r + 1) % roles.length; ms = 300 }
    this.timer = setTimeout(this.tick, ms)
  }

  render() {
    return <div className="role">&gt; {this.state.text}<span className="cur" /></div>
  }
}

function Hero() {
  return (
    <header className="hero">
      <div>
        <p className="hi">Hi, I’m</p>
        <h1>Dinesh Kumar</h1>
        <RoleText />
        <p className="lead">
          Full-stack developer with 4 years of experience building APIs, authentication systems and
          AI-powered cloud pipelines. Based in Indore, Madhya Pradesh.
        </p>
        <a className="btn main" href="#projects">See my projects</a>
        <a className="btn" href="#contact">Get in touch</a>
        <div className="stats">{stats.map(s => <Stat key={s.label} {...s} />)}</div>
      </div>
      <Terminal />
    </header>
  )
}

function Skills() {
  return (
    <section id="skills">
      <Reveal as="h2">Skills</Reveal>
      <div className="skills">
        {skills.map((g, i) => (
          <Reveal key={g.title} delay={(i % 3) * 0.12}>
            <h3>{g.title}</h3>
            <div className="tags">
              {g.items.map((t, j) => <span key={t} style={{ '--d': `${0.25 + j * 0.07}s` }}>{t}</span>)}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Experience() {
  return (
    <section id="experience">
      <Reveal as="h2">Experience</Reveal>
      <div className="tl">
        {jobs.map((j, i) => (
          <Reveal key={j.meta} className="job" delay={i * 0.15}>
            <h3>{j.title}</h3>
            <p>{j.meta}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Projects() {
  return (
    <section id="projects">
      <Reveal as="h2">Projects</Reveal>
      {projects.map((p, i) => (
        <Reveal as="details" key={p.name} open={i === 0} delay={i * 0.08}>
          <summary><strong>{p.name}</strong><small>{p.stack}</small></summary>
          <ul>{p.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
        </Reveal>
      ))}
    </section>
  )
}

function Education() {
  return (
    <section id="education">
      <Reveal as="h2">Education</Reveal>
      <div className="edu">
        {education.map((e, i) => (
          <Reveal key={e.title} delay={i * 0.12}>
            <strong>{e.title}</strong><br /><small>{e.meta}</small>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <Reveal as="section" id="contact" className="contact">
      <h2>Let’s work together</h2>
      <p>Open to new roles and projects. Cricket and travel keep me going outside of code.</p>
      <a className="btn main" href="mailto:dkg8085@gmail.com">dkg8085@gmail.com</a>
      <a className="btn" href="tel:+917509903735">+91 75099 03735</a>
    </Reveal>
  )
}

export default class App extends Component {
  prog = React.createRef()
  glow = React.createRef()

  onScroll = () => {
    const h = document.documentElement
    this.prog.current.style.width = `${(h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100}%`
  }

  onMove = e => {
    this.glow.current.style.left = `${e.clientX}px`
    this.glow.current.style.top = `${e.clientY}px`
  }

  componentDidMount() {
    addEventListener('scroll', this.onScroll, { passive: true })
    if (!reduced()) addEventListener('mousemove', this.onMove)
  }

  componentWillUnmount() {
    removeEventListener('scroll', this.onScroll)
    removeEventListener('mousemove', this.onMove)
  }

  render() {
    return (
      <>
        <div id="prog" ref={this.prog} />
        <div id="glow" ref={this.glow} />
        <nav>
          <div className="wrap">
            <b className="logo">DV</b>
            <ul>
              {['skills', 'experience', 'projects', 'education', 'contact'].map(id => (
                <li key={id}>
                  <a href={`#${id}`} className={id === 'contact' ? 'nav-cta' : ''}>
                    {id[0].toUpperCase() + id.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        <main className="wrap">
          <Hero />
          <Skills />
          <Experience />
          <Projects />
          <Education />
          <Contact />
        </main>
        <footer>© {new Date().getFullYear()} Dinesh Kumar</footer>
      </>
    )
  }
}
