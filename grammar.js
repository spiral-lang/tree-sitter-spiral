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
        [$.pipe_operation, $.build],
        [$.decorator, $.build],
        [$._expr, $.build],
        [$.range_expression, $.build],
        [$.binary_operation, $._expr],
        [$.binary_operation, $.build],
        [$.decorator, $.call],
        [$.unary_operation, $.build],
        [$.unary_operation, $._expr],
        [$.unary_operator, $._binary_operator],
        [$.decorator, $.index_expression],
        [$.ternary_expression, $.unary_operator],
        [$.ternary_expression, $.build],
        [$.ternary_expression, $.binary_operation],

        [$.hash_tag_expression, $.functor_declaration],
        [$.hash_tag_expression, $.ternary_expression],


    ],
    extras: $ => [/\s/, $.line_comment, $.block_comment],

    supertypes: $ => [
        $._expr,
        $._literal,
        $._declaration_statement,
        $._pattern,
    ],

    inline: $ => [
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
        $._binary_expr,
    ],

    rules: {

        source_file: $ => repeat($._statement),

        ident: $ => token(/[a-zA-Zα-ωΑ-Ωµ_][a-zA-Zα-ωΑ-Ωµ\d_]*/),

        symbol: $ => seq('$', $.ident),

        simple_path: $ => seq(
            choice($.ident, $.simple_path),
            '::',
            $.ident
        ),

        self_path: $ => token(seq('::', caseInsensitive('self'))),


        unary_operator: $ => choice(
            "!",
            "-",
            "~",
            "?",
            '+',
            '*',
            '&',
        ),

        _binary_operator: $ => choice(
            "^",
            "≠",
            "!=",
            "~=",
            "=>",
            "==",
            "%",
            "&",
            "∘",
            "|",
            "*",
            "+",
            "-",
            "≤",
            "<=",
            "≥",
            ">=",
            "/",
            "÷",
            "<",
            ">",
            '<<',
            '>>',
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
            "M",
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
            "a",
            'z',
            'y',
            $.exponent,
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
            choice($._expr, $.key_tty_value),
            '}'
        ),

        spread_element: $ => seq('...', $._simple_expression),

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
            field('binding', optional(choice('@', '@let', '@const'))),
            field('key', choice($.ident, $.spread_element))
        ),

        _ktv_head: $ => choice($._ktv_head_symbol, $._ktv_head_ident),

        key_tty_value: $ => seq(
            $._ktv_head,
            $._ktv_tail,
        ),

        _tty: $ => seq(':', $._expr),

        _inner_object: $ => seq(
            sepBy1(',', choice(
                $.key_tty_value,
                $._expr,
            )),
            optional(',')
        ),

        braces_object: $ => seq(
            '{',
            optional($._inner_object),
            '}'
        ),

        statements_block: $ => seq(
            '{',
            repeat($._statement),
            optional($._expr),
            '}'
        ),

        square_object: $ => seq('[',
            sepBy(',', $._expr),
            optional(','),
            ']'),

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

        dot_expression: $ => seq(
            field('value', $._simple_expression),
            '.',
            field('field', choice(
                $.ident,
                $.string_literal,
                $.arabic_natural_number
                )
            )
        ),

        call: $ => seq(
            field('callee', $._simple_expression),
            field('arguments', $.bracket_object)
        ),

        build: $ => seq(
            field('constructor', $._simple_expression),
            field('arguments', $.braces_object)
        ),


        unary_operation: $ => choice(
            seq(
                field('left', $.unary_operator),
                field('right', $._simple_expression)
            ),
            seq(field('left', $._simple_expression),
                field('right', $.unary_operator))
        ),


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
        ),

        product_expression: $ => seq($._number, choice($.ident, $.simple_path, $.bracket_object)),

        binary_operation: $ => seq(
            field('left', choice($._simple_expression, $.binary_operation, $.product_expression, $.unary_operation)),
            field('operator', $._binary_operator),
            field('right', choice($._simple_expression, $.product_expression)),
        ),

        pipe_operation: $ => seq(
            field('left', choice($._simple_expression, $.pipe_operation)),
            '|>',
            field('right', $._simple_expression),
        ),

        _binary_expr: $ => choice($.binary_operation, $.pipe_operation),


        decorator: $ => seq(
            '#',
            $._simple_expression
        ),

        hash_tag_expression: $ => seq(
            field('left', $.decorator),
            field('right', $._expr)
        ),

        range_expression: $ => seq(
            $._simple_expression,
            choice('..', '...'),
            $._simple_expression,
        ),


        /**
         * =============================================================
         *                          spx
         * =============================================================
         */

        spx_opening_element: $ => seq(
            '<',
            field('decorators', repeat($.decorator)),
            field('name', $._spx_element_name),
            repeat(field('attribute', $._spx_attribute)),
            '>'
        ),

        spx_closing_element: $ => seq(
            '<',
            '/',
            field('name', $._spx_element_name),
            '>'
        ),

        spx_element: $ => seq(
            field('open_tag', $.spx_opening_element),
            repeat($._spx_child),
            field('close_tag', $.spx_closing_element)
        ),

        spx_self_closing_element: $ => seq(
            '<',
            field('decorators', repeat($.decorator)),
            field('name', $._spx_element_name),
            repeat(field('attribute', $._spx_attribute)),
            '/',
            '>'
        ),

        spx_fragment: $ => seq('<', '>', repeat($._spx_child), '<', '/', '>'),

        spx_expression: $ => choice($.spx_element, $.spx_self_closing_element, $.spx_fragment),

        spx_text: $ => /[^{}<>]+/,

        _spx_child: $ => choice(
            $.spx_text,
            $.spx_expression,
            $.braces_object
        ),


        _spx_element_name: $ => choice(
            $.ident,
            $.simple_path,
            $.spx_dot_expression,
        ),

        spx_dot_expression: $ => seq(
            field('value', $._spx_element_name),
            '.',
            field('field', choice(
                $.ident,
                )
            )
        ),

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

        spx_key_tty_value: $ => seq(
            field('decorators', repeat($.decorator)),
            field('key', choice($.spread_element, $.ident, $.symbol)),
            field('type', optional($._spx_tty)),
            field('value', optional($._spx_optional_value))
        ),

        _spx_attribute: $ => choice(
            $.spx_key_tty_value,
        ),

        _expr: $ => choice(
            $._simple_expression,
            $._binary_expr,
            $.ternary_expression,
            $.hash_tag_expression,
            $.range_expression,
            $.product_expression,
            $.spx_expression,
            $.unary_operation
        ),


        annotated_ident: $ => seq(
            alias(optional('::'), $.export_ident),
            $.ident,
            field('tty', optional($._tty)),
        ),

        _pattern: $ => choice(
            $.annotated_ident,
            $.braces_object,
            $.square_object,
            $.bracket_object,
        ),

        _optional_value: $ => seq(
            '=',
            field('value', $._expr)
        ),


        ternary_expression: $ => seq(
            field('condition', choice(
                $._simple_expression,
                $._binary_expr,
                $.product_expression,
                $.unary_operation)
            ),
            '?',
            field('consequence', choice(
                $._simple_expression,
                $._binary_expr,
                $.product_expression,
                $.unary_operation,
                $.spx_expression
            )),
            ':',
            field('alternative', choice(
                $._simple_expression,
                $._binary_expr,
                $.product_expression,
                $.unary_operation,
                $.spx_expression
                )
            )
        ),

        variable_declaration: $ => seq(
            choice('let', 'const'),
            field('pattern', $._pattern),
            optional($._optional_value),
            ';'
        ),

        functor_declaration: $ => prec(PREC.EXP, seq(
            repeat($.decorator),
            choice($.ident, $.simple_path),
            choice($.ident, $.simple_path),
            $.functor_literal)
        ),

        empty_statement: $ => ';',

        functor_literal_signature: $ => seq(
            field('domain', $.functor_domain),
            optional(seq(':', field('codomain', $._expr))),
            ';'
        ),

        functor_literal_item: $ => seq(
            field('domain', $.functor_domain),
            optional(seq(':', field('codomain', $._expr))),
            field('body', $.statements_block),
        ),

        lambda_literal_item: $ => seq(
            field('domain', $.functor_domain),
            optional(seq(':', field('codomain', $._expr))),
            '=>',
            field('return', $._expr),
            ';',
        ),

        functor_literal: $ => choice($.functor_literal_signature, $.functor_literal_item, $.lambda_literal_item),

        functor_domain: $ => seq('(', sepBy(',', $.key_tty_value), ')'),

        _declaration_statement: $ => choice(
            $.variable_declaration,
            $.functor_declaration,
        ),

        label: $ => seq(`'`, $.ident),

        for_expression: $ => seq(
            optional(seq($.label, ':')),
            'for',
            field('pattern', $._pattern),
            'in',
            field('value', $._expr),
            field('body', $.statements_block)
        ),

        while_expression: $ => seq(
            optional(seq($.label, ':')),
            'while',
            field('condition', $._expr),
            field('body', $.statements_block)
        ),

        while_let_expression: $ => seq(
            optional(seq($.label, ':')),
            'while',
            'let',
            field('pattern', $._pattern),
            '=',
            field('value', $._expr),
            field('body', $.statements_block)
        ),
        match_expression: $ => seq(
            'match',
            field('value', $._expr),
            field('body', $.braces_object)
        ),
        break_statement: $ => seq('break', optional(choice($.label, $._expr)), ';'),

        continue_statement: $ => seq('continue', optional($.label), ';'),

        index_expression: $ => seq($._simple_expression, '[', $._expr, ']'),

        do_statement: $ => prec(PREC.DO_STATEMENT, seq('do', choice(seq(choice($.label, $._expr), ';'), $.statements_block))),

        if_expression: $ => seq(
            'if',
            field('condition', $._expr),
            field('consequence', $.statements_block),
            optional($._else_tail)
        ),

        if_let_expression: $ => seq(
            'if',
            'let',
            field('pattern', $._pattern),
            '=',
            field('value', $._expr),
            field('consequence', $.statements_block),
            optional($._else_tail)
        ),

        _else_tail: $ => seq(
            'else',
            field('alternative', choice(
                $.statements_block,
                $.if_expression,
                $.if_let_expression
            ))
        ),
        return_statement: $ => seq(
            'return',
            optional($._expr),
            ';'
        ),
        yield_statement: $ => seq(
            'yield',
            optional($._expr),
            ';'
        ),

        assignment_statement: $ => seq(
            field('left', $._expr),
            '=',
            field('right', $._expr),
            ';'
        ),
        _expression_statement: $ => choice(
            seq($._expr, ';'),
            prec(1, $._expression_ending_with_block)
        ),

        _expression_ending_with_block: $ => choice(
            $.statements_block,
            $.if_expression,
            $.if_let_expression,
            $.match_expression,
            $.while_expression,
            $.while_let_expression,
            $.for_expression
        ),

        _statement: $ => choice(
            $.empty_statement,
            $._expression_statement,
            $._declaration_statement,
            $.break_statement,
            $.continue_statement,
            $.return_statement,
            $.yield_statement,
            $.assignment_statement,
            $.do_statement,
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
//TODO: binding pattern
//TODO: Composite assignation
//TODO: hashtag expression
//TODO: use
//TODO: investigate label
//TODO: module
//TODO: DOCUMENTATION
