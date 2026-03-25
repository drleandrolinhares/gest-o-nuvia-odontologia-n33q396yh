export const NuviaLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 350 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M95 65 C95 85, 75 95, 55 90 C30 80, 25 50, 45 35 C65 20, 95 30, 105 50 C115 70, 95 90, 80 90"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <path
      d="M45 45 C35 55, 35 75, 55 80"
      stroke="currentColor"
      strokeWidth="6"
      strokeLinecap="round"
    />
    <text
      x="130"
      y="45"
      fontFamily="sans-serif"
      fontSize="38"
      fontWeight="300"
      letterSpacing="0.05em"
      fill="currentColor"
    >
      N U V I Λ
    </text>
    <text x="130" y="75" fontFamily="serif" fontSize="24" fill="currentColor">
      Odontologia
    </text>
    <text
      x="130"
      y="95"
      fontFamily="sans-serif"
      fontSize="10"
      letterSpacing="0.1em"
      fill="currentColor"
    >
      BY SOUZA FILHO
    </text>
  </svg>
)
