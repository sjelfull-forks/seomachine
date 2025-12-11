# Quick Start Guide - TypeScript Edition

Get started with SEO Machine TypeScript in 5 minutes!

## Prerequisites

- Node.js 18+ or Bun 1.0+
- npm, yarn, or bun

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/sjelfull-forks/seomachine.git
cd seomachine
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Installation
```bash
npm test
```

You should see:
```
✓ 63 tests passing
```

## Running Your First Analysis

### Option 1: Use the Example Script

```bash
npm run example
```

This runs a complete SEO analysis on sample content.

### Option 2: Write Your Own Script

Create `my-analysis.ts`:

```typescript
import { 
  KeywordAnalyzer, 
  ReadabilityScorer,
  SEOQualityRater 
} from './src/index.ts'

const content = `
# Your Article Title

Your article content here...
`

// Analyze keywords
const keywordAnalyzer = new KeywordAnalyzer()
const keywords = keywordAnalyzer.analyze(content, 'main keyword')
console.log('Keyword density:', keywords.primaryKeyword.density)

// Check readability
const readabilityScorer = new ReadabilityScorer()
const readability = readabilityScorer.analyze(content)
console.log('Reading grade:', readability.grade)

// Rate SEO quality
const seoRater = new SEOQualityRater()
const quality = seoRater.rate(content, 'Page Title', 'Meta description')
console.log('SEO score:', quality.overallScore)
```

Run it:
```bash
npx tsx my-analysis.ts
```

## Common Use Cases

### 1. Analyze Keyword Density

```typescript
import { KeywordAnalyzer } from './src/modules/keyword-analyzer.ts'

const analyzer = new KeywordAnalyzer()
const result = analyzer.analyze(
  content,
  'primary keyword',
  ['secondary', 'keywords'],
  1.5  // target density %
)

console.log(`Density: ${result.primaryKeyword.density}%`)
console.log(`Stuffing risk: ${result.keywordStuffing.risk}`)
console.log(`LSI keywords: ${result.lsiKeywords.join(', ')}`)
```

### 2. Check Content Readability

```typescript
import { ReadabilityScorer } from './src/modules/readability-scorer.ts'

const scorer = new ReadabilityScorer()
const metrics = scorer.analyze(content)

console.log(`Reading ease: ${metrics.fleschReadingEase}`)
console.log(`Grade level: ${metrics.grade}`)
console.log(`Recommendation: ${metrics.recommendation}`)
```

### 3. Rate SEO Quality

```typescript
import { SEOQualityRater } from './src/modules/seo-quality-rater.ts'

const rater = new SEOQualityRater()
const score = rater.rate(
  content,
  'Page Title Here',
  'Meta description here...',
  'main keyword'
)

console.log(`Overall: ${score.overallScore}/100`)
console.log(`Title: ${score.titleScore}/100`)
console.log(`Content: ${score.contentScore}/100`)

// Show recommendations
score.recommendations.forEach(rec => console.log(`- ${rec}`))
```

### 4. Detect Search Intent

```typescript
import { SearchIntentAnalyzer } from './src/modules/search-intent-analyzer.ts'

const analyzer = new SearchIntentAnalyzer()
const intent = analyzer.analyze('how to optimize SEO')

console.log(`Intent: ${intent.intent}`)
console.log(`Confidence: ${(intent.confidence * 100).toFixed(1)}%`)
```

### 5. Clean Content (Remove AI Watermarks)

```typescript
import { ContentScrubber } from './src/modules/content-scrubber.ts'

const scrubber = new ContentScrubber()
const result = scrubber.scrub(content)

console.log(`Cleaned: ${result.cleanedContent}`)
console.log(`Removed ${result.removedCharacters} invisible characters`)

// Check for watermarks
const watermarks = scrubber.detectWatermarks(content)
if (watermarks.length > 0) {
  console.log('Watermarks found:', watermarks)
}
```

