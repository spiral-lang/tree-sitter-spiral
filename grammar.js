const NEGATIVE_PREC = [
    'TTY',
    'PREFIX_EXPRESSION',
    'PIPE_OPERATOR',
    'EXPRESSION_BLOCK',
    'USE',
    'DECORATOR',
    'SPECIAL_OPERATOR',
    'TRY_EXPRESSION',
    'MODULE',
    'OBJECT_DECLARATION',
    'BRACE_OBJECT',
    'KEY_TTY_VALUE',
];
const POSITIVE_PREC = [
    'BECOMES',
    'ON',
    'MORPH',
    'FUNCTOR_OR',
    'THEN',
    'FUNCTOR_AND',
    'EQ',
    'NEQ',
    'IS',
    'IN',
    'GOL',
    'FUNCTOR_COMPOSITION',
    'BINARY',
    'AMBIGUOUS_BINARY_BLOCK',
    'AMBIGUOUS_BINARY_NOT_BLOCK',
    'AMBIGUOUS_BINARY',
    'HASH_TAG',
    'RANGE',
    'AMBIGUOUS_UNARY_PREFIX',
    'AMBIGUOUS_UNARY_POSTFIX',
    'PREFIX',
    'POSTFIX',
    'INDEX',
    'BUILD',
    'STATEMENT_BLOCK',
    'CALL',
    'TRY_CALL',
    'SIMPLE_PATH',
    'DOT_EXPRESSION',
    'SPX',
    'STRING',
    'FRACTIONAL',
    'EXPORT_SIGN',
    'FUNCTOR_DECLARATION',
    'PRODUCT',
];

PREC = {
    TTY: 0,
    PREFIX_EXPRESSION: 0,
    PIPE_OPERATOR: 0,
    EXPRESSION_BLOCK: 0,
    USE: 0,
    DECORATOR: 0,
    SPECIAL_OPERATOR: 0,
    TRY_EXPRESSION: 0,
    MODULE: 0,
    OBJECT_DECLARATION: 0,
    BRACE_OBJECT: 0,
    STATEMENT_BLOCK: 0,
    KEY_TTY_VALUE: 0,
    ON: 0,
    FUNCTOR_OR: 0,
    FUNCTOR_AND: 0,
    THEN: 0,
    EQ: 0,
    NEQ: 0,
    IS: 0,
    IN: 0,
    GOL: 0,
    BECOMES: 0,
    MORPH: 0,
    FUNCTOR_COMPOSITION: 0,
    BINARY: 0,
    AMBIGUOUS_BINARY_NOT_BLOCK: 0,
    AMBIGUOUS_BINARY: 0,
    EXPRESSION_NOT_ENDING_WITH_BLOCK: 0,
    AMBIGUOUS_UNARY_PREFIX: 0,
    AMBIGUOUS_UNARY_POSTFIX: 0,
    PREFIX: 0,
    POSTFIX: 0,
    RANGE: 0,
    BUILD: 0,
    HASH_TAG: 0,

    FUNCTOR_DECLARATION: 0,
    CALL: 0,
    TRY_CALL: 0,
    SPX: 0,
    DOT_EXPRESSION: 0,
    STRING: 0,
    FRACTIONAL: 0,
    EXPORT_SIGN: 0,
    SIMPLE_PATH: 0,
    INDEX: 0,
    PRODUCT: 0,
    SIGNATURE: 0,
};

NEGATIVE_PREC.reverse();
NEGATIVE_PREC.map((x, index) => {
    PREC[x] = index * -10;
});

POSITIVE_PREC.map((x, index) => {
    PREC[x] = index * 10;
});

PREC.FUNCTOR_DECLARATION = PREC.CALL;

ambiguous_unary_binary_operator_list = [
    '^',
    '%',
    '/',
    '<<',
    '>>',
    '*',
    '+',
    '-',
    '¦',
    '§',
    '\u{00A9}',
    '\u{00AC}',
    '\u{00AE}',
    '\u{00B1}',
    '\u{00B6}',
    '\u{00BF}',
    '\u{00D7}',
    '\u{00F7}',
    /[\u2016-\u2017]/,
    /[\u2020-\u2027]/,
    '\u{203B}',
    /[\u2041-\u2053]/,
    /[\u2055-\u205E]/,
    /[\u2190-\u2217]/,
    /[\u2219-\u23FF]/,
    /[\u2219-\u221D]/,
    /[\u221F-\u23FF]/,
    /[\u2500-\u2775]/,
    /[\u2794-\u2BFF]/,
    /[\u2E00-\u2E7F]/,
    /[\u3001-\u3003]/,
    /[\u3008-\u3030]/,
];

const functor_binary_table = [
    [PREC.FUNCTOR_AND, '&', true],
    [PREC.FUNCTOR_OR, '|', true],
    [PREC.FUNCTOR_AND, 'and', true],
    [PREC.FUNCTOR_OR, 'or', true],
    [PREC.FUNCTOR_COMPOSITION, '∘', true],
];

comparison_operator_table = [
    [PREC.NEQ, '≠', true],
    [PREC.NEQ, '!=', true],
    [PREC.NEQ, '~=', true],
    [PREC.EQ, '==', true],
    [PREC.GOL, '≤', true],
    [PREC.GOL, '<=', true],
    [PREC.GOL, '≥', true],
    [PREC.GOL, '>=', true],
    [PREC.GOL, '<', true],
    [PREC.GOL, '>', true],
];

