(symbol) @symbol
(char_literal) @character
(escape_sequence) @character
(decimal_literal(fraction_literal (arabic_natural_number) @natural_number))
(natural_number ) @natural_number
(natural_fraction_literal ) @natural_number

"on" @keyword
"is" @keyword
"not" @keyword
"morphs" @keyword
"becomes" @keyword
"then" @keyword
"and" @keyword
"or" @keyword
"if" @keyword
"else" @keyword
"while" @keyword
"where" @keyword
"return" @keyword
"yield" @keyword
"use" @keyword
"do" @keyword
"throw" @keyword
"match" @keyword
"try" @keyword
"catch" @keyword
(binding "@" @keyword)
"show" @keyword
"let" @keyword
"const" @keyword
"for" @keyword
"of" @keyword
(boolean_literal) @keyword


(escaped_string_literal "`" @string)
(escaped_string_literal (string_start) @string)
(escaped_string_literal (string_content) @string)

(raw_string_literal (string_start) @string)
(raw_string_literal (internal_string_content) @string)

(raw_string_literal "`" @string)


(spx_expression (spx_element (spx_text) @string))
(spx_expression (spx_fragment (spx_text) @string))

(object_key) @key




(line_comment) @comment
(block_comment) @comment


(natural_unit_suffix) @number_suffix
(fractional_unit_suffix) @number_suffix


"!" @keyword.operator
"?" @keyword.operator
"~" @keyword.operator
"|"  @keyword.operator
"&"  @keyword.operator
"∘"  @keyword.operator
"->"  @keyword.operator
"|>"  @keyword.operator
"≠"  @keyword.operator
"!="  @keyword.operator
"~="  @keyword.operator
"=="  @keyword.operator
"≤"  @keyword.operator
"<="  @keyword.operator
"≥"  @keyword.operator
">="  @keyword.operator
(algebra_operation (* ">" @keyword.operator))
(algebra_operation (* "<" @keyword.operator))

(decorator) @decorator

(document (doc_fragment "--" @document))
(document (doc_fragment (spx_text) @document))

;; Use make_compiler_hofs.js to generate this string

(all_operators_preprocessor) @operator
(ambiguous_operator) @operator
(operator_as_expression) @operator

(object_declaration header:(*) @hof)
(functor_literal_expression header:(*) @hof)
(functor_without_arguments header:(*) @hof)

"{" @delimiter
"}" @delimiter
";" @delimiter
"," @delimiter
"(" @delimiter
")" @delimiter
"[" @delimiter
"]" @delimiter
":" @delimiter
"." @delimiter
(template_substitution)
(document (doc_fragment "<" @delimiter))
(document (doc_fragment "/" @delimiter))
(document (doc_fragment ">" @delimiter))
(spx_opening_element "<" @delimiter)
(spx_opening_element ">" @delimiter)
(spx_closing_element "<" @delimiter)
(spx_closing_element ">" @delimiter)
(spx_closing_element "/" @delimiter)
(spx_self_closing_element "/" @delimiter)
(spx_self_closing_element "<" @delimiter)
(spx_self_closing_element "<" @delimiter)
(spx_fragment "<" @delimiter)
(spx_fragment ">" @delimiter)
(spx_fragment "/" @delimiter)
(angle_object "<" @delimiter)
(angle_object ">" @delimiter)
(assign) @delimiter
(simple_path "::" @delimiter)
(only_export_label "::" @delimiter)
(only_export_label ":" @delimiter)
(label "::" @delimiter)
(label ":" @delimiter)
(arrow) @delimiter.special
(currency) @currency
