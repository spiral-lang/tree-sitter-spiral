; Scopes
;-------

(statements_block) @local.scope
(functor_literal_expression) @local.scope
(functor_without_arguments) @local.scope
(lambda_literal_expression) @local.scope
(object_declaration) @local.scope


; Definitions
;------------


(variable_declaration
  pattern: (exportable_type_annotation (ident) @local.definition) )
(variable_declaration
  pattern: (object_pattern (* (ident) @local.definition) ) )
(variable_declaration
  pattern: (object_pattern (* (key_tty_value (object_key (ident)  @local.definition)))))
(functor_literal_expression name:(ident) @local.definition)
(functor_without_arguments name:(ident) @local.definition)
(lambda_literal_expression name:(ident) @local.definition)
(lambda_literal_expression domain:(bracket_object (ident) @local.definition) )
(lambda_literal_expression domain:(bracket_object (key_tty_value key: (*) @local.definition) ))
(functor_literal_expression domain:(bracket_object (ident) @local.definition) )
(functor_literal_expression domain:(bracket_object (key_tty_value key: (*) @local.definition) ))
(object_declaration name:(ident)  @local.definition)
(only_export_label (ident) @local.definition)
(label (ident) @local.definition)
(binding (ident) @local.definition)
(for_expression
  pattern: (type_annotation (ident) @local.definition) )
(for_expression
  pattern: (object_pattern (* (ident) @local.definition) ) )
(for_expression
  pattern: (object_pattern (* (key_tty_value (object_key)  @local.definition))))

(key_tty_value (binding type: "let") key:(object_key) @local.definition)
(key_tty_value (binding type: "const") key:(object_key) @local.definition)
(key_tty_value (binding rename: "@") key:(object_key) @local.definition)
; References
;------------


(call callee: (ident) @local.reference)
(build constructor: (ident) @local.reference)
(product_expression (ident) @local.reference)
(simple_path left: (ident) @local.reference)
(spread_element expression: (ident) @local.reference)
(range_expression from: (ident) @local.reference)
(range_expression to: (ident) @local.reference)
(ambiguous_algebra_operation left: (ident) @local.reference)
(ambiguous_algebra_operation right: (ident) @local.reference)
(functor_binary_operation left: (ident) @local.reference)
(functor_binary_operation right: (ident) @local.reference)
(binary_operation left: (ident) @local.reference)
(binary_operation right: (ident) @local.reference)
(dot_expression left: (ident) @local.reference)
(index_expression left: (ident) @local.reference)
(unary_operation_prefix expression:  (ident) @local.reference)
(unary_operation_postfix expression:  (ident) @local.reference)

