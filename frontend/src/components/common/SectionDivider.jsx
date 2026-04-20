function SectionDivider({ flip = false }) {
  return (
    <div className={`page-divider ${flip ? 'rotate-180' : ''}`}>
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
        <path
          fill="#f4f2ee"
          d="M0,32L80,42.7C160,53,320,75,480,74.7C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
        />
      </svg>
    </div>
  )
}

export default SectionDivider
