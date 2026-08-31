/**
 * The mark: a cockade.
 *
 * The tricolour cockade is a civic emblem, worn since 1789 and free for anyone to use.
 * That matters here, because everything else this surface borrows from officialdom — the
 * paper, the tricolour rule, the stamps — stops short of the State's actual identity.
 * Marianne, the "République Française" block and the Marianne typeface belong to public
 * services, and a private demonstration wearing them would be claiming an authority it
 * does not have.
 */
export function Cockade({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="15" cy="15" r="14.25" fill="#17265e" />
      <circle cx="15" cy="15" r="9.75" fill="#ffffff" />
      <circle cx="15" cy="15" r="5.25" fill="#b8202e" />
      {/* A hairline keeps the white ring legible on a white masthead. */}
      <circle cx="15" cy="15" r="14.25" fill="none" stroke="#0d1839" strokeOpacity="0.18" />
    </svg>
  )
}

export function Wordmark({ subtitle }: { subtitle: string }) {
  return (
    <>
      <Cockade />
      <span>
        <span className="brand-name">Le Bon Article</span>
        <span className="brand-sub">{subtitle}</span>
      </span>
    </>
  )
}
