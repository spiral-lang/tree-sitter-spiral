const PREC = {
    PREFIX_EXPRESSION: -200000,
    PIPE_OPERATOR: -100000,
    EXPRESSION_BLOCK: -7000,
    USE: -6000,
    DECORATOR: -180,
    SPECIAL_OPERATOR: -150,
    TRY_EXPRESSION: -5,
    MODULE: -10,
    OBJECT_DECLARATION: -9,
    BRACE_OBJECT: -5,
    STATEMENT_BLOCK: -4,
    KEY_TTY_VALUE: -2,
    ON: 580,
    FUNCTOR_BINARY: 581,
    FUNCTOR_OR: 583,
    FUNCTOR_AND: 584,
    THEN: 585,
    EQ: 586,
    NEQ: 587,
    IS: 588,
    IN: 589,
    GOL: 590,
    BECOMES: 593,
    MORPH: 594,
    FUNCTOR_COMPOSITION: 595,
    BINARY: 600,
    AMBIGUOUS_BINARY: 900,
    HASH_TAG: 950,
    AMBIGUOUS_UNARY_PREFIX: 1000,
    AMBIGUOUS_UNARY_POSTFIX: 1100,
    PREFIX: 700,
    POSTFIX: 800,
    FUNCTOR_WITHOUT_ARGUMENTS: 925,
    FUNCTOR_DEFINITION: 950,
    BUILD: 1000,
    TRY_CALL: 1400,
    SPX: 2000,
    RANGE: 2500,
    STRING: 2800,
    FRACTIONAL: 3000,
};

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
    /[\u2030-\u203E]/,
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
    [PREC.MORPH, '->', true],
    [PREC.MORPH, 'morphs', true]
];

on_operator_table = [
    [PREC.ON, 'on', true],
];

