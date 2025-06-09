// Enhanced Audio Context for comprehensive sound effects
class EnhancedAudioManager {
  constructor() {
    this.audioContext = null
    this.isMuted = false
    this.isInitialized = false
    this.masterGain = null
    this.soundEffects = new Map()
  }

  async initAudio() {
    try {
      // Create audio context on user interaction
      if (!this.audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      }
      // Resume context if suspended (browser auto-play policy)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume()
      }

      // Create master gain node
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.masterGain.gain.setValueAtTime(0.3, this.audioContext.currentTime)

      this.isInitialized = true
      console.log("Enhanced Audio initialized successfully")

      // Initialize sound effects
      this.initializeSoundEffects()

      return true
    } catch (error) {
      console.log("Audio initialization failed:", error)
      return false
    }
  }

  initializeSoundEffects() {
    // Pre-create sound effect configurations
    this.soundEffects.set("click", {
      frequency: 800,
      type: "square",
      duration: 0.1,
      volume: 0.1,
    })

    this.soundEffects.set("hover", {
      frequency: 1200,
      type: "sine",
      duration: 0.05,
      volume: 0.05,
    })

    this.soundEffects.set("typing", {
      frequency: () => 2000 + Math.random() * 500,
      type: "square",
      duration: 0.02,
      volume: 0.03,
    })

    this.soundEffects.set("scan", {
      frequency: 440,
      type: "sawtooth",
      duration: 0.3,
      volume: 0.02,
    })

    this.soundEffects.set("glitch", {
      frequency: () => 100 + Math.random() * 1000,
      type: "square",
      duration: 0.1,
      volume: 0.04,
    })

    this.soundEffects.set("notification", {
      frequency: 880,
      type: "sine",
      duration: 0.2,
      volume: 0.06,
    })
  }

  async playSound(soundType, customConfig = {}) {
    if (!this.audioContext || this.isMuted) return

    // Always try to resume context before playing
    if (this.audioContext.state === "suspended") {
      try { await this.audioContext.resume() } catch (e) {}
    }

    const config = { ...this.soundEffects.get(soundType), ...customConfig }
    if (!config) return

    try {
      const oscillator = this.audioContext.createOscillator()
      const gainNode = this.audioContext.createGain()
      const filter = this.audioContext.createBiquadFilter()

      oscillator.connect(filter)
      filter.connect(gainNode)
      gainNode.connect(this.masterGain)

      const frequency = typeof config.frequency === "function" ? config.frequency() : config.frequency
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      oscillator.type = config.type

      filter.type = "lowpass"
      filter.frequency.setValueAtTime(frequency * 2, this.audioContext.currentTime)

      gainNode.gain.setValueAtTime(config.volume, this.audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + config.duration)

      oscillator.start(this.audioContext.currentTime)
      oscillator.stop(this.audioContext.currentTime + config.duration)
    } catch (error) {
      console.log(`${soundType} sound failed:`, error)
    }
  }

  playClickSound() {
    this.playSound("click")
  }

  playHoverSound() {
    this.playSound("hover")
  }

  playTypingSound() {
    this.playSound("typing")
  }

  playScanSound() {
    this.playSound("scan")
  }

  playGlitchSound() {
    this.playSound("glitch")
  }

  playNotificationSound() {
    this.playSound("notification")
  }

  toggleMute() {
    this.isMuted = !this.isMuted

    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.audioContext.currentTime)
    }

    console.log("Audio", this.isMuted ? "muted" : "unmuted")
    return this.isMuted
  }

  // Add visual feedback for audio
  showAudioFeedback(type) {
    const feedback = document.createElement("div")
    feedback.className = "audio-feedback"
    feedback.textContent = type.toUpperCase()
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 255, 0, 0.9);
      color: black;
      padding: 10px 20px;
      border-radius: 5px;
      font-family: monospace;
      font-weight: bold;
      z-index: 10000;
      pointer-events: none;
      animation: audioFeedback 1s ease;
    `

    document.body.appendChild(feedback)
    setTimeout(() => feedback.remove(), 1000)
  }
}

// Replace the old audioManager with enhanced version
const audioManager = new EnhancedAudioManager()

// Add CSS for audio feedback animation
const audioFeedbackStyle = document.createElement("style")
audioFeedbackStyle.textContent = `
  @keyframes audioFeedback {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
  }
