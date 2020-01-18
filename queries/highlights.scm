(symbol) @symbol
(char_literal) @character
(escape_sequence) @character
(arabic_natural_number) @natural_number
(octal_natural_number) @natural_number
(hexadecimal_natural_number) @natural_number
(binary_natural_number) @natural_number


"if" @keyword
"else" @keyword
"while" @keyword
"where" @keyword
"return" @keyword
"use" @keyword
"do" @keyword
"throw" @keyword
(special_operator) @keyword
(comparison_operator) @keyword
"on" @keyword
"becomes" @keyword
"match" @keyword
"try" @keyword
"catch" @keyword
"@" @keyword
"show" @keyword
"let" @keyword
"const" @keyword
"yield" @keyword
"for" @keyword
"of" @keyword
(boolean_literal) @keyword
(self_path) @keyword

(string_content) @string
(string_limitier) @string
(spx_expression (spx_element (spx_text) @string))
(spx_expression (spx_fragment (spx_text) @string))


(object_key) @key
(spx_key) @key


(natural_unit_suffix) @number_suffix
(fractional_unit_suffix) @number_suffix

(line_comment) @comment
(block_comment) @comment

"::" @delimitier.path
(ambiguous_unary_binary_operator) @operator

(assign) @delimitier.assign
(arrow) @delimitier.arrow

;; Use make_compiler_hofs.js to generate this string


((variable_declaration   value: (ident) @ident.hof.compiler)
  (match? @ident.hof.compiler "_*[tT]_*[hH]_*[eE]_*[oO]_*[rR]_*[yY]_*|_*[mM]_*[oO]_*[dD]_*|_*[mM]_*[oO]_*[dD]_*[uU]_*[lL]_*[eE]_*|_*[pP]_*[kK]_*[gG]_*|_*[pP]_*[aA]_*[cC]_*[kK]_*[aA]_*[gG]_*[eE]_*|_*[sS]_*[tT]_*[rR]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[nN]_*[aA]_*[tT]_*|_*[nN]_*[aA]_*[tT]_*[uU]_*[rR]_*[aA]_*[lL]_*|_*[lL]_*[iI]_*[tT]_*[eE]_*[rR]_*[aA]_*[lL]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[sS]_*[tT]_*[rR]_*|_*[lL]_*[iI]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*[iI]_*[oO]_*[nN]_*[aA]_*[lL]_*|_*[dD]_*[eE]_*[cC]_*|_*[dD]_*[eE]_*[cC]_*[iI]_*[mM]_*[aA]_*[lL]_*|_*[gG]_*[rR]_*[aA]_*[pP]_*[hH]_*|_*[sS]_*[eE]_*[tT]_*|_*[lL]_*[iI]_*[sS]_*[tT]_*|_*[sS]_*[eE]_*[qQ]_*|_*[sS]_*[eE]_*[qQ]_*[uU]_*[eE]_*[nN]_*[cC]_*[eE]_*|_*[rR]_*[eE]_*[cC]_*[oO]_*[rR]_*[dD]_*|_*[cC]_*[aA]_*[tT]_*[eE]_*[gG]_*[oO]_*[rR]_*[yY]_*|_*[nN]_*[uU]_*[mM]_*[bB]_*[eE]_*[rR]_*|_*[nN]_*[uU]_*[mM]_*|_*[eE]_*[vV]_*[eE]_*[nN]_*[tT]_*|_*[oO]_*[pP]_*[tT]_*[iI]_*[oO]_*[nN]_*|_*[nN]_*[oO]_*[nN]_*[eE]_*|_*[sS]_*[oO]_*[mM]_*[eE]_*|_*[oO]_*[kK]_*|_*[eE]_*[rR]_*[rR]_*[oO]_*[rR]_*|_*[rR]_*[eE]_*[sS]_*[uU]_*[lL]_*[tT]_*|_*[eE]_*[nN]_*[uU]_*[mM]_*|_*[nN]_*[eE]_*[vV]_*[eE]_*[rR]_*|_*[uU]_*[nN]_*[iI]_*[tT]_*|_*[uU]_*[nN]_*[iI]_*[mM]_*[pP]_*[lL]_*[eE]_*[mM]_*[eE]_*[nN]_*[tT]_*[eE]_*[dD]_*|_*[eE]_*[qQ]_*|_*[gG]_*[tT]_*|_*[gG]_*[tT]_*[eE]_*|_*[lL]_*[tT]_*|_*[lL]_*[tT]_*[eE]_*|_*[nN]_*[oO]_*[tT]_*[eE]_*[qQ]_*")
)