pipe_operator_table = [
    [PREC.PIPE_OPERATOR, '|>', false]
];
morph_operator_table = [
    [PREC.MORPH, '->', true, 'right'],
    [PREC.MORPH, 'morphs', true, 'right']
];

on_operator_table = [
    [PREC.ON, 'on', true, 'right'],
];

other_binary_operators_table = [
    [PREC.THEN, 'then', false, 'right'],
    [PREC.BECOMES, 'becomes', false, 'right'],
    [PREC.IN, 'in', false],
    [PREC.IN, seq('not', 'in'), false],
    [PREC.IS, 'is', false],
    [PREC.IS, seq('is', 'not'), false],
];

compound_assigment_symbol =
    morph_operator_table
        .map(([_, operator]) => operator)
        .concat(
            functor_binary_table
                .map(([_, operator]) => operator)
        )
        .concat(ambiguous_unary_binary_operator_list)
        .map(
            (x) => {
                if (x instanceof RegExp) {
                    return new RegExp(`${x.toString().replace(/\//g, '')}=`);
                } else {
                    return `${x.toString()}=`;

                }

            }
        );


const make_operator = ($) => (operator, has_preprocessor) => {
    if (has_preprocessor) {
        return seq(
            field('symbol', operator),
            field('preprocessor',
                optional(
                    seq(
                        '.',
                        $.square_object,
                    )
                )
            )
        )
    } else {
        return operator;
    }
};