`
document.head.appendChild(audioFeedbackStyle)

// Enhanced scanning effects
function initializeScanningEffects() {
  // Random scan sound effects
  setInterval(() => {
    if (Math.random() > 0.95) {
      audioManager.playScanSound()
    }
  }, 2000)

  // Random glitch effects with sound
  setInterval(() => {
    if (Math.random() > 0.98) {
      const glitchElements = document.querySelectorAll(".glitch-enhanced, .glitch")
      if (glitchElements.length > 0) {
        const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)]
        randomElement.style.animation = "none"
        void randomElement.offsetWidth // Trigger reflow
        randomElement.style.animation = "glitch-anim 0.3s ease-in-out"
        audioManager.playGlitchSound()

        setTimeout(() => {
          randomElement.style.animation = ""
        }, 300)
      }
    }
  }, 3000)

  // Notification sound for section changes
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target.tagName === "SECTION") {
          audioManager.playNotificationSound()
        }
      })
    },
    { threshold: 0.5 },
  )

  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section)
  })
}

// Terminal typing effect
document.addEventListener("DOMContentLoaded", () => {
  const typingText = document.getElementById("typing-text")
  const responseText = document.getElementById("response-text")
  // const terminalCursor = document.getElementById("terminal-cursor")

  const commands = ["whoami", "cat profile.txt", "ls -la projects/", "sudo access --grant-all"]
  const responses = [
    "rogue@cybersecurity:~$",
    "Penetration Tester | Bug Hunter | Exploit Developer | Python Programmer | Top 1% in TryHackMe | CTF Player",
    "Defense-Sphere.py  Xylem-Network.py  C2C-Malware.py  Password-Manager.py  Ransomware.py",
    "Access granted. Welcome to my portfolio.",
  ]

  let commandIndex = 0
  let charIndex = 0
  let responseIndex = 0
  let isTyping = true
  let isResponse = false

  function typeText() {
    if (isTyping && commandIndex < commands.length) {
      if (charIndex < commands[commandIndex].length) {
        typingText.textContent += commands[commandIndex].charAt(charIndex)
        audioManager.playTypingSound()
        charIndex++
        setTimeout(typeText, Math.random() * 100 + 50)
      } else {
        isTyping = false
        isResponse = true
        setTimeout(showResponse, 500)
      }
    }
  }

  function showResponse() {
    if (isResponse) {
      responseText.textContent = responses[responseIndex]
      responseIndex++

      setTimeout(() => {
        typingText.textContent = ""
        responseText.textContent = ""
        charIndex = 0
        commandIndex++
        isTyping = true
        isResponse = false

        if (commandIndex < commands.length) {
          setTimeout(typeText, 500)
        } else {
          setTimeout(() => {
            document.querySelector(".terminal-body").innerHTML += `
                            <div class="line">
                                <span class="prompt">$</span>
                                <span class="command">echo "Explore my portfolio below"</span>
                            </div>
                            <div class="line response">Explore my portfolio below</div>
                        `
          }, 500)
        }
      }, 1500)
    }
  }

  // Start the typing animation
  setTimeout(typeText, 2000)

  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle")
  const navLinks = document.getElementById("navLinks")

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active")
    navLinks.classList.toggle("active")
    audioManager.playClickSound()
  })

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active")
      navLinks.classList.remove("active")
      audioManager.playClickSound()
    })
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 70,
          behavior: "smooth",
        })
      }
    })
  })

  // Hacking animation on page load
  const hackOverlay = document.getElementById("hackOverlay")
  const hackText = document.getElementById("hackText")
  const hackProgressBar = document.getElementById("hackProgressBar")
  const hackPercentage = document.getElementById("hackPercentage")

  const loadingTexts = [
    "Initializing...",
    "Decrypting portfolio data...",
    "Bypassing security protocols...",
    "Access granted. Loading interface...",
  ]

  function showHackingAnimation() {
    let progress = 0
    let textIndex = 0

    const progressInterval = setInterval(() => {
      progress += Math.random() * 15

      if (progress >= 25 && textIndex === 0) {
        hackText.textContent = loadingTexts[1]
        textIndex = 1
      } else if (progress >= 50 && textIndex === 1) {
        hackText.textContent = loadingTexts[2]
        textIndex = 2
      } else if (progress >= 75 && textIndex === 2) {
        hackText.textContent = loadingTexts[3]
        textIndex = 3
      }

      progress = Math.min(progress, 100)
      hackProgressBar.style.width = progress + "%"
      hackPercentage.textContent = Math.floor(progress) + "% COMPLETE"

      if (progress >= 100) {
        clearInterval(progressInterval)
        setTimeout(async () => {
          hackOverlay.classList.add("hidden")
          // Ensure audio is initialized
          if (!audioManager.isInitialized) {
            await audioManager.initAudio()
          }
        }, 500)
      }
    }, 100)
  }

  // Show hacking animation on page load
  setTimeout(showHackingAnimation, 500)

  // Audio controls
  const audioToggle = document.getElementById("audioToggle")
  const audioIcon = document.getElementById("audioIcon")
  const audioStatus = document.getElementById("audioStatus")

  audioToggle.addEventListener("click", async () => {
    // Initialize audio on first click
    if (!audioManager.isInitialized) {
      const success = await audioManager.initAudio()
      if (!success) {
        alert("Audio initialization failed. Please check your browser settings.")
        return
      }
    }

    const isMuted = audioManager.toggleMute()
    audioIcon.className = isMuted ? "fas fa-volume-mute" : "fas fa-volume-up"
    audioStatus.textContent = isMuted ? "OFF" : "ON"
    audioToggle.classList.toggle("muted", isMuted)

    // Play click sound to test
    if (!isMuted) {
      setTimeout(() => audioManager.playClickSound(), 100)
    }
  })

  // Initialize scanning effects
  initializeScanningEffects()

  // Enhanced audio initialization
  const initAudioOnInteraction = async () => {
    if (!audioManager.isInitialized) {
      const success = await audioManager.initAudio()
      if (success) {
        audioManager.showAudioFeedback("AUDIO READY")
      }
    }
  }

  // Multiple ways to initialize audio
  document.addEventListener("click", initAudioOnInteraction, { once: true })
  document.addEventListener("keydown", initAudioOnInteraction, { once: true })
  document.addEventListener("touchstart", initAudioOnInteraction, { once: true })
  document.addEventListener("mousemove", initAudioOnInteraction, { once: true })

  // Add click and hover sound effects
  document.querySelectorAll(".clickable").forEach((element) => {
    element.addEventListener("click", async () => {
      await audioManager.playClickSound()
    })
    element.addEventListener("mouseenter", async () => {
      await audioManager.playHoverSound()
    })
  })

  // Glitch effect on hover for project cards
  const projectCards = document.querySelectorAll(".project-card")

  projectCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.classList.add("glitch-effect")
      setTimeout(() => {
        this.classList.remove("glitch-effect")
      }, 1000)
    })
  })

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view")

        // Animate skill bars
        if (entry.target.classList.contains("skill-bar")) {
          const progress = entry.target.querySelector(".progress")
          const skillLevel = entry.target.getAttribute("data-skill")
          setTimeout(() => {
            progress.style.width = skillLevel + "%"
          }, 200)
        }

        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe all sections for scroll animations
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section)
  })

  // Observe project cards for staggered animations
  document.querySelectorAll(".project-card").forEach((card, index) => {
    card.style.transitionDelay = `${index * 0.1}s`
    observer.observe(card)
  })

  // Observe skill bars for animation
  document.querySelectorAll(".skill-bar").forEach((bar, index) => {
    bar.style.transitionDelay = `${index * 0.1}s`
    observer.observe(bar)
  })

  // Observe hexagons for animation
  document.querySelectorAll(".skill-hexagon").forEach((hexagon, index) => {
    hexagon.style.transitionDelay = `${index * 0.1}s`
    observer.observe(hexagon)
  })

  // Terminal cursor blinking
  // const terminalCursorElement = document.querySelector(".terminal-cursor")
  // setInterval(() => {
  //   if (terminalCursorElement) {
  //     terminalCursorElement.style.opacity = terminalCursorElement.style.opacity === "0" ? "1" : "0"
  //   }
  // }, 500)

  // Random glitch effect on elements with .glitch class
  function randomGlitch() {
    const glitchElements = document.querySelectorAll(".glitch")
    if (glitchElements.length > 0) {
      const randomElement = glitchElements[Math.floor(Math.random() * glitchElements.length)]
      randomElement.classList.add("active")
      setTimeout(() => {
        randomElement.classList.remove("active")
      }, 200)
    }

    setTimeout(randomGlitch, Math.random() * 5000 + 2000)
  }

  randomGlitch()

  // Mouse follow effect for terminal cursor
  document.addEventListener("mousemove", (e) => {
    if (Math.random() > 0.98) {
      terminalCursorElement.style.left = e.clientX + "px"
      terminalCursorElement.style.top = e.clientY + "px"
      terminalCursorElement.style.opacity = "1"

      setTimeout(() => {
        terminalCursorElement.style.opacity = "0"
      }, 500)
    }
  })

  // Add glitch effect to sections on scroll
  window.addEventListener("scroll", () => {
    // Update header background on scroll
    const header = document.getElementById("header")
    if (window.scrollY > 10) {
      header.classList.add("scrolled")
    } else {
      header.classList.remove("scrolled")
    }

    // Random glitch effect on scroll
    if (Math.random() > 0.95) {
      const sections = document.querySelectorAll("section")
      const randomSection = sections[Math.floor(Math.random() * sections.length)]

      randomSection.classList.add("glitch-effect")
      setTimeout(() => {
        randomSection.classList.remove("glitch-effect")
      }, 200)
    }
  })

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Ctrl + M to toggle audio
    if (e.ctrlKey && e.key === "m") {
      e.preventDefault()
      audioToggle.click()
    }

    // Escape to close mobile menu
    if (e.key === "Escape") {
      menuToggle.classList.remove("active")
      navLinks.classList.remove("active")
    }
  })

  // Add typing sound to terminal cursor
  setInterval(() => {
    if (terminalCursor && terminalCursor.style.opacity === "1") {
      if (Math.random() > 0.7) {
        audioManager.playTypingSound()
      }
    }
  }, 200)

  console.log(`
    ██████╗  ██████╗  ██████╗ ██╗   ██╗███████╗
    ██╔══██╗██╔═══██╗██╔════╝ ██║   ██║██╔════╝
    ██████╔╝██║   ██║██║  ███╗██║   ██║█████╗  
    ██╔══██╗██║   ██║██║   ██║██║   ██║██╔══╝  
    ██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝███████╗
    ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝ ╚══════╝
    
    Welcome to R0GU3's Cybersecurity Portfolio
    System Status: ONLINE
    Security Level: MAXIMUM
    `)

  // Debug: Log scan line visibility
  setTimeout(() => {
    const scanLine = document.querySelector('.scan-line')
    if (scanLine) {
      const rect = scanLine.getBoundingClientRect()
      console.log('Scan line position:', rect)
    }
  }, 2000)
})
