'use client'
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function RefTracker() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const ref = searchParams.get('ref'); // ID do divulgador
    const src = searchParams.get('src'); // Rede Social (fb, ig, wa)

    if (ref) {
      // Salva por 7 dias para garantir a conversão posterior
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      
      document.cookie = `chave_ref=${ref}; expires=${expires.toUTCString()}; path=/`;
      if (src) {
        document.cookie = `chave_src=${src}; expires=${expires.toUTCString()}; path=/`;
      }
    }
  }, [searchParams]);

  return null;
}