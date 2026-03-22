import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const COLORS = ["#FF2D55","#FF6B00","#FFE500","#00FF94","#00D4FF","#BF5FFF"]
const AVATARS = ["🐻","🍺","🎧","🚇","🧱","🥨","🌧","🎨","🔥","⚡","🏚","🎸","🦅","💿","🌀"]
const ADJ = ["Lost","Loud","Broke","Sleepy","Wired","Grumpy","Stoked","Chill","Wild","Late"]
const NOUN = ["Bear","Tourist","Raver","Dealer","Artist","Ghost","Pigeon","Local","Expat","Blob"]

function generateName() {
  return `${ADJ[Math.floor(Math.random()*ADJ.length)]} ${NOUN[Math.floor(Math.random()*NOUN.length)]}`
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000)
  if (diff < 60) return "just now"
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
  return `${Math.floor(diff/86400)}d ago`
}

export default function BerlinBoard() {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [focused, setFocused] = useState(false)
  const [nickname] = useState(generateName)
  const [avatar] = useState(() => AVATARS[Math.floor(Math.random()*AVATARS.length)])
  const [accentColor] = useState(() => COLORS[Math.floor(Math.random()*COLORS.length)])
  const maxChars = 300

  useEffect(() => { loadMessages() }, [])

  async function loadMessages() {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .order('time', { ascending: false })
    if (!error && data) setMessages(data)
    setLoading(false)
  }

  async function post() {
    if (!text.trim() || posting) return
    setPosting(true)
    const msg = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2,7)}`,
      text: text.trim(),
      nickname,
      avatar,
      color: accentColor,
      time: new Date().toISOString(),
    }
    setMessages(p => [msg, ...p])
    setText("")
    await supabase.from('posts').insert([msg])
    setPosting(false)
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0c0c0c",
      fontFamily: "DM Sans, sans-serif",
      maxWidth: 620,
      margin: "0 auto",
      padding: "0 24px 80px",
    }}>

      {/* HEADER */}
      <header style={{ paddingTop: 64, paddingBottom: 48 }}>
        <div style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 11,
          color: "#aaaaaa",
          letterSpacing: 3,
          textTransform: "uppercase",
          marginBottom: 32,
        }}>
          Berlin / Daily Board
        </div>

        <h1 style={{
          fontFamily: "DM Sans, sans-serif",
          fontWeight: 300,
          fontSize: "clamp(28px, 6vw, 42px)",
          color: "#ffffff",
          lineHeight: 1.25,
          letterSpacing: "-0.5px",
        }}>
          Describe your best<br />day in Berlin.
        </h1>

        <p style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 13,
          color: "#aaaaaa",
          marginTop: 14,
        }}>
          What made it unforgettable? · {messages.length} {messages.length === 1 ? "story" : "stories"}
        </p>

        <div style={{ borderTop: "1px solid #2a2a2a", marginTop: 32 }} />
      </header>

      {/* COMPOSE */}
      <div style={{ marginBottom: 56 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 18 }}>{avatar}</span>
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 12,
            color: accentColor,
            letterSpacing: 1,
          }}>{nickname.toUpperCase()}</span>
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#888888" }}>· anon</span>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, maxChars))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) post() }}
          placeholder="It started somewhere in Mitte..."
          rows={5}
          style={{
            width: "100%",
            background: "transparent",
            border: "none",
            borderTop: `1px solid ${focused ? accentColor : "#2a2a2a"}`,
            borderBottom: `1px solid ${focused ? accentColor : "#2a2a2a"}`,
            outline: "none",
            resize: "none",
            fontFamily: "DM Mono, monospace",
            fontSize: 14,
            lineHeight: 1.8,
            color: "#ffffff",
            padding: "18px 0",
            transition: "border-color 0.2s",
            display: "block",
          }}
        />

        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: 14,
        }}>
          <span style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
            color: text.length > maxChars * 0.85 ? "#FF2D55" : "#888888",
          }}>
            {text.length}/{maxChars}
          </span>
          <button
            onClick={post}
            disabled={!text.trim() || posting}
            style={{
              background: "transparent",
              border: `1px solid ${text.trim() ? accentColor : "#2a2a2a"}`,
              color: text.trim() ? accentColor : "#666666",
              padding: "8px 22px",
              fontFamily: "DM Mono, monospace",
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: text.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            {posting ? "..." : "Post"}
          </button>
        </div>
      </div>

      {/* FEED */}
      {loading ? (
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: "#aaaaaa", letterSpacing: 2 }}>
          LOADING...
        </div>
      ) : messages.length === 0 ? (
        <div style={{ fontFamily: "DM Mono, monospace", fontSize: 12, color: "#aaaaaa" }}>
          No stories yet. Be the first.
        </div>
      ) : (
        <div>
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className="msg"
              style={{
                borderTop: "1px solid #2a2a2a",
                padding: "28px 0",
                animationDelay: `${Math.min(i * 0.05, 0.4)}s`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <span style={{ fontSize: 15 }}>{msg.avatar}</span>
                <span style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 11,
                  color: msg.color,
                  letterSpacing: 1,
                }}>{msg.nickname.toUpperCase()}</span>
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 11, color: "#888888" }}>
                  · {timeAgo(msg.time)}
                </span>
              </div>
              <p style={{
                fontFamily: "DM Sans, sans-serif",
                fontWeight: 300,
                fontSize: 16,
                lineHeight: 1.7,
                color: "#ffffff",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}>{msg.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