__all_operators__ =
    [
        ['!', true],
        ['?', true],
        ['~', true]
    ].concat(comparison_operator_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
        .concat(functor_binary_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
        .concat(pipe_operator_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
        .concat(morph_operator_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
        .concat(on_operator_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
        .concat(other_binary_operators_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
        .concat(ambiguous_unary_binary_operator_list.map((operator) => [operator, true]));

__operators__as_expression__ = []
    .concat(comparison_operator_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
    .concat(morph_operator_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
    .concat(other_binary_operators_table.map(([_, operator, has_preprocessor]) => [operator, has_preprocessor]))
    .concat(ambiguous_unary_binary_operator_list.map((operator) => [operator, true]));


module.exports = grammar({
        name: 'spiral',

        externals: $ => [
            $.string_content,
            $.block_comment,
        ],

        conflicts: $ => [
            [$.natural_number, $.fraction_literal],
            [$._literal, $.product_expression],
            [$.braces_object, $.statements_block],
            [$._expression, $.index_expression],
            [$.try_call, $.call],
            [$.functor_literal_expression, $.call],
            [$.functor_literal_expression, $.lambda_literal_expression],
            [$.functor_literal_expression, $.label, $.functor_without_arguments, $.object_declaration],
            [$.build, $.functor_without_arguments],
            [$.angle_object, $.spx_expression],
            [$.angle_object, $.document],
            [$.algebra_operation],
            [$.hash_tag_expression, $._expression_statement],
            [$.try_expression, $.try_call],
            [$.hash_tag_expression, $.expression_block],
            [$._expression, $.expression_block],
            [$.spread_element, $.hash_tag_expression, $.expression_block],
            [$.spread_element, $.hash_tag_expression],
            [$.unary_operation_postfix, $.unary_operation_prefix, $.binary_operation],
            [$.index_expression, $.algebra_operation],
            [$.braces_object, $._expression],
            [$.bracket_object, $._expression],
            [$.key_tty_value, $.lambda_literal_expression],
            [$.assign, $.variable_declaration],
            [$.document, $.spx_expression],
            [$.expression_block],
            [$.hash_tag_expression],
            [$._expression, $.variable_declaration],
            [$.binding, $.variable_declaration],
            [$.fraction_literal, $.dot_expression],
            [$.decorator, $.index_expression],
            [$._functor_binary_item, $.lambda_literal_expression],
            [$.all_operators_preprocessor],
            [$._functor_binary_item],
            [$.functor_binary_operation],
            [$.binary_operation],
            [$.decorator],
            [$._expression, $.assignment_statement],
            [$.use_expression, $.use_expression_block],
            [$.hash_tag_expression, $.hash_tag_ending_with_block],
            [$._expression, $.compound_assigment],
            [$.call, $.variable_declaration],
            [$.binding],
            [$.simple_path, $.binding],
            [$.key_tty_value, $._expression],
            [$._expression, $.do_statement],
            [$.key_tty_value, $._expression, $.use_tree],
            [$.variable_declaration, $.index_expression],
            [$.simple_path, $.use_tree],
            [$.use_expression, $.use_expression_block],
            [$.use_tree, $.use_expression, $.use_expression_block],
            [$.build, $._expression],
            [$._expression, $.lambda_literal_expression],
            [$.call, $.expression_block],
            [$.index_expression, $.expression_block],
            [$.key_tty_value],
            [$._expression, $.use_tree],
            [$.operator_as_expression],
            [$._optional_value_ktv, $.lambda_literal_expression],
            [$.object_pattern, $.match_expression],
            [$.lambda_literal_expression],
            [$._expression, $.try_call],
            [$.binary_operation, $.where_block],
            [$.build, $.spx_element_name],
            [$.build, $._expression, $.object_pattern],
            [$.spread_element, $.build],
            [$.binary_operation, $.lambda_literal_expression],
            [$._expression, $.on_statement],
            [$._expression, $.try_call, $.on_statement],
            [$._expression, $.do_statement, $.on_statement],
            [$.decorator, $._expression, $.on_statement],
            [$.angle_object]

        ],

        extras: $ => [/\s/, $.line_comment, $.block_comment],

        supertypes: $ => [
            $._expression,
            $._literal,
            $._pattern,
            $._declarative_pattern,

        ],

        inline: $ => [
            $._functor_declaration,
            $._inner_object,
            $._expression_ending_with_block,
            $._spx_attribute,
            $._spx_child,
            $._ktv_head,
            $._ktv_head_symbol,
            $._ktv_head_ident,
            $._functor_binary_item,
            $._simple_expression,
            $._expression_with_braces,
        ],

        rules: {

            source_file: $ => repeat($._statement),
            currency: $ => choice(
                '\u{0024}',
                '\u{00A2}',
                '\u{00A3}',
                '\u{00A4}',
                '\u{00A5}',
                '\u{058F}',
                '\u{060B}',
                '\u{07FE}',
                '\u{07FF}',
                '\u{09F2}',
                '\u{09F3}',
                '\u{09FB}',
                '\u{0AF1}',
                '\u{0BF9}',
                '\u{0E3F}',
                '\u{17DB}',
                '\u{20A0}',
                '\u{20A1}',
                '\u{20A2}',
                '\u{20A3}',
                '\u{20A4}',
                '\u{20A5}',
                '\u{20A6}',
                '\u{20A7}',
                '\u{20A8}',
                '\u{20A9}',
                '\u{20AA}',
                '\u{20AB}',
                '\u{20AC}',
                '\u{20AD}',
                '\u{20AE}',
                '\u{20AF}',
                '\u{20B0}',
                '\u{20B1}',
                '\u{20B2}',
                '\u{20B3}',
                '\u{20B4}',
                '\u{20B5}',
                '\u{20B6}',
                '\u{20B7}',
                '\u{20B8}',
                '\u{20B9}',
                '\u{20BA}',
                '\u{20BB}',
                '\u{20BC}',
                '\u{20BD}',
                '\u{20BE}',
                '\u{20BF}',
                '\u{A838}',
                '\u{FDFC}',
                '\u{FE69}',
                '\u{FF04}',
                '\u{FFE0}',
                '\u{FFE1}',
                '\u{FFE5}',
                '\u{FFE6}',
                '\u{11FDD}',
                '\u{11FDE}',
                '\u{11FDF}',
                '\u{11FE0}',
                '\u{1E2FF}',
                '\u{1ECB0}',
                'Ƀ',
            ),

            infinite: $ => '∞',

            ident: $ => choice(
                token(/[a-zA-Zα-ωΑ-Ωµ_°][a-zA-Zα-ωΑ-Ωµ\d_]*/),
                $.currency,
                $.infinite,
            ),

            symbol: $ => token(/'[a-zA-Z_][a-zA-Z\d_]*/),

            simple_path: $ => prec.left(PREC.SIMPLE_PATH,
                seq(
                    field('left', choice($.ident, $.simple_path)),
                    field('path_sep', '::'),
                    field('right', choice($.ident, $.angle_object))
                )
            ),

            unary_symbol_prefix: $ => prec(PREC.PREFIX, choice('!', '~')),

            unary_symbol_postfix: $ => prec(PREC.POSTFIX, choice('?')),

            all_operators_preprocessor: $ => make_operator($)(choice(...__all_operators__.map(([operator, _]) => operator)), true),
            arrow: $ => '=>',
            assign: $ => '=',
            natural_unit_suffix: $ => seq('\'',
                choice(
                    caseInsensitive('yotta'),
                    caseInsensitive('zetta'),
                    caseInsensitive('zeta'),
                    caseInsensitive('yota'),
                    caseInsensitive('exa'),
                    caseInsensitive('peta'),
                    caseInsensitive('tera'),
                    caseInsensitive('giga'),
                    caseInsensitive('mega'),
                    caseInsensitive('kilo'),
                    'Y',
                    'Z',
                    'E',
                    'P',
                    'T',
                    'G',
                    'M',
                    'K',
                    'k')
            ),

            exponent: $ => seq(
                /e[+\-]/,
                $.arabic_natural_number
            ),

            fractional_unit_suffix: $ => prec.left(
                seq('\'',
                    choice(
                        caseInsensitive('deci'),
                        caseInsensitive('centi'),
                        caseInsensitive('milli'),
                        caseInsensitive('mili'),
                        caseInsensitive('micro'),
                        caseInsensitive('nano'),
                        caseInsensitive('pico'),
                        caseInsensitive('femto'),
                        caseInsensitive('atto'),
                        caseInsensitive('ato'),
                        caseInsensitive('zepto'),
                        caseInsensitive('yocto'),
                        'd',
                        'c',
                        'm',
                        'μ',
                        'n',
                        'p',
                        'f',
                        'a',
                        'z',
                        'y',
                        $.exponent,
                    )
                )
            ),


            arabic_natural_number: $ => token(/[0-9][0-9_]*/),

            octal_natural_number: $ => token(/0o[0-7_]+/),

            hexadecimal_natural_number: $ => token(/0x[0-9a-fA-F_]+/),

            binary_natural_number: $ => token(/0b[01_]+/),

            natural_number: $ => seq(
                field('value', choice(
                    $.arabic_natural_number,
                    $.octal_natural_number,
                    $.hexadecimal_natural_number,
                    $.binary_natural_number
                    )
                ),
                optional(field('suffix', $.natural_unit_suffix))
            ),

            fraction_literal: $ => prec.left(seq(
                field('numerator', $.arabic_natural_number),
                '.',
                field('denominator', $.arabic_natural_number),
                optional(field('suffix', choice($.natural_unit_suffix, $.fractional_unit_suffix)))
            )),

            natural_fraction_literal: $ => seq(
                field('value', choice(
                    $.arabic_natural_number,
                    $.octal_natural_number,
                    $.hexadecimal_natural_number,
                    $.binary_natural_number
                    )
                ),
                field('suffix', $.fractional_unit_suffix)
            ),

            decimal_literal: $ => seq(
                choice($.fraction_literal, $.natural_fraction_literal),
            ),

            string_literal: $ => choice(
                $.escaped_string_literal,
                $.raw_string_literal
            ),

            escaped_string_literal: $ => prec.left(
                PREC.STRING,
                seq(
                    alias(/b?`/, $.string_start),
                    repeat(choice(
                        $.escape_sequence,
                        $.template_substitution,
                        $.string_content
                    )),
                    '`',
                )
            ),

            raw_string_literal: $ => prec.left(
                PREC.STRING,
                choice(
                    seq(
                        alias(/rb'\{\}`/, $.string_start),
                        repeat(
                            choice(
                                alias(
                                    seq(
                                        '{',
                                        choice($._expression, $.key_tty_value),
                                        '}',
                                    ),
                                    $.raw_template_substitution
                                ),
                                alias(/[^{`]+/, $.internal_string_content),
                            )
                        ),
                        '`',
                    ),
                    seq(
                        alias(/rb'\(\)`/, $.string_start),
                        repeat(
                            choice(
                                alias(
                                    seq(
                                        '(',
                                        choice($._expression, $.key_tty_value),
                                        ')',
                                    ),
                                    $.raw_template_substitution
                                ),
                                alias(/[^(`]+/, $.internal_string_content),
                            )
                        ),
                        '`',
                    ),
                    seq(
                        alias(/rb'‹›`/, $.string_start),
                        repeat(
                            choice(
                                alias(
                                    seq(
                                        '‹',
                                        choice($._expression, $.key_tty_value),
                                        '›',
                                    ),
                                    $.raw_template_substitution
                                ),
                                alias(/[^‹`]+/, $.internal_string_content),
                            )
                        ),
                        '`',
                    ),
                    seq(
                        alias(/rb'«»`/, $.string_start),
                        repeat(
                            choice(
                                alias(
                                    seq(
                                        '«',
                                        choice($._expression, $.key_tty_value),
                                        '»',
                                    ),
                                    $.raw_template_substitution,
                                ),
                                alias(/[^«`]+/, $.internal_string_content),
                            )
                        ),
                        '`',
                    ),
                    seq(
                        alias(/rb?`/, $.string_start),
                        repeat(alias(/[^`]+/, $.internal_string_content)),
                        '`',
                    ),
                ),
            ),

            char_literal: $ => token(
                seq(
                    optional('b'),
                    '\'',
                    optional(choice(
                        seq('\\', choice(
                            /[^xu]/,
                            /u[0-9a-fA-F]{4}/,
                            /u{[0-9a-fA-F]+}/,
                            /x[0-9a-fA-F]{2}/
                        )),
                        /[^\\']/
                    )),
                    '\''
                )
            ),

            escape_sequence: $ => token.immediate(
                seq('\\',
                    choice(
                        /[^xu]/,
                        /u[0-9a-fA-F]{4}/,
                        /u{[0-9a-fA-F]+}/,
                        /x[0-9a-fA-F]{2}/
                    )
                )
            ),

            template_substitution: $ => seq(
                '{',
                choice($._expression, $.key_tty_value),
                '}'
            ),

            spread_element: $ => seq(
                field('decorators', repeat($.decorator)),
                '...',
                field('expression', $._simple_expression)
            ),


            _ktv_head_symbol: $ => field('key', $.symbol),

            binding: $ => choice(
                field('type', choice('let', 'const')),
                seq(
                    field('type', optional(choice('let', 'const'))),
                    field('rename', seq('@', optional(choice($.label, $.ident)))),
                )
            ),

            _ktv_head_ident: $ => seq(
                optional($.binding),
                field('key', choice(alias($._simple_expression, $.object_key), $.spread_element))
            ),

            _ktv_head: $ => choice($._ktv_head_symbol, $._ktv_head_ident),

            key_tty_value: $ => choice(
                prec.right(
                    seq(
                        $._ktv_head,
                        field('type', optional($._tty)),
                        field('value', $._optional_value_ktv),
                    )
                ),
                prec.right(
                    seq(
                        $._ktv_head,
                        field('type', $._tty),
                        field('value', optional($._optional_value_ktv)),
                    )
                ),
                prec.right(
                    seq(
                        choice(
                            seq(
                                $.binding,
                                field('key', choice(alias($._simple_expression, $.object_key), $.spread_element))
                            ),
                            $.spread_element
                        ),
                        field('type', optional($._tty)),
                        field('value', optional($._optional_value_ktv)),
                    )
                ),
            ),


            _tty: $ => prec.right(PREC.TTY,
                seq(
                    ':',
                    $._expression,
                )
            ),

            _inner_object: $ => seq(
                sepBy1(',', choice(
                    $._expression,
                    $.key_tty_value,
                    $.all_operators_preprocessor,
                )),
                optional(',')
            ),

            statements_block: $ => seq(
                '{',
                repeat($._statement),
                optional($._expression),
                '}'
            ),

            braces_object: $ => seq(
                '{',
                optional($._inner_object),
                '}'
            ),

            bracket_object: $ => seq('(',
                optional($._inner_object),
                ')'
            ),

            angle_object: $ => seq(
                '<',
                optional(
                    seq(
                        sepBy1(
                            ',',
                            choice(
                                $._simple_expression,
                                seq(
                                    choice(
                                        alias(
                                            choice(
                                                $.ident,
                                                $.simple_path,
                                            ),
                                            $.object_key
                                        ),
                                        $.symbol
                                    ),
                                    optional(
                                        seq(
                                            $.assign,
                                            $._simple_expression,
                                        )
                                    ),
                                )
                            )
                        ),
                        optional(',')
                    )
                ),
                '>'
            ),

            square_object: $ => seq(
                '[',
                sepBy(',', choice($._expression, $.spread_element)),
                optional(','),
                ']'
            ),

            _number: $ => choice($.natural_number, $.decimal_literal),

            boolean_literal: $ => choice('true', 'false'),

            line_comment: $ => token(seq('//', /.*/)),

            comment: $ => choice(
                $.line_comment,
                $.block_comment,
            ),

            _literal: $ => choice(
                $._number,
                $.char_literal,
                $.string_literal,
                $.boolean_literal,
            ),

            dot_expression: $ => prec.left(PREC.DOT_EXPRESSION, seq(
                field('left', $._simple_expression),
                '.',
                field('right', choice(
                    $.ident,
                    $.simple_path,
                    $.string_literal,
                    $.arabic_natural_number,
                    $.bracket_object,
                    $.all_operators_preprocessor
                    )
                )
            )),

            call: $ => prec.left(PREC.CALL, seq(
                field('callee', $._simple_expression),
                field('arguments', $.bracket_object)
            )),

            build: $ => prec.dynamic(PREC.BUILD, seq(
                field('constructor', choice($.ident, $.simple_path)),
                field('arguments', choice($.braces_object))
            )),


            _simple_expression: $ => choice(
                $._literal,
                $.ident,
                $.simple_path,
                $.dot_expression,
                $.call,
                $.symbol,
                $.square_object,
                $.index_expression,
                $.try_call,
                $.bracket_object,
                $._expression_with_braces,
            ),

            _expression_with_braces: $ => choice(
                $.build,
                $.braces_object,
                $.statements_block,
            ),


            product_expression: $ => prec.left(
                PREC.PRODUCT,
                choice(
                    seq(
                        $._number,
                        choice(
                            $.ident,
                            $.simple_path,
                            $.bracket_object
                        )
                    ),
                )
            ),


            ambiguous_algebra_operation: $ => prec.left(
                PREC.AMBIGUOUS_BINARY, choice(
                    //prefix
                    choice(...ambiguous_unary_binary_operator_list
                        .map(operator =>
                            seq(
                                field('symbol', alias(operator, $.ambiguous_operator)),
                                field('expression', $._expression),
                            )
                        )
                    ),
                    //postfix
                    choice(...ambiguous_unary_binary_operator_list
                        .map(operator =>
                            seq(
                                field('expression', $._expression),
                                field('symbol', alias(operator, $.ambiguous_operator)),
                            )
                        )
                    ),
                    choice(...ambiguous_unary_binary_operator_list
                        .map(operator =>
                            seq(
                                field('left', $._expression),
                                field('operator',
                                    seq(
                                        field('symbol', alias(operator, $.ambiguous_operator)),
                                        field('preprocessor',
                                            optional(
                                                seq(
                                                    '.',
                                                    $.square_object,
                                                )
                                            )
                                        )
                                    )
                                ),
                                field('right', $._expression,),
                            )
                        )
                    ),
                )
            ),


            //never ends with braces
            unary_operation_prefix: $ => prec.left(
                PREC.PREFIX,
                seq(
                    field('symbol', $.unary_symbol_prefix),
                    field('expression', $._expression),
                )
            ),

            //postfix opration should never done on expresion ending with braces
            unary_operation_postfix: $ => prec.left(PREC.POSTFIX,
                seq(
                    field('expression', $._expression),
                    field('symbol', $.unary_symbol_postfix),
                )
            ),

            binary_operation: $ => {
                const operators =
                    pipe_operator_table
                        .concat(morph_operator_table)
                        .concat(on_operator_table)
                        .concat(comparison_operator_table)
                        .concat(other_binary_operators_table);


                return choice(
                    ...operators.map(
                        ([precedence, operator, has_preprocessor, associativity]) => {
                            let operator_field;
                            if (has_preprocessor) {
                                operator_field = seq(
                                    field('symbol', operator),
                                    field('preprocessor',
                                        optional(
                                            seq(
                                                '.',
                                                $.square_object,
                                            )
                                        )
                                    )
                                )
                            } else {
                                operator_field = field('symbol', operator);
                            }
                            let inner = seq(
                                field('left', $._expression),
                                operator_field,
                                field('right', $._expression),
                            );
                            if (associativity === 'right') {
                                return prec.right(
                                    precedence,
                                    inner
                                )
                            }
                            return prec.left(
                                precedence,
                                inner
                            )
                        }
                    )
                );
            },


            operator_as_expression: $ => make_operator($)(choice(...__operators__as_expression__.map(([operator, _]) => operator)), true),
            _functor_binary_item: $ => choice(
                $._expression,
                $.operator_as_expression
            ),

            functor_binary_operation: $ => {

                return choice(...functor_binary_table.map(
                    ([precedence, operator, has_preprocessor]) =>
                        prec.left(
                            precedence,
                            seq(
                                field('left', $._functor_binary_item),
                                field('operator',
                                    seq(
                                        field('symbol', operator),
                                        field('preprocessor',
                                            optional(
                                                seq(
                                                    '.',
                                                    $.square_object,
                                                )
                                            )
                                        )
                                    )
                                ),
                                field('right', $._functor_binary_item),
                            )
                        )
                    )
                );
            },


            algebra_operation: $ => choice(
                $.binary_operation,
                $.functor_binary_operation,
            ),


            decorator: $ => prec(
                PREC.DECORATOR,
                seq(
                    '#',
                    field('expression',
                        seq(
                            field("operation_left", optional($.unary_symbol_prefix)),
                            choice(
                                $.ident,
                                $.simple_path,
                                $.bracket_object,
                            ),
                            field("operation_right", optional($.unary_symbol_postfix)),
                        )
                    ),
                )
            ),

            hash_tag_expression: $ => prec.right(
                PREC.HASH_TAG,
                seq(
                    field('left', repeat1($.decorator)),
                    field('right', optional($._expression))
                )
            ),


            range_expression: $ => prec.left(
                PREC.RANGE, seq(
                    field('from', choice($.product_expression, $._simple_expression)),
                    field('include', choice('..', '...')),
                    field('to', choice($.product_expression, $._simple_expression)),
                )
            ),


            /**
             * =============================================================
             *                          spx
             * =============================================================
             */

            spx_opening_element: $ => prec.left(seq(
                field('open_angle', '<'),
                field('binding', optional($.binding)),
                field('decorators', repeat($.decorator)),
                field('name', $.spx_element_name),
                field('attributes', repeat($._spx_attribute)),
                field('close_angle', '>'),
            )),

            spx_closing_element: $ => prec.left(seq(
                '<',
                '/',
                field('name', $.spx_element_name),
                '>',
            )),

            spx_element: $ => prec.left(PREC.SPX, seq(
                field('open_tag', $.spx_opening_element),
                repeat($._spx_child),
                field('close_tag', $.spx_closing_element)
            )),

            spx_self_closing_element: $ => prec.left(PREC.SPX, seq(
                field('open', '<'),
                field('binding', optional($.binding)),
                field('decorators', repeat($.decorator)),
                field('name', $.spx_element_name),
                field('attributes', repeat($._spx_attribute)),
                field('close',
                    seq(
                        '/',
                        '>'
                    )
                )
            )),

            spx_fragment: $ => prec.left(PREC.SPX,
                seq(
                    '<',
                    field('binding', optional($.binding)),
                    '>',
                    field('content', repeat($._spx_child)),
                    field('close', seq('<', '/', '>'))
                )
            ),

            spx_expression: $ => prec.left(choice($.spx_element, $.spx_self_closing_element, $.spx_fragment)),

            spx_text: $ => /[^{<]+/,

            _spx_child: $ => choice(
                $.spx_text,
                $.spx_expression,
                $.braces_object,
                $.statements_block,
            ),


            spx_element_name: $ => seq(optional('::'), alias($._simple_expression, $.object_key)),


            _spx_inner_expression: $ => choice(
                $._literal,
                $.braces_object,
            ),

            _spx_optional_value: $ => seq(
                $.assign,
                field('value', $._spx_inner_expression)
            ),

            _spx_tty: $ => seq(
                ':',
                field('type', $._spx_inner_expression)
            ),

            spx_key_tty_value: $ => prec.left(seq(
                field('key', choice(alias($._simple_expression, $.object_key), $.spread_element)),
                field('type', optional($._spx_tty)),
                field('value', optional($._spx_optional_value))
            )),

            _spx_attribute: $ => $.spx_key_tty_value,

            _expression: $ => choice(
                $._simple_expression,
                $.unary_operation_prefix,
                $.unary_operation_postfix,
                $.range_expression,
                $.product_expression,
                $.ambiguous_algebra_operation,
                $.algebra_operation,
                $._functor_declaration,
                $._expression_ending_with_block,
                $._prefix_expression,
                $.hash_tag_expression,
            ),


            _prefix_expression: $ => prec.right(
                PREC.PREFIX_EXPRESSION,
                choice(
                    $.use_expression,
                    $.break_expression,
                    $.continue_expression,
                    $.return_expression,
                    $.throw_expression,
                    $.yield_expression,
                    $.do_expression,
                    $.show_expression,
                )
            ),

            type_annotation: $ => prec.left(seq(
                $.ident,
                field('tty', optional($._tty))
            )),

            _pattern: $ => choice(
                prec(1, $.type_annotation),
                $.object_pattern,
            ),

            exportable_type_annotation: $ => prec.left(seq(
                field('export', optional('::')),
                $.ident,
                field('tty', optional($._tty))
            )),
            object_pattern: $ => seq(
                field('callee', optional(
                    seq(
                        field('decorators', optional(repeat1($.decorator))),
                        choice($.ident, $.simple_path)
                    )
                )),
                field('object', choice($.braces_object, $.bracket_object, $.square_object)),
            ),
            _declarative_pattern: $ => choice(
                prec(1, $.exportable_type_annotation),
                $.object_pattern,
            ),

            _optional_value: $ => seq(
                choice($.assign),
                field('value', $._expression)
            ),

            _optional_value_ktv: $ => seq(
                choice($.assign, $.arrow),
                field('value', $._expression)
            ),


            variable_declaration: $ => seq(
                choice('let', 'const'),
                field('pattern', $._declarative_pattern),
                field('right',
                    choice(
                        seq(
                            field('inline_value', optional($._optional_value)),
                            ';'
                        ),
                        seq(
                            $.assign,
                            $._expression_ending_with_block
                        ),
                    )
                ),
            ),

            empty_statement: $ => ';',


            functor_literal_expression: $ => prec.dynamic(
                PREC.FUNCTOR_DECLARATION,
                choice(
                    seq(
                        field('header', $.ident),
                        field('name', $.ident),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                    seq(
                        field('header', $.ident),
                        field('name', $.simple_path),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                    seq(
                        field('header', $.ident),
                        field('name', $.only_export_label),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.ident),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.simple_path),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.only_export_label),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                    seq(
                        field('header', $.ident),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        field('wheres', optional($.where_block)),
                        field('body', $.statements_block),
                    ),
                )
            ),

            where_block: $ => prec.right(PREC.PREFIX, repeat1(seq('where', $._expression))),


            _functor_declaration: $ => choice(
                $.lambda_literal_expression,
                $.functor_literal_expression
            ),

            lambda_literal_expression: $ => prec.dynamic(
                PREC.FUNCTOR_DECLARATION,
                choice(
                    seq(
                        field('name', $.ident),
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        $.arrow,
                        field('body', $._expression),
                    ),
                    seq(
                        field('domain', $.ident),
                        field('codomain', optional($._tty)),
                        $.arrow,
                        field('body', $._expression),
                    ),
                    seq(
                        field('domain', $.bracket_object),
                        field('codomain', optional($._tty)),
                        $.arrow,
                        field('body', $._expression),
                    ),
                    seq(
                        field('domain', $.square_object),
                        field('codomain', optional($._tty)),
                        $.arrow,
                        field('body', $._expression),
                    ),
                    seq(
                        field('domain', $.braces_object),
                        field('codomain', optional($._tty)),
                        $.arrow,
                        field('body', $._expression),
                    )
                )
            ),

            label: $ => seq($.symbol, choice(':', '::'), $.ident),
            only_export_label: $ => seq($.symbol, '::', $.ident),


            index_expression: $ => prec.left(PREC.INDEX,
                seq(
                    field("left", $._simple_expression),
                    field("right", $.square_object),
                )
            ),

            compound_assigment_operator: $ => choice(...compound_assigment_symbol),

            assignment_statement: $ => prec.left(seq(
                field('left', $._expression),
                field('right', choice(
                    seq(
                        field('inline_value', $._optional_value),
                        ';'
                    ),
                    seq(
                        $.assign,
                        $._expression_ending_with_block
                    ),
                )),
            )),

            compound_assigment: $ => prec.left(
                seq(
                    field('left', $._expression),
                    $.compound_assigment_operator,
                    field('right',
                        choice(
                            seq(
                                field('inline_value', $._expression),
                                ';'
                            ),
                            $._expression_ending_with_block
                        )
                    ),
                )
            ),

            expression_block: $ => seq(
                field('label', optional(seq($.label, '@'))),
                $._expression_ending_with_block,
            ),

            _expression_statement: $ => choice(
                seq($._expression, ';'),
                prec(1,
                    $.expression_block,
                ),
            ),

            /**
             * =============================================================
             *           Statements
             * =============================================================
             */

            try_call: $ => prec.left(
                seq(
                    prec(PREC.TRY_CALL, 'try'),
                    $.bracket_object,
                )
            ),

            match_expression: $ => seq(
                'match',
                choice(
                    seq(
                        field('value', $._expression),
                        field('body', $.braces_object)
                    ),
                    seq(
                        field('pattern', $._pattern),
                        'of',
                        field('value', $._expression),
                        field('body', $.braces_object)
                    ),
                )
            ),

            while_expression: $ => seq(
                'while',
                field('condition', $._expression),
                field('body', $.statements_block)
            ),

            functor_without_arguments: $ => prec.left(
                PREC.MODULE,
                choice(
                    seq(
                        field('header', $.ident),
                        field('name', $.ident),
                        field('body', $.statements_block)
                    ),
                    seq(
                        field('header', $.ident),
                        field('name', $.simple_path),
                        field('body', $.statements_block)
                    ), seq(
                        field('header', $.ident),
                        field('name', $.only_export_label),
                        field('body', $.statements_block)
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.ident),
                        field('body', $.statements_block)
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.simple_path),
                        field('body', $.statements_block)
                    ), seq(
                        field('header', $.simple_path),
                        field('name', $.only_export_label),
                        field('body', $.statements_block)
                    )
                )
            ),

            object_declaration: $ => prec.left(
                PREC.OBJECT_DECLARATION,
                choice(
                    seq(
                        field('header', $.ident),
                        field('name', $.ident),
                        field('wheres', optional($.where_block)),
                        field('body', $.braces_object)
                    ),
                    seq(
                        field('header', $.ident),
                        field('name', $.simple_path),
                        field('wheres', optional($.where_block)),
                        field('body', $.braces_object)
                    ),
                    seq(
                        field('header', $.ident),
                        field('name', $.only_export_label),
                        field('wheres', optional($.where_block)),
                        field('body', $.braces_object)
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.ident),
                        field('wheres', optional($.where_block)),
                        field('body', $.braces_object)
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.simple_path),
                        field('wheres', optional($.where_block)),
                        field('body', $.braces_object)
                    ),
                    seq(
                        field('header', $.simple_path),
                        field('name', $.only_export_label),
                        field('wheres', optional($.where_block)),
                        field('body', $.braces_object)
                    ),
                )
            ),


            for_expression: $ => seq(
                'for',
                field('pattern', $._pattern),
                'of',
                field('value', $._expression),
                field('body', $.statements_block)
            ),

            if_expression: $ => seq(
                'if',
                field('condition', $._expression),
                field('consequence', $.statements_block),
                optional($._else_tail)
            ),


            _else_tail: $ => prec.right(seq(
                'else',
                field('alternative', choice(
                    $.statements_block,
                    $.if_expression,
                ))
            )),

            try_expression: $ => prec.right(
                seq(
                    prec(PREC.TRY_EXPRESSION, 'try'),
                    choice(
                        seq(
                            field('expr', $._expression),
                            field('catch', $.braces_object)
                        ),
                        seq(
                            field('expr', $.statements_block),
                            'catch',
                            field('catch', $.braces_object)
                        ),
                    )
                )
            ),

            break_expression: $ => prec.right(
                seq('break',
                    optional($._expression)
                )
            ),
            use_tree: $ => prec.right(
                choice(
                    $.ident,
                    $.symbol,
                    $.simple_path,
                    seq($.ident, 'as', $.ident),
                    seq($.simple_path, 'as', $.ident),
                    seq(
                        $.ident,
                        '::',
                        $._use_tree_tail
                    ),
                    seq(
                        $.simple_path,
                        '::',
                        $._use_tree_tail
                    ),
                )
            ),

            _use_tree_tail: $ => seq(
                '{',
                sepBy1(',', $.use_tree),
                optional(','),
                '}'
            ),

            use_expression: $ => prec.right(
                choice(
                    seq(
                        'use',
                        optional(seq($._simple_expression, '::')),
                        $.use_tree
                    ),
                    seq(
                        'use',
                        optional(seq($._simple_expression, '::')),
                        $._use_tree_tail,
                    )
                )
            ),

            use_expression_block: $ => prec.right(
                seq(
                    'use',
                    optional(seq($._simple_expression, '::')),
                    $._use_tree_tail,
                )
            ),

            continue_expression: $ => prec.right(seq('continue', optional($._expression))),

            return_expression: $ => prec.right(seq(
                'return',
                optional($._expression),
            )),

            throw_expression: $ => prec.right(seq(
                'throw',
                $._expression,
            )),

            show_expression: $ => prec.right(seq(
                'show',
                $._expression,
            )),

            yield_expression: $ => prec.right(seq(
                'yield',
                optional($._expression),
            )),

            do_expression: $ => prec.right(seq('do', $._expression)),
            do_statement: $ => prec.right(seq('do', choice($.statements_block))),
            on_statement: $ => seq($._simple_expression, 'on', $.braces_object),
            loop_statement: $ => seq('loop', $.statements_block),

            hash_tag_ending_with_block: $ => prec.right(
                PREC.HASH_TAG - 1,
                seq(
                    field('left', repeat1($.decorator)),
                    field('right', $._expression_ending_with_block)
                )
            ),
            _expression_ending_with_block: $ => choice(
                $._expression_with_braces,
                $.if_expression,
                $.loop_statement,
                $.match_expression,
                $.while_expression,
                $.for_expression,
                $.functor_without_arguments,
                $.functor_literal_expression,
                $.try_expression,
                $.do_statement,
                $.object_declaration,
                $.spx_expression,
                $.use_expression_block,
                $.hash_tag_ending_with_block,
                $.on_statement,
            ),

            _statement: $ => choice(
                $.empty_statement,
                $.document,
                $._expression_statement,
                $.variable_declaration,
                $.assignment_statement,
                $.compound_assigment,
            ),

            doc_fragment: $ => prec.left(PREC.SPX,
                seq(
                    '<',
                    field('binding', optional($.binding)),
                    field('decorators', repeat($.decorator)),
                    '--',
                    field('attributes', repeat($._spx_attribute)),
                    '>',
                    field('content', repeat($._spx_child)),
                    field('close', seq('<', '--', '/', '>')),
                )
            ),

            /**
             sp documents
             */
            document: $ => $.doc_fragment
        }
    }
);

function sepBy1(sep, rule) {
    return seq(rule, repeat(seq(sep, rule)))
}

function sepBy(sep, rule) {
    return optional(sepBy1(sep, rule))
}

function caseInsensitive(keyword) {
    return new RegExp(keyword
        .split('')
        .map(letter => `[${letter}${letter.toUpperCase()}]`)
        .join('')
    )
}

//todo: remove custom brackets for operators
//add bracket color
//color operator
//color special names
//color functor
//todo: end algrebras ending with block
//todo: string ✓
//todo: algebra ending wih block
//todo: test then ✓
//TODO: raw string ✓
//TODO: hashtag expression  + algebras, test hashtag in every form *
//todo: use tree as expression ✓
//TODO: test ambiguity for for, while, wverything that use block or statement
//TODO: functors (add curry test)
//TODO: ALgebra ending with bloc

//TODO: spx binding
//TODO: doc binding
//TODO: algebras precedence test
//todo let zxczx[x,g,s] = sd;
//todo add klaksdl.( + | +) test
// maybe algebra ending with block


//exprt cases
//functor withiut argument
//object declaration
//functor declaration
//let exp
//binding object and spx
//label @


//TODO: AMbigous without block
//tty without block for functor signure, lamda, functor definition
