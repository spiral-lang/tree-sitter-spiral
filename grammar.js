const PREC = {
    EXP: 5,
    UNARY_EXP: 6,
    KV_PAIR: 1,
    TERNARY: 2,
    UNARY: 12,
    PIPE: 9,
    BINARY: 10,
    CALL: 20,
    BUILD: 21,
    BRACES_OBJECT: 50,
    STMT_BLOCK: 25,
    FIELD: 40,
    DECORATOR: 100,
    RANGE: -1,
    DECIMAL: 80,
};

module.exports = grammar({
    name: 'spiral',

    externals: $ => [
        $._string_content,
    ],

    extras: $ => [/\s/],

    supertypes: $ => [
        $._expr,
        $._literal,
        $._declaration_statement,
        $._pattern,
    ],

    inline: $ => [
        $._declaration_statement,
        $._expression_ending_with_block
    ],

    rules: {
        source_file: $ => repeat($._statement),
        ident: $ => token(/[a-zA-Zα-ωΑ-Ωµ_$][a-zA-Zα-ωΑ-Ωµ\d_$]*/),
        simple_path: $ => seq(
            choice($.ident, $.simple_path),
            '::',
            $.ident
        ),
        _unary_operator: $ => token.immediate(choice(
            "!",
            "-",
            "~",
            "?",
            '+',
            '*'
        )),

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
        fraction_literal: $ => prec(PREC.DECIMAL, seq(
            field('numerator', $.arabic_natural_number),
            '.',
            field('denominator', $.arabic_natural_number),
            optional(field('suffix', seq('\'', choice($.natual_unit_suffix, $.fractional_unit_suffix))))
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
        string_literal: $ => seq(
            /b?`/,
            repeat(choice(
                $.escape_sequence,
                $.template_substitution,
                $._string_content
            )),
            token.immediate('`')
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
            choice($._expr, $.kv_pair),
            '}'
        ),
        block: $ => prec(PREC.STMT_BLOCK, seq(
            '{',
            repeat($._statement),
            optional($._expr),
            '}'
        )),

        kv_pair: $ => prec(PREC.KV_PAIR, seq($.ident, optional($.kv_type), optional($._optional_value))),
        kv_type: $ => seq(':', $._expr),
        _inner_object: $ => seq(
            sepBy1(',', choice(
                $._expr,
                $.kv_pair
            )),
        ),

        braces_object: $ => prec(PREC.BRACES_OBJECT, seq(
            '{',
            optional($._inner_object),
            '}')),
        square_object: $ => seq('[',
            optional($._inner_object),
            ']'),
        bracket_object: $ => seq('(',
            optional($._inner_object),
            ')'),
        _number: $ => choice($.natural_number, $.decimal_literal),
        boolean_literal: $ => choice('true', 'false'),

        _literal: $ => choice(
            $._number,
            $.char_literal,
            $.string_literal,
            $.boolean_literal,
        ),

        dot_expression: $ => prec(PREC.FIELD, seq(
            field('value', $._unary_expr),
            '.',
            field('field', choice(
                $.ident,
                $.string_literal,
                $.arabic_natural_number
                )
            )
        )),

        function_call: $ => prec(PREC.CALL, seq(
            field('callee', $._unary_expr),
            field('arguments', $.bracket_object)
        )),

        build_expr: $ => prec(PREC.BUILD, seq(
            field('constructor', $._unary_expr),
            field('arguments', $.braces_object)
        )),

        _unary_expr: $ => prec(PREC.UNARY_EXP, choice(
            $._literal,
            $.square_object,
            $.braces_object,
            $.ident,
            $.simple_path,
            $.dot_expression,
            $.function_call,
            //$.unary_operation,
            $.group_expression,
            $.build_expr,
            $.index_expression,
        )),

        unary_operation: $ => prec(PREC.UNARY, seq(
            $._unary_operator,
            $._unary_expr
        )),

        binary_operation: $ => prec.right(PREC.BINARY, seq(
            field('left', choice($._unary_expr, $.binary_operation)),
            '\s+',
            field('operator', $._binary_operator),
            '\s+',
            field('right', $._unary_expr),
        )),
        pipe_operation: $ => prec.right(PREC.PIPE, seq(
            field('left', choice($._unary_expr, $.pipe_operation)),
            '|>',
            field('right', $._unary_expr),
        )),
        _binary_expr: $ => choice($.binary_operation, $.pipe_operation),
        group_expression: $ => seq(
            '(',
            optional($._expr),
            ')'
        ),
        _number_sign_without_leading_whitespace: $ => token.immediate("#"),

        decorator: $ => prec(PREC.DECORATOR, seq(
            '#',
            choice(
                $.ident,
                $.dot_expression,
                $.simple_path,
                $.function_call,
            )
        )),

        hash_tag_expression: $ => prec(PREC.DECORATOR, seq(
            field('header', repeat1($.decorator)),
            field('expression', $._unary_expr)
        )),

        _expr: $ => prec(
            PREC.EXP,
            choice(
                $._unary_expr,
                $._binary_expr,
                $.ternary_expression,
                $.hash_tag_expression,
                $.range_expression
            )
        ),
        range_expression: $ => prec.left(PREC.RANGE, choice(
            seq($._unary_expr, choice('..', '...'), $._unary_expr),
        )),
        type_annotation: $ => seq(
            $.ident,
            ":",
            $._expr
        ),

        _pattern: $ => choice(
            $.type_annotation,
            $.braces_object,
            $.square_object,
        ),

        _optional_value: $ => seq(
            '=',
            field('value', $._expr)
        ),

        ternary_expression: $ => prec.right(PREC.TERNARY, seq(
            field('condition', $._expr),
            '?',
            field('consequence', $._expr),
            ':',
            field('alternative', $._expr)
        )),

        variable_declaration: $ => seq(
            choice('let', 'const'),
            field('pattern', $._pattern),
            optional($._optional_value),
            ';'
        ),

        functor_declaration: $ => seq(
            repeat($.decorator),
            choice($.ident, $.simple_path),
            choice($.ident, $.simple_path),
            $.functor_literal),

        empty_statement: $ => ';',

        _expression_statement: $ => choice(
            seq($._expr, ';'),
            prec(1, $._expression_ending_with_block)
        ),

        functor_literal_signature: $ => seq(
            field('domain', $.functor_domain),
            optional(seq(':', field('codomain', $._expr))),
            ';'
        ),

        functor_literal_item: $ => seq(
            field('domain', $.functor_domain),
            optional(seq(':', field('codomain', $._expr))),
            field('body', $.block),
        ),

        lambda_literal_item: $ => seq(
            field('domain', $.functor_domain),
            optional(seq(':', field('codomain', $._expr))),
            '=>',
            field('return', $._expr),
            ';',
        ),
        functor_literal: $ => choice($.functor_literal_signature, $.functor_literal_item, $.lambda_literal_item),
        functor_domain: $ => seq('(', sepBy(',', $.kv_pair), ')'),

        _declaration_statement: $ => choice(
            $.variable_declaration,
            $.empty_statement,
            $.functor_declaration,
        ),
        label: $ => seq(`'`, $.ident),

        for_expression: $ => seq(
            optional(seq($.label, ':')),
            'for',
            field('pattern', $._pattern),
            'in',
            field('value', $._expr),
            field('body', $.block)
        ),

        while_expression: $ => seq(
            optional(seq($.label, ':')),
            'while',
            field('condition', $._expr),
            field('body', $.block)
        ),

        while_let_expression: $ => seq(
            optional(seq($.label, ':')),
            'while',
            'let',
            field('pattern', $._pattern),
            '=',
            field('value', $._expr),
            field('body', $.block)
        ),
        match_expression: $ => seq(
            'match',
            field('value', $._expr),
            field('body', $.braces_object)
        ),
        break_statement: $ => seq('break', optional(choice($.label, $._expr)), ';'),
        continue_statement: $ => seq('continue', optional($.label), ';'),
        index_expression: $ => prec(PREC.CALL, seq($._expr, '[', $._expr, ']')),
        do_statement: $ => seq('do', choice(seq(choice($.label, $._expr), ';'), $.block)),
        if_expression: $ => seq(
            'if',
            field('condition', $._expr),
            field('consequence', $.block),
            optional($._else_tail)
        ),

        if_let_expression: $ => seq(
            'if',
            'let',
            field('pattern', $._pattern),
            '=',
            field('value', $._expr),
            field('consequence', $.block),
            optional($._else_tail)
        ),

        _else_tail: $ => seq(
            'else',
            field('alternative', choice(
                $.block,
                $.if_expression,
                $.if_let_expression
            ))
        ),
        return_statement: $ => seq(
            'return',
            optional($._expr),
            ';'
        ),

        assignment_statement: $ => seq(
            field('left', $._expr),
            '=',
            field('right', $._expr),
            ';'
        ),

        _expression_ending_with_block: $ => choice(
            $.block,
            $.if_expression,
            $.if_let_expression,
            $.match_expression,
            $.while_expression,
            $.while_let_expression,
            $.for_expression
        ),

        _statement: $ => choice(
            $._expression_statement,
            $._declaration_statement,
            $.break_statement,
            $.continue_statement,
            $.return_statement,
            $.assignment_statement,
            $.do_statement,
        ),

    }
})
;

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
//TODO: comments
//TODO: DOCUMENTATION
