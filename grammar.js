const PREC = {
    BRACE_OBJECT: 1,
    STATEMENT_BLOCK: -1,
    KEY_TTY_VALUE: 120,
    FUNCTOR_WITHOUT_ARGUMENTS: -10,
    OBJECT_DECLARATION: -9,
    BUILD: 550,
    TRY_CALL: 555,
    TRY_EXPRESSION: -5,
    BINARY: 600,
    PREFIX: 700,
    POSTFIX: 800,
};

module.exports = grammar({
    name: 'spiral',

    externals: $ => [
        $._string_content,
        $.block_comment,
    ],

    conflicts: $ => [
        [$.natural_number, $.fraction_literal],
        [$._literal, $.product_expression],
        [$.key_tty_value, $._simple_expression],
        [$.braces_object, $.statements_block],
        [$._expression, $.build],
        [$._expression, $.index_expression],
        [$._expression, $.call],
        [$.comparison_operator, $.spx_opening_element, $.spx_self_closing_element],
        [$.while_expression, $._simple_expression],
        [$.match_expression, $._simple_expression],
        [$.if_expression, $._simple_expression],
        [$.algebra_operation],
        [$._simple_expression, $.lambda_literal_expression],
        [$._simple_expression, $._expression],
        [$.hash_tag_expression, $._expression_statement],
        [$.try_expression, $.try_call],
        [$.simple_path, $.functor_without_arguments],
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
        [$.special_operator],
        [$.call, $._simple_expression],
        [$._simple_expression, $.index_expression],
        [$.natural_number, $.fraction_literal, $.object_key],
        [$.spread_element, $.hash_tag_expression, $.expression_block],
        [$.spread_element, $.hash_tag_expression],
        [$.symbolic_operator_without_comparison, $.symbolic_operator],
        [$.unary_operation_postfix, $.unary_operation_prefix, $.binary_operation],
        [$.index_expression, $.algebra_operation],
        [$._simple_expression, $.functor_literal_expression, $.functor_literal_signature, $.lambda_literal_expression],
        [$._simple_expression, $.functor_literal_expression, $.functor_literal_signature],
        [$.braces_object, $._expression],
        [$.bracket_object, $._expression],
        [$.key_tty_value, $.lambda_literal_expression],
        [$.object_key, $._simple_expression, $.lambda_literal_expression],
        [$.object_key, $._simple_expression, $.lambda_literal_expression],
        [$.build, $._simple_expression, $.functor_without_arguments],
        [$._assign, $.variable_declaration],
        [$.hash_tag_expression, $.expression_block, $.use_declaration],
        [$.spread_element, $.hash_tag_expression, $.expression_block, $.use_declaration],
        [$.object_key, $._simple_expression, $.use_tree]


    ],

    extras: $ => [/\s/, $.line_comment, $.block_comment],

    supertypes: $ => [
        $._expression,
        $._literal,
        $._declaration_statement,
        $._pattern,
        $._declarative_pattern,
    ],

    inline: $ => [
        $._all_operators,
        $._declaration_statement,
        $._inner_object,
        $._expression_ending_with_block,
        $._spx_attribute,
        $._spx_element_name,
        $._spx_child,
        $._ktv_head,
        $._ktv_head_symbol,
        $._ktv_head_ident,
    ],

    rules: {

        source_file: $ => repeat($._statement),

        ident: $ => choice(
            token(/[a-zA-Zα-ωΑ-Ωµ_][a-zA-Zα-ωΑ-Ωµ\d_]*/),
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

        symbol: $ => token(/'[a-zA-Z_][a-zA-Z\d_]*/),

        simple_path: $ => seq(
            choice($.ident, $.simple_path),
            '::',
            $.ident
        ),

        self_path: $ => token(seq('::', caseInsensitive('self'))),

        comparison_operator: $ => choice(
            '≠',
            '!=',
            '~=',
            '==',
            '≤',
            '<=',
            '≥',
            '>=',
            '<',
            '>',
        ),

        ambiguous_unary_binary_operator: $ => choice(
            '^',
            '%',
            '|',
            '/',
            '<<',
            '>>',
            '!',
            '~',
            '?',
            '&',
            '*',
            '+',
            '-',
            '¦',
            '§',
            choice('\u{00A9}', '\u{00AB}', '\u{00AC}', '\u{00AE}'),
            choice('\u{00B0}', '\u{00B1}', '\u{00B6}', '\u{00BB}'),
            choice('\u{00BF}', '\u{00D7}', '\u{00F7}'),
            /[\u2016-\u2017]/,
            /[\u2020-\u2027]/,
            /[\u2030-\u203E]/,
            /[\u2041-\u2053]/,
            /[\u2055-\u205E]/,
            /[\u2190-\u23FF]/,
            /[\u2500-\u2775]/,
            /[\u2794-\u2BFF]/,
            /[\u2E00-\u2E7F]/,
            /[\u3001-\u3003]/,
            /[\u3008-\u3030]/,
        ),

        special_operator: $ => choice(
            '->',
            '|>',
            'in',
            seq('not', 'in'),
            'is',
            seq('is', 'not'),
            'and',
            'or',
            'on',
            'becomes',
        ),

        _all_operators: $ => choice(
            $.symbolic_operator,
            $.special_operator,
        ),

        symbolic_operator: $ => prec.left(1,
            seq(
                choice(
                    $.comparison_operator,
                    $.ambiguous_unary_binary_operator,
                ),
                optional(
                    seq(
                        '.',
                        $.square_object
                    )
                )
            )
        ),

        symbolic_operator_without_comparison: $ => prec.left(
            seq(
                $.ambiguous_unary_binary_operator,
                optional(
                    seq(
                        '.',
                        $.square_object
                    )
                )
            )
        ),
        _arrow: $ => '=>',
        _assign: $ => '=',
        natural_unit_suffix: $ => choice(
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
            'k'),

        exponent: $ => seq(
            'e',
            choice('+', '-'),
            $.arabic_natural_number
        ),

        fractional_unit_suffix: $ => choice(
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
        ),

        export_sign: $ => '[::]',

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
            optional(field('suffix', seq('\'', $.natural_unit_suffix)))
        ),

        fraction_literal: $ => seq(
            field('numerator', $.arabic_natural_number),
            '.',
            field('denominator', $.arabic_natural_number),
            optional(field('suffix', seq('\'', choice($.natural_unit_suffix, $.fractional_unit_suffix))))
        ),

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

        string_literal: $ => seq(
            /b?`/,
            repeat(choice(
                $.escape_sequence,
                $.template_substitution,
                $._string_content
            )),
            '`'
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

        object_key_index: $ => prec.left(seq($.object_key, $.square_object)),

        object_key_dot: $ => prec.left(seq(
            field('value', $.object_key),
            '.',
            field('field', choice(
                $.ident,
                $.string_literal,
                $.arabic_natural_number
                )
            )
        )),


        _ktv_head_symbol: $ => field('key', $.symbol),

        _ktv_head_ident: $ => prec.left(seq(
            field('binding', optional(seq(
                choice('let', 'const'),
                field('rename', optional(seq('@', $.ident))),
            ))),
            field('key', choice($.object_key, $.spread_element))
        )),

        _ktv_head: $ => choice($._ktv_head_symbol, $._ktv_head_ident),

        key_tty_value: $ => prec.left(seq(
            $._ktv_head,
            field('type', optional($._tty)),
            field('value', optional($._optional_value_ktv)),
        )),

        _tty: $ => prec.left(seq(
            ':',
            $._expression
        )),

        _inner_object: $ => prec.left(seq(
            sepBy1(',', choice(
                $.key_tty_value,
                $._expression,
                $.symbolic_operator,
            )),
            optional(',')
        )),

        statements_block: $ => prec.left(PREC.STATEMENT_BLOCK, seq(
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

        bracket_object: $ => seq('(',
            optional($._inner_object),
            ')'
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

        dot_expression: $ => prec.left(seq(
            field('value', $._simple_expression),
            '.',
            field('field', choice(
                $.ident,
                $.string_literal,
                $.arabic_natural_number,
                $.bracket_object,
                $.symbolic_operator,
                )
            )
        )),

        call: $ => prec.left(PREC.BUILD, seq(
            field('callee', $._simple_expression),
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
            $.try_call,
        ),

        product_expression: $ => prec.left(seq($._number, choice($.ident, $.simple_path, $.bracket_object))),

        unary_operation_prefix: $ => prec.left(PREC.PREFIX, seq(
            $.symbolic_operator_without_comparison,
            choice($._expression),
        )),
        unary_operation_postfix: $ => prec.left(PREC.POSTFIX, seq(
            $._expression,
            $.symbolic_operator_without_comparison,
        )),

        binary_operation: $ => prec.left(PREC.BINARY,
            seq(
                $._expression,
                $._all_operators,
                choice(
                    $._expression,
                    $.symbolic_operator_without_comparison
                )
            )
        ),

        algebra_operation: $ => choice(
            $.unary_operation_prefix,
            $.unary_operation_postfix,
            $.binary_operation,
        ),

        decorator: $ => prec.left(seq(
            '#',
            $._simple_expression,
        )),

        hash_tag_expression: $ => prec.left(seq(
            field('left', $.decorator),
            field('right', $._expression)
        )),

        range_expression: $ => prec.left(seq(
            $._simple_expression,
            choice('..', '...'),
            $._simple_expression,
        )),


        /**
         * =============================================================
         *                          spx
         * =============================================================
         */

        spx_opening_element: $ => prec.left(seq(
            '<',
            field('decorators', repeat($.decorator)),
            field('name', $._spx_element_name),
            repeat(field('attribute', $._spx_attribute)),
            '>'
        )),

        spx_closing_element: $ => prec.left(seq(
            '<',
            '/',
            field('name', $._spx_element_name),
            '>'
        )),

        spx_element: $ => prec.left(seq(
            field('open_tag', $.spx_opening_element),
            repeat($._spx_child),
            field('close_tag', $.spx_closing_element)
        )),

        spx_self_closing_element: $ => prec.left(seq(
            '<',
            field('decorators', repeat($.decorator)),
            field('name', $._spx_element_name),
            repeat(field('attribute', $._spx_attribute)),
            '/',
            '>'
        )),

        spx_fragment: $ => prec.left(seq('<', '>', repeat($._spx_child), '<', '/', '>')),

        spx_expression: $ => choice($.spx_element, $.spx_self_closing_element, $.spx_fragment),

        spx_text: $ => /[^{}<>]+/,

        _spx_child: $ => choice(
            $.spx_text,
            $.spx_expression,
            $.braces_object,
            $.statements_block,
        ),


        _spx_element_name: $ => choice(
            $.ident,
            $.simple_path,
            $.spx_dot_expression,
        ),

        spx_dot_expression: $ => prec.left(seq(
            field('value', $._spx_element_name),
            '.',
            field('field', choice(
                $.ident,
                )
            )
        )),

        _spx_inner_expression: $ => choice(
            $._literal,
            $.braces_object,
        ),

        _spx_optional_value: $ => seq(
            $._assign,
            field('value', $._spx_inner_expression)
        ),

        _spx_tty: $ => seq(
            ':',
            field('type', $._spx_inner_expression)
        ),

        spx_key_tty_value: $ => prec.left(seq(
            field('key', choice($.spread_element, $.ident, $.symbol)),
            field('type', optional($._spx_tty)),
            field('value', optional($._spx_optional_value))
        )),

        _spx_attribute: $ => choice(
            $.spx_key_tty_value,
        ),

        _expression: $ => prec.left(choice(
            $._simple_expression,
            $.hash_tag_expression,
            $.range_expression,
            $.product_expression,
            $.spx_expression,
            $.algebra_operation,
            $.functor_literal_signature,
            $.lambda_literal_expression,
            $.break_expression,
            $.continue_expression,
            $.return_expression,
            $.throw_expression,
            $.show_expression,
            $.yield_expression,
            $.do_expression,
            $._expression_ending_with_block,
        )),

        type_annotation: $ => prec.left(seq(
            $.ident,
            field('tty', optional($._tty))
        )),

        _pattern: $ => choice(
            prec(1, $.type_annotation),
            $.object_pattern,
            $.square_object,
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
            field('object', choice($.braces_object, $.bracket_object)),
        ),
        _declarative_pattern: $ => choice(
            prec(1, $.exportable_type_annotation),
            $.object_pattern,
            $.square_object,
        ),

        _optional_value: $ => seq(
            choice($._assign),
            field('value', $._expression)
        ),

        _optional_value_ktv: $ => seq(
            choice($._assign, $._arrow),
            field('value', $._expression)
        ),

        variable_declaration: $ => seq(
            choice('let', 'const'),
            field('pattern', $._declarative_pattern),
            choice(
                seq(
                    optional($._optional_value),
                    ';'
                ),
                seq('=', choice($._expression_ending_with_block, $.build, $.braces_object)),
            ),
        ),

        empty_statement: $ => ';',


        functor_literal_expression: $ => prec.left(seq(
            field('header',
                seq(
                    field('header_1', choice($.ident, $.simple_path)),
                    optional(field('header_2', choice(seq(optional($.export_sign), $.ident), $.simple_path)))
                )
            ),
            field('domain', $.bracket_object),
            field('codomain', optional($._tty)),
            field('wheres', repeat($.where_expression)),
            field('body', $.statements_block),
        )),

        where_expression: $ => prec.left(seq('where', $._expression)),

        functor_literal_signature: $ => prec.left(
            seq(
                field('header', field('tty', choice($.ident, $.simple_path))),
                field('domain', $.bracket_object),
                choice(
                    seq(
                        field('codomain', $._tty),
                        field('wheres', repeat($.where_expression)),
                    ),
                    field('wheres', repeat1($.where_expression)),
                ),
            ),
        ),

        lambda_literal_expression: $ => prec.left(seq(
            field('header',
                choice(
                    field('domain', choice($.ident, $.bracket_object)),
                    seq(
                        field('name', $.ident),
                        field('domain', choice($.bracket_object)),
                    )
                )),
            field('codomain', optional($._tty)),
            $._arrow,
            field('body', $._expression),
        )),

        _declaration_statement: $ => choice(
            $.variable_declaration,
        ),

        label: $ => $.symbol,

        index_expression: $ => prec.left(seq($._simple_expression, $.square_object)),


        assignment_statement: $ => prec.left(seq(
            field('left', $._expression),
            $._assign,
            field('right', $._expression),
            ';'
        )),

        expression_block: $ => prec.left(seq(
            field('label', optional(seq($.label, "[:]"))),
            field('decorators', repeat($.decorator)),
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

        match_expression: $ => prec.left(
            seq(
                'match',
                seq(
                    field('value', $._expression),
                    field('body', $.braces_object)
                )
            )
        ),


        while_expression: $ => prec.left(seq(
            'while',
            field('condition', $._expression),
            field('body', $.statements_block)
        )),

        functor_without_arguments: $ => prec.left(PREC.FUNCTOR_WITHOUT_ARGUMENTS, seq(
            field('header',
                seq(
                    choice($.ident, $.simple_path),
                    optional(seq(optional($.export_sign), $.ident))
                )
            ),
            field('body', $.statements_block)
        )),

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

        for_expression: $ => prec.left(seq(
            'for',
            field('pattern', $._pattern),
            'of',
            field('value', $._expression),
            field('body', $.statements_block)
        )),

        if_expression: $ => prec.left(seq(
            'if',
            field('condition', $._expression),
            field('consequence', $.statements_block),
            optional($._else_tail)
        )),


        _else_tail: $ => prec.left(seq(
            'else',
            field('alternative', choice(
                $.statements_block,
                $.if_expression,
            ))
        )),

        try_expression: $ => prec.left(PREC.TRY_EXPRESSION, seq(
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

        break_expression: $ => prec.left(
            seq('break',
                optional($._expression)
            )
        ),
        use_tree: $ => prec.left(choice(
            $.ident,
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
        )),
        _use_tree_tail: $ => seq(
            '{',
            sepBy1(',', $.use_tree),
            optional(','),
            '}'
        ),

        use_declaration: $ => prec.left(seq(
            field('decorators', repeat($.decorator)),
            'use',
            optional(seq($.ident, $.bracket_object, "::")),
            choice($.use_tree, $._use_tree_tail),
            ';'
        )),

        continue_expression: $ => prec.left(seq('continue', optional($.label))),

        return_expression: $ => prec.left(seq(
            'return',
            optional($._expression),
        )),

        throw_expression: $ => prec.left(seq(
            'throw',
            $._expression,
        )),

        show_expression: $ => prec.left(seq(
            'show',
            $._expression,
        )),

        yield_expression: $ => prec.left(seq(
            'yield',
            optional($._expression),
        )),

        do_expression: $ => prec.left(seq('do', $._expression),),

        _expression_ending_with_block: $ => choice(
            $.statements_block,
            $.if_expression,
            $.match_expression,
            $.while_expression,
            $.for_expression,
            $.functor_without_arguments,
            $.try_expression,
            $.functor_literal_expression,
            $.object_declaration,
        ),

        _statement: $ => choice(
            $.empty_statement,
            $._expression_statement,
            $._declaration_statement,
            $.assignment_statement,
            $.use_declaration,
        ),

    }
});

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

//TODO: try/catch
//TODO: binding pattern text spx, object support number string and a.c.d.c.d, binding custom name
//TODO: Composite assignation
//TODO: use
//TODO: DOCUMENTATION

// TODO SPX binding, asd.asdas.asd  ::sadasd, asd[]
// TODO .+(), .+.(-> Number, .[*-{x, y}] )
// if x ==.(->Short, .[size]) y {
// }

