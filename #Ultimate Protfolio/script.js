// Terminal typing effect
document.addEventListener("DOMContentLoaded", () => {
  const typingText = document.getElementById("typing-text")
  const responseText = document.getElementById("response-text")
  const commands = ["whoami", "cat profile.txt", "ls -la projects/", "sudo access --grant-all"]
  const responses = [
    "rogue@cybersecurity:~$",
    "Penetration Tester | Bug Hunter | Exploit Developer | Python Prorgammer | Top 1% in TryHackme | CTF Player",
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

      // Reset for next command
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
          // All commands completed, show final message
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
  setTimeout(typeText, 1000)

  // Matrix effect
  const canvas = document.getElementById("matrix-canvas")
  const ctx = canvas.getContext("2d")

  // Make canvas full size of container
  function resizeCanvas() {
    const container = document.querySelector(".matrix-container")
    if (container) {
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
    }
  }

  window.addEventListener("resize", resizeCanvas)
  resizeCanvas()

  // Matrix rain effect
  const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン"
  const fontSize = 14
  const columns = canvas.width / fontSize
  const drops = []

  for (let i = 0; i < columns; i++) {
    drops[i] = Math.floor((Math.random() * canvas.height) / fontSize)
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.fillStyle = "#0f0"
    ctx.font = fontSize + "px monospace"

    for (let i = 0; i < drops.length; i++) {
      const text = chars.charAt(Math.floor(Math.random() * chars.length))
      ctx.fillText(text, i * fontSize, drops[i] * fontSize)

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }

      drops[i]++
    }
  }

  setInterval(drawMatrix, 50)

  // Mobile menu toggle
  const menuToggle = document.querySelector(".menu-toggle")
  const navLinks = document.querySelector(".nav-links")

  menuToggle.addEventListener("click", function () {
    this.classList.toggle("active")
    navLinks.classList.toggle("active")
  })

  // Close mobile menu when clicking a link
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.classList.remove("active")
      navLinks.classList.remove("active")
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
  const hackOverlay = document.querySelector(".hack-overlay")
  const hackText = document.querySelector(".hack-text")
  const hackProgressBar = document.querySelector(".hack-progress-bar")

  function showHackingAnimation() {
    hackOverlay.style.display = "flex"
    hackText.textContent = "Decrypting portfolio data..."
    hackProgressBar.style.transition = "width 1s linear"
    hackProgressBar.style.width = "0"
    setTimeout(() => {
      hackProgressBar.style.transition = "width 2s linear"
      hackProgressBar.style.width = "100%"
    }, 10)

    setTimeout(() => {
      hackOverlay.style.opacity = "0"
      setTimeout(() => {
        hackOverlay.style.display = "none"
      }, 500)
    }, 3000)
  }

  // Show hacking animation on page load
  setTimeout(showHackingAnimation, 0)

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

  // Form submission
  const contactForm = document.getElementById("contact-form")

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault()

      // Simulate form submission
      const submitBtn = this.querySelector(".submit-btn")
      const originalText = submitBtn.innerHTML

      submitBtn.innerHTML = '<span class="btn-text">SENDING...</span>'
      submitBtn.disabled = true

      setTimeout(() => {
        submitBtn.innerHTML =
          '<span class="btn-text">MESSAGE SENT</span><span class="btn-icon"><i class="fas fa-check"></i></span>'

        // Reset form
        setTimeout(() => {
          contactForm.reset()
          submitBtn.innerHTML = originalText
          submitBtn.disabled = false
        }, 3000)
      }, 2000)
    })
  }

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -100px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view")
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
  const terminalCursor = document.querySelector(".terminal-cursor")
  setInterval(() => {
    terminalCursor.style.opacity = terminalCursor.style.opacity === "0" ? "1" : "0"
  }, 500)

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
    if (Math.random() > 0.95) {
      terminalCursor.style.left = e.clientX + "px"
      terminalCursor.style.top = e.clientY + "px"
      terminalCursor.style.opacity = "1"

      setTimeout(() => {
        terminalCursor.style.opacity = "0"
      }, 500)
    }
  })

  // Add glitch effect to sections on scroll
  window.addEventListener("scroll", () => {
    if (Math.random() > 0.95) {
      const sections = document.querySelectorAll("section")
      const randomSection = sections[Math.floor(Math.random() * sections.length)]

      randomSection.classList.add("glitch-effect")
      setTimeout(() => {
        randomSection.classList.remove("glitch-effect")
      }, 200)
    }
  })

  // Set skill bar widths after they're in view
  document.querySelectorAll(".skill-bar").forEach((bar) => {
    const progress = bar.querySelector(".progress")
    const width = progress.style.width
    progress.style.width = "0"

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            progress.style.width = width
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.5 },
    )

    observer.observe(bar)
  })
})
