let hof = [
    'theory',
    'mod',
    'module',
    'pkg',
    'package',
    'str',
    'string',
    'nat',
    'natural',
    'literal',
    'string',
    'str',
    'lit',
    'rat',
    'rational',
    'dec',
    'decimal',
    'graph',
    'set',
    'list',
    'seq',
    'sequence',
    'record',
    'category',
    'number',
    'num',
    'event',
    'option',
    'none',
    'some',
    'ok',
    'error',
    'result',
    'enum',
    'never',
    'unit',
    'unimplemented',
    'eq',
    'gt',
    'gte',
    'lt',
    'lte',
    'noteq'
];

function caseInsensitive(keyword) {
    return '_*' + keyword
        .split('')
        .map(letter => `[${letter}${letter.toUpperCase()}]` + '_*')
        .join('')

}

hof.map(caseInsensitive).join('|');
