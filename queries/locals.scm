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

