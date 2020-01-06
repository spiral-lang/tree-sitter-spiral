#include <tree_sitter/parser.h>
#include <wctype.h>

enum TokenType {
  STRING_CONTENT,
};

void *tree_sitter_spiral_external_scanner_create() { return NULL; }
void tree_sitter_spiral_external_scanner_destroy(void *p) {}
void tree_sitter_spiral_external_scanner_reset(void *p) {}
unsigned tree_sitter_spiral_external_scanner_serialize(void *p, char *buffer) { return 0; }
void tree_sitter_spiral_external_scanner_deserialize(void *p, const char *b, unsigned n) {}

static void advance(TSLexer *lexer) { lexer->advance(lexer, false); }

bool tree_sitter_spiral_external_scanner_scan(void *payload, TSLexer *lexer, const bool *valid_symbols) {
  if (valid_symbols[STRING_CONTENT]) {
    bool has_content = false;
    for (;;) {
      if (lexer->lookahead == '`' || lexer->lookahead == '\\' || lexer->lookahead == '{') {
        break;
      } else if (lexer->lookahead == 0) {
        return false;
      }
      has_content = true;
      advance(lexer);
    }
    lexer->result_symbol = STRING_CONTENT;
    return has_content;
  }

  while (iswspace(lexer->lookahead)) lexer->advance(lexer, true);

  return false;
}
