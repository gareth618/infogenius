export const GRAMMAR = {
  'function inline-code': {
    pattern: /(^|[\s([{`/*_~^])`((?!`).)+`($|(?=[\s)\]}`.?!,;:/*_~^-]))/m,
    lookbehind: true
  },
  'function inline-kbrd': {
    pattern: /(^|[\s([{/*_~^]);((?![`$;]).)+;($|(?=[\s)\]}.?!,;:/*_~^-]))/m,
    lookbehind: true
  },
  'function inline-emoj': {
    pattern: /(^|[\s([{/*_~^]):(yey|lol|hehe|haha|wink|love|cool|smirk|tongue|sad|cry|wow|smile|tractor|think|party|golden|silver|bronze|farmer|1\/5|2\/5|3\/5|4\/5|5\/5):($|(?=[/\s)\]}.?!,;:/*_~^-]))/m,
    lookbehind: true
  },
  'function inline-math': {
    pattern: /(^|[\s([{/*_~^])\$((?![`$;]).)+\$($|(?=[\s)\]}.?!,;:/*_~^-]))/m,
    lookbehind: true
  },
  'function math': {
    pattern: /^ *\$\$.+\$\$$/ms
  },
  'regex link-beg': {
    pattern: /(^|[^\w\]])\??\[(?=\S)/,
    lookbehind: true
  },
  'regex link-end': {
    pattern: /\]\(((?![[\]])\S)*\)(TODO)?/
  },
  'string span-bold': {
    pattern: /(^|[^*])\*\*(?=$|[^*])/,
    lookbehind: true
  },
  'string span-ital': {
    pattern: /(^|[^_])__(?=$|[^_])/,
    lookbehind: true
  },
  'string span-strk': {
    pattern: /(^|[^~])~~(?=$|[^~])/,
    lookbehind: true
  },
  'string span-high': {
    pattern: /(^|[^^])\^\^(?=$|[^^])/,
    lookbehind: true
  },
  'keyword hr': {
    pattern: /^ *===$/m
  },
  'keyword header': {
    pattern: /^ *#{2,6} /m
  },
  'number helper': {
    pattern: /^ *([lLcCrR] ([1-9]\d* ([1-9]\d* )?)?)?> /m
  },
  'number block': {
    pattern: /^ *(>>>( center| right| header)?|<<<)$/m
  },
  'number list': {
    pattern: /^ *((\+\+\+)( [1aAiI].| \*\*[1aAiI].\*\*| none)?|~~~|---)$/m
  },
  'number table': {
    pattern: /^ *(\?\?\?|!!!)$/m
  },
  'number code': {
    pattern: /^ *(```|\^\^\^)( (html|css|javascript|json|c|cpp|java|python|bash|text|latex|markdown)( -> ((?![=>])\S(((?![=>]).)*(?![=>])\S)?))?( => (\S(.*\S)?))?)?$/m
  }
};
