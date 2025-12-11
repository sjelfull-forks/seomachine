# Migration Guide: Python to TypeScript

This guide explains how the SEO Machine project has been migrated from Python to TypeScript.

## Overview

The project has been fully converted from Python to TypeScript with modern tooling:
- **Language**: Python 3.x → TypeScript 5.3
- **Runtime**: Python → Node.js/Bun
- **Package Manager**: pip → npm/bun
- **Testing**: Python unittest → Vitest
- **Linting**: pylint → oxlint
- **Type Checking**: Type hints → Strict TypeScript

## Module Mapping

| Python Module | TypeScript Module | Status |
|--------------|-------------------|---------|
| `dataforseo.py` | `dataforseo.ts` | ✅ Complete |
| `keyword_analyzer.py` | `keyword-analyzer.ts` | ✅ Complete |
| `readability_scorer.py` | `readability-scorer.ts` | ✅ Complete |
| `search_intent_analyzer.py` | `search-intent-analyzer.ts` | ✅ Complete |
| `seo_quality_rater.py` | `seo-quality-rater.ts` | ✅ Complete |
| `content_scrubber.py` | `content-scrubber.ts` | ✅ Complete |
| `google_analytics.py` | TBD | 🔄 Pending |
| `google_search_console.py` | TBD | 🔄 Pending |
| `content_length_comparator.py` | TBD | 🔄 Pending |
| `data_aggregator.py` | TBD | 🔄 Pending |

## Key Changes

### 1. Type System

**Python (Type Hints):**
```python
from typing import Dict, List, Optional

def analyze(content: str, keyword: str) -> Dict[str, Any]:
    return {"density": 1.5}
```

**TypeScript (Full Type Safety):**
```typescript
interface AnalysisResult {
  density: number
}

function analyze(content: string, keyword: string): AnalysisResult {
  return { density: 1.5 }
}
```

### 2. Classes and Constructors

**Python:**
```python
class KeywordAnalyzer:
    def __init__(self):
        self.stop_words = set(['a', 'an', 'the'])
    
    def analyze(self, content: str) -> Dict:
        pass
```

**TypeScript:**
```typescript
class KeywordAnalyzer {
  private stopWords: Set<string>

  constructor() {
    this.stopWords = new Set(['a', 'an', 'the'])
  }

  analyze(content: string): AnalysisResult {
    // implementation
  }
}
```

### 3. Dictionary → Object/Record

**Python:**
```python
result = {
    'keyword': keyword,
    'density': 1.5,
    'count': 10
}
```

**TypeScript:**
```typescript
const result = {
  keyword: keyword,
  density: 1.5,
  count: 10
}

// Or with Record type
const heatmap: Record<string, number> = {
  section_1: 5,
  section_2: 3
}
```

### 4. List Comprehension → Array Methods

**Python:**
```python
keywords = [word for word in words if len(word) > 3]
scores = [analyze(word) for word in keywords]
```

**TypeScript:**
```typescript
const keywords = words.filter(word => word.length > 3)
const scores = keywords.map(word => analyze(word))
```

### 5. String Formatting

**Python:**
```python
message = f"Density: {density:.2f}%"
```

**TypeScript:**
```typescript
const message = `Density: ${density.toFixed(2)}%`
```

### 6. Environment Variables

**Python:**
```python
import os
from dotenv import load_dotenv

load_dotenv()
login = os.getenv('DATAFORSEO_LOGIN')
```

**TypeScript:**
```typescript
import 'dotenv/config'

const login = process.env.DATAFORSEO_LOGIN
```

### 7. Error Handling

**Python:**
```python
try:
    result = process_data()
except ValueError as e:
    print(f"Error: {e}")
```

**TypeScript:**
```typescript
try {
  const result = processData()
} catch (error) {
  if (error instanceof Error) {
    console.log(`Error: ${error.message}`)
  }
}
```

## Dependencies Migration

### Python Dependencies → TypeScript/Node.js