### 6. Use DataForSEO API

First, set up environment variables in `.env`:
```env
DATAFORSEO_LOGIN=your_login
DATAFORSEO_PASSWORD=your_password
```

Then:
```typescript
import { DataForSEO } from './src/modules/dataforseo.ts'

const client = new DataForSEO()

// Get rankings
const rankings = await client.getRankings(
  'example.com',
  ['keyword1', 'keyword2']
)

console.log(rankings)

// Get keyword ideas
const ideas = await client.getKeywordIdeas('seed keyword', 100)
console.log(`Found ${ideas.length} keyword ideas`)

// Get questions
const questions = await client.getQuestions('topic', 50)
console.log(`Found ${questions.length} related questions`)
```

## Development Workflow

### Run Tests
```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:ui       # UI mode
```

### Lint Code
```bash
npm run lint          # Check
npm run lint:fix      # Fix automatically
```

### Type Check
```bash
npm run type-check
```

### Format Code
```bash
npm run format        # Format
npm run format:check  # Check only
```

## Project Structure

```
seomachine/
├── src/
│   ├── modules/          # Core SEO modules
│   ├── types/            # TypeScript types
│   └── index.ts          # Main exports
├── tests/                # Test files
├── examples/             # Example scripts
├── README-TS.md          # Full documentation
└── MIGRATION.md          # Migration guide
```

## Next Steps

1. ✅ Read [README-TS.md](./README-TS.md) for complete documentation
2. ✅ Check [examples/analyze-content.ts](./examples/analyze-content.ts) for a full example
3. ✅ Review [MIGRATION.md](./MIGRATION.md) if migrating from Python
4. ✅ Explore the test files to see more usage patterns

## Troubleshooting

### Tests failing?
```bash
npm install  # Reinstall dependencies
npm test     # Run tests again
```

### Type errors?
```bash
npm run type-check  # See detailed errors
```

### Linting errors?
```bash
npm run lint:fix  # Auto-fix
```

## Common Patterns

### Batch Analysis
```typescript
const contents = ['article1', 'article2', 'article3']
const analyzer = new KeywordAnalyzer()

const results = contents.map(content => 
  analyzer.analyze(content, 'keyword')
)

console.log('Average density:', 
  results.reduce((sum, r) => sum + r.primaryKeyword.density, 0) / results.length
)
```

### Custom Guidelines
```typescript
const rater = new SEOQualityRater({
  titleMinLength: 40,
  titleMaxLength: 70,
  minWordCount: 500,
  targetKeywordDensity: 2.0
})

const score = rater.rate(content)
```

### Combined Analysis
```typescript
function analyzeArticle(content: string, keyword: string) {
  const keywordAnalyzer = new KeywordAnalyzer()
  const readabilityScorer = new ReadabilityScorer()
  const seoRater = new SEOQualityRater()

  return {
    keywords: keywordAnalyzer.analyze(content, keyword),
    readability: readabilityScorer.analyze(content),
    seo: seoRater.rate(content, undefined, undefined, keyword)
  }
}

const report = analyzeArticle(myContent, 'SEO')
console.log('Complete Analysis:', report)
```

## Getting Help

- 📖 Full docs: [README-TS.md](./README-TS.md)
- 🔄 Migration: [MIGRATION.md](./MIGRATION.md)
- 💡 Examples: [examples/](./examples/)
- 🐛 Issues: [GitHub Issues](https://github.com/sjelfull-forks/seomachine/issues)

## Performance Tips

1. **Reuse instances**: Create analyzer instances once, reuse for multiple analyses
2. **Async operations**: Use DataForSEO methods with `await` for better performance
3. **Batch processing**: Process multiple articles in parallel with `Promise.all()`

## What's Next?

- Explore advanced features in the modules
- Integrate with your content pipeline
- Add custom analysis rules
- Contribute improvements!

Happy analyzing! 🚀
