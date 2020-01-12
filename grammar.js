const PREC = {
    EXP: 5,
    SIMPLE_EXPRESSION: 6,
    KEY_TTY_VALUE: 120,
    TERNARY: 2,
    UNARY: 12,
    PIPE: 9,
    BINARY: 10,
    CALL: 20,
    BUILD: 21,
    FUNCTOR_WITHOUT_ARGUMENTS: -10,
    DOT: 40,
    DECORATOR: 100,
    RANGE: -1,
    DECIMAL: 80,
    DO_STATEMENT: 500,
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
        [$._simple_expression, $.for_expression],
        [$._simple_expression, $._expression_ending_with_block],
        [$._simple_expression, $.lambda_literal_expression],
        [$._tty, $.algebra_operation],
        [$._simple_expression, $.functor_without_arguments],
        [$._simple_expression, $.functor_literal_signature, $.lambda_literal_expression],
        [$._simple_expression, $.functor_literal_signature],
        [$._simple_expression, $._expression],
        [$.hash_tag_expression, $._expression_statement],
        [$._simple_expression, $.try_call],
        [$.simple_path, $.functor_without_arguments],
        [$._simple_expression, $._expression, $.expression_block],
        [$._simple_expression, $.expression_block],
        [$.hash_tag_expression, $.expression_block],
        [$._expression, $.expression_block],
        [$.key_tty_value, $._simple_expression, $.functor_literal_signature],
        [$._simple_expression_without_braces, $.functor_literal_signature],
        [$._simple_expression, $._simple_expression_without_braces],
        [$.bracket_object, $.bracket_object_without_braces],
        [$._simple_expression, $._simple_expression_without_braces, $.functor_literal_signature],
        [$.bracket_object, $._inner_object_without_braces],
        [$._expression, $._expression_without_braces],
        [$._tty, $.algebra_operation_without_braces],
        [$.square_object, $.square_object_without_braces],
        [$.algebra_operation_without_braces],
        [$.algebra_operation_without_braces, $._tty_without_braces],
        [$.natural_number, $.object_key],
        [$.object_key, $._simple_expression],
        [$.object_key, $.lambda_literal_expression],
        [$.object_key, $._literal],
        [$.object_key, $._simple_expression_without_braces],
        [$._simple_expression_without_braces, $.lambda_literal_expression],
        [$._simple_expression, $._simple_expression_without_braces, $.functor_literal_signature, $.lambda_literal_expression],
        [$.object_key, $.object_key_dot],
        [$.object_key, $.exportable_type_annotation],

        [$.object_key, $._simple_expression, $._simple_expression_without_braces],
        [$.object_key, $._simple_expression_without_braces, $.functor_literal_signature],
        [$.object_key, $._simple_expression, $._simple_expression_without_braces, $.functor_literal_signature, $.lambda_literal_expression],
        [$._simple_expression_without_braces, $.key_tty_value_without_braces],
        [$._simple_expression, $._simple_expression_without_braces, $.key_tty_value_without_braces],
        [$.key_tty_value_without_braces, $._simple_expression],
        [$.natural_number, $.fraction_literal, $.object_key],
        [$.spread_element, $.hash_tag_expression, $.expression_block],
        [$.spread_element, $.hash_tag_expression],
        [$.hash_tag_expression_without_braces, $.spread_element_without_braces],
        [$.spread_element, $.hash_tag_expression, $.hash_tag_expression_without_braces, $.spread_element_without_braces],


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
        $._ktv_tail,
        $._ktv_optional_value,
        $._ktv_optional_type,
        $._ktv_head,
        $._ktv_head_symbol,
        $._ktv_head_ident,
    ],

    rules: {

        source_file: $ => repeat($._statement),

        ident: $ => choice(
            token(/[a-zA-Zα-ωΑ-Ωµ_][a-zA-Zα-ωΑ-Ωµ\d_]*/),
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

        exclusive_binary_operator: $ => choice(
            '^',
            '%',
            '|',
            '/',
            '<<',
            '>>',
        ),

        exclusive_unary_operator: $ => choice(
            '!',
            '~',
            '?',
        ),

        ambiguous_unary_binary_operator: $ => choice(
            '&',
            '*',
            '+',
            '-',
            '¦',
            '§',
            '¢',
            '£',
            '¤',
            '¥',
            '$',
            '€',
            '฿',
            'Ƀ',
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
            'becomes'
        ),

        _all_operators: $ => choice(
            $.comparison_operator,
            $.exclusive_binary_operator,
            $.exclusive_unary_operator,
            $.ambiguous_unary_binary_operator,
            $.special_operator
        ),


        natual_unit_suffix: $ => choice(
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

        exponent: $ => seq('e', choice('+', '-'), $.arabic_natural_number),

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
        export_sign: $ => '.::',
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
            optional(field('suffix', seq('\'', $.natual_unit_suffix)))
        ),

        fraction_literal: $ => seq(
            field('numerator', $.arabic_natural_number),
            '.',
            field('denominator', $.arabic_natural_number),
            optional(field('suffix', seq('\'', choice($.natual_unit_suffix, $.fractional_unit_suffix))))
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

        spread_element: $ => seq(field('decorators', repeat($.decorator)), '...', $._simple_expression),

        object_key: $ => prec.left(choice(
            $.ident,
            $.arabic_natural_number,
            $.string_literal,
            $.object_key_index,
            $.object_key_dot,
        )),
        object_key_index: $ => prec.left(seq($.object_key, $.square_object_without_braces)),

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

        _ktv_optional_value: $ => seq(
            field('type', $._tty),
            field('value', optional($._optional_value))
        ),

        _ktv_optional_type: $ => seq(
            field('type', optional($._tty)),
            field('value', $._optional_value)
        ),

        _ktv_tail: $ => choice($._ktv_optional_value, $._ktv_optional_type),
        _ktv_head_symbol: $ => field('key', $.symbol),
        _ktv_head_ident: $ => seq(
            field('binding', optional(seq(
                choice('let', 'const'),
                field('rename', optional(seq('@', $.ident))),
            ))),
            field('key', choice($.object_key, $.spread_element))
        ),

        _ktv_head: $ => choice($._ktv_head_symbol, $._ktv_head_ident),

        key_tty_value: $ => seq(
            $._ktv_head,
            $._ktv_tail,
        ),

        _tty: $ => seq(':', $._expression),

        _inner_object: $ => seq(
            sepBy1(',', choice(
                $.key_tty_value,
                $._expression,
                seq($._all_operators, optional(seq('.', $.square_object_without_braces))),
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


        square_object: $ => seq(
            '[',
            sepBy(',', choice($._expression, $.spread_element)),
            optional(','),
            ']'
        ),

        bracket_object: $ => seq('(',
            optional($._inner_object),
            ')'
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
                $.arabic_natural_number
                )
            )
        )),

        call: $ => prec.left(seq(
            field('callee', $._simple_expression),
            field('arguments', $.bracket_object)
        )),

        build: $ => prec.left(PREC.BUILD, seq(
            field('constructor', $._simple_expression),
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
            //complex index
        ),

        product_expression: $ => prec.left(seq($._number, choice($.ident, $.simple_path, $.bracket_object))),


        algebra_operation: $ => prec.left(seq(
            choice(
                seq(
                    field('left', choice($.exclusive_unary_operator, $.ambiguous_unary_binary_operator)),
                    field('right', $._expression)
                ),
                seq(
                    field('left', $._expression),
                    field('right', choice($.exclusive_unary_operator, $.ambiguous_unary_binary_operator))
                ),
                seq(
                    field('left', $._expression),
                    field('center', $._all_operators),
                    field('right', $._expression),
                    field('final', optional(choice($.exclusive_unary_operator, $.ambiguous_unary_binary_operator))),
                ),
            ),
        )),

        decorator: $ => prec.left(seq(
            '#',
            $._simple_expression_without_braces,
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
            '=',
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
            $.lambda_literal_expression,
            $.functor_literal_signature,
            $.break_expression,
            $.continue_expression,
            $.return_expression,
            $.yield_expression,
            $.do_expression,
            $._expression_ending_with_block,
        )),

        /**
         * =============================================================
         *          expression without braces
         * =============================================================
         */

        dot_expression_without_braces: $ => prec.left(seq(
            field('value', $._simple_expression_without_braces),
            '.',
            field('field', choice(
                $.ident,
                $.string_literal,
                $.arabic_natural_number,
                )
            ),
        )),

        call_without_braces: $ => prec.left(seq(
            field('callee', $._simple_expression_without_braces),
            field('arguments', $.bracket_object_without_braces)
        )),

        index_expression_without_braces: $ => prec.left(seq($._simple_expression_without_braces, $.square_object_without_braces)),

        _simple_expression_without_braces: $ => choice(
            $.self_path,
            $._literal,
            $.ident,
            $.simple_path,
            $.dot_expression_without_braces,
            $.call_without_braces,
            $.symbol,
            $.bracket_object_without_braces,
            $.square_object_without_braces,
            $.index_expression_without_braces,
        ),

        range_expression_without_braces: $ => prec.left(seq(
            $._simple_expression_without_braces,
            choice('..', '...'),
            $._simple_expression_without_braces,
        )),

        algebra_operation_without_braces: $ => prec.left(seq(
            choice(
                seq(
                    field('left', choice($.exclusive_unary_operator, $.ambiguous_unary_binary_operator)),
                    field('right', $._expression_without_braces)
                ),
                seq(
                    field('left', $._expression_without_braces),
                    field('right', choice($.exclusive_unary_operator, $.ambiguous_unary_binary_operator))
                ),
                seq(
                    field('left', $._expression_without_braces),
                    field('center', $._all_operators),
                    field('right', $._expression_without_braces),
                    field('final', optional(choice($.exclusive_unary_operator, $.ambiguous_unary_binary_operator))),
                ),
            ),
        )),
        hash_tag_expression_without_braces: $ => prec.left(seq(
            field('left', $.decorator),
            field('right', $._expression_without_braces)
        )),

        spread_element_without_braces: $ => seq(field('decorators', repeat($.decorator)), '...', $._simple_expression_without_braces),
        value_without_braces: $ => prec.left(seq('=', $._expression_without_braces)),
        key_tty_value_without_braces: $ => prec.left(seq(
            field('key',
                choice($.object_key, $.symbol, $.spread_element_without_braces)
            ),
            field('type', optional($._tty_without_braces)),
            field('value', optional($.value_without_braces)),
        )),

        _inner_object_without_braces: $ => prec.left(seq(
            sepBy1(',', choice(
                $.key_tty_value_without_braces,
                $._expression_without_braces,
                seq($._all_operators, optional(seq('.', $.square_object_without_braces))),
            )),
            optional(',')
        )),

        bracket_object_without_braces: $ => seq(
            '(',
            optional($._inner_object_without_braces),
            ')'
        ),

        square_object_without_braces: $ => seq(
            '[',
            sepBy(',', choice($._expression_without_braces, $.spread_element_without_braces)),
            optional(','),
            ']'
        ),

        _tty_without_braces: $ => prec.left(seq(':', $._expression_without_braces)),

        _expression_without_braces: $ => prec.left(choice(
            $._simple_expression_without_braces,
            $.hash_tag_expression_without_braces,
            $.range_expression_without_braces,
            $.product_expression,
            $.algebra_operation_without_braces,
            $.functor_literal_signature,
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
            '=',
            field('value', $._expression)
        ),


        variable_declaration: $ => seq(
            choice('let', 'const'),
            field('pattern', $._declarative_pattern),
            optional($._optional_value),
            ';'
        ),

        empty_statement: $ => ';',


        functor_literal_expression: $ => prec.left(seq(
            field('header',
                seq(
                    field('tty', choice($.ident, $.simple_path)),
                    field('name', choice(seq(optional($.export_sign), $.ident), $.simple_path))
                )
            ),
            field('domain', $.bracket_object),
            field('codomain', optional($._tty_without_braces)),
            field('body', $.statements_block),
        )),


        functor_literal_signature: $ => prec.left(
            seq(
                field('header', field('tty', choice($.ident, $.simple_path))),
                field('domain', $.bracket_object),
                field('codomain', $._tty_without_braces),
            ),
        ),

        lambda_literal_expression: $ => prec.left(seq(
            field('name', optional($.ident)),
            field('domain', choice($.ident, $.symbol, $.bracket_object)),
            field('codomain', optional($._tty_without_braces)),
            '=>',
            field('body', $._expression),
        )),

        _declaration_statement: $ => choice(
            $.variable_declaration,
        ),

        label: $ => seq(`'`, $.ident),

        index_expression: $ => prec.left(seq($._simple_expression, $.square_object)),


        assignment_statement: $ => prec.left(seq(
            field('left', $._expression),
            '=',
            field('right', $._expression),
            ';'
        )),

        expression_block: $ => prec.left(seq(
            field('label', optional($.label)),
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

        try_call: $ => prec.left(
            seq(
                choice(
                    'try',
                ),
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

        try_expression: $ => prec.left(seq(
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
                optional(choice($.label, $._expression))
            )
        ),

        continue_expression: $ => prec.left(seq('continue', optional($.label))),

        return_expression: $ => prec.left(seq(
            'return',
            optional($._expression),
        )),

        yield_expression: $ => prec.left(seq(
            'yield',
            optional($._expression),
        )),

        do_expression: $ => prec.left(
            seq('do',
                choice($.label, $._expression),
            )
        ),

        _expression_ending_with_block: $ => choice(
            $.statements_block,
            $.if_expression,
            $.match_expression,
            $.while_expression,
            $.for_expression,
            $.functor_without_arguments,
            $.try_expression,
            $.functor_literal_expression,
        ),

        _statement: $ => choice(
            $.empty_statement,
            $._expression_statement,
            $._declaration_statement,
            $.assignment_statement,
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
