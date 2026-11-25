import Image from 'next/image';

/** Логотип студии: золотой апертурный цветок на графите */
export default function LogoMark({ className = 'h-11 w-11', rounded = 'rounded-xl' }: { className?: string; rounded?: string }) {
  return (
    <Image
      src="/images/logo-mark.png"
      alt="Ольга Курденкова — логотип"
      width={96}
      height={96}
      priority
      className={`${className} ${rounded} object-cover shadow-card`}
    />
  );
}
