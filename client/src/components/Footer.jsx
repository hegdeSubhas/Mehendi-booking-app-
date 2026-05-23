import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, MessageCircle, Heart } from 'lucide-react'

// Simple Instagram SVG icon
const InstagramIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--brown)', color: 'rgba(255,255,255,0.85)' }}>
      {/* Decorative top border */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, var(--gold-dark), var(--gold), var(--gold-dark))' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ background: 'rgba(201,168,76,0.2)' }}>
                🌿
              </div>
              <div>
                <div className="font-bold text-lg text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Sumii Art World</div>
                <div className="text-xs" style={{ color: 'var(--gold)' }}>Premium Mehendi Art</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Crafting timeless henna art for your most cherished moments. Bridal, Arabic, Traditional & more.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.2)' }}
              >
                <InstagramIcon size={18} style={{ color: 'var(--gold)' }} />
              </a>
              <a href="https://wa.me/+917338498524" target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.2)' }}
              >
                <MessageCircle size={18} style={{ color: 'var(--gold)' }} />
              </a>
              <a href="tel:+917338498524"
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: 'rgba(201,168,76,0.2)' }}
              >
                <Phone size={18} style={{ color: 'var(--gold)' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>Quick Links</h4>
            <ul className="space-y-3">
              {[
                { to: '/', label: 'Home' },
                { to: '/designs', label: 'Designs' },
                { to: '/book', label: 'Book Now' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm transition-colors hover:text-amber-300" style={{ color: 'rgba(255,255,255,0.65)' }}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>Our Services</h4>
            <ul className="space-y-3">
              {['Bridal Mehendi', 'Arabic Designs', 'Festival Mehendi', 'Engagement Ceremonies', 'Traditional Patterns', 'Minimal Modern', 'Group Bookings'].map(s => (
                <li key={s} className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5" style={{ fontFamily: 'Playfair Display, serif' }}>Get In Touch</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--gold)' }} />
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.65)' }}>Sirsi karnataka</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0" style={{ color: 'var(--gold)' }} />
                <a href="tel:+917338498524" className="text-sm hover:text-amber-300 transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>+91 7338498524</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0" style={{ color: 'var(--gold)' }} />
                <a href="mailto:sumashreedhar074@gmail.com" className="text-sm hover:text-amber-300 transition-colors" style={{ color: 'rgba(255,255,255,0.65)' }}>sumashreedhar074@gmail.com</a>
              </li>
            </ul>
            <a
              href="https://wa.me/+917338498524?text=Hi! I'd like to book a mehendi session."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 hover:scale-105"
              style={{ background: '#25D366', color: 'white' }}
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            © {year} Sumii Art World. All rights reserved.
          </p>
          <p className="text-sm flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> for beautiful celebrations
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