| Python Package | TypeScript/Node.js | Notes |
|---------------|-------------------|-------|
| `requests` | `fetch` (built-in) | Native Web API |
| `pandas` | Custom implementation | Not needed for core features |
| `numpy` | Math utilities | Basic math, no heavy computation |
| `textstat` | Custom implementation | Implemented readability formulas |
| `scikit-learn` | Custom/simplified | Basic clustering only |
| `beautifulsoup4` | TBD | For web scraping |
| `python-dotenv` | `dotenv` package | Environment variables |
| `orjson` | `JSON` (built-in) | Native JSON support |

### New TypeScript Dependencies

```json
{
  "dependencies": {
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/node": "^20.10.5",
    "@vitest/ui": "^1.0.4",
    "oxlint": "^0.15.0",
    "prettier": "^3.1.1",
    "typescript": "^5.3.3",
    "vitest": "^1.0.4"
  }
}
```

## Testing Migration

### Python (unittest)

```python
import unittest

class TestKeywordAnalyzer(unittest.TestCase):
    def setUp(self):
        self.analyzer = KeywordAnalyzer()
    
    def test_analyze(self):
        result = self.analyzer.analyze("content", "keyword")
        self.assertGreater(result['density'], 0)
```

### TypeScript (Vitest)

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('KeywordAnalyzer', () => {
  let analyzer: KeywordAnalyzer

  beforeEach(() => {
    analyzer = new KeywordAnalyzer()
  })

  it('should analyze keyword density', () => {
    const result = analyzer.analyze('content', 'keyword')
    expect(result.density).toBeGreaterThan(0)
  })
})
```

## Running the Code

### Python
```bash
# Install dependencies
pip install -r requirements.txt

# Run script
python test_dataforseo.py

# Run tests
python -m unittest discover
```

### TypeScript
```bash
# Install dependencies
npm install

# Run example
npm run example

# Run tests
npm test

# Lint
npm run lint

# Type check
npm run type-check
```

## Benefits of TypeScript Migration

### 1. Type Safety
- Catch errors at compile time, not runtime
- Better IDE autocomplete and IntelliSense
- Refactoring is safer and easier

### 2. Better Developer Experience
- Rich type information
- Better code navigation
- Inline documentation

### 3. Modern Tooling
- Fast testing with Vitest
- Lightning-fast linting with oxlint
- Instant feedback during development

### 4. Performance
- Node.js/Bun runtime optimizations
- No Python interpreter overhead
- Faster startup times

### 5. Ecosystem
- Massive npm ecosystem
- Better web integration
- Modern build tools

## Breaking Changes

### API Changes
Most APIs remain similar, but with TypeScript conventions:

**Python:**
```python
analyzer = KeywordAnalyzer()
result = analyzer.analyze(content, "SEO", ["keywords"], 1.5)
print(result['primary_keyword']['density'])
```

**TypeScript:**
```typescript
const analyzer = new KeywordAnalyzer()
const result = analyzer.analyze(content, "SEO", ["keywords"], 1.5)
console.log(result.primaryKeyword.density)
```

### Naming Conventions
- `snake_case` → `camelCase` for variables and functions
- Python conventions → TypeScript conventions

### Return Types
- Python dicts → TypeScript objects with interfaces
- More specific types instead of `Any`

## What's Next?

### Remaining Tasks
1. Convert Google Analytics integration
2. Convert Google Search Console integration
3. Convert content length comparator
4. Convert data aggregator
5. Migrate example scripts
6. Update all documentation

### Future Enhancements
- Add API server (Express/Fastify)
- Create CLI tool
- Add web UI
- Deploy as service
- Add more integrations

## Support

If you encounter issues during migration or usage:
1. Check the TypeScript documentation in README-TS.md
2. Review the examples in `examples/` directory
3. Run the test suite: `npm test`
4. Open a GitHub issue

## Contributing

Contributions are welcome! Please:
1. Write TypeScript with strict type checking
2. Add tests for new features
3. Run linter and type checker
4. Follow existing code style
