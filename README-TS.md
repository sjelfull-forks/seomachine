# SEO Machine - TypeScript Edition

A specialized TypeScript-based workspace for creating long-form, SEO-optimized blog content. This system helps you research, write, analyze, and optimize content that ranks well and serves your target audience.

## 🚀 New in TypeScript Edition

This repository has been converted from Python to TypeScript with modern tooling:

- ✅ **TypeScript** for type safety and better developer experience
- ✅ **Bun** runtime support (fallback to Node.js/npm)
- ✅ **Vitest** for fast, modern testing
- ✅ **oxlint** for lightning-fast linting
- ✅ **Full type coverage** with strict TypeScript configuration

## Overview

SEO Machine provides:
- **Advanced SEO Analysis**: Search intent detection, keyword density & clustering, content length comparison, readability scoring, SEO quality rating (0-100)
- **Content Tools**: Content scrubber (removes AI watermarks), readability scorer, keyword analyzer
- **Data Integrations**: DataForSEO for SERP data and keyword research
- **TypeScript Modules**: Fully typed, testable, and maintainable codebase

## Getting Started

### Prerequisites
- Node.js 18+ or Bun 1.0+
- npm, yarn, or bun

### Installation

1. Clone this repository:
```bash
git clone https://github.com/sjelfull-forks/seomachine.git
cd seomachine
```

2. Install dependencies:
```bash
npm install
# or
bun install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your API credentials:
```env
DATAFORSEO_LOGIN=your_login
DATAFORSEO_PASSWORD=your_password
```

## Development

### Available Scripts

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Lint code
npm run lint

# Type check
npm run type-check

# Format code
npm run format

# Build
npm run build
```

### Project Structure

```
seomachine/
├── src/
│   ├── modules/          # Core SEO analysis modules
│   │   ├── dataforseo.ts
│   │   ├── keyword-analyzer.ts
│   │   ├── readability-scorer.ts
│   │   ├── seo-quality-rater.ts
│   │   ├── search-intent-analyzer.ts
│   │   └── content-scrubber.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── index.ts          # Main entry point
├── tests/                # Vitest test files
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── oxlintrc.json
```

## Modules

### DataForSEO
Fetches SERP data, competitor rankings, and keyword research.

```typescript
import { DataForSEO } from './src/modules/dataforseo'

const client = new DataForSEO({
  login: 'your_login',
  password: 'your_password'
})

// Get rankings
const rankings = await client.getRankings('example.com', ['keyword1', 'keyword2'])

// Get keyword ideas
const ideas = await client.getKeywordIdeas('seed keyword', 100)

// Get related questions
const questions = await client.getQuestions('keyword', 50)
```

### Keyword Analyzer
Analyzes keyword density, distribution, and clustering.

```typescript
import { KeywordAnalyzer } from './src/modules/keyword-analyzer'

const analyzer = new KeywordAnalyzer()
const result = analyzer.analyze(
  content,
  'primary keyword',
  ['secondary', 'keywords'],
  1.5 // target density %
)

console.log(result.primaryKeyword.density)
console.log(result.keywordStuffing.risk)
console.log(result.lsiKeywords)
```

### Readability Scorer
Calculates Flesch Reading Ease, grade level, and other metrics.

```typescript
import { ReadabilityScorer } from './src/modules/readability-scorer'

const scorer = new ReadabilityScorer()
const metrics = scorer.analyze(content)

console.log(metrics.fleschReadingEase)
console.log(metrics.fleschKincaidGrade)
console.log(metrics.grade)
```

### SEO Quality Rater
Rates content quality against SEO best practices (0-100 score).

```typescript
import { SEOQualityRater } from './src/modules/seo-quality-rater'

const rater = new SEOQualityRater()
const score = rater.rate(
  content,
  'Page Title',
  'Meta description',
  'primary keyword'
)

console.log(score.overallScore)
console.log(score.recommendations)
```

### Search Intent Analyzer
Determines search intent (informational, navigational, transactional, commercial).

```typescript
import { SearchIntentAnalyzer } from './src/modules/search-intent-analyzer'

const analyzer = new SearchIntentAnalyzer()
const intent = analyzer.analyze('how to optimize SEO')

console.log(intent.intent) // 'informational'
console.log(intent.confidence)
console.log(intent.signals)
```

### Content Scrubber
Removes AI-generated watermarks and telltale signs.

```typescript
import { ContentScrubber } from './src/modules/content-scrubber'

const scrubber = new ContentScrubber()
const result = scrubber.scrub(content)

console.log(result.cleanedContent)
console.log(result.removedCharacters)
console.log(result.issues)
```

## Testing

The project uses Vitest for testing. All modules have comprehensive test coverage.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage

# Run tests with UI
npm run test:ui
```

## Type Safety

This project uses strict TypeScript configuration:

- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noUncheckedIndexedAccess: true`
- `noImplicitOverride: true`

All modules are fully typed with comprehensive interfaces.

## Linting

Using oxlint for fast, modern linting:

```bash
npm run lint
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linter (`npm run lint`)
6. Run type check (`npm run type-check`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Original Python Version

The original Python version of this project is available in the git history. This TypeScript conversion maintains all the functionality while adding:
- Type safety
- Modern tooling
- Better developer experience
- Faster testing and linting
- Improved maintainability

## Support

For issues and questions, please open a GitHub issue.