((build constructor: (ident) @build.hof.compiler )
  (match? @build.hof.compiler "_*[tT]_*[hH]_*[eE]_*[oO]_*[rR]_*[yY]_*|_*[mM]_*[oO]_*[dD]_*|_*[mM]_*[oO]_*[dD]_*[uU]_*[lL]_*[eE]_*|_*[pP]_*[kK]_*[gG]_*|_*[pP]_*[aA]_*[cC]_*[kK]_*[aA]_*[gG]_*[eE]_*|_*[sS]_*[tT]_*[rR]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[nN]_*[aA]_*[tT]_*|_*[nN]_*[aA]_*[tT]_*[uU]_*[rR]_*[aA]_*[lL]_*|_*[lL]_*[iI]_*[tT]_*[eE]_*[rR]_*[aA]_*[lL]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[sS]_*[tT]_*[rR]_*|_*[lL]_*[iI]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*[iI]_*[oO]_*[nN]_*[aA]_*[lL]_*|_*[dD]_*[eE]_*[cC]_*|_*[dD]_*[eE]_*[cC]_*[iI]_*[mM]_*[aA]_*[lL]_*|_*[gG]_*[rR]_*[aA]_*[pP]_*[hH]_*|_*[sS]_*[eE]_*[tT]_*|_*[lL]_*[iI]_*[sS]_*[tT]_*|_*[sS]_*[eE]_*[qQ]_*|_*[sS]_*[eE]_*[qQ]_*[uU]_*[eE]_*[nN]_*[cC]_*[eE]_*|_*[rR]_*[eE]_*[cC]_*[oO]_*[rR]_*[dD]_*|_*[cC]_*[aA]_*[tT]_*[eE]_*[gG]_*[oO]_*[rR]_*[yY]_*|_*[nN]_*[uU]_*[mM]_*[bB]_*[eE]_*[rR]_*|_*[nN]_*[uU]_*[mM]_*|_*[eE]_*[vV]_*[eE]_*[nN]_*[tT]_*|_*[oO]_*[pP]_*[tT]_*[iI]_*[oO]_*[nN]_*|_*[nN]_*[oO]_*[nN]_*[eE]_*|_*[sS]_*[oO]_*[mM]_*[eE]_*|_*[oO]_*[kK]_*|_*[eE]_*[rR]_*[rR]_*[oO]_*[rR]_*|_*[rR]_*[eE]_*[sS]_*[uU]_*[lL]_*[tT]_*|_*[eE]_*[nN]_*[uU]_*[mM]_*|_*[nN]_*[eE]_*[vV]_*[eE]_*[rR]_*|_*[uU]_*[nN]_*[iI]_*[tT]_*|_*[uU]_*[nN]_*[iI]_*[mM]_*[pP]_*[lL]_*[eE]_*[mM]_*[eE]_*[nN]_*[tT]_*[eE]_*[dD]_*|_*[eE]_*[qQ]_*|_*[gG]_*[tT]_*|_*[gG]_*[tT]_*[eE]_*|_*[lL]_*[tT]_*|_*[lL]_*[tT]_*[eE]_*|_*[nN]_*[oO]_*[tT]_*[eE]_*[qQ]_*")
)


