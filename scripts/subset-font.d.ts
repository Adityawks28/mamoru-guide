// subset-font ships no types, and the fontverter types are not a module.
declare module 'subset-font' {
  interface SubsetFontOptions {
    targetFormat?: 'sfnt' | 'truetype' | 'woff' | 'woff2';
    preserveNameIds?: number[];
    keepFeatures?: string[];
    noLayoutClosure?: boolean;
    noHinting?: boolean;
    dropTables?: string[];
  }
  export default function subsetFont(font: Buffer, text: string, options?: SubsetFontOptions): Promise<Buffer>;
}

declare module 'fontverter' {
  export function convert(font: Buffer, toFormat: 'sfnt' | 'truetype' | 'woff' | 'woff2', fromFormat?: 'sfnt' | 'truetype' | 'woff' | 'woff2'): Promise<Buffer>;
}