other_binary_operators_table = [
    [PREC.THEN, 'then', false],
    [PREC.BECOMES, 'becomes', false],
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

const make_raw_template_substitution = ($) => (input) => {
    let [left, right] = [input[0], input[1]];
    let pattern = `rb?@${input
        .replace('{', '\\{')
        .replace('}', '\\}')        
        .replace('(', '\\(')
        .replace(')', '\\)')
    }\``;
    return seq(
        alias(new RegExp(pattern), $.string_start),
        repeat(
            choice(
                alias(
                    seq(
                        left,
                        choice($._expression, $.key_tty_value),
                        right
                    ),
                    $.template_substitution
                ),
                alias(new RegExp(`[^\`${left}]+`), $.internal_string_content),
            )
        ),
        '`',
    )
};

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
            [$.key_tty_value, $._simple_expression],
            [$.braces_object, $.statements_block],
            [$._expression, $.index_expression],
            [$.functor_literal_signature, $.call],
            [$.try_call, $.call],
            [$._simple_expression, $.call],
            [$.simple_path, $._simple_expression],
            [$.functor_literal_expression, $.call],
            [$.functor_literal_expression, $.lambda_literal_expression],
            [$.functor_literal_signature, $.call, $.functor_literal_expression],
            [$.functor_literal_signature, $.functor_literal_expression],
            [$.functor_literal_expression, $.label, $.functor_without_arguments, $.object_declaration],
            [$.build, $.functor_without_arguments],
            [$.angle_object, $.spx_expression],
            [$.angle_object, $.document],
            [$.functor_literal_signature, $.lambda_literal_expression],
            [$.functor_literal_signature],
            [$.while_expression, $._simple_expression],
            [$.match_expression, $._simple_expression],
            [$.if_expression, $._simple_expression],
            [$.algebra_operation],
            [$._simple_expression, $.lambda_literal_expression],
            [$._simple_expression, $._expression],
            [$.hash_tag_expression, $._expression_statement],
            [$.try_expression, $.try_call],
            [$._simple_expression, $._expression, $.expression_block],
            [$._simple_expression, $.expression_block],
            [$.hash_tag_expression, $.expression_block],
            [$._expression, $.expression_block],
            [$.key_tty_value, $._simple_expression, $.functor_literal_signature],
            [$.natural_number, $.object_key],
            [$.object_key, $._simple_expression],
            [$.object_key, $.lambda_literal_expression],
            [$.object_key, $._literal],
            [$.object_key, $.object_key_dot],
            [$.object_key, $.exportable_type_annotation],
            [$._simple_expression, $.index_expression],
            [$.natural_number, $.fraction_literal, $.object_key],
            [$.spread_element, $.hash_tag_expression, $.expression_block],
            [$.spread_element, $.hash_tag_expression],
            [$.unary_operation_postfix, $.unary_operation_prefix, $.binary_operation],
            [$.index_expression, $.algebra_operation],
            [$._simple_expression, $.functor_literal_expression, $.functor_literal_signature, $.lambda_literal_expression],
            [$._simple_expression, $.functor_literal_expression, $.functor_literal_signature],
            [$.braces_object, $._expression],
            [$.bracket_object, $._expression],
            [$.key_tty_value, $.lambda_literal_expression],
            [$.object_key, $._simple_expression, $.lambda_literal_expression],
            [$.object_key, $._simple_expression, $.lambda_literal_expression],
            [$.assign, $.variable_declaration],
            [$.object_key, $._simple_expression, $.use_tree],
            [$.document, $.spx_expression],
            [$.expression_block],
            [$._simple_expression, $._expression, $.do_statement],
            [$._simple_expression, $.do_statement],
            [$.hash_tag_expression],
            [$._simple_expression, $._expression, $.variable_declaration],
            [$._simple_expression, $.variable_declaration],
            [$._expression, $.variable_declaration],
            [$.binding, $.variable_declaration],
            [$.ambiguous_unary_operation_prefix, $.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation],
            [$.fraction_literal, $.dot_expression],
            [$.binary_operation, $.functor_binary_operation, $.on_statement],
            [$.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation, $.unary_operation_postfix],
            [$._simple_expression, $.functor_literal_expression],
            [$._simple_expression, $.functor_literal_expression, $.lambda_literal_expression],
            [$._tty, $.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation],
            [$.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation, $.lambda_literal_expression],
            [$.ambiguous_unary_operation_prefix, $._functor_binary_item],
            [$.decorator, $.index_expression],
            [$._functor_binary_item, $.lambda_literal_expression],
            [$.all_operators_preprocessor],
            [$._functor_binary_item],
            [$.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation, $._functor_binary_item],
            [$._simple_expression, $.on_statement],
            [$._simple_expression, $._expression, $.on_statement],
            [$.ambiguous_binary_operation, $._functor_binary_item],
            [$.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation],
            [$._functor_binary_item, $.where_expression],
            [$.ambiguous_unary_operation_prefix, $.binary_operation],
            [$.ambiguous_unary_operation_prefix, $.binary_operation, $.on_statement],
            [$.functor_binary_operation],
            [$.binary_operation],
            [$.decorator],
            [$.binary_operation, $.on_statement],
            [$.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation, $.binary_operation],
            [$.ambiguous_binary_operation, $.binary_operation],
            [$.ambiguous_binary_operation, $.binary_operation, $.on_statement],
            [$._simple_expression, $.functor_literal_signature],
            [$._expression, $._functor_declaration, $.expression_block],
            [$._expression, $._functor_declaration],
            [$.object_key, $._simple_expression, $.functor_literal_signature],
            [$._simple_expression, $._expression, $.lambda_literal_expression],
            [$._simple_expression, $._expression, $.lambda_literal_expression, $.on_statement],
            [$.ambiguous_unary_operation_postfix, $.ambiguous_binary_operation, $.hash_tag_expression],
            [$.build, $._simple_expression, $.functor_without_arguments],
            [$._simple_expression, $.assignment_statement],
            [$._simple_expression, $._expression, $.assignment_statement],
            [$._expression, $.assignment_statement],
            [$._expression, $._functor_declaration, $.assignment_statement],
            [$._simple_expression, $.label],
            [$.object_key, $._simple_expression, $.label],
            [$.simple_path, $._simple_expression, $.use_tree],
            [$.use_expression, $.use_expression_block],
            [$.key_tty_value, $._simple_expression, $.use_tree],
            [$.hash_tag_expression, $.hash_tag_ending_with_block],
            [$._simple_expression, $.compound_assigment],
            [$._simple_expression, $._expression, $.compound_assigment],
            [$._expression, $.compound_assigment],
            [$._expression, $._functor_declaration, $.compound_assigment],
            [$.call, $.variable_declaration],
            [$._expression, $.variable_declaration, $._functor_declaration],


        ],

        extras: $ => [/\s/, $.line_comment, $.block_comment],

        supertypes: $ => [
            $._expression,
            $._literal,
            $._pattern,
            $._declarative_pattern,
        ],

        inline: $ => [
            $._inner_object,
            $._expression_ending_with_block,
            $._spx_attribute,
            $._spx_child,
            $._ktv_head,
            $._ktv_head_symbol,
            $._ktv_head_ident,
            $._functor_binary_item
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

            simple_path: $ => prec.left(
                seq(
                    field('left', choice($.ident, $.simple_path)),
                    field('path_sep', '::'),
                    field('right', choice($.ident, $.angle_object))
                )
            ),

            self_path: $ => token(seq('::', caseInsensitive('self'))),

            unary_symbol_prefix: $ => prec(PREC.PREFIX, choice('!', '~')),

            unary_symbol_postfix: $ => prec(PREC.POSTFIX, choice('!', '?')),

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
                PREC.FRACTIONAL,
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
                )),

            export_sign: $ => choice(seq('[', '::', ']'), seq('[', ':', ']')),

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
                field('suffix', seq('\'', $.fractional_unit_suffix))
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
                choice(
                    ...(
                        [
                            '{}',
                            '()',
                            '‹›',
                            '«»',
                            '｢｣',
                            '⸢⸣',
                            '⸢⸥',
                            '⸤⸥',
                            '⸤⸣',
                            '⦃⦄'
                        ].map(make_raw_template_substitution($))),
                    seq(
                        alias(/rb?`/, $.string_start),
                        repeat(alias(/[^`]+/, $.internal_string_content)),
                        '`',
                    ),
                ),
            ),

            char_literal: $ => token(seq(
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
            )),

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
                $._simple_expression
            ),

            object_key: $ => prec.left(choice(
                $.ident,
                $.simple_path,
                $.arabic_natural_number,
                $.string_literal,
                $.object_key_index,
                $.object_key_dot,
            )),

            object_key_index: $ => prec.left(
                seq(
                    $.object_key,
                    $.square_object
                )
            ),

            object_key_dot: $ => prec.left(seq(
                field('value', $.object_key),
                '.',
                field('field', choice(
                    $.ident,
                    $.string_literal,
                    $.arabic_natural_number,
                    $.simple_path,
                    )
                )
            )),


            _ktv_head_symbol: $ => field('key', $.symbol),

            binding: $ => choice(
                field('type', choice('let', 'const')),
                seq(
                    field('type', optional(choice('let', 'const'))),
                    field('rename', seq('@', optional($.export_sign), $.ident)),
                )
            ),

            _ktv_head_ident: $ => prec.left(seq(
                optional($.binding),
                field('key', choice($.object_key, $.spread_element))
            )),

            _ktv_head: $ => choice($._ktv_head_symbol, $._ktv_head_ident),

            key_tty_value: $ => prec.left(seq(
                $._ktv_head,
                field('type', optional($._tty)),
                field('value', optional($._optional_value_ktv)),
            )),

            _tty: $ => prec.left(PREC.BUILD, seq(
                ':',
                $._expression,
            )),

            _inner_object: $ => prec.left(seq(
                sepBy1(',', choice(
                    $.key_tty_value,
                    $.all_operators_preprocessor,
                    $._expression
                )),
                optional(',')
            )),

            statements_block: $ => prec.left(seq(
                '{',
                repeat($._statement),
                optional($._expression),
                '}'
            )),

            braces_object: $ => prec.left(PREC.BRACE_OBJECT, seq(
                '{',
                optional($._inner_object),
                '}'
            )),

            bracket_object: $ => prec.left(seq('(',
                optional($._inner_object),
                ')'
            )),

            angle_object: $ => prec.left(seq(
                '<',
                optional(seq(
                    sepBy1(
                        ',',
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
                    ),
                    optional(',')
                )),
                '>'
            )),

            square_object: $ => prec.left(PREC.BRACE_OBJECT, seq(
                '[',
                sepBy(',', choice($._expression, $.spread_element)),
                optional(','),
                ']'
            )),

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

            dot_expression: $ => prec.left(seq(
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

            call: $ => prec.left(seq(
                field('callee',
                    choice(
                        $.ident,
                        $.simple_path,
                        $.dot_expression,
                        $.build,
                        $.call,
                        $.statements_block,
                        $.braces_object,
                        $.bracket_object,
                        $.index_expression,
                    )
                ),
                field('arguments', $.bracket_object)
            )),

            build: $ => prec.left(PREC.BUILD, seq(
                field('constructor', choice($.ident, $.simple_path)),
                field('arguments', $.braces_object)
            )),


            _simple_expression: $ => choice(
                $.self_path,
                $._literal,
                $.ident,
                $.simple_path,
                $.dot_expression,
                $.call,
                $.build,
                $.symbol,
                $.bracket_object,
                $.square_object,
                $.braces_object,
                $.statements_block,
                $.index_expression,
                $.unary_operation_prefix,
                $.unary_operation_postfix,
                $.try_call,
            ),

            product_expression: $ => seq(
                $._number,
                choice(
                    $.ident,
                    $.simple_path,
                    $.bracket_object
                )
            ),

            ambiguous_unary_operation_prefix: $ => {
                return choice(...ambiguous_unary_binary_operator_list.map(
                    (operator) =>
                        prec.left(
                            PREC.AMBIGUOUS_UNARY_PREFIX,
                            seq(
                                field('symbol', operator),
                                field('expression', $._expression),
                            )
                        )
                    )
                );
            },

            ambiguous_unary_operation_postfix: $ => {
                return choice(...ambiguous_unary_binary_operator_list.map(
                    (operator) =>
                        prec.left(
                            PREC.AMBIGUOUS_UNARY_POSTFIX,
                            seq(
                                field('expression', $._expression),
                                field('symbol', operator),
                            )
                        )
                    )
                );
            },

            ambiguous_binary_operation: $ => {
                return choice(...ambiguous_unary_binary_operator_list.map(
                    (operator) =>
                        prec.left(
                            PREC.AMBIGUOUS_BINARY,
                            seq(
                                field('left', $._expression),
                                field('operator', make_operator($)(operator, true)),
                                field('right', $._expression,),
                            )
                        )
                    )
                )
            },


            ambiguous_algebra_operation: $ => choice(
                $.ambiguous_unary_operation_prefix,
                $.ambiguous_unary_operation_postfix,
                $.ambiguous_binary_operation,
            ),

            unary_operation_prefix: $ => prec.left(
                PREC.PREFIX,
                seq(
                    field("symbol", $.unary_symbol_prefix),
                    field("expression", $._simple_expression),
                )
            ),

            unary_operation_postfix: $ => prec.left(PREC.POSTFIX,
                seq(
                    field("expression", $._simple_expression),
                    field("symbol", $.unary_symbol_postfix),
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
                        ([precedence, operator, has_preprocessor]) =>
                            prec.left(
                                precedence,
                                seq(
                                    field('left', $._expression),
                                    alias(make_operator($)(operator, has_preprocessor), $.compiler_binary_operator),
                                    field('right', $._expression),
                                )
                            )
                    )
                );
            },
            _functor_binary_item: $ => choice(
                $._expression,
                make_operator($)(choice(...__operators__as_expression__.map(([operator, _]) => operator)), true),
            ),
            functor_binary_operation: $ => {

                return choice(...functor_binary_table.map(
                    ([precedence, operator, has_preprocessor]) =>
                        prec.left(
                            precedence,
                            seq(
                                field('left', $._functor_binary_item),
                                alias(make_operator($)(operator, has_preprocessor), $.compiler_functor_operator),
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
                    field('expression', $._simple_expression),
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
                    field('from', $._expression),
                    field('include', choice('..', '...')),
                    field('to', $._expression),
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
                field("open", '<'),
                field('binding', optional($.binding)),
                field('decorators', repeat($.decorator)),
                field('name', $.spx_element_name),
                field('attributes', repeat($._spx_attribute)),
                field("close",
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


            spx_element_name: $ => seq(optional("::"), $.object_key),


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
                field('key', $.object_key),
                field('type', optional($._spx_tty)),
                field('value', optional($._spx_optional_value))
            )),

            _spx_attribute: $ => $.spx_key_tty_value,

            _expression: $ => prec.left(choice(
                $._simple_expression,
                $.range_expression,
                $.product_expression,
                $.ambiguous_algebra_operation,
                $.algebra_operation,
                prec.left(1, $._functor_declaration),
                $._expression_ending_with_block,
                $._prefix_expression,
                $.hash_tag_expression,
            )),

            _prefix_expression: $ => prec.right(PREC.PREFIX_EXPRESSION,
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
                optional($.export_sign),
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


            functor_literal_expression: $ => seq(
                field('header',
                    seq(
                        alias(
                            field('header_1',
                                choice($.ident, $.simple_path)
                            ),
                            $.functor_hof
                        ),
                        alias(
                            optional(
                                field('header_2', choice(
                                    seq(optional($.export_sign), $.ident),
                                    $.simple_path
                                    )
                                )
                            ), $.functor_name)
                    )
                ),
                field('domain', $.bracket_object),
                field('codomain', optional($._tty)),
                field('wheres', repeat($.where_expression)),
                field('body', $.statements_block),
            ),

            where_expression: $ => prec.left(seq('where', $._expression)),

            functor_literal_signature: $ => prec.left(
                seq(
                    field('header', choice($.ident, $.simple_path)),
                    field('domain', choice($.bracket_object)),
                    choice(
                        seq(
                            field('codomain', $._tty),
                            field('wheres', repeat($.where_expression)),
                        ),
                        field('wheres', repeat1($.where_expression)),
                    ),
                )
            ),

            _functor_declaration: $ => choice(
                $.functor_literal_signature,
                $.lambda_literal_expression,
                $.functor_literal_expression
            ),

            lambda_literal_expression: $ => prec.left(seq(
                field('header',
                    choice(
                        field('domain', choice($.ident, $.bracket_object, $.square_object, $.braces_object)),
                        seq(
                            field('name', $.ident),
                            field('domain', choice($.bracket_object)),
                        )
                    )),
                field('codomain', optional($._tty)),
                $.arrow,
                field('body', $._expression),
            )),

            label: $ => $.ident,

            index_expression: $ => prec.left(seq($._simple_expression, $.square_object)),

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

            expression_block: $ => prec.left(seq(
                field('label', optional(seq($.label, $.export_sign))),
                $._expression_ending_with_block,
            )),

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

            try_call: $ => prec.left(PREC.TRY_CALL,
                seq(
                    'try',
                    $.bracket_object,
                )
            ),

            match_expression: $ => prec.right(
                seq(
                    'match',
                    seq(
                        field('value', $._expression),
                        field('body', $.braces_object)
                    )
                )
            ),

            while_expression: $ => prec.right(seq(
                'while',
                field('condition', $._expression),
                field('body', $.statements_block)
            )),

            functor_without_arguments: $ => prec.left(
                PREC.MODULE,
                seq(
                    field('header',
                        seq(
                            choice($.ident, $.simple_path),
                            optional(seq(optional($.export_sign), $.ident))
                        )
                    ),
                    field('body', $.statements_block)
                )
            ),

            object_declaration: $ => prec.left(PREC.OBJECT_DECLARATION, seq(
                field('header',
                    seq(
                        choice($.ident, $.simple_path),
                        seq(optional($.export_sign), $.ident)
                    )
                ),
                field('wheres', repeat($.where_expression)),
                field('body', $.braces_object)
            )),

            for_expression: $ => prec.right(seq(
                'for',
                field('pattern', $._pattern),
                'of',
                field('value', $._expression),
                field('body', $.statements_block)
            )),

            if_expression: $ => prec.right(seq(
                'if',
                field('condition', $._expression),
                field('consequence', $.statements_block),
                optional($._else_tail)
            )),


            _else_tail: $ => prec.right(seq(
                'else',
                field('alternative', choice(
                    $.statements_block,
                    $.if_expression,
                ))
            )),

            try_expression: $ => prec.right(PREC.TRY_EXPRESSION, seq(
                'try',
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
            )),

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
                    seq(choice($.ident, $.simple_path), 'as', $.ident),
                    seq(
                        choice(
                            $.ident,
                            $.simple_path
                        ),
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

            use_expression: $ => prec.right(seq(
                'use',
                optional(seq($._simple_expression, "::")),
                choice($.use_tree, $._use_tree_tail)
            )),

            use_expression_block: $ => prec.right(seq(
                'use',
                optional(seq($._simple_expression, "::")),
                $._use_tree_tail,
            )),

            continue_expression: $ => prec.right(seq('continue', optional($.label))),

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
            on_statement: $ => prec.left(seq($._expression, 'on', choice($.braces_object))),

            hash_tag_ending_with_block: $ => prec.right(
                PREC.HASH_TAG,
                seq(
                    field('left', repeat1($.decorator)),
                    field('right', $._expression_ending_with_block)
                )
            ),
            _expression_ending_with_block: $ => choice(
                $.statements_block,
                $.if_expression,
                $.match_expression,
                $.while_expression,
                $.for_expression,
                $.functor_without_arguments,
                $.functor_literal_expression,
                $.try_expression,
                $.do_statement,
                $.on_statement,
                $.build,
                $.object_declaration,
                $.braces_object,
                $.spx_expression,
                $.use_expression_block,
                $.hash_tag_ending_with_block,
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
                    '*',
                    field('attributes', repeat($._spx_attribute)),
                    '>',
                    field('content', repeat($._spx_child)),
                    field('close', seq('<', '*', '/', '>')),
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

//todo: string
//todo: algebra ending wih block
//todo: test then *
//TODO: raw string *
//TODO: hashtag expression  + algebras, test hashtag in every form *
//todo: use tree as expression *
//TODO: test ambiguity for for, while, wverything that use block or statement
//TODO: functors (add curry test)
//TODO: ALgebra ending with bloc

//TODO: spx binding
//TODO: doc binding
//TODO: algebras precedence test
//todo let zxczx[x,g,s] = sd;
//todo add klaksdl.( + | +) test
// maybe algebra ending with block