((call callee: (ident) @call.hof.compiler )
  (match? @call.hof.compiler "_*[tT]_*[hH]_*[eE]_*[oO]_*[rR]_*[yY]_*|_*[mM]_*[oO]_*[dD]_*|_*[mM]_*[oO]_*[dD]_*[uU]_*[lL]_*[eE]_*|_*[pP]_*[kK]_*[gG]_*|_*[pP]_*[aA]_*[cC]_*[kK]_*[aA]_*[gG]_*[eE]_*|_*[sS]_*[tT]_*[rR]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[nN]_*[aA]_*[tT]_*|_*[nN]_*[aA]_*[tT]_*[uU]_*[rR]_*[aA]_*[lL]_*|_*[lL]_*[iI]_*[tT]_*[eE]_*[rR]_*[aA]_*[lL]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[sS]_*[tT]_*[rR]_*|_*[lL]_*[iI]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*[iI]_*[oO]_*[nN]_*[aA]_*[lL]_*|_*[dD]_*[eE]_*[cC]_*|_*[dD]_*[eE]_*[cC]_*[iI]_*[mM]_*[aA]_*[lL]_*|_*[gG]_*[rR]_*[aA]_*[pP]_*[hH]_*|_*[sS]_*[eE]_*[tT]_*|_*[lL]_*[iI]_*[sS]_*[tT]_*|_*[sS]_*[eE]_*[qQ]_*|_*[sS]_*[eE]_*[qQ]_*[uU]_*[eE]_*[nN]_*[cC]_*[eE]_*|_*[rR]_*[eE]_*[cC]_*[oO]_*[rR]_*[dD]_*|_*[cC]_*[aA]_*[tT]_*[eE]_*[gG]_*[oO]_*[rR]_*[yY]_*|_*[nN]_*[uU]_*[mM]_*[bB]_*[eE]_*[rR]_*|_*[nN]_*[uU]_*[mM]_*|_*[eE]_*[vV]_*[eE]_*[nN]_*[tT]_*|_*[oO]_*[pP]_*[tT]_*[iI]_*[oO]_*[nN]_*|_*[nN]_*[oO]_*[nN]_*[eE]_*|_*[sS]_*[oO]_*[mM]_*[eE]_*|_*[oO]_*[kK]_*|_*[eE]_*[rR]_*[rR]_*[oO]_*[rR]_*|_*[rR]_*[eE]_*[sS]_*[uU]_*[lL]_*[tT]_*|_*[eE]_*[nN]_*[uU]_*[mM]_*|_*[nN]_*[eE]_*[vV]_*[eE]_*[rR]_*|_*[uU]_*[nN]_*[iI]_*[tT]_*|_*[uU]_*[nN]_*[iI]_*[mM]_*[pP]_*[lL]_*[eE]_*[mM]_*[eE]_*[nN]_*[tT]_*[eE]_*[dD]_*|_*[eE]_*[qQ]_*|_*[gG]_*[tT]_*|_*[gG]_*[tT]_*[eE]_*|_*[lL]_*[tT]_*|_*[lL]_*[tT]_*[eE]_*|_*[nN]_*[oO]_*[tT]_*[eE]_*[qQ]_*")
)

((simple_path
   base_path: (simple_path base_path: (ident) @path.start.hof.compiler  path_ends: (*) @path.ends.hof.compiler)
   path_ends: (*) @path.ends.hof.compiler
 )
  (match? @path.start.hof.compiler "_*[tT]_*[hH]_*[eE]_*[oO]_*[rR]_*[yY]_*|_*[mM]_*[oO]_*[dD]_*|_*[mM]_*[oO]_*[dD]_*[uU]_*[lL]_*[eE]_*|_*[pP]_*[kK]_*[gG]_*|_*[pP]_*[aA]_*[cC]_*[kK]_*[aA]_*[gG]_*[eE]_*|_*[sS]_*[tT]_*[rR]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[nN]_*[aA]_*[tT]_*|_*[nN]_*[aA]_*[tT]_*[uU]_*[rR]_*[aA]_*[lL]_*|_*[lL]_*[iI]_*[tT]_*[eE]_*[rR]_*[aA]_*[lL]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[sS]_*[tT]_*[rR]_*|_*[lL]_*[iI]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*[iI]_*[oO]_*[nN]_*[aA]_*[lL]_*|_*[dD]_*[eE]_*[cC]_*|_*[dD]_*[eE]_*[cC]_*[iI]_*[mM]_*[aA]_*[lL]_*|_*[gG]_*[rR]_*[aA]_*[pP]_*[hH]_*|_*[sS]_*[eE]_*[tT]_*|_*[lL]_*[iI]_*[sS]_*[tT]_*|_*[sS]_*[eE]_*[qQ]_*|_*[sS]_*[eE]_*[qQ]_*[uU]_*[eE]_*[nN]_*[cC]_*[eE]_*|_*[rR]_*[eE]_*[cC]_*[oO]_*[rR]_*[dD]_*|_*[cC]_*[aA]_*[tT]_*[eE]_*[gG]_*[oO]_*[rR]_*[yY]_*|_*[nN]_*[uU]_*[mM]_*[bB]_*[eE]_*[rR]_*|_*[nN]_*[uU]_*[mM]_*|_*[eE]_*[vV]_*[eE]_*[nN]_*[tT]_*|_*[oO]_*[pP]_*[tT]_*[iI]_*[oO]_*[nN]_*|_*[nN]_*[oO]_*[nN]_*[eE]_*|_*[sS]_*[oO]_*[mM]_*[eE]_*|_*[oO]_*[kK]_*|_*[eE]_*[rR]_*[rR]_*[oO]_*[rR]_*|_*[rR]_*[eE]_*[sS]_*[uU]_*[lL]_*[tT]_*|_*[eE]_*[nN]_*[uU]_*[mM]_*|_*[nN]_*[eE]_*[vV]_*[eE]_*[rR]_*|_*[uU]_*[nN]_*[iI]_*[tT]_*|_*[uU]_*[nN]_*[iI]_*[mM]_*[pP]_*[lL]_*[eE]_*[mM]_*[eE]_*[nN]_*[tT]_*[eE]_*[dD]_*|_*[eE]_*[qQ]_*|_*[gG]_*[tT]_*|_*[gG]_*[tT]_*[eE]_*|_*[lL]_*[tT]_*|_*[lL]_*[tT]_*[eE]_*|_*[nN]_*[oO]_*[tT]_*[eE]_*[qQ]_*")
)

((simple_path
   base_path: (ident) @path.start.hof.compiler
   path_ends: (*) @path.ends.hof.compiler
 )
  (match? @path.start.hof.compiler "_*[tT]_*[hH]_*[eE]_*[oO]_*[rR]_*[yY]_*|_*[mM]_*[oO]_*[dD]_*|_*[mM]_*[oO]_*[dD]_*[uU]_*[lL]_*[eE]_*|_*[pP]_*[kK]_*[gG]_*|_*[pP]_*[aA]_*[cC]_*[kK]_*[aA]_*[gG]_*[eE]_*|_*[sS]_*[tT]_*[rR]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[nN]_*[aA]_*[tT]_*|_*[nN]_*[aA]_*[tT]_*[uU]_*[rR]_*[aA]_*[lL]_*|_*[lL]_*[iI]_*[tT]_*[eE]_*[rR]_*[aA]_*[lL]_*|_*[sS]_*[tT]_*[rR]_*[iI]_*[nN]_*[gG]_*|_*[sS]_*[tT]_*[rR]_*|_*[lL]_*[iI]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*|_*[rR]_*[aA]_*[tT]_*[iI]_*[oO]_*[nN]_*[aA]_*[lL]_*|_*[dD]_*[eE]_*[cC]_*|_*[dD]_*[eE]_*[cC]_*[iI]_*[mM]_*[aA]_*[lL]_*|_*[gG]_*[rR]_*[aA]_*[pP]_*[hH]_*|_*[sS]_*[eE]_*[tT]_*|_*[lL]_*[iI]_*[sS]_*[tT]_*|_*[sS]_*[eE]_*[qQ]_*|_*[sS]_*[eE]_*[qQ]_*[uU]_*[eE]_*[nN]_*[cC]_*[eE]_*|_*[rR]_*[eE]_*[cC]_*[oO]_*[rR]_*[dD]_*|_*[cC]_*[aA]_*[tT]_*[eE]_*[gG]_*[oO]_*[rR]_*[yY]_*|_*[nN]_*[uU]_*[mM]_*[bB]_*[eE]_*[rR]_*|_*[nN]_*[uU]_*[mM]_*|_*[eE]_*[vV]_*[eE]_*[nN]_*[tT]_*|_*[oO]_*[pP]_*[tT]_*[iI]_*[oO]_*[nN]_*|_*[nN]_*[oO]_*[nN]_*[eE]_*|_*[sS]_*[oO]_*[mM]_*[eE]_*|_*[oO]_*[kK]_*|_*[eE]_*[rR]_*[rR]_*[oO]_*[rR]_*|_*[rR]_*[eE]_*[sS]_*[uU]_*[lL]_*[tT]_*|_*[eE]_*[nN]_*[uU]_*[mM]_*|_*[nN]_*[eE]_*[vV]_*[eE]_*[rR]_*|_*[uU]_*[nN]_*[iI]_*[tT]_*|_*[uU]_*[nN]_*[iI]_*[mM]_*[pP]_*[lL]_*[eE]_*[mM]_*[eE]_*[nN]_*[tT]_*[eE]_*[dD]_*|_*[eE]_*[qQ]_*|_*[gG]_*[tT]_*|_*[gG]_*[tT]_*[eE]_*|_*[lL]_*[tT]_*|_*[lL]_*[tT]_*[eE]_*|_*[nN]_*[oO]_*[tT]_*[eE]_*[qQ]_*")
)


(variable_declaration)



"{" @delimitier
"}" @delimitier
";" @delimitier
"," @delimitier
"(" @delimitier
"<" @delimitier
">" @delimitier
")" @delimitier
"[" @delimitier
"]" @delimitier
":" @delimitier




(decorator) @decorator



(spx_tag)  @tag
(document) @document

